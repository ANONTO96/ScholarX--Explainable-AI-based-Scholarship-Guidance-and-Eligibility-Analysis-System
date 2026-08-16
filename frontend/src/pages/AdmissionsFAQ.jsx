import ReusableFAQ from "../components/ReusableComp/ReusableFAQ";
import { admissionFaqs } from "../data/FAQs/admissionFaqs";

export default function AdmissionsFAQ() {
  return (
    <>
      {/* Your other Admissions sections */}

      <ReusableFAQ
        badge="Admissions Help"
        title="Everything About University Admissions"
        description="Get answers about admission requirements, documents, English tests, applications, offers, and choosing the right university."
        faqs={admissionFaqs}
        ctaTitle="Need Help With Your University Application?"
        ctaDescription="From choosing the right university to preparing your documents and submitting your application, our consultants are here to guide you through every step."
      />
    </>
  );
}