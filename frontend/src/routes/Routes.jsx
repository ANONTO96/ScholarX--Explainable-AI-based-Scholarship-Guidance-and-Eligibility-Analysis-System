import { createBrowserRouter } from "react-router";
import Home from "../pages/Home";
import Root from "../pages/Root";
import ErrorPage from "../pages/ErrorPage";
import AllCourses from "../pages/AllCourses";
import AllCountries from "../pages/AllCountries";
import Features from "../pages/Features";
import Pricing from "../pages/Pricing";
import Contact from "../pages/Contact";
import FAQ from "../pages/FAQ";
import Support from "../pages/Support";
import Blog from "../pages/Blog";
import CountryDetails from "../pages/CountryDetails";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    errorElement: <ErrorPage></ErrorPage>,
    children: [
       { index: true, Component: Home },
       {path: "features", Component: Features},
       { path: "courses", Component: AllCourses },
       {path: "/countries/:slug", Component: CountryDetails},
       { path: "countries", Component: AllCountries},
       {path: "pricing", Component: Pricing},
       {path: "blog", Component: Blog},
       {path: "FAQ", Component: FAQ},
       {path: "support", Component: Support},
       {path: "contact", Component: Contact},
    ],
  },
]);