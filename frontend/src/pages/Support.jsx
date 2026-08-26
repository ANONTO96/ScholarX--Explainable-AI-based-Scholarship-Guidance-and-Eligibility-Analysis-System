import {
  BookOpen,
  MessageCircleMore,
  CalendarCheck,
  Bug,
  GraduationCap,
  BadgeDollarSign,
 Plane,
  Bot,
  UserRoundCog,
  ArrowRight,
  Sparkles,
  Clock3,
  Headphones,
  ShieldCheck,
  Mail,
  UserRound,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router";

const stats = [
  {
    title: "Average Response",
    value: "< 10 min",
    icon: Clock3,
  },
  {
    title: "Students Helped",
    value: "5,000+",
    icon: Headphones,
  },
  {
    title: "Satisfaction",
    value: "98%",
    icon: ShieldCheck,
  },
];

const actions = [
  {
    title: "Chat on WhatsApp",
    desc: "Fastest way to reach us",
    icon: MessageCircleMore,
    color: "bg-green-500",
    route: "https://wa.me/8801XXXXXXXXX",
    type: "external",
  },
  {
    title: "Email Support",
    desc: "Detailed questions & documents",
    icon: Mail,
    color: "bg-blue-500",
    route: "mailto:support@scholarx.com",
    type: "external",
  },
  {
    title: "Book Consultation",
    desc: "Meet an education expert consultant",
    icon: CalendarCheck,
    color: "bg-violet-500",
    route: "/book-consultation",
    type: "internal",
  },
];

const quickActions = [
  {
    title: "Live Chat",
    description: "Talk to our support team on WhatsApp",
    icon: MessageCircleMore,
    color: "from-cyan-500 to-sky-600",
    borderColor: "hover:border-sky-100",
    route: "https://wa.me/8801XXXXXXXXX",
    type: "external",
  },
  {
    title: "Book Consultation",
    description: "Meet an education expert consultant",
    icon: CalendarCheck,
    color: "from-violet-500 to-purple-600",
    borderColor: "hover:border-purple-100",
    route: "/book-consultation",
    type: "internal",
  },
  {
    title: "Help Center",
    description: "Browse articles, guides & FAQs",
    icon: BookOpen,
    color: "from-blue-500 to-indigo-600",
    borderColor: "hover:border-blue-100",
    route: "/FAQ",
    type: "internal",
  },
  {
    title: "Report an Issue",
    description: "Found a problem? Let us know",
    icon: Bug,
    color: "from-rose-500 to-red-600",
    borderColor: "hover:border-red-100",
    route: "/report-issue",
    type: "internal",
  },
];

const categoriesActions = [
  {
    title: "Admissions",
    description:
      "Applications, entry requirements, deadlines and offers.",
    icon: GraduationCap,
    color: "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white",
    borderColor: "hover:border-blue-100",
    route:"/admissionsFAQ"
  },
  {
    title: "Scholarships",
    description:
      "Funding opportunities, eligibility and application tips.",
    icon: BadgeDollarSign,
    color: "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white",
    borderColor:"hover:border-emerald-100",
    route:"/scholarshipsFAQ"
  },
  {
    title: "ScholarX AI",
    description:
      "Eligibility Checker, recommendations and profile analysis.",
    icon: Bot,
    color: "bg-violet-50 text-violet-600 group-hover:bg-violet-600 group-hover:text-white",
    borderColor:"hover:border-violet-100",
    route:"/scholarXaiFAQ"
  },
  {
    title: "Student Visa",
    description:
      "Visa documents, interviews and financial requirements.",
    icon: Plane,
    color: "bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white",
    borderColor:"hover:border-orange-100",
    route:"/studentVisaFAQ"
  },
  {
    title: "Account & Billing",
    description:
      "Login issues, subscriptions and account settings.",
    icon: UserRoundCog,
    color: "bg-sky-50 text-sky-600 group-hover:bg-sky-600 group-hover:text-white",
    borderColor:"hover:border-sky-100",
    route:"/account&BillingFAQ"
  },
  {
    title: "General Support",
    description:
      "Need help? Our team is always ready to assist you.",
    icon: MessageCircleMore,
    color: "bg-pink-50 text-pink-600 group-hover:bg-pink-600 group-hover:text-white",
    borderColor:"hover:border-pink-100",
    route:"/generalSupportFAQ"
  },
];

const Support = () => {

  const navigate = useNavigate();

// routing for support banner actions
const handleActionClick = (action) => {
  if (action.type === "internal") {
    navigate(action.route);
    return;
  }

 if (action.type === "external") {
    window.open(action.route, "_blank", "noopener,noreferrer");
  }
};
  return (
    <section className="bg-linear-to-b from-slate-50 via-white to-white py-20">
      <div className="mx-auto max-w-7xl px-6">

        {/* ---------------- HERO ---------------- */}

        <div className="relative overflow-hidden rounded-[36px] border border-slate-200 bg-linear-to-br from-blue-600 via-indigo-600 to-violet-700 px-8 py-16 text-white shadow-2xl lg:px-16">

          <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 h-56 w-56 rounded-full bg-cyan-400/20 blur-3xl"></div>

          <div className="relative mx-auto max-w-3xl text-center">

            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 backdrop-blur">

              <Sparkles size={18} />

              <span className="text-sm font-medium">
                ScholarX Support Center
              </span>

            </div>

            <h1 className="text-4xl font-extrabold leading-tight md:text-6xl">
              How can we
              <span className="block bg-linear-to-r from-amber-200 via-orange-300 to-rose-300 bg-clip-text text-transparent">
  help you today?
</span>
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100">
              Get personalized guidance, instant answers, and expert support to navigate every step of your international education journey.
            </p>

          </div>

        </div>

        {/* ---------------- QUICK ACTIONS ---------------- */}

        <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">

          {quickActions.map((item) => {

            const Icon = item.icon;

            return (
              <div
                key={item.title}
                onClick={() => handleActionClick(item)}
                className={`group cursor-pointer rounded-3xl border border-slate-200 bg-white p-6 shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl ${item.borderColor}`}
              >

                <div
                  className={`mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br ${item.color} text-white shadow-lg transition-all duration-500 group-hover:scale-105
group-hover:rotate-3`}
                >
                  <Icon size={30} />
                </div>

                <h3 className="text-xl font-bold">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  {item.description}
                </p>

                <button className="mt-6 flex items-center gap-2 font-semibold text-blue-600">

                  Learn More

                  <ArrowRight
                    size={18}
                    className="transition group-hover:translate-x-1"
                  />

                </button>

              </div>
            );
          })}
        </div>

        {/* ---------------- CATEGORIES ---------------- */}

        <div className="mt-20">

          <div className="text-center">

            <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-100 px-5 py-2 text-sm font-semibold text-sky-600">
              Browse Categories
            </span>

            <h2 className="mt-6 text-4xl font-bold">
              Find Help by Topic
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-slate-500">
              Everything you need—from finding scholarships
              to getting your student visa—is organized into
              easy-to-browse categories.
            </p>

          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">

            {categoriesActions.map((item) => {

              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className={`group cursor-pointer rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${item.borderColor}`}
                >

                  <div
                    className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-500 group-hover:scale-110
group-hover:rotate-3 ${item.color}`}
                  >
                    <Icon size={30} />
                  </div>

                  <h3 className="text-2xl font-bold">
                    {item.title}
                  </h3>

                  <p className="mt-4 leading-7 text-slate-500">
                    {item.description}
                  </p>

                  <NavLink to={`${item.route}`} className="mt-8 flex items-center gap-2 font-semibold text-blue-600">

                    Get Help

                    <ArrowRight
                      size={18}
                      className="transition group-hover:translate-x-1"
                    />

                  </NavLink>

                </div>
              );
            })}

          </div>

        </div>

        {/* ---------------- SUPPORT BANNER ---------------- */}
        <div className="mt-20">
            <div className="mx-auto max-w-7xl">

        <div className="mb-14 text-center">

          <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-100 px-5 py-2 text-sm font-semibold text-sky-600">
            Instant Support
          </span>

          <h2 className="mt-6 text-4xl font-extrabold">
            Get Help Whenever You Need It
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-slate-500">
            Whether you have questions about universities, scholarships,
            visas or your ScholarX account, our consultants and AI assistant
            are always ready to help.
          </p>

        </div>

        <div className="relative overflow-hidden rounded-[36px] bg-linear-to-br from-blue-600 via-indigo-600 to-violet-700 p-7 shadow-2xl lg:p-14">

          {/* Glow */}

          <div className="absolute -right-24 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute -left-24 bottom-0 h-60 w-60 rounded-full bg-cyan-300/10 blur-3xl"></div>

          <div className="relative grid gap-10 lg:grid-cols-2">

            {/* LEFT */}

            <div>

              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-white backdrop-blur">

                <Sparkles size={18} />

                Always Here For You

              </div>

              <h3 className="mt-6 text-4xl font-bold leading-tight text-white">

                Need immediate assistance?

              </h3>

              <p className="mt-4 max-w-lg leading-8 text-blue-100">

                Our education consultants help students every day with
                admissions, university selection, scholarships, visa guidance
                and much more.

              </p>

              <div className="mt-10 space-y-5">

                {actions.map((item) => {

                  const Icon = item.icon;

                  return (

                    <button
                      key={item.title}
                      onClick={() => handleActionClick(item)}
                      className="group flex w-full items-center justify-between rounded-2xl border border-white/20 bg-white/10 p-5 text-left text-white backdrop-blur transition hover:bg-white/20"
                    >

                      <div className="flex items-center gap-5">

                        <div className={`${item.color} rounded-xl p-3 text-white`}>

                          <Icon size={24} />

                        </div>

                        <div>

                          <h4 className="font-semibold">

                            {item.title}

                          </h4>

                          <p className="text-sm text-blue-100">

                            {item.desc}

                          </p>

                        </div>

                      </div>

                      <ArrowRight
                        size={20}
                        className="transition group-hover:translate-x-1"
                      />

                    </button>

                  );

                })}

              </div>

            </div>

            {/* RIGHT */}

            <div className="flex flex-col gap-6">

              {/* Consultant */}

              <div className="rounded-3xl border border-white/20 bg-white/10 p-7 backdrop-blur">

                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-4">

                    <div className="relative">

                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-blue-600">

                        <UserRound size={32} />

                      </div>

                      <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-white bg-green-500"></span>

                    </div>

                    <div>

                      <h4 className="text-xl font-bold text-white">

                        Education Consultant

                      </h4>

                      <p className="text-blue-100">

                        Available Now

                      </p>

                    </div>

                  </div>

                  <div className="rounded-full inline-flex gap-1 bg-green-500/20 px-3 py-1 text-sm font-medium text-green-300">

                    ● <span>Online</span>

                  </div>

                </div>

                <div className="mt-7 rounded-2xl bg-white/10 p-5">

                  <p className="leading-7 text-blue-50">

                    👋 Hello! Looking for the perfect university or scholarship?
                    Our consultants usually reply within a few minutes.

                  </p>
                </div>

                <button className="mt-6 w-full rounded-2xl bg-white py-4 font-semibold text-blue-700 transition hover:scale-102">

                  Start Conversation

                </button>

              </div>

              {/* AI */}

              <div className="rounded-3xl border border-cyan-300/30 bg-linear-to-r from-cyan-400/20 to-blue-500/20 p-7 backdrop-blur">

                <div className="flex items-center gap-4">

                  <div className="rounded-2xl bg-sky-400 p-3 text-white">

                    <Bot size={28} />

                  </div>

                  <div>

                    <h4 className="text-xl font-bold text-white">

                      ScholarX AI Assistant

                    </h4>

                    <p className="text-blue-100">

                      Available 24/7

                    </p>

                  </div>

                </div>

                <p className="mt-6 leading-7 text-blue-50">

                  Get instant answers about eligibility, scholarships,
                  universities and application requirements anytime.

                </p>

                <NavLink to="/AI-ChatBot" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-sky-400 px-6 py-3 font-semibold text-white transition hover:scale-104">

                  Ask AI Assistant

                  <ArrowRight size={18} />

                </NavLink>

              </div>

            </div>

          </div>

          {/* Service Cards */}

                                    <div className="mt-10 grid gap-4 sm:grid-cols-3">

                                        <div className="group rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur transition-all duration-300 hover:-translate-y-2 hover:border-blue-300/40 hover:bg-white/10">

                                            <div className="mb-4 inline-flex rounded-xl bg-blue-500/20 p-3 text-cyan-300">
                                                <GraduationCap size={24} />
                                            </div>

                                            <h4 className="font-semibold text-white">
                                                University Selection
                                            </h4>

                                            <p className="mt-2 text-sm leading-6 text-blue-100">
                                                Find universities that perfectly match your profile and future goals.
                                            </p>

                                        </div>

                                        <div className="group rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur transition-all duration-300 hover:-translate-y-2 hover:border-amber-300/40 hover:bg-white/10">

                                            <div className="mb-4 inline-flex rounded-xl bg-amber-500/20 p-3 text-amber-300">
                                                <BadgeDollarSign size={24} />
                                            </div>

                                            <h4 className="font-semibold text-white">
                                                Scholarship Guidance
                                            </h4>

                                            <p className="mt-2 text-sm leading-6 text-blue-100">
                                                Explore scholarships and funding opportunities to reduce tuition costs.
                                            </p>

                                        </div>

                                        <div className="group rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur transition-all duration-300 hover:-translate-y-2 hover:border-cyan-300/40 hover:bg-white/10">

                                            <div className="mb-4 inline-flex rounded-xl bg-cyan-500/20 p-3 text-cyan-300">
                                                <Plane size={24} />
                                            </div>

                                            <h4 className="font-semibold text-white">
                                                Visa Assistance
                                            </h4>

                                            <p className="mt-2 text-sm leading-6 text-blue-100">
                                                Complete support for documentation, interviews and visa preparation.
                                            </p>

                                        </div>

                                    </div>

          {/* Bottom Stats */}

          <div className="relative mt-12 grid gap-5 border-t border-white/15 pt-10 md:grid-cols-3">

            {stats.map((item) => {

              const Icon = item.icon;

              return (

                <div
                  key={item.title}
                  className="rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur transition-all duration-300 hover:-translate-y-2 hover:border-gray-400"
                >

                  <div className="flex items-center gap-4">

                    <div className="rounded-xl bg-white/15 p-3 text-white">

                      <Icon size={24} />

                    </div>

                    <div>

                      <p className="text-sm text-blue-100">

                        {item.title}

                      </p>

                      <h4 className="mt-1 text-3xl font-bold text-white">

                        {item.value}

                      </h4>

                    </div>

                  </div>

                </div>

              );

            })}

          </div>

        </div>

      </div>
        </div>

      </div>
    </section>
  );
};

export default Support;