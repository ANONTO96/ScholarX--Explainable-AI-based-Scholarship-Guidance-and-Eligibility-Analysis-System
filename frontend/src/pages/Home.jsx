import CTASection from "../components/CTASection";
import Hero from "../components/Hero";
import PopularDestinations from "../components/PopularDestinantions";
import RoadmapSection from "../components/RoadmapSection";
import ScholarshipSearchSection from "../components/ScholarshipSearchSection";
import StudentStories from "../components/StudentStories";
import SubMarquee from "../components/SubMarquee";
import TimelineSection from "../components/TimelineSection";
import Analyze from "../components/Analyze";

const Home = () => {
    return (
        <div>
        <Hero></Hero>
        <SubMarquee></SubMarquee>
        <ScholarshipSearchSection></ScholarshipSearchSection>
        <Analyze></Analyze>
        <RoadmapSection></RoadmapSection>
        <TimelineSection></TimelineSection>
        <PopularDestinations></PopularDestinations>
        <StudentStories></StudentStories>
        <CTASection></CTASection>
        </div>
    );
};

export default Home;