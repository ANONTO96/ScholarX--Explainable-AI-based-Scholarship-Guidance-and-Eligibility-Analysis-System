import { Menu, X, } from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router";


const Navbar = () => {
    // state for mobile dropdown icon
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div>
            <div className="navbar bg-base-100">
                {/* logo and name */}
                <div className="navbar-start">
                    <NavLink to="/" className="btn btn-ghost font-semibold text-2xl">
                        <img className="w-7 h-7" src="https://img.icons8.com/?size=100&id=sN8OKT5sSTJM&format=png&color=000000" alt="logo" />
                        ScholarX
                    </NavLink>
                </div>
                {/*desktop center navigation */}
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1">
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
                        <li><NavLink to="/pricing" className={({ isActive }) =>
    isActive
      ? "text-sky-600 font-semibold"
      : "text-gray-700 hover:text-sky-600"
  }>Pricing</NavLink></li>
                        <li>
                            <details>
                                <summary>Resources</summary>
                                <ul className="p-2 bg-base-100 w-40 z-1">
                                    <li><NavLink to="/resources/submenu1" className={({ isActive }) =>
        isActive
          ? "text-sky-600 font-semibold"
          : "text-gray-700 hover:text-sky-600"
      }>Submenu 1</NavLink></li>
                                    <li><NavLink to="/resources/submenu2" className={({ isActive }) =>
        isActive
          ? "text-sky-600 font-semibold"
          : "text-gray-700 hover:text-sky-600"
      }>Submenu 2</NavLink></li>
                                </ul>
                            </details>
                        </li>
                    </ul>
                </div>
                {/* user actions */}
                <div className="navbar-end gap-1">
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
                                        }>Submenu 1</NavLink></li>

                                        <li><NavLink to="/resources/submenu2" className={({ isActive }) =>
                                            isActive
                                                ? "text-sky-600 font-semibold"
                                                : "text-gray-700 hover:text-sky-600"
                                        }>Submenu 2</NavLink></li>

                                    </ul>

                                </li>        </ul>

                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;