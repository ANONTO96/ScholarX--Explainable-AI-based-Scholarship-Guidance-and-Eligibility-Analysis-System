import MarqueeRow from "../components/ReusableComp/MarqueeRow";
import {
    GraduationCap,
    BrainCircuit,
    ShieldCheck,
    Database,
    BriefcaseBusiness,
    Landmark,
    Stethoscope,
    Building2,
    Globe,
    Megaphone,
    Cog,
    Laptop,
    Leaf,
    Scale,
    Plane,
} from "lucide-react";

const subjects = [
    { name: "Computer Science", icon: Laptop },
    { name: "Software Engineering", icon: Cog },
    { name: "Artificial Intelligence", icon: BrainCircuit },
    { name: "Data Science", icon: Database },
    { name: "Cyber Security", icon: ShieldCheck },
    { name: "Business Administration", icon: BriefcaseBusiness },
    { name: "Finance", icon: Landmark },
    { name: "Medicine", icon: Stethoscope },
    { name: "Architecture", icon: Building2 },
    { name: "Environmental Science", icon: Leaf },
    { name: "International Relations", icon: Globe },
    { name: "Marketing", icon: Megaphone },
    { name: "Education", icon: GraduationCap },
    { name: "Psychology", icon: BrainCircuit },
    { name: "Law", icon: Scale },
    { name: "Hospitality & Tourism", icon: Plane },
];

const SubMarquee = () => {
    // Split the subjects into two rows
    const firstRow = subjects.slice(0, Math.ceil(subjects.length / 2));
    const secondRow = subjects.slice(Math.ceil(subjects.length / 2));
    // Duplicate the items in each row to create a seamless scrolling effect
    const firstRowItems = [...firstRow, ...firstRow];
    const secondRowItems = [...secondRow, ...secondRow];

    return (
        <section className="py-10 sm:py-20 bg-white space-y-5 sm:space-y-7">
            <h1 className="text-2xl sm:text-3xl xl:text-4xl text-center w-[90%] md:w-[70%] xl:w-[50%] mx-auto">
                Trusted by the applicants targeting the world's best programs at the best universities.
            </h1>
            <MarqueeRow items={firstRowItems} />
            <MarqueeRow items={secondRowItems} reverse />
        </section>
    );
};

export default SubMarquee;