import React from 'react';
import { Container, Card } from 'react-bootstrap';
import Header from '../components/Header';
import Footer from '../components/Footer';

const policies = {
  cancellation: {
    title: 'Cancellation & Return Policy',
    lastUpdated: 'October 2026',
    content: (
      <>
        <h3 className="text-dark fw-bold mb-3">1. Order Cancellations</h3>
        <p className="mb-4">
          At Medicare, we strive to process and dispatch orders as quickly as possible. If you need to cancel an order, you must do so within <strong>12 hours</strong> of order placement or before the order has been processed by our pharmacy team. Once an order has been approved, dispensed, or handed over to our shipping carriers, it cannot be cancelled.
        </p>
        
        <h3 className="text-dark fw-bold mb-3">2. Return Regulations</h3>
        <p className="mb-4">
          Due to federal and international pharmacy regulations governing prescription and over-the-counter medications, <strong>we are strictly unable to accept returns of any dispensed medications</strong>. This zero-return policy ensures the safety and clinical integrity of the pharmaceutical supply chain, guaranteeing that no returned or compromised products are ever re-dispensed.
        </p>
        
        <h3 className="text-dark fw-bold mb-3">3. Non-Prescription Items</h3>
        <p className="mb-4">
          For non-medicinal products, wellness accessories, or OTC supplements, you may request a return within <strong>14 days</strong> of delivery, provided the items are unopened, unused, and in their original sealed packaging. Return shipping costs for non-medicinal items are the responsibility of the customer.
        </p>
        
        <h3 className="text-dark fw-bold mb-3">4. Requesting Assistance</h3>
        <p className="mb-0">
          To request an order cancellation or discuss a shipment issue, please contact our support team immediately at <strong>support@thecheappharma.com</strong>.
        </p>
      </>
    )
  },
  communication: {
    title: 'Communication Policy',
    lastUpdated: 'October 2026',
    content: (
      <>
        <h3 className="text-dark fw-bold mb-3">1. Consent to Electronic Communications</h3>
        <p className="mb-4">
          By creating an account, placing an order, or utilizing our checkout process, you explicitly consent to receive transactional and promotional electronic communications from Medicare. These communications include order confirmations, delivery tracking updates, account security notifications, and one-time password (OTP) verification codes.
        </p>
        
        <h3 className="text-dark fw-bold mb-3">2. Communication Channels</h3>
        <p className="mb-4">
          We may communicate with you via:
        </p>
        <ul className="mb-4">
          <li><strong>Email</strong>: Primary channel for invoices, tracking numbers, and account management.</li>
          <li><strong>SMS/Text Messages</strong>: Used for delivery alerts and checkout verification codes (OTP). Standard message and data rates may apply.</li>
          <li><strong>Support Chat & Phone</strong>: For direct customer service inquiries.</li>
        </ul>
        
        <h3 className="text-dark fw-bold mb-3">3. Opt-Out and Preferences</h3>
        <p className="mb-4">
          You can manage your communication preferences or opt-out of promotional newsletters at any time by clicking the "unsubscribe" link at the bottom of our emails, replying "STOP" to SMS messages, or contacting our support desk. Transactional updates regarding your active orders and account security cannot be disabled.
        </p>
        
        <h3 className="text-dark fw-bold mb-3">4. Privacy and Security</h3>
        <p className="mb-0">
          We do not sell, rent, or lease your contact information to third-party advertisers. All contact details are handled securely in accordance with our Privacy Policy. If you have questions about your preferences, please contact <strong>privacy@thecheappharma.com</strong>.
        </p>
      </>
    )
  },
  drug: {
    title: 'Drug & Prescription Policy',
    lastUpdated: 'October 2026',
    content: (
      <>
        <h3 className="text-dark fw-bold mb-3">1. Prescription Verification Requirement</h3>
        <p className="mb-4">
          Certain products offered on our platform are classified as prescription-only (Rx) medications. In accordance with federal guidelines and pharmacy regulations, orders for prescription medications will only be processed and shipped after a valid prescription from a licensed healthcare provider has been reviewed and verified by our partner pharmacists.
        </p>
        
        <h3 className="text-dark fw-bold mb-3">2. Generic Medications Quality</h3>
        <p className="mb-4">
          We specialize in providing high-quality, affordable generic medications. Generic drugs contain the exact same active pharmaceutical ingredients, offer the same therapeutic efficacy, and must adhere to the same stringent safety standards as brand-name drugs. All generic medications stocked by our pharmacy partners are sourced from WHO-GMP certified facilities.
        </p>
        
        <h3 className="text-dark fw-bold mb-3">3. Controlled Substances Prohibition</h3>
        <p className="mb-4">
          Medicare <strong>does not stock, dispense, or sell controlled substances</strong> (such as narcotics, opioids, benzodiazepines, or highly regulated stimulants). Any request or order for controlled substances will be cancelled automatically, and serious violations may be reported to relevant regulatory bodies.
        </p>
        
        <h3 className="text-dark fw-bold mb-3">4. Maximum Order Limits</h3>
        <p className="mb-4">
          To protect patient safety and prevent stockpiling, we restrict the maximum order quantity of any medication to a <strong>90-day supply</strong> per customer, or as specified by the verified prescription.
        </p>
        
        <h3 className="text-dark fw-bold mb-3">5. Clinical Advice Disclaimer</h3>
        <p className="mb-0">
          No information on this site should replace a consultation with a qualified doctor. Patients must speak with their primary care physicians about potential side effects, drug-drug interactions, and clinical suitability before commencing any new medication regimen. For medical compliance questions, contact <strong>medical@thecheappharma.com</strong>.
        </p>
      </>
    )
  },
  cookie: {
    title: 'Cookie Policy',
    lastUpdated: 'October 2026',
    content: (
      <>
        <h3 className="text-dark fw-bold mb-3">1. Use of Cookies</h3>
        <p className="mb-4">
          Medicare uses cookies, tracking pixels, and local storage technologies to enhance your browsing experience, maintain secure logins, remember cart selections, analyze traffic patterns, and deliver personalized promotions. By using our website, you agree to the storage of cookies on your device as outlined in this policy.
        </p>
        
        <h3 className="text-dark fw-bold mb-3">2. Types of Cookies We Use</h3>
        <p className="mb-4">
          We classify cookies on our site into the following categories:
        </p>
        <ul className="mb-4">
          <li><strong>Essential Cookies</strong>: Required for site operation, including keeping you logged in, protecting security protocols, and managing the checkout flow. These cannot be disabled.</li>
          <li><strong>Performance & Analytics Cookies</strong>: Help us understand how visitors interact with our pages, identify speed issues, and monitor site health. We use tools like Google Analytics for this.</li>
          <li><strong>Functionality Cookies</strong>: Remember preferences such as currency, language, and previously viewed categories.</li>
          <li><strong>Targeting & Marketing Cookies</strong>: Used to deliver relevant advertisements and measure the efficacy of promotional newsletters.</li>
        </ul>
        
        <h3 className="text-dark fw-bold mb-3">3. Managing Cookie Preferences</h3>
        <p className="mb-4">
          Most web browsers allow you to modify cookie settings, disable cookies completely, or clear stored local data. You can adjust these settings in your browser's "Options" or "Preferences" menu. Please note that disabling essential cookies may prevent you from placing orders or accessing secure dashboard portals on our site.
        </p>
        
        <h3 className="text-dark fw-bold mb-3">4. Policy Updates</h3>
        <p className="mb-0">
          We may update our Cookie Policy periodically to reflect changes in our data practices or regulatory requirements. For privacy-related inquiries, reach out to <strong>privacy@thecheappharma.com</strong>.
        </p>
      </>
    )
  },
  disclaimer: {
    title: 'Disclaimer & Terms',
    lastUpdated: 'October 2026',
    content: (
      <>
        <h3 className="text-dark fw-bold mb-3">1. General Information Disclaimer</h3>
        <p className="mb-4">
          All materials, articles, active ingredient descriptions, dosage guides, and clinical recommendations displayed on Medicare are provided for general informational purposes only. While we make every effort to verify the scientific accuracy of our content, the information is not a substitute for professional medical diagnosis, prescribing instructions, or treatments.
        </p>
        
        <h3 className="text-dark fw-bold mb-3">2. No Medical Advice</h3>
        <p className="mb-4">
          Nothing contained on this website constitutes the practice of medicine or the provision of direct medical or pharmaceutical consultations. You must consult your licensed healthcare provider before initiating any new drug regimen, modifying an existing dosage, or relying on any content published here. Disregarding professional medical advice or delaying in seeking treatment due to information read on this site is strictly discouraged.
        </p>
        
        <h3 className="text-dark fw-bold mb-3">3. Trademark and Brand Ownership</h3>
        <p className="mb-4">
          All brand names, logos, manufacturer marks, and product trademarks referenced on this portal (such as Viagra, Cialis, Ventolin, etc.) are the sole property of their respective legal owners. Our references to these brand-name drugs are solely for therapeutic classification and generic equivalency information. Medicare is an independent platform and is not affiliated with, endorsed by, or partnered with the manufacturers of brand-name products.
        </p>
        
        <h3 className="text-dark fw-bold mb-3">4. Limitation of Liability</h3>
        <p className="mb-0">
          Medicare and its associates shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the use of, or inability to use, this website or the information contained herein. For legal inquiries, please contact <strong>legal@thecheappharma.com</strong>.
        </p>
      </>
    )
  },
  guarantee: {
    title: 'Medicare Guarantees',
    lastUpdated: 'October 2026',
    content: (
      <>
        <h3 className="text-dark fw-bold mb-3">1. Delivery Guarantee</h3>
        <p className="mb-4">
          We stand behind our delivery services. If your package is lost in transit, damaged, or seized by customs authorities, Medicare provides a <strong>100% Delivery Guarantee</strong>. In such events, we will issue a complete reshipment of your order free of charge, or provide a full refund. Delivery claims must be reported within 30 days of the estimated arrival date.
        </p>
        
        <h3 className="text-dark fw-bold mb-3">2. Quality & Authenticity Guarantee</h3>
        <p className="mb-4">
          Your health and safety are our highest priorities. We guarantee that all medications sold on our platform are 100% genuine, ethically sourced, and stored in temperature-controlled warehouses. Every product features batch numbers and verifiable expiration dates, matching the strict standards set by the FDA and global pharmaceutical boards.
        </p>
        
        <h3 className="text-dark fw-bold mb-3">3. Secure Shopping Guarantee</h3>
        <p className="mb-4">
          We guarantee that your transactions and personal data are fully protected. Our checkout portal utilizes Alpha SSL 256-bit encryption and McAfee security systems to ensure that your financial details are processed securely and privately.
        </p>
        
        <h3 className="text-dark fw-bold mb-3">4. Price Match Policy</h3>
        <p className="mb-0">
          We are committed to providing affordable medication. If you find the identical generic product (same dosage, strength, and quantity) offered by another reputable online pharmacy at a lower price, contact our support team and we will match it. For guarantee inquiries, reach out to <strong>support@thecheappharma.com</strong>.
        </p>
      </>
    )
  },
  'medical-disclaimer': {
    title: 'Medical Disclaimer',
    lastUpdated: 'October 2026',
    content: (
      <>
        <h3 className="text-dark fw-bold mb-3">1. Educational Purpose Only</h3>
        <p className="mb-4">
          All drug descriptions, pharmacological summaries, active ingredient details, and health blog articles published on Medicare are written and reviewed for educational and general informational purposes only. The statements on this website have not been evaluated by the Food and Drug Administration (FDA) or any other national healthcare agency.
        </p>
        
        <h3 className="text-dark fw-bold mb-3">2. Consult Your Doctor</h3>
        <p className="mb-4">
          The information provided here must not be used to self-diagnose, prevent, treat, or cure any disease or medical condition. You should always consult a licensed doctor, clinical pharmacist, or healthcare specialist before starting any new medication, altering your diet, or beginning an exercise program.
        </p>
        
        <h3 className="text-dark fw-bold mb-3">3. Individual Results May Vary</h3>
        <p className="mb-4">
          Therapeutic outcomes depend on individual medical histories, age, genetics, and adherence guidelines. Medicare does not guarantee specific therapeutic results or claim that the generic alternatives offered will work identically for every patient.
        </p>
        
        <h3 className="text-dark fw-bold mb-3">4. Emergency Situations</h3>
        <p className="mb-0">
          If you believe you are experiencing a medical emergency, call 911 or visit your nearest emergency room immediately. Do not delay medical treatment based on any content read on this website. For questions regarding our medical review board, please contact <strong>medical@thecheappharma.com</strong>.
        </p>
      </>
    )
  }
};

function PolicyPage({ type }) {
  const policy = policies[type] || policies['disclaimer'];

  return (
    <>
      <Header />
      
      {/* Page Header */}
      <div className="bg-primary text-white py-5 text-center mb-5">
        <Container>
          <h1 className="display-4 fw-bold">{policy.title}</h1>
          <p className="lead opacity-75">Last Updated: {policy.lastUpdated}</p>
        </Container>
      </div>

      <Container className="mb-5 min-vh-100">
        <Card className="border-0 shadow-sm rounded-4 p-md-5 p-4">
          <Card.Body className="text-muted lh-lg">
            {policy.content}
          </Card.Body>
        </Card>
      </Container>

      <Footer />
    </>
  );
}

export default PolicyPage;
