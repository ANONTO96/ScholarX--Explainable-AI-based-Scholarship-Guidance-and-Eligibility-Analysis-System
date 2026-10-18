import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { NavLink } from "react-router";
import { useRef, useState } from "react";
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
import china from "../assets/china.avif"
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
    name: "Ireland",
    slug: "ireland",
    image: ireland,
  },
  {
    id: 7,
    name: "New Zealand",
    slug: "new-zealand",
    image: newzealand,
  },
  {
    id: 8,
    name: "Netherlands",
    slug: "netherlands",
    image: netherlands,
  },
  {
    id: 9,
    name: "Italy",
    slug: "italy",
    image: italy,
  },
  {
    id: 10,
    name: "France",
    slug: "france",
    image: france,
  },
  {
    id: 11,
    name: "Sweden",
    slug: "sweden",
    image: sweden,
  },
  
  {
    id: 12,
    name: "Switzerland",
    slug: "switzerland",
    image: switzerland,
  },
  {
    id: 13,
    name: "South Korea",
    slug: "south-korea",
    image: southkorea,
  },
  {
    id: 14,
    name: "China",
    slug: "china",
    image: china,
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
  const scrollContainerRef = useRef(null);
const dragRef = useRef({
  isDragging: false,
  startX: 0,
  scrollLeft: 0,
  hasMoved: false,
});

const [isDragging, setIsDragging] = useState(false);

const scrollCards = (direction) => {
  if (!scrollContainerRef.current) return;

  scrollContainerRef.current.scrollBy({
    left: direction * 280,
    behavior: "smooth",
  });
};

const handleMouseDown = (e) => {
  if (e.button !== 0) return;

  dragRef.current = {
    isDragging: true,
    startX: e.pageX,
    scrollLeft: scrollContainerRef.current.scrollLeft,
    hasMoved: false,
  };

  setIsDragging(true);
};

const handleMouseMove = (e) => {
  if (!dragRef.current.isDragging) return;

  const distance = e.pageX - dragRef.current.startX;

  if (Math.abs(distance) > 5) {
    dragRef.current.hasMoved = true;
  }

  if (dragRef.current.hasMoved) {
    scrollContainerRef.current.scrollLeft =
      dragRef.current.scrollLeft - distance;
  }
};

const handleMouseUp = () => {
  dragRef.current.isDragging = false;
  setIsDragging(false);
};

const handleCardClick = (e) => {
  if (dragRef.current.hasMoved) {
    e.preventDefault();
    e.stopPropagation();
    dragRef.current.hasMoved = false;
  }
};
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
<div
  ref={scrollContainerRef}
  onMouseDown={handleMouseDown}
  onMouseMove={handleMouseMove}
  onMouseUp={handleMouseUp}
  onMouseLeave={handleMouseUp}
  onClickCapture={handleCardClick}
  className={`overflow-x-auto overflow-y-hidden
    scrollbar-none [&::-webkit-scrollbar]:hidden
    touch-pan-x select-none
    ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
>
  <div className="flex w-max gap-5 pb-2">
    {countries.map((country) => (
      <NavLink
        key={country.id}
        to={`/countries/${country.slug}`}
        draggable={false}
        className="group shrink-0 w-52 md:w-71"
      >
        <div className="overflow-hidden rounded-3xl">
          <img
            src={country.image}
            alt={country.name}
            draggable={false}
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
<div className="mt-10 sm:mt-12 flex flex-col-reverse sm:flex-row items-center justify-between gap-5">

  {/* Scroll hint */}
  <p className="hidden lg:block text-sm text-gray-500">
    Drag to explore destinations
  </p>

  {/* Show All */}
  <NavLink
    to="/countries"
    className="group inline-flex items-center justify-center gap-2 rounded-full border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-900 transition-all duration-300 hover:border-blue-500 hover:text-blue-600 hover:shadow-sm"
  >
    Explore all destinations
    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
  </NavLink>

  {/* Navigation */}
  <div className="flex items-center gap-3">
    <button
      onClick={() => scrollCards(-1)}
      aria-label="Scroll destinations left"
      className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-300 text-gray-700 transition-all duration-300 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 active:scale-95"
    >
      <ChevronLeft className="h-5 w-5" />
    </button>

    <button
      onClick={() => scrollCards(1)}
      aria-label="Scroll destinations right"
      className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-300 text-gray-700 transition-all duration-300 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 active:scale-95"
    >
      <ChevronRight className="h-5 w-5" />
    </button>
  </div>

</div>
      </div>
    </section>
  );
};

export default PopularDestinations;