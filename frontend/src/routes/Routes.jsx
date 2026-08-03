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

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    errorElement: <ErrorPage></ErrorPage>,
    children: [
       { index: true, Component: Home },
       {path: "features", Component: Features},
       { path: "courses", Component: AllCourses },
       { path: "countries", Component: AllCountries},
       {path: "pricing", Component: Pricing},
       {path: "FAQ", Component: FAQ},
       {path: "contact", Component: Contact},
    ],
  },
]);