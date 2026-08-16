import ReusableFAQ from "../components/ReusableComp/ReusableFAQ";
import { aiFaqs } from "../data/FAQs/aiFaqs";

export default function ScholarXAiFAQ() {
  return (
    <ReusableFAQ
      badge="ScholarX AI Help"
      title="Everything About ScholarX AI"
      description="Learn how ScholarX AI analyzes your profile, evaluates your eligibility, recommends universities and scholarships, and helps you make smarter study-abroad decisions."
      faqs={aiFaqs}
      ctaTitle="Need Help With Your Study-Abroad Plan?"
      ctaDescription="Use ScholarX AI to explore universities, scholarships, and study destinations that match your academic profile, goals, and preferences."
    />
  );
}