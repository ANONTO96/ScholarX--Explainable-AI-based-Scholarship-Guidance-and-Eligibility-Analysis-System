import { Menu, X, } from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router";


const Navbar = () => {
    // state for mobile dropdown icon
    const [isOpen, setIsOpen] = useState(false);
    return (
        <>
            <div className="flex w-full lg:w-[90%] mx-auto py-2 items-center justify-between">
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
      : "text-gray-700 hover:text-sky-600"
  }>Home</NavLink></li>
                        <li><NavLink to="/features" className={({ isActive }) =>
    isActive
      ? "text-sky-600 font-semibold"
      : "text-gray-700 hover:text-sky-600"
  }>Features</NavLink></li>
                        <li><details>
                                <summary>Countries</summary>
                                <ul className="p-2 bg-base-100 w-40 z-1">
                                    
                                </ul>
                            </details></li>
                        <li><details>
                                <summary>Courses</summary>
                                <ul className="p-2 bg-base-100 w-40 z-1">
                                    
                                </ul>
                            </details></li>
                        <li><NavLink to="/pricing" className={({ isActive }) =>
    isActive
      ? "text-sky-600 font-semibold"
      : "text-gray-700 hover:text-sky-600"
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
                    <a
    className="px-3 py-1 sm:px-5 sm:py-2 shrink-0 text-lg rounded-xl
               bg-gray-100 text-black
               border border-[#3A2C2C]
               shadow-[1px_2px_0px_0px_#3A2C2C]
               transition-all duration-200
               hover:translate-y-0.5
               hover:shadow-[1px_2px_0px_0px_#3A2C2C]"
  >
    Log in
  </a>

  <a
    className="px-3 py-1 sm:px-5 sm:py-2 shrink-0 text-lg rounded-xl
               bg-[#DCEEFF] text-black
               border border-[#3A2C2C]
               shadow-[1px_2px_0px_0px_#3A2C2C]
               transition-all duration-200
               hover:translate-y-0.5
               hover:shadow-[1px_2px_0px_0px_#3A2C2C]"
  >
    Sign up
  </a>
                    {/* mobile dropdown */}
                    <div className="relative lg:hidden">

                        <button

                            onClick={() => setIsOpen(prev => !prev)}

                            className="btn btn-ghost"

                        >

                            {isOpen ? <X size={24} /> : <Menu size={24} />}

                        </button>



                        {isOpen && (

                            <ul className="absolute right-0 mt-2 menu bg-base-100 rounded-box shadow w-52">

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
                                <li><NavLink to="/features" className={({ isActive }) =>
    isActive
      ? "text-sky-600 font-semibold"
      : "text-gray-700 hover:text-sky-600"
  }>Countries</NavLink>
  <ul className="p-2">

                                        <li><NavLink to="/resources/submenu1" className={({ isActive }) =>
                                            isActive
                                                ? "text-sky-600 font-semibold"
                                                : "text-gray-700 hover:text-sky-600"
                                        }>Australia</NavLink></li>

                                        <li><NavLink to="/resources/submenu2" className={({ isActive }) =>
                                            isActive
                                                ? "text-sky-600 font-semibold"
                                                : "text-gray-700 hover:text-sky-600"
                                        }>Canada</NavLink></li>
                                        <li><NavLink to="/resources/submenu2" className={({ isActive }) =>
                                            isActive
                                                ? "text-sky-600 font-semibold"
                                                : "text-gray-700 hover:text-sky-600"
                                        }>UK</NavLink></li>

                                        <li><NavLink to="/resources/submenu3" className={({ isActive }) =>
                                            isActive
                                                ? "text-sky-600 font-semibold"
                                                : "text-gray-700 hover:text-sky-600"
                                        }>USA</NavLink></li>
                                        <li><NavLink to="/resources/submenu3" className={({ isActive }) =>
                                            isActive
                                                ? "text-sky-600 font-semibold"
                                                : "text-gray-600 font-medium hover:text-sky-600"
                                        }>View All <img className="w-4 h-5" src="https://img.icons8.com/?size=100&id=XWDoILn3LPrg&format=png&color=000000"></img></NavLink></li>

                                    </ul>
  </li>
                                <li><NavLink to="/features" className={({ isActive }) =>
    isActive
      ? "text-sky-600 font-semibold"
      : "text-gray-700 hover:text-sky-600"
  }>Courses</NavLink>
  <ul className="p-2">

                                        <li><NavLink to="/resources/submenu1" className={({ isActive }) =>
                                            isActive
                                                ? "text-sky-600 font-semibold"
                                                : "text-gray-700 hover:text-sky-600"
                                        }>MBA</NavLink></li>

                                        <li><NavLink to="/resources/submenu2" className={({ isActive }) =>
                                            isActive
                                                ? "text-sky-600 font-semibold"
                                                : "text-gray-700 hover:text-sky-600"
                                        }>IT</NavLink></li>
                                        <li><NavLink to="/resources/submenu2" className={({ isActive }) =>
                                            isActive
                                                ? "text-sky-600 font-semibold"
                                                : "text-gray-700 hover:text-sky-600"
                                        }>Engineering</NavLink></li>

                                        <li><NavLink to="/resources/submenu3" className={({ isActive }) =>
                                            isActive
                                                ? "text-sky-600 font-semibold"
                                                : "text-gray-700 hover:text-sky-600"
                                        }>Nursing</NavLink></li>
                                        <li><NavLink to="/resources/submenu3" className={({ isActive }) =>
                                            isActive
                                                ? "text-sky-600 font-semibold"
                                                : "text-gray-600 font-medium hover:text-sky-600"
                                        }>View All <img className="w-4 h-5" src="https://img.icons8.com/?size=100&id=XWDoILn3LPrg&format=png&color=000000"></img></NavLink></li>

                                    </ul>
  </li>

                                <li><NavLink to="/pricing" className={({ isActive }) =>
    isActive
      ? "text-sky-600 font-semibold"
      : "text-gray-700 hover:text-sky-600"
  }>Pricing</NavLink ></li>

                                <li>

                                    <NavLink to="/resources" className={({ isActive }) =>
        isActive
          ? "text-sky-600 font-semibold"
          : "text-gray-700 hover:text-sky-600"
      }>Resources</NavLink>

                                    <ul className="p-2">

                                        <li><NavLink to="/resources/submenu1" className={({ isActive }) =>
                                            isActive
                                                ? "text-sky-600 font-semibold"
                                                : "text-gray-700 hover:text-sky-600"
                                        }>Blog</NavLink></li>

                                        <li><NavLink to="/resources/submenu2" className={({ isActive }) =>
                                            isActive
                                                ? "text-sky-600 font-semibold"
                                                : "text-gray-700 hover:text-sky-600"
                                        }>FAQ</NavLink></li>
                                        <li><NavLink to="/resources/submenu2" className={({ isActive }) =>
                                            isActive
                                                ? "text-sky-600 font-semibold"
                                                : "text-gray-700 hover:text-sky-600"
                                        }>Support</NavLink></li>

                                        <li><NavLink to="/resources/submenu3" className={({ isActive }) =>
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
        </>
    );
};

export default Navbar;