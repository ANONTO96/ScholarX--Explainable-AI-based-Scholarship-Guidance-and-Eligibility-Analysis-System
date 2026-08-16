import ReusableFAQ from "../components/ReusableComp/ReusableFAQ";
import { visaFaqs } from "../data/FAQs/visaFaqs";

export default function VisaFAQ() {
  return (
    <ReusableFAQ
      badge="Student Visa Help"
      title="Everything About Student Visas"
      description="Get answers about student visa requirements, documents, financial proof, interviews, processing times, and preparing your visa application."
      faqs={visaFaqs}
      ctaTitle="Need Help With Your Student Visa?"
      ctaDescription="Get guidance on visa requirements, documentation, financial preparation, interview preparation, and the next steps toward studying abroad."
    />
  );
}