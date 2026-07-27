import CTASection from "../components/CTASection";
import EligibilityAnalysis from "../components/EligibilityAnalysis";
import Hero from "../components/Hero";
import PopularDestinations from "../components/PopularDestinantions";
import RoadmapSection from "../components/RoadmapSection";
import ScholarshipSearchSection from "../components/ScholarshipSearchSection";
import StudentStories from "../components/StudentStories";
import SubMarquee from "../components/SubMarquee";
import TimelineSection from "../components/TimelineSection";

const Home = () => {
    return (
        <div>
        <Hero></Hero>
        <SubMarquee></SubMarquee>
        <ScholarshipSearchSection></ScholarshipSearchSection>
        <EligibilityAnalysis></EligibilityAnalysis>
        <RoadmapSection></RoadmapSection>
        <TimelineSection></TimelineSection>
        <PopularDestinations></PopularDestinations>
        <StudentStories></StudentStories>
        <CTASection></CTASection>
        </div>
    );
};

export default Home;