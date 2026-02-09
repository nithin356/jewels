export type ProductCategory = 'Rings' | 'Necklaces' | 'Earrings' | 'Bracelets' | 'Sets' | 'Watches' | 'Other';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  max_price?: number;
  category: string;
  brand?: string;
  collection?: string;
  images: string[];
  createdAt: number;
  is_new?: number;
  is_limited?: number;
}

export type ProductInput = Omit<Product, 'id' | 'createdAt'>;

export interface NavItem {
  label: string;
  href: string;
}