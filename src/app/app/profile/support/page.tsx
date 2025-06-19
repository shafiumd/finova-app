// src/app/(app)/profile/support/page.tsx
import SubPageHeader from '@/components/SubPageHeader';

const FAQItem = ({ question, answer }: { question: string, answer: string }) => (
  <details className="p-4 bg-white rounded-lg shadow-sm">
    <summary className="font-semibold cursor-pointer">{question}</summary>
    <p className="mt-2 text-gray-600">{answer}</p>
  </details>
);

export default function SupportPage() {
  return (
    <div>
      <SubPageHeader title="Help & Support" />
      <div className="p-4 space-y-6">
        {/* Contact Info */}
        <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <h2 className="text-lg font-semibold mb-2">Contact Us</h2>
            <p className="text-gray-600">For urgent issues, please call us at:</p>
            <a href="tel:+234-FINOVA-APP" className="text-blue-600 font-bold text-xl my-2 block">+234-FINOVA-APP</a>
            <p className="text-sm text-gray-500">Available 24/7</p>
        </div>
        
        {/* FAQ Section */}
        <div>
          <h2 className="text-lg font-semibold mb-4 px-2">Frequently Asked Questions</h2>
          <div className="space-y-3">
            <FAQItem
              question="How do I reset my password?"
              answer="You can reset your password from the 'Security' section in your profile. You will need to enter your old password to set a new one."
            />
            <FAQItem
              question="What are the transfer limits?"
              answer="The daily transfer limit is ₦1,000,000. For limit increases, please contact customer support."
            />
             <FAQItem
              question="Is my money safe with Finova?"
              answer="Yes. Finova uses end-to-end encryption and partners with NDIC-insured institutions to ensure your funds are always secure."
            />
          </div>
        </div>
      </div>
    </div>
  );
}