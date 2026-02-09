import { Product, ProductInput } from "../types";

// ==========================================
// CONFIGURATION
// ==========================================
// Using the real API for database operations
export const isRealApi = true;

// Use direct remote URL to bypass Vite proxy (which was having issues with GET/POST methods)
// This ensures consistent behavior across all environments
const API_BASE_URL = "https://codersdek.com/jewels_api/api";

// ==========================================
// TYPES
// ==========================================

export interface DbService {
  getProducts: () => Promise<Product[]>;
  getProduct: (id: string) => Promise<Product>;
  addProduct: (input: ProductInput, imageFiles?: File[]) => Promise<Product>;
  updateProduct: (
    id: string,
    input: ProductInput,
    imageFiles?: File[],
    existingImages?: string[],
  ) => Promise<Product>;
  deleteProduct: (id: string | string[]) => Promise<void>;
}

// ==========================================
// HELPER FUNCTIONS
// ==========================================
const normalizeImageUrl = (img: string): string => {
  // If it's just a filename (no path), construct full URL
  if (!img.startsWith("http") && !img.startsWith("/")) {
    return `${API_BASE_URL}/uploads/${img}`;
  }

  let normalized = img;

  // Handle legacy full URLs - extract path and filename
  if (normalized.startsWith("http://localhost/jewels/")) {
    normalized = normalized.replace("http://localhost/jewels/api/uploads/", "");
    normalized = normalized.replace("http://localhost/jewels/", "/jewels/");
  }
  if (normalized.startsWith("http://codersdek.com/jewels_api/")) {
    normalized = normalized.replace("http://codersdek.com/jewels_api/api/uploads/", "");
    normalized = normalized.replace("http://codersdek.com/jewels_api/", "/jewels/");
  }

  // Extract just filename from various path formats
  if (normalized.includes("/uploads/")) {
    normalized = normalized.split("/uploads/")[1];
    return `${API_BASE_URL}/uploads/${normalized}`;
  }

  // If we extracted just a filename, reconstruct the full URL
  if (!normalized.startsWith("http") && !normalized.startsWith("/")) {
    return `${API_BASE_URL}/uploads/${normalized}`;
  }

  // Normalize /jewels/api/ paths
  if (normalized.includes("/jewels/api/")) {
    normalized = normalized.replace(/\/jewels\/api\//g, "/");
  }

  // Remove any double slashes except for http://
  normalized = normalized.replace(/([^:]\/)\/+/g, "$1");

  // If we have /jewels/ prefix, convert to API_BASE_URL
  if (normalized.startsWith("/jewels/")) {
    return normalized.replace("/jewels/", `${API_BASE_URL}/`);
  }

  // If it's already a full HTTP URL, return as-is
  if (normalized.startsWith("http")) {
    return normalized;
  }

  // Default: If relative path, prepend API_BASE_URL
  if (normalized.startsWith("/")) {
    return `${API_BASE_URL}${normalized}`;
  }

  return `${API_BASE_URL}/${normalized}`;
};

// ==========================================
// REAL API IMPLEMENTATION (PHP Backend)
// ==========================================
const apiDb: DbService = {
  getProducts: async () => {
    const response = await fetch(`${API_BASE_URL}/get_products.php`);
    if (!response.ok) {
      const errorText = await response.text();
      try {
        const errorData = JSON.parse(errorText);
        throw new Error(errorData.error || `Server error: ${response.status}`);
      } catch {
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }
    }
    const data = await response.json();
    return data.map((p: any) => {
      let images =
        typeof p.images === "string" ? JSON.parse(p.images) : p.images;

      // Normalize all image URLs
      if (Array.isArray(images)) {
        images = images.map((img: string) => normalizeImageUrl(img));
      }

      return {
        ...p,
        images,
        price: parseFloat(p.price),
        max_price: p.max_price ? parseFloat(p.max_price) : undefined,
      };
    });
  },

  getProduct: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/get_product.php?id=${id}`);
    if (!response.ok) {
      const errorText = await response.text();
      try {
        const errorData = JSON.parse(errorText);
        throw new Error(errorData.error || `Server error: ${response.status}`);
      } catch {
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }
    }
    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    let images =
      typeof data.images === "string" ? JSON.parse(data.images) : data.images;

    // Normalize all image URLs
    if (Array.isArray(images)) {
      images = images.map((img: string) => normalizeImageUrl(img));
    }

    return {
      ...data,
      images,
      price: parseFloat(data.price),
      max_price: data.max_price ? parseFloat(data.max_price) : undefined,
    };
  },

  addProduct: async (input, imageFiles) => {
    // Use FormData to send files + text fields
    const formData = new FormData();
    formData.append("name", input.name);
    formData.append("description", input.description || "");
    formData.append("price", input.price.toString());
    if (input.max_price)
      formData.append("max_price", input.max_price.toString());
    formData.append("category", input.category || "Other");
    if (input.brand) formData.append("brand", input.brand);
    if (input.collection) formData.append("collection", input.collection);
    if (input.is_new !== undefined)
      formData.append("is_new", input.is_new.toString());
    if (input.is_limited !== undefined)
      formData.append("is_limited", input.is_limited.toString());

    if (imageFiles) {
      imageFiles.forEach((file) => {
        formData.append("images[]", file);
      });
    }

    const response = await fetch(`${API_BASE_URL}/add_product.php`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to add product: ${errorText}`);
    }

    return { id: "new", ...input, images: [], createdAt: Date.now() };
  },

  updateProduct: async (id, input, imageFiles, existingImages) => {
    const formData = new FormData();
    formData.append("id", id);
    formData.append("name", input.name);
    formData.append("description", input.description || "");
    formData.append("price", input.price.toString());
    if (input.max_price !== undefined)
      formData.append("max_price", input.max_price.toString());
    formData.append("category", input.category || "Other");
    if (input.brand) formData.append("brand", input.brand);
    if (input.collection) formData.append("collection", input.collection);
    if (input.is_new !== undefined)
      formData.append("is_new", input.is_new.toString());
    if (input.is_limited !== undefined)
      formData.append("is_limited", input.is_limited.toString());
    formData.append("keep_existing_images", "true");
    formData.append("existing_images", JSON.stringify(existingImages || []));

    if (imageFiles && imageFiles.length > 0) {
      imageFiles.forEach((file) => {
        formData.append("images[]", file);
      });
    }

    const response = await fetch(`${API_BASE_URL}/update_product.php`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update product: ${errorText}`);
    }

    const result = await response.json();
    if (result.status === "error") {
      throw new Error(result.message);
    }

    return result.product;
  },

  deleteProduct: async (id) => {
    const payload = Array.isArray(id) ? { ids: id } : { id };
    const response = await fetch(`${API_BASE_URL}/delete_product.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error("Failed to delete product(s)");
  },
};

export const db: DbService = apiDb;