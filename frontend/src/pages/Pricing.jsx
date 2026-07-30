import {
  Check,
  X,
  Sparkles,
  Crown,
  Compass,
  ArrowRight,
} from "lucide-react";
import { NavLink } from "react-router";

const plans = [
  {
    name: "Free",
    icon: Compass,
    price: "৳0",
    duration: "Forever",
    description:
      "Perfect for students who are exploring study abroad opportunities before making any decisions.",
    button: "Get Started",
    featured: false,
    features: [
      "Browse Universities & Programs",
      "Search Scholarships",
      "Explore Country Guides & Information",
      "Save up to 5 Favorites",
      "Access Blogs & Study Abroad Resources",
    ],
    missingFeatures: [
      "AI Eligibility Analysis",
      "Personalized University & Scholarship AI Recommendations",
      "AI Profile Evaluation",
      "Application Planning AI Tools",
      "AI Document Assistance",
    ],
  },
  {
    name: "Basic",
    icon: Sparkles,
    price: "৳999",
    duration: "30-Day Access",
    badge: "Most Popular",
    description:
      "Everything you need to find the best universities and scholarships based on their academic profile.",
    button: "Start with AI",
    featured: true,
    features: [
      "Everything In Free Plan",
      "AI Eligibility Checker",
      "Personalized University Recommendations",
      "Scholarship Match Analysis",
      "AI Profile Evaluation",
      "Missing Requirement Analysis",
      "Unlimited Favorites",
      "Compare Universities Side-by-Side",
      "Advanced AI Search Filters",
      "Download Eligibility Report (PDF)",
    ],
  },
  {
    name: "Premium",
    icon: Crown,
    price: "৳1999",
    duration: "30-Day Access",
    description:
      "Complete AI-powered application preparation to maximize your admission and scholarship opportunities with expert guidance.",
    button: "Go Premium",
    featured: false,
    premium: true,
    features: [
      "Everything In Basic Plan",
      "AI SOP Review & Writing Assistant",
      "AI Resume/CV Review & Suggestions",
      "AI Document Checklist Assistant",
      "Application Progress Tracker",
      "Deadline Reminder System",
      "Admission Success Probability Score",
      "Scholarship Winning Probability Score",
      "Priority AI Processing",
      "One 30-45 Minute Expert Consultation",
      "Priority Customer Support",
    ],
  },
];

export default function Pricing() {
  return (
    <section className="relative overflow-hidden bg-gray-50 py-24">

      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 left-20 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-purple-200/30 blur-3xl"></div>
    </div>

      <div className="relative mx-auto max-w-7xl px-6">

        {/* Heading */}

        <div className="mx-auto max-w-3xl text-center">

          <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-100 px-5 py-2 text-sm font-semibold text-sky-600">

            💎 Pricing Plans

          </span>

          <h2 className="mt-6 text-4xl lg:text-5xl font-bold text-gray-900">

            Choose Your ScholarX Journey

          </h2>

          <p className="mt-6 text-lg leading-8 text-gray-600">

            Whether you're just exploring universities or preparing your
            applications, ScholarX has a plan designed for every stage of
            your study abroad journey.

          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-gray-600">

            <div className="rounded-full bg-white px-4 py-2 shadow">

              ✔ One-Time Payment

            </div>

            <div className="rounded-full bg-white px-4 py-2 shadow">

              ✔ No Subscription

            </div>

            <div className="rounded-full bg-white px-4 py-2 shadow">

              ✔ Instant AI Access

            </div>

          </div>
        </div>

        {/* Cards */}

        <div className="mt-20 grid gap-10 lg:gap-8 sm:w-[75%] lg:w-full mx-auto lg:grid-cols-2 xl:grid-cols-3">

          {plans.map((plan) => {
            const Icon = plan.icon;

            return (
              <div
                key={plan.name}
                className={`group relative flex flex-col rounded-3xl border bg-white p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${
  plan.featured
    ? "scale-[1.03] border-sky-600 shadow-2xl"
    : plan.premium
    ? "border-purple-300"
    : "border-gray-200"
}`}
              >
                {plan.badge && (
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 rounded-full bg-linear-to-r from-blue-600 to-indigo-600 w-40 px-5 py-2 text-sm font-semibold text-white shadow-lg">

                    ⭐ {plan.badge}

                  </div>
                )}

                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-2xl shadow-sm
transition-all
duration-500
group-hover:scale-110
group-hover:rotate-3
group-hover:shadow-lg ${
                    plan.featured
                      ? "bg-blue-600 text-white"
                      : plan.premium
                      ? "bg-purple-600 text-white"
                      : "bg-sky-200 text-gray-700 group-hover:bg-sky-500 group-hover:text-white"
                  }`}
                >
                  <Icon size={30} />
                </div>

                <h3 className="mt-6 text-3xl font-bold">{plan.name}</h3>
                {/* price plan */}
                <div className="mt-5 flex flex-wrap items-end gap-2">
                  <span className="text-5xl font-extrabold">
                    {plan.price}
                  </span>

                  <span className="pb-2 text-gray-500">
                    / {plan.duration}
                  </span>
                </div>
                {/* description */}
                <p className="mt-5 text-gray-600 leading-7">
                  {plan.description}
                </p>

                <div className="my-8 h-px bg-gray-200"></div>

                <div className="space-y-4">

                  {plan.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-start gap-3"
                    >
                      <div
                        className={`mt-1 flex h-6 w-6 items-center justify-center rounded-full ${
                          plan.featured
                            ? "bg-blue-100"
                            : plan.premium
                            ? "bg-purple-100"
                            : "bg-gray-100"
                        }`}
                      >
                        <Check
                          size={14}
                          className={
                            plan.featured
                              ? "text-blue-600"
                              : plan.premium
                              ? "text-purple-600"
                              : "text-gray-600"
                          }
                        />
                      </div>

                      <span className="text-gray-700">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
                {plan.missingFeatures && (
  <>
    <div className="my-6 border-t border-dashed border-gray-200 pt-6">
      <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400">
        Unlock with Paid Membership
      </p>

      <div className="space-y-4">
        {plan.missingFeatures.map((feature) => (
          <div
            key={feature}
            className="flex items-start gap-3 opacity-60"
          >
            <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-50">
              <X
                size={14}
                className="text-red-500"
              />
            </div>

            <span className="text-gray-500">
              {feature}
            </span>
          </div>
        ))}
      </div>
    </div>
  </>
)}
                {/* empty div for aligning button at the bottom */}
                <div className="grow"></div>
                <NavLink
                  className={`mt-10 group flex w-full items-center justify-center gap-2 rounded-2xl py-4 font-semibold transition ${
                    plan.featured
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : plan.premium
                      ? "bg-purple-600 text-white hover:bg-purple-700"
                      : "border bg-white hover:bg-gray-50"
                  }`}
                >
                  {plan.button}

                  <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
                </NavLink>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}