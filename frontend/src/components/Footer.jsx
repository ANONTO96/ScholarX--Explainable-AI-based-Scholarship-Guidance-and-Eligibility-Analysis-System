import { NavLink } from "react-router";


const Footer = () => {
    return (
        <div className="bg-white">
          {/* top */}
            <div className="place-items-center">
  <img
    src="https://img.icons8.com/?size=100&id=sN8OKT5sSTJM&format=png&color=000000"
    alt="ScholarX"
    className="h-16 w-auto"
  />
</div>
        <footer className="max-w-450 mx-auto px-3 pt-10 pb-20 text-base-content lg:px-6">
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
    <nav className="flex flex-col gap-3">
    <h6 className="footer-title opacity-80">Platform</h6>
    <NavLink className="link link-hover text-gray-500">Home</NavLink>
    <NavLink className="link link-hover text-gray-500">Features</NavLink>
    <NavLink className="link link-hover text-gray-500">Countries</NavLink>
    <NavLink className="link link-hover text-gray-500">Courses</NavLink>
    <NavLink className="link link-hover text-gray-500">Pricing</NavLink>
    <NavLink className="link link-hover text-gray-500">About us</NavLink>
    <NavLink className="link link-hover text-gray-500">Privacy Policy</NavLink>
    <NavLink className="link link-hover text-gray-500">Terms of Service</NavLink>
  </nav>
  <nav className="flex flex-col gap-3">
    <h6 className="footer-title opacity-80">Services</h6>
    <NavLink className="link link-hover text-gray-500">University Admissions</NavLink>
    <NavLink className="link link-hover text-gray-500">Study Abroad Counseling</NavLink>
    <NavLink className="link link-hover text-gray-500">Scholarship Assistance</NavLink>
    <NavLink className="link link-hover text-gray-500">Digital AI Tools</NavLink>
    <NavLink className="link link-hover text-gray-500">Visa Assistance</NavLink>
    <NavLink className="link link-hover text-gray-500">SOP, LOR & CV Services</NavLink>
    <NavLink className="link link-hover text-gray-500">Pre-Departure Services</NavLink>
  </nav>
  <nav className="flex flex-col gap-3">
    <h6 className="footer-title opacity-80">Resources</h6>
    <NavLink className="link link-hover text-gray-500">Blog</NavLink>
    <NavLink className="link link-hover text-gray-500">FAQ</NavLink>
    <NavLink className="link link-hover text-gray-500">Support</NavLink>
    <NavLink className="link link-hover text-gray-500">Contact</NavLink>
  </nav>
  <form>
    <h6 className="footer-title opacity-80">Subscribe</h6>
    <p className="text-gray-500">Join our newsletter to stay up to date on features and releases.</p>
    <fieldset className="max-w-sm">
      <div className="flex flex-col lg:flex-row items-start mt-2 gap-1">
        <input
          type="text"
          placeholder="Enter your email"
          className="h-11 w-full rounded-lg border border-neutral-200 bg-neutral-100 px-4 text-sm outline-none" />
        <button className="px-3 py-1 shrink-0 text-lg rounded-xl
               bg-gray-100 text-black
               border border-[#3A2C2C]
               shadow-[2px_3px_0px_0px_#3A2C2C]
               transition-all duration-200
               hover:translate-y-0.5
               hover:shadow-[1px_2px_0px_0px_#3A2C2C]">Subscribe</button>
      </div>
      <p className="mt-3 text-xs leading-5 text-neutral-500">
By subscribing you agree to our Privacy Policy and
provide consent to receive updates from our company.
</p>
    </fieldset>
  </form>
  </div>
</footer>
<hr className="text-gray-300" />
{/* bottom */}
<div className="footer place-items-center sm:place-items-start sm:footer-horizontal text-base-content items-center w-[98%] mx-auto pt-6 pb-6 sm:pb-10">
    <aside className="grid-flow-col items-center">
    <img className="w-10 h-10" src="https://img.icons8.com/?size=100&id=sN8OKT5sSTJM&format=png&color=000000" alt="logo" />
    <p className="text-gray-600">Copyright © {new Date().getFullYear()} -ScholarX. All rights reserved.</p>
  </aside>
  <nav className="grid-flow-col gap-2 place-self-center md:justify-self-end">
    <a>
      <img className="w-7 h-7" src="https://img.icons8.com/?size=100&id=59780&format=png&color=000000" alt="Facebook" />
    </a>
    <a>
      <img className="w-7 h-7" src="https://img.icons8.com/?size=100&id=59813&format=png&color=000000" alt="Instagram" />
    </a>
    <a>
        <img className="w-7 h-7" src="https://img.icons8.com/?size=100&id=01GWmP9aUoPj&format=png&color=000000" alt="Twitter" />
    </a>
    <a>
        <img className="w-7 h-7" src="https://img.icons8.com/?size=100&id=98960&format=png&color=000000" alt="LinkedIn" />
    </a>
  </nav>
  </div>
  </div>
    );
};

export default Footer;