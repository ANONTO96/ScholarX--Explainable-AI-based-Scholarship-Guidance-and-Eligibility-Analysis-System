import ReusableFAQ from "../components/ReusableComp/ReusableFAQ";
import { supportFaqs } from "../data/FAQs/supportFaqs";

export default function GeneralSupportFAQ() {
  return (
    <ReusableFAQ
      badge="General Support"
      title="How Can We Help You?"
      description="Find answers to common questions about ScholarX, technical issues, study-abroad guidance, consultations, and getting support."
      faqs={supportFaqs}
      ctaTitle="Still Need Help?"
      ctaDescription="Can't find the answer you're looking for? Get in touch with the ScholarX support team or chat with our AI assistant for personalized guidance."
    />
  );
}