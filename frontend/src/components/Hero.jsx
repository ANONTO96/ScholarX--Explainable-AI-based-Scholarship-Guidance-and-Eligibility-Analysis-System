import { NavLink } from "react-router";
import heroImg1 from "../assets/hero1.png"
import { BookOpen, GraduationCap, Sparkles } from "lucide-react";

const Hero = () => {
    return (
        <section className="mb-20 pt-40 w-full lg:w-[95%] xl:w-[90%] mx-auto">
            {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-blue-300/20 blur-3xl" />

        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-indigo-300/20 blur-3xl" />

        <div className="absolute bottom-0 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-sky-200/20 blur-3xl" />

        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
            linear-gradient(to right,#2563eb 1px,transparent 1px),
            linear-gradient(to bottom,#2563eb 1px,transparent 1px)
          `,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Floating Icons */}

      <BookOpen
        className="absolute z-10 left-15 md:left-25 top-50 md:top-55 lg:top-60 rotate-12 text-blue-200"
        size={90}
      />

      <GraduationCap
        className="absolute z-10 right-15 md:right-25 top-70 md:top-80 lg:top-100 -rotate-12 text-indigo-200"
        size={90}
      />

      <Sparkles
        className="absolute z-10 right-[45%] top-22 lg:top-25 rotate-12 text-blue-200"
        size={55}
      />
        <div className="relative z-20 lg:z-0 flex flex-col gap-5 items-start justify-center w-[96%] max-w-210 text-center mx-auto px-5 sm:px-10 lg:px-20">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-semibold">Find the scholarship that fits your future</h1>
            <p className="text-gray-600">We aggregate global opportunities from Erasmus+ to DAAD and analyze your profile against them. Then we build your personal roadmap to a funded education.</p>
            <div className="flex gap-2 sm:gap-5 items-center justify-center w-full">
                <NavLink to="/programs"
                        className="px-3 py-1 sm:px-4 shrink-0 text-lg rounded-lg
               bg-[#DCEEFF] text-black
               border border-[#3A2C2C]
               shadow-[2px_3px_0px_0px_#3A2C2C]
               transition-all duration-200
               hover:translate-y-0.5
               hover:shadow-[1px_2px_0px_0px_#3A2C2C]"
                    >
                        Start
                    </NavLink>
            <NavLink to="/learn-more-about-scholarship-search"
                        className="px-3 py-1 sm:px-4 shrink-0 text-lg rounded-lg
               bg-gray-100 text-black
               border border-[#3A2C2C]
               shadow-[2px_3px_0px_0px_#3A2C2C]
               transition-all duration-200
               hover:translate-y-0.5
               hover:shadow-[1px_2px_0px_0px_#3A2C2C]"
                    >
                        Learn
                    </NavLink>
            </div>
        </div>
        <div className="relative z-20 mt-16 flex items-center justify-center">
                <img className="xl:w-[75%] px-4 sm:px-5 mx-auto" src={heroImg1} alt="Banner" />
            </div>
        </section>
    );
};

export default Hero;