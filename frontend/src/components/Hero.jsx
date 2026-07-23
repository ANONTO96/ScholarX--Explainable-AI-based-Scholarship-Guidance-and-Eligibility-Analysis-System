import { NavLink } from "react-router";
import heroImg1 from "../assets/hero1.png"

const Hero = () => {
    return (
        <div className="my-20 w-full lg:w-[90%] mx-auto">
        <div className=" flex flex-col gap-5 items-start justify-center w-[96%] max-w-210 text-center mx-auto px-5 sm:px-10 lg:px-20">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-semibold">Find the scholarship that fits your future</h1>
            <p className="text-gray-600">We aggregate global opportunities from Erasmus+ to DAAD and analyze your profile against them. Then we build your personal roadmap to a funded education.</p>
            <div className="flex gap-2 sm:gap-5 items-center justify-center w-full">
                <NavLink to="/start"
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
            <NavLink to="/learn"
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
        <div className="mt-16 flex items-center justify-center">
                <img className="lg:w-[80%] px-4 sm:px-5 mx-auto" src={heroImg1} alt="Hero" />
            </div>
        </div>
    );
};

export default Hero;