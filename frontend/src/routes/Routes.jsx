import { createBrowserRouter } from "react-router";
import Home from "../pages/Home";
import Root from "../pages/Root";
import ErrorPage from "../pages/ErrorPage";
import AllPrograms from "../pages/AllPrograms";
import AllCountries from "../pages/AllCountries";
import Features from "../pages/Features";
import Pricing from "../pages/Pricing";
import Contact from "../pages/Contact";
import FAQ from "../pages/FAQ";
import Support from "../pages/Support";
import Blog from "../pages/Blog";
import CountryDetails from "../pages/CountryDetails";
import ProgramDetails from "../pages/ProgramDetails";


export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    errorElement: <ErrorPage></ErrorPage>,
    children: [
       { index: true, Component: Home },
       {path: "features", Component: Features},
       { path: "countries", Component: AllCountries},
       {path: "/countries/:slug", Component: CountryDetails},
       {path: "/programs", Component: AllPrograms},
       {path: "/programDetails/:slug", Component: ProgramDetails},
       {path: "pricing", Component: Pricing},
       {path: "blog", Component: Blog},
       {path: "FAQ", Component: FAQ},
       {path: "support", Component: Support},
       {path: "contact", Component: Contact},
    ],
  },
]);