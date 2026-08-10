import { ArrowRight } from "lucide-react";
import { NavLink } from "react-router";

export default function CTASection() {
  return (
    <section className="pt-20 pb-10 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-neutral-100 shadow-lg rounded-lg py-24 px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-semibold text-gray-900">
            Your funded future starts now
          </h2>

          <p className="mt-3 max-w-2xl mx-auto text-gray-600 text-base">
            Stop searching and start building your path to a fully funded
            education abroad today.
          </p>

          <div className="mt-10 flex items-center justify-center gap-4">
            <NavLink to="/programs" className="px-3 py-1 sm:px-4 sm:py-2 rounded-xl bg-sky-100 border border-[#3A2C2C] shadow-[2px_3px_0px_0px_#3A2C2C] font-medium hover:translate-y-0.5 hover:shadow-[1px_2px_0px_0px_#3A2C2C] transition-all">
              Start
            </NavLink>

            <NavLink to="/learn" className="px-3 py-1 sm:px-4 sm:py-2 rounded-xl bg-white border border-[#3A2C2C] shadow-[2px_3px_0px_0px_#3A2C2C] font-medium hover:translate-y-0.5 hover:shadow-[1px_2px_0px_0px_#3A2C2C] transition-all inline-flex items-center gap-2">
              Learn More
              <ArrowRight size={16} />
            </NavLink>
          </div>
        </div>
      </div>
    </section>
  );
}