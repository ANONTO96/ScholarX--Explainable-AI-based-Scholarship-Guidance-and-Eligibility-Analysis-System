import EligibilityAnalysis from "../components/EligibilityAnalysis";
import Hero from "../components/Hero";
import ScholarshipSearchSection from "../components/ScholarshipSearchSection";
import SubMarquee from "../components/SubMarquee";

const Home = () => {
    return (
        <div>
        <Hero></Hero>
        <SubMarquee></SubMarquee>
        <ScholarshipSearchSection></ScholarshipSearchSection>
        <EligibilityAnalysis></EligibilityAnalysis>
        </div>
    );
};

export default Home;