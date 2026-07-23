import { ArrowRight } from "lucide-react";
import { NavLink } from "react-router";

const RoadmapSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-3xl mx-auto px-6 text-center">

        {/* Small Label */}
        <p className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-4">
          Execute
        </p>

        {/* Heading */}
        <h2 className="text-4xl lg:text-5xl font-semibold leading-tight text-gray-900">
          Your roadmap to yes
        </h2>

        {/* Description */}
        <p className="mt-3 text-gray-600 leading-8 max-w-2xl mx-auto">
          We turn a mountain of requirements into a clear, chronological
          plan built just for you. Every deadline, every document, every
          step mapped until the submit button is hit.
        </p>

        {/* Buttons */}
        <div className="mt-5 flex justify-center items-center gap-6">

          <NavLink
                    to="/ScholarshipSearch"
                        className="px-3 py-1 sm:px-4 sm:py-2 shrink-0 rounded-lg
               bg-gray-100 text-black
               border border-[#3A2C2C]
               shadow-[2px_3px_0px_0px_#3A2C2C]
               transition-all duration-200
               hover:translate-y-0.5
               hover:shadow-[1px_2px_0px_0px_#3A2C2C]"
                    >
                        Start
                    </NavLink>

              <NavLink
                    to="/learn-more-about-scholarship-search"
                        className="group flex items-center gap-2 font-semibold text-gray-900 hover:text-blue-500 transition"
                    >
                Learn More
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </NavLink>
        </div>

        {/* Timeline */}
        <div className="mt-14 flex justify-center gap-10 text-sm text-gray-500">

          <div className="relative pb-2">
            <span className="text-black font-medium">
              Plan
            </span>

            <div className="absolute left-1/2 -translate-x-1/2 bottom-0 h-0.5 w-8 bg-black rounded-full" />
          </div>

          <span>Track</span>

          <span>Submit</span>

        </div>

      </div>
    </section>
  );
};

export default RoadmapSection;