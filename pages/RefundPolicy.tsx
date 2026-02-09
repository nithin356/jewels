import React from 'react';

const RefundPolicy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-serif font-bold text-stone-900 mb-8">Refund & Return Policy</h1>
      <div className="prose prose-stone max-w-none">
        
        <h3>1. Returns</h3>
        <p>
          Our policy lasts 7 days. If 7 days have gone by since your purchase, unfortunately, we can’t offer you a refund or exchange. To be eligible for a return, your item must be unused and in the same condition that you received it. It must also be in the original packaging.
        </p>

        <h3>2. Non-returnable items</h3>
        <ul>
          <li>Custom-made or personalized jewelry pieces.</li>
          <li>Items on final sale.</li>
          <li>Earrings (for hygiene reasons).</li>
        </ul>

        <h3>3. Refunds</h3>
        <p>
          Once your return is received and inspected, we will send you a notification that we have received your returned item. We will also notify you of the approval or rejection of your refund. If you are approved, then your refund will be processed, and a credit will automatically be applied to your original method of payment, within a certain amount of days.
        </p>

        <h3>4. Exchanges</h3>
        <p>
          We only replace items if they are defective or damaged. If you need to exchange it for the same item, contact us via WhatsApp at 7899090083.
        </p>

        <h3>5. Shipping</h3>
        <p>
          To return your product, you should contact our support team. You will be responsible for paying for your own shipping costs for returning your item. Shipping costs are non-refundable.
        </p>
      </div>
    </div>
  );
};

export default RefundPolicy;