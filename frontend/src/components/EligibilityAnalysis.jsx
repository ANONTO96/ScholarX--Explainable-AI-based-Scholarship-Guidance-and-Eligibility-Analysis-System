import { ArrowRight } from "lucide-react";
import heroImg3 from "../assets/hero3.png";
import { NavLink } from "react-router";

const EligibilityAnalysis = () => {
    return (
        <section className="pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-10">
        <div className="grid lg:grid-cols-2 items-center gap-14 xl:gap-22">
          {/* Left Content */}
          <div className="order-2 lg:order-1">
            <p className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-4">
              Analyze
            </p>

            <h2 className="text-4xl lg:text-5xl font-semibold leading-tight text-gray-900">
              See your true odds
              <br />
              before you write a
              <br />
              single word
            </h2>

            <p className="mt-3 text-gray-600 leading-8 max-w-xl">
              Our engine reads your profile and instantly cross-references it
              against every scholarship in the system. You get a clear match
              probability, not a vague hope.
            </p>
            {/* Buttons */}
            <div className="mt-5 flex items-center gap-5">
              <NavLink to="/eligibilityAnalysis"
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
                to="/learn-more-about-eligibility-analysis"
                className="group flex items-center gap-2 font-semibold text-gray-900 hover:text-blue-500 transition"
              >
                Learn More
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </NavLink>
            </div>
          </div>

          {/* Right Image */}
          <div className="order-1 lg:order-2">
            <img
              src={heroImg3}
              alt="Students checking scholarship eligibility"
              className="w-full h-90 sm:h-100 lg:h-125 object-cover rounded-lg shadow-xl"
            />
          </div>
        </div>
      </div>
    </section>
    );
};

export default EligibilityAnalysis;