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
import AdmissionsFAQ from "../pages/AdmissionsFAQ";
import ScholarshipsFAQ from "../pages/ScholarshipsFAQ";
import ScholarXAiFAQ from "../pages/ScholarXAiFAQ";
import VisaFAQ from "../pages/VisaFAQ";
import AccountBillingFAQ from "../pages/AccountBillingFAQ";
import GeneralSupportFAQ from "../pages/GeneralSupportFAQ";
import BookConsultation from "../pages/BookConsultation";
import ReportIssue from "../pages/ReportIssues";
import LearnMoreAboutScholarshipSearch from "../pages/LearnMoreAboutScholarshipSearch";
import EligibilityAnalysis from "../pages/EligibilitiyAnalysis";
import LearnMoreAboutEligibilityAnalysis from "../pages/LearnMoreAboutEligibilityAnalysis";
import LearnMoreAboutWholeProcess from "../pages/LearnMoreAboutWholeProcess";
import AboutUs from "../pages/AboutUs";
import TermsOfService from "../pages/TermsOfService";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import Login from "../pages/Login";
import Register from "../pages/Register";
import UniversityDetails from "../pages/UniversityDetails";
import OpportunityDetails from "../pages/OpportunityDetails";
import DashboardLayout from "../pages/Dashboard/DashboardLayout";
import DashboardOverview from "../pages/Dashboard/DashboardOverview";


export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    errorElement: <ErrorPage></ErrorPage>,
    children: [
      { index: true, Component: Home },
      { path: "eligibility-analysis", Component: EligibilityAnalysis },
      { path: "learn-more-about-eligibility-analysis", Component: LearnMoreAboutEligibilityAnalysis },
      { path: "learn-more-about-scholarship-search", Component: LearnMoreAboutScholarshipSearch },
      { path: "learn-more-about-whole-process", Component: LearnMoreAboutWholeProcess },
      { path: "features", Component: Features },
      { path: "countries", Component: AllCountries },
      { path: "/countries/:slug", Component: CountryDetails },
      { path: ":type", Component: AllPrograms },
      { path: "/programDetails/:slug", Component: ProgramDetails },
      { path: "/universityDetails/:slug", Component: UniversityDetails },
      { path: "/opportunityDetails/:slug", Component: OpportunityDetails },
      { path: "pricing", Component: Pricing },
      { path: "blog", Component: Blog },
      { path: "FAQ", Component: FAQ },
      { path: "support", Component: Support },
      { path: "book-consultation", Component: BookConsultation },
      { path: "report-issue", Component: ReportIssue },
      { path: "admissionsFAQ", Component: AdmissionsFAQ },
      { path: "scholarshipsFAQ", Component: ScholarshipsFAQ },
      { path: "scholarXaiFAQ", Component: ScholarXAiFAQ },
      { path: "studentVisaFAQ", Component: VisaFAQ },
      { path: "account&BillingFAQ", Component: AccountBillingFAQ },
      { path: "generalSupportFAQ", Component: GeneralSupportFAQ },
      { path: "contact", Component: Contact },
      { path: "about-us", Component: AboutUs },
      { path: "privacy-policy", Component: PrivacyPolicy },
      { path: "terms-of-service", Component: TermsOfService },
    ],
  },
  { path: "logIn", Component: Login },
  { path: "register", Component: Register },
  {
        path: "dashboard",
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: <DashboardOverview />,
          },

          {
            path: "profile",
            element: <div>Profile Page</div>,
          },

          {
            path: "matches",
            element: <div>Matchmaking Page</div>,
          },

          {
            path: "favorites",
            element: <div>Favorites Page</div>,
          },

          {
            path: "applications",
            element: <div>Applications Page</div>,
          },

          {
            path: "deadlines",
            element: <div>Deadlines Page</div>,
          },

          {
            path: "documents",
            element: <div>Documents Page</div>,
          },

          {
            path: "eligibility",
            element: <div>Eligibility Page</div>,
          },

          {
            path: "settings",
            element: <div>Settings Page</div>,
          },
        ],
      },
]);