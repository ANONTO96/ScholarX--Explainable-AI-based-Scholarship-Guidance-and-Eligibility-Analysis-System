import { generalFaqs } from "../data/FAQs/generalFAQs";
import ReusableFAQ from "../components/ReusableComp/reusableFAQ";


export default function FAQ() {

  return (
    <ReusableFAQ
            badge="Frequently Asked Questions"
            title="Everything You Need to Know"
            description="Find answers to the most common questions about universities,
            scholarships, admissions, and our AI-powered guidance platform."
            faqs={generalFaqs}
            ctaTitle="Need Help Planning Your Study Abroad Journey?"
            ctaDescription="Whether you're choosing a university, applying for scholarships,
                or preparing your visa documents, our consultants are here to
                guide you every step of the way."
          />
  );
}