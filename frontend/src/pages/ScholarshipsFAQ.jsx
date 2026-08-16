import ReusableFAQ from "../components/ReusableComp/ReusableFAQ";
import { scholarshipFaqs } from "../data/FAQs/scholarshipFaqs";

export default function ScholarshipsFAQ() {
  return (
    <>
      {/* Your other Admissions sections */}

      <ReusableFAQ
        badge="Scholarship Help"
      title="Everything About Scholarships"
      description="Find answers about scholarship eligibility, applications, deadlines, funding, and required documents."
      faqs={scholarshipFaqs}
      ctaTitle="Need Help Finding a Scholarship?"
      ctaDescription="Let ScholarX help you discover scholarship opportunities that match your academic profile and study destination."
      />
    </>
  );
}