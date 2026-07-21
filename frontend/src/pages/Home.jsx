import EligibilityAnalysis from "../components/EligibilityAnalysis";
import Hero from "../components/Hero";
import RoadmapSection from "../components/RoadmapSection";
import ScholarshipSearchSection from "../components/ScholarshipSearchSection";
import SubMarquee from "../components/SubMarquee";

const Home = () => {
    return (
        <div>
        <Hero></Hero>
        <SubMarquee></SubMarquee>
        <ScholarshipSearchSection></ScholarshipSearchSection>
        <EligibilityAnalysis></EligibilityAnalysis>
        <RoadmapSection></RoadmapSection>
        </div>
    );
};

export default Home;