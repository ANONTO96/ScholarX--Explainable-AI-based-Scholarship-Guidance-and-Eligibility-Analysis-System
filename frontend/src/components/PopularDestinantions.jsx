import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { NavLink } from "react-router";
import { useState } from "react";
import usa from "../assets/usa.avif"
import uk from "../assets/uk.avif"
import canada from "../assets/canada.avif"
import australia from "../assets/australia.avif"
import germany from "../assets/germany.avif"
import france from "../assets/france.avif"
import ireland from "../assets/ireland.avif"
import netherlands from "../assets/netherlands.avif"
import sweden from "../assets/sweden.avif"
import newzealand from "../assets/newzealand.avif"
import switzerland from "../assets/switzerland.avif"
import japan from "../assets/japan.avif"
import southkorea from "../assets/southkorea.avif"
import singapore from "../assets/singapore.avif"
import italy from "../assets/italy.avif"
import malaysia from "../assets/malaysia.avif";

const countries = [
  {
    id: 1,
    name: "United States",
    slug: "usa",
    image: usa,
  },
  {
    id: 2,
    name: "United Kingdom",
    slug: "uk",
    image: uk,
  },
  {
    id: 3,
    name: "Canada",
    slug: "canada",
    image: canada,
  },
  {
    id: 4,
    name: "Australia",
    slug: "australia",
    image: australia,
  },
  {
    id: 5,
    name: "Germany",
    slug: "germany",
    image: germany,
  },
  {
    id: 6,
    name: "France",
    slug: "france",
    image: france,
  },
  {
    id: 7,
    name: "Ireland",
    slug: "ireland",
    image: ireland,
  },
  {
    id: 8,
    name: "Netherlands",
    slug: "netherlands",
    image: netherlands,
  },
  {
    id: 9,
    name: "Sweden",
    slug: "sweden",
    image: sweden,
  },
  {
    id: 10,
    name: "New Zealand",
    slug: "new-zealand",
    image: newzealand,
  },
  {
    id: 11,
    name: "Switzerland",
    slug: "switzerland",
    image: switzerland,
  },
  {
    id: 12,
    name: "Italy",
    slug: "italy",
    image: italy,
  },
  {
    id: 13,
    name: "South Korea",
    slug: "south-korea",
    image: southkorea,
  },
  {
    id: 14,
    name: "Singapore",
    slug: "singapore",
    image: singapore,
  },
  {
    id: 15,
    name: "Japan",
    slug: "japan",
    image: japan,
  },
  {
    id: 16,
    name: "Malaysia",
    slug: "malaysia",
    image: malaysia,
  },
];

const PopularDestinations = () => {
  const visibleCards = 6;
  const [startIndex, setStartIndex] = useState(0);

  const handleNext = () => {
    setStartIndex((prev) => (prev + 1) % countries.length);
  };

  const handlePrev = () => {
    setStartIndex(
      (prev) => (prev - 1 + countries.length) % countries.length
    );
  };

  const visibleCountries = [];

  for (let i = 0; i < visibleCards; i++) {
    visibleCountries.push(
      countries[(startIndex + i) % countries.length]
    );
  }
  return (
    <section className="pb-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-10">

        {/* Heading */}
        <div className="text-center mb-14">
          <h2 className="text-4xl lg:text-5xl font-semibold text-gray-900">
            Explore popular study destinations
          </h2>

          <p className="mt-3 text-lg text-gray-600">
            Find a country to learn and excel in all aspects of life
          </p>
        </div>

        {/* Cards */}
        <div className="overflow-hidden">
          <div className="flex gap-6 transition-transform duration-500">
            {visibleCountries.map((country) => (
              <NavLink
                key={country.id}
                to={`/countries/${country.slug}`}
                className="group shrink-0 w-52 md:w-71"
              >
                <div className="overflow-hidden rounded-3xl">
                  <img
                    src={country.image}
                    alt={country.name}
                    className="h-48 w-full object-cover transition duration-500 group-hover:scale-110"
                  />
                </div>

                <h3 className="mt-4 text-center text-xl font-semibold">
                  {country.name}
                </h3>
              </NavLink>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-14 flex items-center justify-between">
          <div className="w-27">
          </div>
          <NavLink
            to="/countries"
            className="group flex items-center gap-2 font-semibold rounded-4xl border border-gray-300 px-5 py-3 text-gray-900 hover:scale-104 hover:border-gray-300 hover:text-blue-500 transition"
          >
            Show All
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </NavLink>

          <div className="flex gap-4">
            <button
              onClick={handlePrev}
              className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition"
            >
              <ChevronLeft />
            </button>

            <button
              onClick={handleNext}
              className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition"
            >
              <ChevronRight />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PopularDestinations;