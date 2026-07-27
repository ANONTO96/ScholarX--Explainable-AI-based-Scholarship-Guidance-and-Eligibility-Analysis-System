import { NavLink } from "react-router";
import { CalendarDays,
  ChartNoAxesColumn,
  FileCheck, ArrowRight } from "lucide-react";
import plan from "../assets/plan.jpg";
import track from "../assets/track.jpg";
import submit from "../assets/submit.jpg";
import { useState } from "react";

const TimelineSection = () => {
  // state for cards
const [current, setCurrent] = useState(0);

const steps = [
  {
    title: "Plan",
    icon: CalendarDays,
  },
  {
    title: "Track",
    icon: ChartNoAxesColumn,
  },
  {
    title: "Submit",
    icon: FileCheck,
  },
];

const timelineCards = [
  {
    tag: "Plan",
    title: "A personalized timeline built from your best matches",
    description:
      "The system sequences your applications by deadline and probability. You always know exactly what to work on next.",
    image: plan,
  },
  {
    tag: "Track",
    title: "Track every scholarship in one organized dashboard",
    description:
      "Monitor deadlines, document status, interview schedules, and application progress without missing anything.",
    image: track,
  },
  {
    tag: "Submit",
    title: "Submit confidently with an AI-powered checklist",
    description:
      "ScholarX verifies your documents, highlights missing requirements, and helps maximize your success rate.",
    image: submit,
  },
];


const card = timelineCards[current];

    return (
        <section className="pb-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-10 ">
        <div className="flex justify-center gap-10 mb-12">
  {steps.map((step, index) => {
    const Icon = step.icon;

    return (
      <button
        key={step.title}
        onClick={() => setCurrent(index)}
        className={`flex items-center gap-2 pb-3 border-b-2 transition ${
          current === index
            ? "border-black text-black"
            : "border-transparent text-gray-500 hover:text-black"
        }`}
      >
        <Icon size={18} />
        {step.title}
      </button>
    );
  })}
</div>
        <div className="grid lg:grid-cols-2 items-center gap-14 xl:gap-22 bg-zinc-100 rounded-lg shadow-lg">
          {/* Left Content */}
          <div className="order-2 px-4 pb-20 lg:p-0">
            <p className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-4">
              {card.tag}
            </p>

            <h2 className="text-4xl lg:text-5xl font-semibold leading-tight text-gray-900">
              {card.title}
            </h2>

            <p className="mt-3 text-gray-600 leading-8 max-w-xl">
              {card.description}
            </p>
            {/* Buttons */}
            <div className="mt-5 flex items-center gap-5">
              <NavLink to="/TimelineSection"
                className="px-3 py-1 sm:px-4 sm:py-2 rounded-lg
                           bg-gray-100
                           border border-[#3A2C2C]
                           shadow-[2px_3px_0px_0px_#3A2C2C]
                           transition-all duration-200
                           hover:translate-y-0.5
                           hover:shadow-[1px_2px_0px_0px_#3A2C2C]"
              >
                Start
              </NavLink>

              <NavLink
                to="/learn-more-about-timeline-section"
                className="group flex items-center gap-2 font-semibold text-gray-900 hover:text-blue-500 transition"
              >
                Learn More
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </NavLink>
            </div>
          </div>

          {/* Right Image */}
          <div className="order-1">
            <img
              src={card.image}
              alt="Students checking scholarship eligibility"
              className="w-full h-90 sm:h-100 lg:h-125 object-cover rounded-t-lg lg:rounded-t-none lg:rounded-l-lg shadow-xl"
            />
          </div>
        </div>
      </div>
    </section>
    );
};

export default TimelineSection;