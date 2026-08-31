import { CalendarCheck, ChevronDown, MessageSquareText, Sparkles } from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router";
import { useChatbot } from "../../context/AiChatbot/useChatbot";

export default function ReusableFAQ({
  badge,
  title,
  description,
  faqs,
  ctaTitle,
  ctaDescription
}) {
  const { openChatbot } = useChatbot();
  const [active, setActive] = useState(0);

  return (
    <section className="relative overflow-hidden bg-slate-50 pt-40 pb-20">
      {/* ========================================================= */}
      {/* BACKGROUND */}
      {/* ========================================================= */}

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-20 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-purple-200/30 blur-3xl"></div>
      </div>

      <div className="relative mx-auto max-w-5xl px-6">

        {/* ========================================================= */}
        {/* HEADER */}
        {/* ========================================================= */}

        <div className="text-center">

          <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-100 px-5 py-2 text-sm font-semibold text-sky-600 shadow-sm">
            <Sparkles size={15} />
            {badge}
          </span>

          <h2 className="mt-6 text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
            {title}
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            {description}
          </p>
        </div>

        {/* ========================================================= */}
        {/* FAQ ACCORDION */}
        {/* ========================================================= */}

        <div className="mt-14 space-y-4">
          {faqs.map((faq, index) => {
            const open = active === index;

            return (
              <div
                key={index}
                className={`group relative overflow-hidden rounded-3xl border transition-all duration-300 ${
                  open
                    ? "border-blue-200 bg-white shadow-xl"
                    : "border-slate-200/80 bg-white/80 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-white hover:shadow-lg"
                }`}
              >
                {/* Active gradient line */}
                <div
                  className={`absolute left-0 top-0 h-full w-0.75 bg-sky-600 transition-all duration-300 ${
                    open ? "opacity-100" : "opacity-0"
                  }`}
                />

                {/* Soft active glow */}
                {open && (
                  <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-sky-200/50 blur-3xl" />
                )}

                {/* ================================================= */}
                {/* QUESTION */}
                {/* ================================================= */}

                <button
                  onClick={() => setActive(open ? null : index)}
                  className="relative flex w-full items-center gap-5 px-5 py-5 text-left sm:px-7 sm:py-6"
                >
                  {/* Number */}
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold transition-all duration-300 ${
                      open
                        ? "bg-linear-to-br from-sky-500 to-indigo-600 text-white shadow-lg shadow-sky-500/25"
                        : "bg-slate-100 text-slate-500 group-hover:bg-sky-50 group-hover:text-sky-600"
                    }`}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  {/* Question */}
                  <h3
                    className={`flex-1 text-base font-bold leading-7 transition-colors duration-300 sm:text-lg ${
                      open
                        ? "text-sky-600"
                        : "text-slate-800 group-hover:text-sky-600"
                    }`}
                  >
                    {faq.question}
                  </h3>

                  {/* Arrow */}
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                      open
                        ? "bg-sky-100 text-sky-600"
                        : "bg-slate-100 text-slate-400 group-hover:bg-sky-50 group-hover:text-sky-500"
                    }`}
                  >
                    <ChevronDown
                      size={19}
                      className={`transition-transform duration-300 ${
                        open ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </button>

                {/* ================================================= */}
                {/* ANSWER */}
                {/* ================================================= */}

                <div
                  className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                    open
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-5 pb-6 pl-21.25 pr-7 sm:pb-7">
                      <div className="h-px w-full bg-slate-100" />

                      <p className="pt-5 text-[15px] leading-7 text-slate-600 sm:text-base sm:leading-8">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ========================================================= */}
        {/* BOTTOM TRUST ELEMENT */}
        {/* ========================================================= */}

        <div className="mt-10 flex flex-col items-center justify-center gap-3 text-center sm:flex-row">

          <p className="text-sm text-slate-500">
            Still have questions?
            <span className="ml-1 font-semibold text-blue-600">
              ScholarX is here to help.
            </span>
          </p>
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
                                {ctaTitle}
                            </h2>

                            <p className="mt-4 text-blue-100 leading-relaxed">
                                {ctaDescription}
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
                            <NavLink to="/book-consultation" className="rounded-xl bg-white px-6 py-3 font-semibold text-blue-700 transition hover:-translate-y-1
hover:shadow-xl
active:translate-y-0
duration-300">
                                <span className="flex items-center gap-2">
                                    <CalendarCheck size={18} />
                                    Book Consultation
                                </span>
                            </NavLink>

                            <button type="button" onClick={openChatbot} className="rounded-xl border border-white/30 bg-white/10 px-6 py-3 font-semibold backdrop-blur hover:-translate-y-1
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