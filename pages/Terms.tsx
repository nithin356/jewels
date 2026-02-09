import React from 'react';

const Terms: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-serif font-bold text-stone-900 mb-8">Terms and Conditions</h1>
      <div className="prose prose-stone max-w-none">
        <p className="lead">
          Welcome to Jewels. These terms and conditions outline the rules and regulations for the use of the Jewels Website, located at heyjewels.ae.
        </p>

        <h3>1. Acceptance of Terms</h3>
        <p>
          By accessing this website we assume you accept these terms and conditions. Do not continue to use Jewels if you do not agree to take all of the terms and conditions stated on this page.
        </p>

        <h3>2. Products</h3>
        <p>
          Jewelry products displayed on this site are available for purchase while supplies last. We have made every effort to display as accurately as possible the colors and images of our products that appear at the store. We cannot guarantee that your computer monitor's display of any color will be accurate.
        </p>

        <h3>3. Pricing</h3>
        <p>
          Prices for our products are subject to change without notice. We reserve the right at any time to modify or discontinue the Service (or any part or content thereof) without notice at any time.
        </p>

        <h3>4. Order Process</h3>
        <p>
          Orders are currently processed via WhatsApp communication. Finalization of sale, payment terms, and delivery schedules will be confirmed through direct communication with our sales team.
        </p>

        <h3>5. Intellectual Property</h3>
        <p>
          Unless otherwise stated, Jewels and/or its licensors own the intellectual property rights for all material on Jewels. All intellectual property rights are reserved.
        </p>
      </div>
    </div>
  );
};

export default Terms;