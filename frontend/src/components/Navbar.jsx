import { Menu, X, ArrowRight, ChevronDown, } from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router";
import ReactCountryFlag from "react-country-flag";


const Navbar = () => {
  // state for mobile dropdown icon
  const [isOpen, setIsOpen] = useState(false);
  // for closing dropdown menu


  const countries = [
    { name: "United States", code: "US", slug: "usa" },
    { name: "United Kingdom", code: "GB", slug: "uk" },
    { name: "Canada", code: "CA", slug: "canada" },
    { name: "Australia", code: "AU", slug: "australia" },
    { name: "Germany", code: "DE", slug: "germany" },
    { name: "Ireland", code: "IE", slug: "ireland" },
    { name: "New Zealand", code: "NZ", slug: "new-zealand" },
    { name: "Netherlands", code: "NL", slug: "netherlands" },
    { name: "Italy", code: "IT", slug: "italy" },
    { name: "France", code: "FR", slug: "france" },
    { name: "Sweden", code: "SE", slug: "sweden" },
    { name: "Switzerland", code: "CH", slug: "switzerland" },
    { name: "China", code: "CN", slug: "china" },
    { name: "Japan", code: "JP", slug: "japan" },
    { name: "South Korea", code: "KR", slug: "south-korea" },
    { name: "Malaysia", code: "MY", slug: "malaysia" },
  ];

  const courseCategories = [
    {
      title: "Engineering & Technology",
      items: [
        {
          name: "Computer Science",
          slug: "computer-science",
        },
        {
          name: "Software Engineering",
          slug: "software-engineering",
        },
        {
          name: "Data Science",
          slug: "data-science",
        },
        {
          name: "Artificial Intelligence",
          slug: "artificial-intelligence",
        },
        {
          name: "Cyber Security",
          slug: "cyber-security",
        },
        {
          name: "Civil Engineering",
          slug: "civil-engineering",
        },
        {
          name: "Mechanical Engineering",
          slug: "mechanical-engineering",
        },
        {
          name: "Electrical Engineering",
          slug: "electrical-engineering",
        },
      ],
    },

    {
      title: "Business & Management",
      items: [
        {
          name: "Business Administration (MBA)",
          slug: "business-administration",
        },
        {
          name: "Finance",
          slug: "finance",
        },
        {
          name: "Accounting",
          slug: "accounting",
        },
        {
          name: "Marketing",
          slug: "marketing",
        },
        {
          name: "Economics",
          slug: "economics",
        },
        {
          name: "International Business",
          slug: "international-business",
        },
      ],
    },

    {
      title: "Health & Medicine",
      items: [
        {
          name: "Medicine",
          slug: "medicine",
        },
        {
          name: "Nursing",
          slug: "nursing",
        },
        {
          name: "Pharmacy",
          slug: "pharmacy",
        },
        {
          name: "Public Health",
          slug: "public-health",
        },
        {
          name: "Dentistry",
          slug: "dentistry",
        },
        {
          name: "Biomedical Science",
          slug: "biomedical-science",
        },
      ],
    },

    {
      title: "Science & Humanities",
      items: [
        {
          name: "Psychology",
          slug: "psychology",
        },
        {
          name: "Law",
          slug: "law",
        },
        {
          name: "Architecture",
          slug: "architecture",
        },
        {
          name: "Environmental Science",
          slug: "environmental-science",
        },
        {
          name: "Biotechnology",
          slug: "biotechnology",
        },
        {
          name: "Media & Communication",
          slug: "media-communication",
        },
      ],
    },
  ];
  return (
    <nav className="fixed inset-x-0 z-50 w-full pt-1 px-2">
      <div className="flex w-full xl:w-[90%] mx-auto px-2 lg:px-3 py-2 lg:py-3 items-center justify-between rounded-2xl
    border border-white/20
    bg-white/30
    lg:bg-white/60
    backdrop-blur-md
    backdrop-saturate-150
    shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
        {/* logo and name */}
        <div className="">
          <NavLink to="/" className="btn btn-ghost font-semibold text-2xl">
            <img className="w-7 h-7" src="https://img.icons8.com/?size=100&id=sN8OKT5sSTJM&format=png&color=000000" alt="logo" />
            ScholarX
          </NavLink>
        </div>
        {/*desktop center navigation */}
        <div className=" hidden lg:flex">
          <ul className="menu menu-horizontal">
            <li><NavLink to="/" className={({ isActive }) =>
              isActive
                ? "text-sky-600 font-semibold"
                : "text-gray-800 hover:text-sky-600"
            }>Home</NavLink></li>
            <li><NavLink to="/features" className={({ isActive }) =>
              isActive
                ? "text-sky-600 font-semibold"
                : "text-gray-800 hover:text-sky-600"
            }>Features</NavLink></li>
            {/* countries */}
            <li className="relative group">
              <button className="flex items-center gap-1 px-4 py-2 text-gray-800 hover:text-sky-600">
                Countries
                <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform" />
              </button>

              <div
                className="
      absolute flex flex-col left-1/2 top-full
      -translate-x-1/2 mt-4
      w-fit
      min-w-100
      rounded-2xl
      bg-white
      border
      border-gray-200
      shadow-lg
      p-8
      opacity-0 invisible
      group-hover:opacity-100
      group-hover:visible
      transition-all duration-200
      z-50
    "
              >
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  {countries.map((country) => (
                    <NavLink
                      key={country.slug}
                      to={`/countries/${country.slug}`}
                      className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-sky-50 transition"
                    >
                      {/* country flag */}
                      <div className="w-7 h-7 rounded-full shadow-xl border border-gray-100 overflow-hidden flex items-center justify-center">
                        <ReactCountryFlag
                          countryCode={country.code}
                          svg
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                      {/* country name */}
                      <span>{country.name}</span>
                    </NavLink>
                  ))}
                </div>
                <NavLink
                  to="/countries"
                  className="flex items-center justify-center w-full rounded-xl border border-gray-200 px-5 py-3 font-semibold transition-all duration-300 hover:bg-sky-500 hover:text-white"
                >
                  Explore All

                  <ArrowRight
                    size={18}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </NavLink>
              </div>
            </li>
            {/* courses */}
            <li className="relative group">
              <button className="flex items-center gap-1 px-4 py-2 text-gray-800 hover:text-sky-600">
                Programs
                <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
              </button>

              <div
                className="
      absolute left-1/2 top-full
      -translate-x-1/2 mt-4
      w-fit flex flex-col
      min-w-100
      rounded-2xl
      bg-white
      border
      border-gray-200
      shadow-lg
      p-8
      opacity-0 invisible
      group-hover:opacity-100
      group-hover:visible
      transition-all duration-200
      z-50
    "
              >
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  {courseCategories.map((category) => (
                    <div key={category.title}>
                      <h3 className="font-semibold text-sky-600 mb-3">
                        {category.title}
                      </h3>

                      <div className="space-y-2">
                        {category.items.map((course) => (
                          <NavLink
                            key={course}
                            to={`/programDetails/${course.slug}`}
                            className="block rounded-lg px-2 py-1 hover:bg-sky-50"
                          >
                            {course.name}
                          </NavLink>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <NavLink
                  to="programs"
                  className="flex items-center justify-center w-full rounded-xl border border-gray-200 px-5 py-3 font-semibold transition-all duration-300 hover:bg-sky-500 hover:text-white"
                >
                  Explore All

                  <ArrowRight
                    size={18}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </NavLink>
              </div>
            </li>
            <li><NavLink to="/pricing" className={({ isActive }) =>
              isActive
                ? "text-sky-600 font-semibold"
                : "text-gray-800 hover:text-sky-600"
            }>Pricing</NavLink></li>
            <li>
              <details>
                <summary>Resources</summary>
                <ul className="p-2 bg-base-100 w-40 z-1">
                  <li><NavLink to="/blog" className={({ isActive }) =>
                    isActive
                      ? "text-sky-600 font-semibold"
                      : "text-gray-700 hover:text-sky-600"
                  }>Blog</NavLink></li>
                  <li><NavLink to="/FAQ" className={({ isActive }) =>
                    isActive
                      ? "text-sky-600 font-semibold"
                      : "text-gray-700 hover:text-sky-600"
                  }>FAQ</NavLink></li>
                  <li><NavLink to="/support" className={({ isActive }) =>
                    isActive
                      ? "text-sky-600 font-semibold"
                      : "text-gray-700 hover:text-sky-600"
                  }>Support</NavLink></li>
                  <li><NavLink to="/contact" className={({ isActive }) =>
                    isActive
                      ? "text-sky-600 font-semibold"
                      : "text-gray-700 hover:text-sky-600"
                  }>Contact</NavLink></li>
                </ul>
              </details>
            </li>
          </ul>
        </div>
        {/* user actions */}
        <div className="flex items-center gap-1">
          <NavLink to="/login"
            className="px-3 py-1 sm:px-4 sm:py-2 shrink-0 text-lg rounded-xl
               bg-gray-100 text-black
               border border-[#3A2C2C]
               shadow-[2px_3px_0px_0px_#3A2C2C]
               transition-all duration-200
               hover:translate-y-0.5
               hover:shadow-[1px_2px_0px_0px_#3A2C2C]"
          >
            Log in
          </NavLink>

          <NavLink to="/signup"
            className="px-3 py-1 sm:px-4 sm:py-2 shrink-0 text-lg rounded-xl
               bg-[#DCEEFF] text-black
               border border-[#3A2C2C]
               shadow-[2px_3px_0px_0px_#3A2C2C]
               transition-all duration-200
               hover:translate-y-0.5
               hover:shadow-[1px_2px_0px_0px_#3A2C2C]"
          >
            Sign up
          </NavLink>
          {/* mobile dropdown */}
          <div className="relative lg:hidden">

            <button

              onClick={() => setIsOpen(prev => !prev)}

              className="btn btn-ghost"

            >

              {isOpen ? <X size={24} /> : <Menu size={24} />}

            </button>



            {isOpen && (

              <ul className="absolute right-0 mt-2 menu bg-base-100 rounded-box shadow w-52 z-100"
                onClick={() => setIsOpen(false)}>

                <li><NavLink to="/" className={({ isActive }) =>
                  isActive
                    ? "text-sky-600 font-semibold"
                    : "text-gray-700 hover:text-sky-600"
                }>Home</NavLink></li>

                <li><NavLink to="/features" className={({ isActive }) =>
                  isActive
                    ? "text-sky-600 font-semibold"
                    : "text-gray-700 hover:text-sky-600"
                }>Features</NavLink></li>
                {/* countries */}
                <li><NavLink to="/countries" className={({ isActive }) =>
                  isActive
                    ? "text-sky-600 font-semibold"
                    : "text-gray-700 hover:text-sky-600"
                }>Countries</NavLink>
                  <ul className="p-2">
                    {countries.slice(0, 4).map((country) => (
                      <li key={country.slug}>
                        <NavLink
                          to={`/countries/${country.slug}`}
                          className={({ isActive }) =>
                            `flex items-center gap-3 ${isActive
                              ? "text-sky-600 font-semibold"
                              : "text-gray-700 hover:text-sky-600"
                            }`
                          }
                        >
                          <div className="w-6 h-6 rounded-full border shadow-xl border-gray-200 overflow-hidden shrink-0">
                            <ReactCountryFlag
                              countryCode={country.code}
                              svg
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          </div>

                          <span>{country.name}</span>
                        </NavLink>
                      </li>
                    ))}

                    <li>
                      <NavLink
                        to="/countries"
                        className={({ isActive }) =>
                          `group flex items-center gap-2 transition ${isActive
                            ? "text-sky-600 font-semibold"
                            : "text-gray-800 font-medium hover:text-sky-600"
                          }`
                        }
                      >
                        View All
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </NavLink>
                    </li>
                  </ul>
                </li>
                {/* programs */}
                <li><NavLink to="/programs" className={({ isActive }) =>
                  isActive
                    ? "text-sky-600 font-semibold"
                    : "text-gray-700 hover:text-sky-600"
                }>Programs</NavLink>
                  <ul className="p-2">

                    <li><NavLink to="/programDetails/business-administration" className={({ isActive }) =>
                      isActive
                        ? "text-sky-600 font-semibold"
                        : "text-gray-700 hover:text-sky-600"
                    }>Business Administration</NavLink></li>

                    <li><NavLink to="/programDetails/computer-science" className={({ isActive }) =>
                      isActive
                        ? "text-sky-600 font-semibold"
                        : "text-gray-700 hover:text-sky-600"
                    }>Computer Science</NavLink></li>
                    <li><NavLink to="/programDetails/civil-engineering" className={({ isActive }) =>
                      isActive
                        ? "text-sky-600 font-semibold"
                        : "text-gray-700 hover:text-sky-600"
                    }>Civil Engineering</NavLink></li>

                    <li><NavLink to="/programDetails/nursing" className={({ isActive }) =>
                      isActive
                        ? "text-sky-600 font-semibold"
                        : "text-gray-700 hover:text-sky-600"
                    }>Nursing</NavLink></li>
                    <li><NavLink to="/programs" className={({ isActive }) =>
                      isActive
                        ? "text-sky-600 font-semibold group flex items-center gap-2 transition"
                        : "text-gray-800 font-medium group flex items-center gap-2 transition hover:text-sky-600"
                    }>View All <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" /></NavLink></li>

                  </ul>
                </li>

                <li><NavLink to="/pricing" className={({ isActive }) =>
                  isActive
                    ? "text-sky-600 font-semibold"
                    : "text-gray-700 hover:text-sky-600"
                }>Pricing</NavLink ></li>

                <li>

                  <Link className="text-gray-700 hover:text-sky-600"
                  >Resources</Link>

                  <ul className="p-2">

                    <li><NavLink to="/blog" className={({ isActive }) =>
                      isActive
                        ? "text-sky-600 font-semibold"
                        : "text-gray-700 hover:text-sky-600"
                    }>Blog</NavLink></li>

                    <li><NavLink to="/FAQ" className={({ isActive }) =>
                      isActive
                        ? "text-sky-600 font-semibold"
                        : "text-gray-700 hover:text-sky-600"
                    }>FAQ</NavLink></li>
                    <li><NavLink to="/support" className={({ isActive }) =>
                      isActive
                        ? "text-sky-600 font-semibold"
                        : "text-gray-700 hover:text-sky-600"
                    }>Support</NavLink></li>

                    <li><NavLink to="/contact" className={({ isActive }) =>
                      isActive
                        ? "text-sky-600 font-semibold"
                        : "text-gray-700 hover:text-sky-600"
                    }>Contact</NavLink></li>

                  </ul>

                </li>        </ul>

            )}

          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;