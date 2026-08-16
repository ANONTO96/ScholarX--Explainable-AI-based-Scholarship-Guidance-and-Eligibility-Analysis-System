import ReusableFAQ from "../components/ReusableComp/ReusableFAQ";
import { accountBillingFaqs } from "../data/FAQs/account&billingFaqs";

export default function AccountBillingFAQ() {
  return (
    <ReusableFAQ
      badge="Account & Billing Help"
      title="Everything About Your Account & Billing"
      description="Get answers about your ScholarX account, subscriptions, payments, plans, cancellations, and billing-related questions."
      faqs={accountBillingFaqs}
      ctaTitle="Need Help With Your Account?"
      ctaDescription="Having trouble with your account, subscription, or payment? Our support team is here to help you get everything sorted."
    />
  );
}