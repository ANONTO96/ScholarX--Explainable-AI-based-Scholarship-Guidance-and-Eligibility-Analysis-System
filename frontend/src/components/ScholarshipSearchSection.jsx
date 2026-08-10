import { ArrowRight, Globe2, Timer, Database } from "lucide-react";
import heroImg2 from "../assets/hero2.png"; // Change to your image path
import { NavLink } from "react-router";

const ScholarshipSearchSection = () => {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-14 xl:gap-22 items-center">
          {/* Left Image */}
          <div>
            <img
              src={heroImg2}
              alt="Students searching scholarships"
              className="w-full h-90 sm:h-100 lg:h-125 rounded-lg object-cover shadow-xl"
            />
          </div>

          {/* Right Content */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">
              Aggregate
            </p>

            <h2 className="text-4xl lg:text-5xl font-semibold text-gray-900 leading-tight">
              One system to search every scholarship that matters
            </h2>

            <p className="mt-3 text-gray-600 max-w-xl leading-8">
              We pull thousands of opportunities from Erasmus+, DAAD,
              government portals, and hundreds of trusted scholarship
              providers into one intelligent search experience.
            </p>

            {/* Features */}
            <div className="mt-5 space-y-3">
              <div className="flex items-start gap-4">
                <Globe2 className="w-5 h-5 mt-1 text-blue-400" />

                <p className="text-gray-700">
                  Global scholarship coverage from Erasmus+, DAAD and many
                  more providers.
                </p>
              </div>

              <div className="flex items-start gap-4">
                <Timer className="w-5 h-5 mt-1 text-blue-400" />

                <p className="text-gray-700">
                  Real-time updates so you never miss new opportunities.
                </p>
              </div>

              <div className="flex items-start gap-4">
                <Database className="w-5 h-5 mt-1 text-blue-400" />

                <p className="text-gray-700">
                  Clean, unified data without duplicates or outdated listings.
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-5 flex flex-wrap items-center gap-5">
              <NavLink
                    to="/programs"
                        className="px-3 py-1 sm:px-4 sm:py-2 shrink-0 text-lg rounded-lg
               bg-gray-100 text-black
               border border-[#3A2C2C]
               shadow-[2px_3px_0px_0px_#3A2C2C]
               transition-all duration-200
               hover:translate-y-0.5
               hover:shadow-[1px_2px_0px_0px_#3A2C2C]"
                    >
                        Explore
                    </NavLink>

              <NavLink
                    to="/learn-more-about-scholarship-search"
                        className="group flex items-center gap-2 font-semibold text-gray-900 hover:text-blue-500 transition"
                    >
                Learn More
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScholarshipSearchSection;