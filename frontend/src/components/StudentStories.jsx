import { ChevronRight } from "lucide-react";
import daadLogo from "../assets/DAAD-logo.svg"
import erasmusLogo from "../assets/Erasmus-logo.svg"
import chevening from "../assets/Chevening-logo.png"
import { NavLink } from "react-router";

const testimonials = [
  {
    logo: daadLogo,
    quote:
      "I found a fully funded master's in Berlin that I would have never seen on my own. The roadmap kept me sane through three applications at once.",
    image: "https://i.pravatar.cc/80?img=12",
    name: "Amara Chen",
    role: "DAAD Scholarship Recipient",
  },
  {
    logo: erasmusLogo,
    quote:
      "The match probability score saved me from wasting weeks on long shots. I focused on two strong fits and got them both.",
    image: "https://i.pravatar.cc/80?img=15",
    name: "Leo Vargas",
    role: "Erasmus Mundus Scholar",
  },
  {
    logo: chevening,
    quote:
      "It felt like having a coach. The deadline tracking alone was worth it. I submitted my best work early for the first time in my life.",
    image: "https://i.pravatar.cc/80?img=32",
    name: "Priya Kapoor",
    role: "Chevening Award Winner",
  },
];

export default function StudentStories() {
  return (
    <section className="bg-zinc-100 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-10">
        {/* Heading */}
        <div className="max-w-md mb-10">
          <h2 className="text-4xl lg:text-5xl font-semibold text-gray-900">
            Student stories
          </h2>

          <p className="mt-3 text-gray-600 leading-8">
            Real results from scholars who stopped searching and started
            finding.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl hover:scale-103 transition-all border border-gray-200 hover:border-sky-100 flex flex-col justify-between min-h-90"
            >
              {/* Logo */}
              <div className="mb-8">
                <img
    src={item.logo}
    alt={item.logoAlt}
    className="h-10 w-10 object-contain rounded-full border border-gray-200"
  />
              </div>

              {/* Quote */}
              <p className="text-[16px] leading-8 text-gray-700 flex-1">
                "{item.quote}"
              </p>

              {/* User */}
              <div className="flex items-center gap-3 mt-5">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-11 h-11 rounded-full object-cover"
                />

                <div>
                  <h4 className="font-medium text-[15px] text-black">
                    {item.name}
                  </h4>

                  <p className="text-sm text-gray-500">{item.role}</p>
                </div>
              </div>

              {/* Link */}
              <NavLink className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-black hover:gap-3 transition-all">
                Read case study
                <ChevronRight size={16} strokeWidth={2.5} />
              </NavLink>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}