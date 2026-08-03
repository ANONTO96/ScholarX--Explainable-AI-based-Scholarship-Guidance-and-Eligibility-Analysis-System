import { CalendarCheck, ChevronDown, MessageSquareText, Sparkles } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question: "What is ScholarX?",
    answer:
      "ScholarX is an AI-powered study abroad platform that helps students discover universities, scholarships, and study destinations based on their academic profile."
  },
  {
    question: "How does the AI Eligibility Checker work?",
    answer:
      "Simply enter your academic information such as GPA, IELTS score, preferred country, and study level. Our AI instantly evaluates your eligibility and recommends the best available options."
  },
  {
    question: "Is the eligibility result accurate?",
    answer:
      "Our recommendations are based on official admission requirements and scholarship criteria. While they provide a strong indication, obviously final admission decisions are always made by universities."
  },
  {
    question: "Can I find scholarships through ScholarX?",
    answer:
      "Yes. ScholarX recommends scholarships that match your academic profile, destination, and degree level while explaining why you're eligible."
  },
  {
    question: "Which countries are available?",
    answer:
      "We currently support major study destinations including the USA, Canada, Australia, the UK, Germany, Ireland, New Zealand, Malaysia, Italy, France, South Korea, and several others."
  },
  {
    question: "Do I need IELTS to study abroad?",
    answer:
      "Not always. Some universities accept alternatives such as Duolingo English Test, PTE, previous English-medium education, or even waive language requirements depending on your profile."
  },
  {
    question: "Can ScholarX help me choose a university?",
    answer:
      "Yes. Based on your academic background, career goals, budget, and preferred country, ScholarX recommends universities that best fit your profile."
  },
  {
    question: "Does ScholarX help with visa applications?",
    answer:
      "Yes. Our consultants guide you through the documentation, financial requirements, interview preparation, and visa application process just like any other education consultation agency."
  },
  {
    question: "Can I talk to an education consultant?",
    answer:
      "Absolutely. You can book a consultation with our experienced counselors for personalized admission and scholarship guidance."
  },
  {
    question: "Is ScholarX free to use?",
    answer:
      "Many features such as searching universities and checking eligibility are free. Premium plans unlock advanced AI analysis, personalized recommendations, and additional support."
  }
];

export default function FAQ() {
  const [active, setActive] = useState(0);

  return (
    <section className="relative bg-slate-50 py-20">
        {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-20 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-purple-200/30 blur-3xl"></div>
      </div>
      {/* FAQ accordion */}
      <div className="relative mx-auto max-w-5xl px-6">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-100 px-5 py-2 text-sm font-semibold text-sky-600">
            Frequently Asked Questions
          </span>

          <h2 className="mt-6 text-4xl font-bold text-slate-900">
            Everything You Need to Know
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            Find answers to the most common questions about universities,
            scholarships, admissions, and our AI-powered guidance platform.
          </p>
        </div>

        <div className="mt-16 space-y-5">
          {faqs.map((faq, index) => {
            const open = active === index;

            return (
              <div
                key={index}
                className={`relative overflow-hidden rounded-3xl border transition-all duration-300
${
  open
    ? "border-blue-200 bg-linear-to-br from-blue-50 via-white to-white shadow-xl ring-1 ring-blue-100"
    : "border-slate-200 bg-white hover:border-blue-200 hover:shadow-lg"
}`}
              >
                <div
  className={`absolute left-0 top-0 h-full w-1 rounded-full transition-all
  ${open ? "bg-sky-600" : "bg-transparent"}`}
/>
                <button
                  onClick={() => setActive(open ? null : index)}
                  className="group flex w-full items-center justify-between p-7 text-left"
                >
                  <h3 className="text-lg font-semibold text-slate-900">
                    {faq.question}
                  </h3>

                  <ChevronDown
  size={22}
  className={`transition-all duration-300 ${
    open
      ? "rotate-180 text-sky-600"
      : "text-slate-400 group-hover:text-sky-600"
  }`}
/>
                </button>

                <div
                  className={`grid transition-[grid-template-rows,opacity] duration-400 ease-out ${
                    open
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-7 pb-7 leading-8 text-slate-600">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Banner */}
                <div className="relative mt-7 overflow-hidden rounded-3xl bg-linear-to-r from-blue-600 to-indigo-700 p-10 text-white shadow-2xl">

                    <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>
                    <div className="absolute -bottom-12 left-20 h-48 w-48 rounded-full bg-cyan-400/20 blur-3xl"></div>

                    <div className="relative flex flex-col items-center justify-between gap-8 lg:flex-row">

                        <div className="max-w-2xl">
                            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm backdrop-blur">
                                <Sparkles size={16} />
                                ScholarX Support
                            </div>

                            <h2 className="text-4xl font-bold">
                                Need Help Planning Your Study Abroad Journey?
                            </h2>

                            <p className="mt-4 text-blue-100 leading-relaxed">
                                Whether you're choosing a university, applying for scholarships,
                                or preparing your visa documents, our consultants are here to
                                guide you every step of the way.
                            </p>
                        </div>

                        <div className="flex flex-wrap justify-center lg:justify-start gap-6 text-sm text-blue-100">

    <div className="flex items-center gap-2">
        ✓ Free Consultation
    </div>

    <div className="flex items-center gap-2">
        ✓ Response within 24 hours
    </div>

    <div className="flex items-center gap-2">
        ✓ Trusted by Students
    </div>

</div>

                        <div className="flex flex-wrap justify-center gap-4">
                            <button className="rounded-xl bg-white px-6 py-3 font-semibold text-blue-700 transition hover:-translate-y-1
hover:shadow-xl
active:translate-y-0
duration-300">
                                <span className="flex items-center gap-2">
                                    <CalendarCheck size={18} />
                                    Book Consultation
                                </span>
                            </button>

                            <button className="rounded-xl border border-white/30 bg-white/10 px-6 py-3 font-semibold backdrop-blur hover:-translate-y-1
hover:shadow-xl
active:translate-y-0
transition-all
duration-300">
                                <span className="flex items-center gap-2">
                                    <MessageSquareText size={18} />
                                    Chat with AI
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
      </div>
    </section>
  );
}