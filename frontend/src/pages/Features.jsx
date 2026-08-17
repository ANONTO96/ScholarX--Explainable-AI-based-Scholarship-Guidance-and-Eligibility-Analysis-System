import {
  Sparkles,
  GraduationCap,
  BadgeDollarSign,
  FileCheck2,
  Plane,
  Users,
  Check,
  CalendarCheck,
  MessageSquareText,
} from "lucide-react";
import { NavLink } from "react-router";

const features = [
  {
    icon: Sparkles,
    title: "AI Eligibility Checker",
    description:
      "Instantly discover which universities and scholarships match your academic profile.",
    items: [
      "Instant eligibility analysis",
      "Scholarship prediction",
      "Requirement gap detection",
    ],
  },
  {
    icon: GraduationCap,
    title: "Smart University Matching",
    description:
      "Receive personalized university recommendations based on your goals, budget, and grades.",
    items: [
      "2000+ universities",
      "Budget-friendly options",
      "Country comparison",
    ],
  },
  {
    icon: BadgeDollarSign,
    title: "Scholarship Finder",
    description:
      "Search thousands of scholarships and discover funding opportunities tailored for you.",
    items: [
      "Merit scholarships",
      "Need-based funding",
      "Deadline reminders",
    ],
  },
  {
    icon: FileCheck2,
    title: "Document Review",
    description:
      "Improve your SOP, CV, and application documents before submission.",
    items: [
      "SOP review",
      "Resume optimization",
      "Document verification",
    ],
  },
  {
    icon: Plane,
    title: "Visa Assistance",
    description:
      "Professional guidance from visa preparation to interview support.",
    items: [
      "Visa checklist",
      "Interview preparation",
      "Application support",
    ],
  },
  {
    icon: Users,
    title: "Expert Consultation",
    description:
      "Connect with experienced education consultants for one-on-one guidance.",
    items: [
      "Personal consultation",
      "Country-specific advice",
      "Fast response",
    ],
  },
];

const Features = () => {
  return (
    <section className="bg-slate-50 py-20">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-20 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-purple-200/30 blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Badge */}
        <div className="flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-100 text-sky-600 px-4 py-2 text-sm font-semibold shadow-sm">
            <Sparkles size={15} />
             Why Students Choose ScholarX
          </span>
        </div>

        {/* Heading */}
        <div className="text-center mt-6 max-w-3xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
            Everything You Need to Study Abroad
          </h2>

          <p className="mt-4 text-lg text-gray-600 leading-relaxed">
            Your complete study abroad platform powered by AI and supported by
            expert consultants. Discover universities, scholarships, visa
            guidance, and everything needed for your journey.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-14 grid gap-8 md:grid-cols-2 xl:grid-cols-3">

          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={index}
                className="
group
relative
overflow-hidden
rounded-3xl
border
border-slate-200/80
bg-white
p-8
shadow-sm
transition-all
duration-500
hover:-translate-y-2
hover:shadow-2xl
hover:border-sky-200
"
              >
                
                {/* Icon */}
                <div className="
flex
h-16
w-16
items-center
justify-center
rounded-2xl
bg-blue-50 text-sky-600
group-hover:bg-sky-500 group-hover:text-white
shadow-sm
transition-all
duration-500
group-hover:scale-110
group-hover:rotate-3
group-hover:shadow-lg
">
                  <Icon size={30} />
                </div>

                {/* Title */}
                <h3 className="mt-6 text-2xl font-bold text-slate-900">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="mt-4 text-slate-600 leading-7">
                  {feature.description}
                </p>

                {/* Divider */}
                <div className="my-6 h-px bg-slate-200"></div>

                {/* Feature List */}
                <ul className="space-y-4">
                  {feature.items.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-3 text-slate-700"
                    >
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-green-100 text-green-600">
                        <Check size={16} />
                      </div>

                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Bottom Stats */}
        <div className="mt-14 rounded-3xl text-white bg-linear-to-r from-blue-600 to-indigo-700 p-10">

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">

            <div>
              <h3 className="text-4xl font-bold">10K+</h3>
              <p className="mt-2 text-blue-100">
                Students Guided
              </p>
            </div>

            <div>
              <h3 className="text-4xl font-bold">15+</h3>
              <p className="mt-2 text-blue-100">
                Study Destinations
              </p>
            </div>

            <div>
              <h3 className="text-4xl font-bold">1K+</h3>
              <p className="mt-2 text-blue-100">
                Universities
              </p>
            </div>

            <div>
              <h3 className="text-4xl font-bold">3K+</h3>
              <p className="mt-2 text-blue-100">
                Scholarships
              </p>
            </div>

          </div>

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
                            <NavLink to="/consultation" className="rounded-xl bg-white px-6 py-3 font-semibold text-blue-700 hover:-translate-y-1
hover:shadow-xl
active:translate-y-0
transition-all
duration-300">
                                <span className="flex items-center gap-2">
                                    <CalendarCheck size={18} />
                                    Book Consultation
                                </span>
                            </NavLink>

                            <NavLink to="/AI-ChatBot" className="rounded-xl border border-white/30 bg-white/10 px-6 py-3 font-semibold backdrop-blur hover:-translate-y-1
hover:shadow-xl
active:translate-y-0
transition-all
duration-300">
                                <span className="flex items-center gap-2">
                                    <MessageSquareText size={18} />
                                    Chat with AI
                                </span>
                            </NavLink>
                        </div>
                    </div>
                </div>
      </div>
    </section>
  );
};

export default Features;