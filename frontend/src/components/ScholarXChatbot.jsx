import { useEffect, useRef, useState } from "react";
import {
    Bot,
    Check,
    ChevronDown,
    MessageCircle,
    Send,
    Sparkles,
    X,
} from "lucide-react";
import { useChatbot } from "../context/AiChatbot/useChatbot";
import ReactMarkdown from "react-markdown";

const initialMessages = [
    {
        id: 1,
        role: "assistant",
        content:
            "Hi! 👋 I'm ScholarX AI, I can help you explore scholarships, understand eligibility requirements, and plan your study journey.",
        time: new Date(),
    },
];

const suggestedQuestions = [
    "Find scholarships for me",
    "Am I eligible for scholarships?",
    "Which country is best for my studies?",
    "Show me scholarships for Computer Science",
    "What scholarships can I apply for?",
    "Help me plan my study abroad journey",
    "What are the requirements for studying abroad?",
    "How can I improve my scholarship chances?",
];



const getBotResponse = (message) => {
    const question = message.toLowerCase().trim();

    
const subjectGroups = [
    {
        name: "Computer Science and IT",
        keywords: [
            "computer science", "computer engineering",
            "software engineering", "software development",
            "information technology", "it scholarship",
            "artificial intelligence", "machine learning",
            "data science", "cybersecurity", "computing",
            "computer scholarship", "programming"
        ],
        areas: "Artificial Intelligence, Machine Learning, Data Science, Software Engineering, Cybersecurity, and Information Technology"
    },
    {
        name: "Engineering",
        keywords: [
            "engineering", "mechanical engineering",
            "civil engineering", "electrical engineering",
            "electronic engineering", "chemical engineering",
            "industrial engineering", "mechatronics",
            "biomedical engineering"
        ],
        areas: "Civil, Mechanical, Electrical, Electronic, Chemical, Industrial, and Biomedical Engineering"
    },
    {
        name: "Business and Management",
        keywords: [
            "business", "management", "mba",
            "accounting", "finance", "marketing",
            "economics", "entrepreneurship",
            "business administration", "human resources"
        ],
        areas: "Business Administration, Finance, Accounting, Marketing, Economics, Entrepreneurship, and Management"
    },
    {
        name: "Medicine and Health Sciences",
        keywords: [
            "medicine", "medical", "health science",
            "public health", "nursing", "pharmacy",
            "dentistry", "physiotherapy", "biotechnology",
            "biomedical science", "clinical research"
        ],
        areas: "Medicine, Public Health, Nursing, Pharmacy, Dentistry, Physiotherapy, and Biomedical Research"
    },
    {
        name: "Natural and Physical Sciences",
        keywords: [
            "natural science", "physical science",
            "biology", "chemistry", "physics",
            "mathematics", "math", "statistics",
            "environmental science", "geology",
            "astronomy", "biochemistry"
        ],
        areas: "Biology, Chemistry, Physics, Mathematics, Statistics, Environmental Science, and related research"
    },
    {
        name: "Social Sciences",
        keywords: [
            "social science", "sociology", "psychology",
            "political science", "international relations",
            "development studies", "anthropology",
            "public policy", "social work"
        ],
        areas: "Sociology, Psychology, Political Science, International Relations, Development Studies, and Public Policy"
    },
    {
        name: "Arts and Humanities",
        keywords: [
            "arts", "humanities", "history",
            "philosophy", "literature", "linguistics",
            "english literature", "language studies",
            "cultural studies", "fine arts", "design"
        ],
        areas: "History, Philosophy, Literature, Linguistics, Cultural Studies, Fine Arts, and Design"
    },
    {
        name: "Law",
        keywords: [
            "law scholarship", "law degree", "legal studies",
            "llb", "llm", "international law",
            "human rights law", "criminology"
        ],
        areas: "Legal Studies, International Law, Human Rights, and related research"
    },
    {
        name: "Agriculture and Food Sciences",
        keywords: [
            "agriculture", "agricultural science",
            "food science", "food technology",
            "forestry", "animal science",
            "veterinary", "plant science",
            "agronomy"
        ],
        areas: "Agricultural Science, Food Technology, Forestry, Veterinary Science, and Plant Science"
    },
    {
        name: "Education",
        keywords: [
            "education scholarship", "education degree",
            "teaching", "educational leadership",
            "educational technology", "special education",
            "teacher training"
        ],
        areas: "Teaching, Educational Leadership, Educational Technology, and Special Education"
    },
    {
        name: "Architecture and Urban Planning",
        keywords: [
            "architecture", "urban planning",
            "urban design", "landscape architecture",
            "city planning", "interior design"
        ],
        areas: "Architecture, Urban Planning, Landscape Architecture, and Sustainable Design"
    }
];

const matchedSubject = subjectGroups.find((subject) =>
    subject.keywords.some((keyword) => question.includes(keyword))
);

if (matchedSubject) {
    return `## 🎓 ${matchedSubject.name} Scholarships

ScholarX can help you explore scholarship opportunities related to **${matchedSubject.name}**.

### Relevant study and research areas

${matchedSubject.areas}

### How to find suitable opportunities

1. Open **Matches** in your ScholarX dashboard.
2. Make sure your profile contains your correct field of study and intended degree level.
3. Review each opportunity's accepted subjects and mandatory requirements.
4. Compare academic criteria, nationality rules, language requirements, funding, and deadlines.
5. Save suitable opportunities to **Favorites** and verify the details with the official provider.

### What determines your eligibility?

Your academic results matter, but selection may also depend on your degree level, subject relevance, research experience, personal statement, recommendations, and the scholarship's specific selection criteria.

**Important:** This guidance does not confirm that a particular scholarship is currently available. Your actual matches depend on the opportunities and criteria in ScholarX's data.

**Next step:** Which degree are you targeting—Bachelor's, Master's, or PhD—and which country interests you most?`;
}


const countryAliases = [
    { name: "United States", aliases: ["united states", "usa", "us"] },
    { name: "United Kingdom", aliases: ["united kingdom", "uk", "britain", "england"] },
    { name: "Canada", aliases: ["canada", "canadian"] },
    { name: "Australia", aliases: ["australia", "australian"] },
    { name: "Germany", aliases: ["germany", "german"] },
    { name: "Ireland", aliases: ["ireland", "irish"] },
    { name: "New Zealand", aliases: ["new zealand"] },
    { name: "Netherlands", aliases: ["netherlands", "dutch", "holland"] },
    { name: "Italy", aliases: ["italy", "italian"] },
    { name: "France", aliases: ["france", "french"] },
    { name: "Sweden", aliases: ["sweden", "swedish"] },
    { name: "Switzerland", aliases: ["switzerland", "swiss"] },
    { name: "South Korea", aliases: ["south korea", "korean"] },
    { name: "China", aliases: ["china", "chinese"] },
    { name: "Japan", aliases: ["japan", "japanese"] },
    { name: "Malaysia", aliases: ["malaysia", "malaysian"] }
];

const matchedCountry = countryAliases.find((country) =>
    country.aliases.some((alias) => question.includes(alias))
);

if (
    matchedCountry &&
    (
        question.includes("scholarship") ||
        question.includes("study") ||
        question.includes("country") ||
        question.includes("university") ||
        question.includes("tuition") ||
        question.includes("cost") ||
        question.includes("living") ||
        question.includes("requirement") ||
        question.includes("ielts") ||
        question.includes("visa") ||
        question.includes("masters") ||
        question.includes("master's") ||
        question.includes("bachelor") ||
        question.includes("phd") ||
        question.includes("funding") ||
        question.includes("admission")
    )
) {
    return `## 🌍 Studying in ${matchedCountry.name}

ScholarX supports exploring study destinations, universities, courses, and scholarship opportunities.

### What to investigate

- **Scholarships and funding:** Look for awards that accept your nationality, intended degree, and field of study.
- **Tuition and living costs:** Compare program fees, accommodation, food, transport, and other expenses.
- **Admission requirements:** Check academic qualifications, language requirements, and program prerequisites.
- **Language of instruction:** Confirm whether your selected program is taught in English or another language.
- **Application documents:** Review transcript, certificate, CV, personal statement, recommendations, and other requested materials.
- **Student visa:** Follow the current official immigration guidance for your circumstances.

### Explore this destination in ScholarX

1. Open the **Countries** section and select ${matchedCountry.name}.
2. Explore the listed universities and programs.
3. Check available scholarship opportunities and their eligibility criteria.
4. Compare the requirements with your student profile.
5. Confirm costs, deadlines, and visa rules through official sources.

**Important:** I don't have verified live country-specific costs, visa rules, or scholarship availability in this response. These details vary by university, program, and intake.

**Next step:** Tell me your intended degree and subject so I can help you narrow down the factors to compare for ${matchedCountry.name}.`;
}


    if (
        question.includes("eligible") ||
        question.includes("eligibility") ||
        question.includes("qualify")
    ) {
        return `## 🎯 Understanding Your Scholarship Eligibility

ScholarX compares your student profile with the available scholarship requirements.

### What is evaluated?

- **Academic performance:** GPA and academic qualifications.
- **Study level:** Whether your current or intended degree meets the criteria.
- **Field of study:** Whether your subject matches the opportunity.
- **English proficiency:** IELTS or other accepted language qualifications.
- **Nationality:** Whether applicants from your country are eligible.
- **Destination and budget:** Relevant country preferences and financial requirements, when available.

### How to review your results

1. Open **Eligibility Analysis** or **Matches** in your dashboard.
2. Review your eligibility status for each opportunity.
3. Identify missing requirements and criteria marked for review.
4. Update your profile if any information is inaccurate.
5. Recheck the results after updating your profile.

**Remember:** A match score measures compatibility with the available criteria. It does not predict or guarantee the final scholarship decision.

**Next step:** Review any missing or uncertain requirements in your eligibility results first.`;
    }

    if (
        question.includes("find scholarships") ||
        question.includes("scholarships for me") ||
        question.includes("what scholarships can i apply")
    ) {
        return `## 🔎 Finding Scholarships That Fit You

The best opportunities are those that match your background, goals, and financial needs.

### Step 1: Complete your profile

Make sure you have entered:

- Your GPA and academic qualifications
- Intended degree level and field of study
- Preferred study destinations
- English-language test results
- Nationality and available budget

### Step 2: Explore your matches

1. Open **Matches** in your dashboard.
2. Review the eligibility status and requirements of each opportunity.
3. Compare funding, deadlines, and required documents.
4. Save promising options to **Favorites**.
5. Verify each opportunity using its official source.

**Important:** This response does not perform a live search or confirm current scholarship availability.

**Next step:** Which degree level are you planning to pursue, and which country interests you most?`;
    }

    if (
        question.includes("which country") ||
        question.includes("best country") ||
        question.includes("study destination")
    ) {
        return `## 🌍 Choosing the Right Study Destination

There is no single best country for every student. The right choice depends on your academic goals, finances, and long-term plans.

### Compare these five factors

1. **Tuition fees:** Can you afford the program without funding?
2. **Scholarships:** Are you eligible for suitable funding opportunities?
3. **Living expenses:** Can your budget cover accommodation, food, and transport?
4. **Admission requirements:** Do you meet the academic and language criteria?
5. **Post-study options:** What official work and migration pathways may be available?

### How ScholarX can help

- Explore countries, universities, and courses.
- Review scholarship opportunities.
- Compare eligibility criteria and funding details.
- Organize your options in your dashboard.

Always verify current tuition, visa conditions, and post-study rules using official sources.

**Next step:** Tell me your intended degree, preferred subject, approximate budget, and any countries you're considering.`;
    }

    if (
        question.includes("improve") ||
        question.includes("scholarship chances") ||
        question.includes("increase my chances") ||
        question.includes("better chance")
    ) {
        return `## 🚀 How to Strengthen Your Scholarship Applications

A strong application is about more than GPA alone.

### Five practical strategies

1. **Target suitable scholarships.** Prioritize opportunities whose mandatory criteria you meet.
2. **Strengthen your English proficiency.** Meet the required IELTS or other accepted test score where applicable.
3. **Build relevant experience.** Develop projects, research, leadership, or volunteering experience when relevant to the scholarship.
4. **Prepare compelling documents.** Explain your goals, achievements, and motivation clearly in your statement of purpose.
5. **Apply strategically.** Track deadlines, follow instructions, and avoid relying on a single opportunity.

### Why a high GPA is not always enough

Selection can also depend on:

- The strength of competing applications
- Essays, interviews, and recommendations
- Research fit or other selection criteria
- Available funding and the number of awards

**Important:** Meeting the eligibility criteria does not guarantee selection.

**Next step:** Identify your weakest area—academic results, English score, experience, or application documents—and make a plan to improve it.`;
    }

    if (
        question.includes("requirements for studying abroad") ||
        question.includes("study abroad requirements") ||
        question.includes("admission requirements")
    ) {
        return `## 📋 Common Requirements for Studying Abroad

Requirements differ by country, university, degree, and scholarship.

### Academic documents

- Academic transcripts and certificates
- Degree certificate or proof of expected graduation
- CV or résumé, if required
- Statement of purpose or personal statement
- Recommendation letters, where requested

### Language and financial requirements

- IELTS, TOEFL, or another accepted language qualification, if required
- Proof of sufficient funds, where applicable
- Evidence of scholarship or sponsorship, if applicable

### Passport and visa

- Valid passport
- Required visa application documents
- Health checks, insurance, or biometrics where applicable

### Recommended preparation order

1. Choose a program and destination.
2. Read the official admission requirements.
3. Check scholarship eligibility and deadlines.
4. Prepare your documents and language test.
5. Follow the official visa instructions after the relevant admission steps.

**Important:** This is a general checklist, not a country-specific visa assessment.

**Next step:** Which country and degree level are you planning for?`;
    }

    if (
        question.includes("plan my study abroad") ||
        question.includes("study abroad journey") ||
        question.includes("study abroad plan")
    ) {
        return `## 🧭 Your Study-Abroad Roadmap

Follow these six stages to organize your preparation.

### Stage 1 — Define your goal
Choose your intended degree, subject, intake, and preferred countries.

### Stage 2 — Set your budget
Estimate tuition, living expenses, travel costs, and the funding you need.

### Stage 3 — Research opportunities
Shortlist universities, programs, and scholarships that fit your goals.

### Stage 4 — Check eligibility
Compare academic requirements, language scores, nationality rules, and other mandatory criteria.

### Stage 5 — Prepare applications
Arrange transcripts, certificates, language results, your CV, and other required documents.

### Stage 6 — Apply and track
Submit applications before their deadlines, monitor responses, and follow official admission and visa instructions.

### How ScholarX supports your journey

Use your profile, Matches, Eligibility Analysis, Favorites, Applications, Documents, and Deadlines sections to organize the process.

**Next step:** Start by defining your target degree, subject, destination, and budget.`;
    }

    if (
        question.includes("deadline") ||
        question.includes("deadlines") ||
        question.includes("reminder")
    ) {
        return `## 📅 Managing Scholarship Deadlines

Missing a deadline can mean missing an entire application cycle.

### What you should do

1. Open **Deadlines** in your ScholarX dashboard.
2. Review upcoming application dates.
3. Check the required documents for each opportunity.
4. Confirm the deadline and time zone on the official website.
5. Aim to submit early so you have time to resolve issues.

### A simple planning method

- **Several weeks before:** Gather documents and arrange recommendations.
- **One to two weeks before:** Review your application and fill any gaps.
- **Before the deadline:** Submit and save your confirmation.

These are suggested planning intervals, not official deadlines.

**Important:** Verify current dates directly with the scholarship provider.

**Next step:** Review your nearest upcoming deadline and identify any documents you still need.`;
    }

    if (
        question.includes("favorite") ||
        question.includes("save scholarship") ||
        question.includes("saved scholarship")
    ) {
        return `## ⭐ Organizing Your Favorite Scholarships

Favorites helps you keep promising opportunities together while you compare them.

### How to use Favorites effectively

1. Save opportunities that interest you.
2. Compare their eligibility requirements.
3. Review funding coverage and additional costs.
4. Check application deadlines and required documents.
5. Prioritize the options that best fit your goals.

**Tip:** Keep a balanced shortlist of highly suitable opportunities rather than choosing based on scholarship value alone.

**Next step:** Review your saved opportunities and decide which ones deserve your attention first.`;
    }

    if (
        question.includes("document") ||
        question.includes("statement of purpose") ||
        question.includes("recommendation letter") ||
        question.includes("transcript")
    ) {
        return `## 📁 Preparing Scholarship Documents

The documents you need depend on the scholarship and institution.

### Common documents

- Academic transcripts and certificates
- CV or résumé
- Statement of purpose or personal statement
- Recommendation letters
- English-language test results, where required
- Passport or identity documents, where requested
- Research proposal or portfolio for certain programs

### Keep your documents organized

1. Create a checklist for each scholarship.
2. Check language, format, and certification requirements.
3. Request recommendation letters early.
4. Proofread your statement of purpose.
5. Confirm whether translations or certified copies are required.

ScholarX's Documents section can help you organize materials, but always follow the provider's official checklist.

**Next step:** Start with the document list for your highest-priority scholarship.`;
    }

    if (
        question.includes("application") ||
        question.includes("apply for") ||
        question.includes("applying")
    ) {
        return `## 📝 Preparing a Scholarship Application

### Before you apply

1. Confirm that you meet the mandatory eligibility requirements.
2. Review the funding conditions and deadline.
3. Gather all required documents.
4. Tailor your statement of purpose to the opportunity.
5. Check every field before submitting.

### After submission

- Save the confirmation or application reference.
- Monitor your email and applicant portal.
- Respond to requests for additional information.
- Keep track of interviews and decision dates, if applicable.

You can use the Applications section in ScholarX to organize your progress where supported.

**Remember:** The scholarship provider makes the final selection decision.

**Next step:** Choose one opportunity and check its official application checklist.`;
    }

    if (
        question.includes("profile") ||
        question.includes("dashboard") ||
        question.includes("my account")
    ) {
        return `## 🖥️ Getting the Most From Your ScholarX Dashboard

Your dashboard helps you organize different parts of your scholarship journey.

### Main sections

- **My Profile:** Maintain your academic background and preferences.
- **Matches:** Review opportunities identified as relevant to your profile.
- **Eligibility Analysis:** Understand how your profile compares with requirements.
- **Favorites:** Save opportunities to review later.
- **Applications:** Organize your application progress.
- **Deadlines:** Keep track of important dates.
- **Documents:** Organize application materials.

### Best practice

Update your profile whenever your GPA, language score, study plans, or other relevant details change. Then review your eligibility results again.

**Next step:** Start with My Profile and make sure your information is accurate.`;
    }

    if (
        question === "hi" ||
        question.startsWith("hi ") ||
        question.startsWith("hello") ||
        question.startsWith("hey")
    ) {
        return `## 👋 Welcome to ScholarX AI!

I can help you navigate your scholarship journey.

### What would you like help with?

- 🎯 Understanding scholarship eligibility
- 🔎 Finding relevant opportunities
- 🌍 Comparing study destinations
- 📋 Preparing application documents
- 📅 Organizing scholarship deadlines
- 🚀 Improving your application strategy

**To get started:** Select a suggested question or tell me about your study plans.`;
    }

    if (question.includes("thank")) {
        return `You're welcome! 😊

I'm here to help you organize your scholarship search and study-abroad preparation.

**What would you like to explore next?**`;
    }

    return `## 🎓 How I Can Help

I can provide guidance on these ScholarX topics:

- **Scholarship eligibility:** Understand requirements and match results.
- **Scholarship search:** Learn how to find relevant opportunities.
- **Computer Science:** Explore funding options for technology-related fields.
- **Study destinations:** Compare costs, requirements, and priorities.
- **Applications:** Prepare documents and plan your application.
- **Deadlines:** Organize important dates.

**Tell me about your target degree, subject, or preferred country**, and I'll help you identify the next steps.

*Note: I'm currently using predefined guidance, not live scholarship database searches.*`;
};



export default function ScholarXChatbot() {

    const {
    isOpen,
    openChatbot,
    closeChatbot,
} = useChatbot();

    const [input, setInput] = useState("");
    const [messages, setMessages] = useState(initialMessages);
    const [isTyping, setIsTyping] = useState(false);
    const suggestionsRef = useRef(null);

    const [isDragging, setIsDragging] = useState(false);

    const didDrag = useRef(false);

    const dragState = useRef({
        startX: 0,
        startScrollLeft: 0,
        lastX: 0,
        velocity: 0,
        animationFrame: null,
    });

    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);


    // Scroll to latest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [messages, isTyping]);

    // Focus input when drawer opens
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 250);
        }
    }, [isOpen]);

    // Prevent background scrolling on mobile when chat is open
    useEffect(() => {
        if (!isOpen) return;

        const handleResize = () => {
            if (window.innerWidth < 640) {
                document.body.style.overflow = "hidden";
            }
        };

        handleResize();

        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    
const handleSendMessage = async (messageText = input) => {
    const text = messageText.trim();

    if (!text || isTyping) return;

    const userMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: text,
        time: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Generate a topic-specific response
    setTimeout(() => {
        const aiMessage = {
            id: crypto.randomUUID(),
            role: "assistant",
            content: getBotResponse(text),
            time: new Date(),
        };

        setMessages((prev) => [...prev, aiMessage]);
        setIsTyping(false);
    }, 600);
};


    const handleKeyDown = (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            handleSendMessage();
        }
    };

    const formatTime = (date) => {
        return new Intl.DateTimeFormat("en", {
            hour: "numeric",
            minute: "2-digit",
        }).format(date);
    };

const handlePointerDown = (e) => {
    const slider = suggestionsRef.current;

    if (!slider) return;

    dragState.current.startX = e.clientX;
    dragState.current.startScrollLeft = slider.scrollLeft;
    dragState.current.lastX = e.clientX;
    dragState.current.velocity = 0;

    // Reset BEFORE a new interaction starts
    didDrag.current = false;

    setIsDragging(true);

    slider.setPointerCapture(e.pointerId);
};

const handlePointerMove = (e) => {
    if (!isDragging) return;

    const slider = suggestionsRef.current;

    if (!slider) return;

    const currentX = e.clientX;

    const totalDistance =
        currentX - dragState.current.startX;

    if (Math.abs(totalDistance) > 5) {
        didDrag.current = true;
    }

    const distance =
        currentX - dragState.current.lastX;

    dragState.current.velocity = distance;

    slider.scrollLeft -= distance;

    dragState.current.lastX = currentX;
};

const handlePointerUp = (e) => {
    const slider = suggestionsRef.current;

    if (!slider) return;

    setIsDragging(false);

    try {
        slider.releasePointerCapture(e.pointerId);
    } catch {
        // Ignore errors when releasing pointer capture
    }

    // Add momentum
    const animate = () => {
        const state = dragState.current;

        if (Math.abs(state.velocity) < 0.3) {
            cancelAnimationFrame(state.animationFrame);
            return;
        }

        slider.scrollLeft -= state.velocity;

        state.velocity *= 0.94;

        state.animationFrame = requestAnimationFrame(animate);
    };

    cancelAnimationFrame(
        dragState.current.animationFrame
    );

    dragState.current.animationFrame =
        requestAnimationFrame(animate);
};

    return (
        <>
            {/* ===================================================== */}
            {/* CHAT DRAWER OVERLAY */}
            {/* ===================================================== */}

            {isOpen && (
                <div
                    className="fixed inset-0 z-998 bg-slate-950/20 backdrop-blur-[2px] sm:bg-transparent sm:backdrop-blur-0"
                    onClick={closeChatbot}
                />
            )}

            {/* ===================================================== */}
            {/* CHAT DRAWER */}
            {/* ===================================================== */}

            <aside
                className={`
                    fixed z-999

                    bottom-0 right-0
                    h-dvh
                    w-full

                    sm:bottom-5
                    sm:right-5
                    sm:h-170
                    sm:w-100
                    lg:h-190
                    lg:w-140

                    overflow-hidden
                    rounded-none
                    sm:rounded-3xl

                    border border-sky-200/70
                    bg-white

                    shadow-[0_25px_80px_rgba(15,23,42,0.20)]

                    transition-all duration-300 ease-out

                    ${isOpen
                        ? "translate-x-0 opacity-100"
                        : "pointer-events-none translate-x-[110%] opacity-0"
                    }
                `}
            >
                {/* ================================================= */}
                {/* HEADER */}
                {/* ================================================= */}

                <div className="relative border-b border-slate-200 bg-linear-to-r from-sky-600 via-sky-500 to-cyan-500 px-4 py-4 text-white">
                    {/* Decorative glow */}
                    <div className="pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full bg-white/15 blur-2xl" />

                    <div className="relative flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {/* Bot avatar */}
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/30 bg-white/15 shadow-lg backdrop-blur-md">
                                <Bot size={23} strokeWidth={2} />
                            </div>

                            <div>
                                <div className="flex items-center gap-2">
                                    <h2 className="text-base font-bold">
                                        ScholarX AI
                                    </h2>

                                    <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
                                        Beta
                                    </span>
                                </div>

                                <div className="mt-0.5 flex items-center gap-1.5 text-xs text-sky-50">
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_8px_rgba(110,231,183,0.8)]" />

                                    Ready to assist
                                </div>
                            </div>
                        </div>

                        {/* Close */}
                        <button
                            type="button"
                            onClick={closeChatbot}
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/20 bg-white/10 transition hover:bg-white/20"
                            aria-label="Close chatbot"
                        >
                            <X size={19} />
                        </button>
                    </div>

                    {/* Header description */}
                    <div className="relative mt-4 rounded-2xl border border-white/15 bg-white/10 px-3 py-2.5 text-xs leading-relaxed text-sky-50 backdrop-blur-sm">
                        Ask me about scholarships, eligibility, study
                        destinations, or your ScholarX journey.
                    </div>
                </div>

                {/* ================================================= */}
                {/* CHAT BODY */}
                {/* ================================================= */}

                <div className="flex h-[calc(100%-184px)] flex-col bg-slate-50">
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto px-4 py-5">
                        <div className="space-y-4">
                            {/* Date / status */}
                            <div className="flex justify-center">
                                <span className="rounded-full bg-white px-3 py-1 text-[10px] font-medium text-slate-400 shadow-sm ring-1 ring-slate-200">
                                    Today
                                </span>
                            </div>

                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex ${message.role === "user"
                                        ? "justify-end"
                                        : "justify-start"
                                        }`}
                                >
                                    <div
                                        className={`flex max-w-[85%] items-end gap-2 ${message.role === "user"
                                            ? "flex-row-reverse"
                                            : ""
                                            }`}
                                    >
                                        {/* Assistant avatar */}
                                        {message.role === "assistant" && (
                                            <div className="mb-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-600">
                                                <Bot size={14} />
                                            </div>
                                        )}

                                        <div>
                                            
<div
    className={`
        rounded-2xl px-3.5 py-3 text-sm leading-relaxed

        ${message.role === "user"
            ? "rounded-br-md bg-sky-500 text-white shadow-sm"
            : "rounded-bl-md border border-slate-200 bg-white text-slate-700 shadow-sm"
        }
    `}
>
    {message.role === "assistant" ? (
        <div className="space-y-2">
            <ReactMarkdown
                components={{
                    h2: ({ children }) => (
                        <h3 className="mb-2 text-sm font-bold text-sky-700">
                            {children}
                        </h3>
                    ),
                    h3: ({ children }) => (
                        <h4 className="mb-1 font-semibold text-slate-800">
                            {children}
                        </h4>
                    ),
                    p: ({ children }) => (
                        <p className="mb-2 last:mb-0">{children}</p>
                    ),
                    ul: ({ children }) => (
                        <ul className="mb-2 list-disc space-y-1 pl-5">
                            {children}
                        </ul>
                    ),
                    ol: ({ children }) => (
                        <ol className="mb-2 list-decimal space-y-1 pl-5">
                            {children}
                        </ol>
                    ),
                    li: ({ children }) => (
                        <li className="pl-0.5">{children}</li>
                    ),
                    strong: ({ children }) => (
                        <strong className="font-semibold text-slate-800">
                            {children}
                        </strong>
                    ),
                    em: ({ children }) => (
                        <em className="text-slate-500">{children}</em>
                    ),
                }}
            >
                {message.content}
            </ReactMarkdown>
        </div>
    ) : (
        message.content
    )}
</div>


                                            <div
                                                className={`mt-1 flex items-center gap-1 text-[10px] text-slate-400 ${message.role === "user"
                                                    ? "justify-end"
                                                    : "justify-start"
                                                    }`}
                                            >
                                                {formatTime(message.time)}

                                                {message.role === "user" && (
                                                    <Check size={11} />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Typing indicator */}
                            {isTyping && (
                                <div className="flex items-end gap-2">
                                    <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-sky-100 text-sky-600">
                                        <Sparkles size={14} />
                                    </div>

                                    <div className="rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-3 shadow-sm">
                                        <div className="flex items-center gap-1">
                                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-sky-400 [animation-delay:-0.3s]" />
                                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-sky-400 [animation-delay:-0.15s]" />
                                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-sky-400" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    {/* ================================================= */}
                    {/* SUGGESTIONS */}
                    {/* ================================================= */}

                    {messages.length === 1 && (
                        <div className="border-t border-slate-200 bg-white px-4 py-3">
                            {/* Header */}
                            <div className="mb-2 flex items-center gap-1.5">
                                <Sparkles
                                    size={13}
                                    className="text-sky-500"
                                />

                                <span className="text-[11px] font-semibold text-slate-500">
                                    Try asking :
                                </span>
                            </div>

                            {/* Scrollable Questions */}
                            <div
                                ref={suggestionsRef}
                                onPointerDown={handlePointerDown}
                                onPointerMove={handlePointerMove}
                                onPointerUp={handlePointerUp}
                                onPointerCancel={handlePointerUp}
                                className={`
        flex
        min-w-0
        gap-2
        overflow-x-auto
        pb-1

        scrollbar-none

        touch-pan-x
        select-none

        ${isDragging
                                        ? "cursor-grabbing"
                                        : "cursor-grab"
                                    }
    `}
                            >
                                {suggestedQuestions.map((question) => (
                                    <button
                                        key={question}
                                        type="button"
                                        onPointerDown={(e) => {
    e.stopPropagation();
    didDrag.current = false;
  }}
  onClick={(e) => {
    e.stopPropagation();

    if (!didDrag.current) {
      handleSendMessage(question);
    }
  }}
                                        className="
                shrink-0
                whitespace-nowrap

                rounded-full
                border border-sky-200
                bg-sky-50

                px-3.5
                py-1.5

                text-[11px]
                font-medium
                text-sky-700

                transition-all
                duration-200

                hover:border-sky-300
                hover:bg-sky-100
                hover:shadow-sm

                active:scale-[0.97]
            "
                                    >
                                        {question}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ================================================= */}
                    {/* INPUT */}
                    {/* ================================================= */}

                    <div className="border-t border-slate-200 bg-white p-3">
                        <div className="flex items-end gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-1.5 transition focus-within:border-sky-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-sky-100">
                            <textarea
                                ref={inputRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                rows={1}
                                placeholder="Ask ScholarX AI..."
                                className="max-h-24 min-h-10 flex-1 resize-none bg-transparent px-3 py-2 text-sm text-slate-700 outline-none placeholder:text-slate-400"
                            />

                            <button
                                type="button"
                                onClick={() => handleSendMessage()}
                                disabled={!input.trim() || isTyping}
                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-500 text-white shadow-sm transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-40"
                                aria-label="Send message"
                            >
                                <Send size={17} />
                            </button>
                        </div>

                        <p className="mt-2 text-center text-[9px] text-slate-400">
                            ScholarX AI can make mistakes. Double check any important
                            information.
                        </p>
                    </div>
                </div>
            </aside>

            {/* ===================================================== */}
            {/* FLOATING CHAT + SCROLL CONTROLS */}
            {/* ===================================================== */}

            <div className="fixed bottom-5 right-5 z-997 flex items-end gap-2">
                {/* CHAT BUTTON */}
                <button
                    type="button"
                    onClick={() => {
    if (isOpen) {
        closeChatbot();
    } else {
        openChatbot();
    }
}}
                    className={`
                        group relative flex h-12 w-12
                        items-center justify-center
                        rounded-2xl

                        border border-sky-300/70
                        bg-white/95
                        text-sky-600

                        shadow-[0_8px_30px_rgba(14,165,233,0.18)]

                        backdrop-blur-xl
                        transition-all duration-200

                        hover:-translate-y-1
                        hover:border-sky-400
                        hover:bg-sky-50
                        hover:shadow-[0_12px_35px_rgba(14,165,233,0.25)]

                        ${isOpen ? "bg-sky-50 text-sky-700" : ""}
                    `}
                    aria-label="Open ScholarX AI"
                >
                    {/* Notification dot */}
                    {!isOpen && (
                        <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-60" />
                            <span className="relative inline-flex h-3 w-3 rounded-full border-2 border-white bg-sky-500" />
                        </span>
                    )}

                    {isOpen ? (
                        <ChevronDown
                            size={21}
                            className="transition-transform group-hover:translate-y-0.5"
                        />
                    ) : (
                        <MessageCircle
                            size={21}
                            className="transition-transform group-hover:scale-110"
                        />
                    )}
                </button>

                {/* SCROLL BUTTONS */}
                <div className="flex flex-col gap-2">
                    <button
                        type="button"
                        onClick={() =>
                            window.scrollTo({
                                top: 0,
                                behavior: "smooth",
                            })
                        }
                        className="flex h-12 w-12 items-center justify-center rounded-2xl border border-sky-200/80 bg-white/95 text-sky-500 shadow-[0_8px_30px_rgba(15,23,42,0.12)] backdrop-blur-xl transition hover:-translate-y-1 hover:border-sky-300 hover:bg-sky-600 hover:text-white"
                        aria-label="Scroll to top"
                    >
                        ↑
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            window.scrollTo({
                                top: document.documentElement.scrollHeight,
                                behavior: "smooth",
                            })
                        }
                        className="flex h-12 w-12 items-center justify-center rounded-2xl border border-sky-200/80 bg-white/95 text-sky-500 shadow-[0_8px_30px_rgba(15,23,42,0.12)] backdrop-blur-xl transition hover:translate-y-1 hover:border-sky-300 hover:bg-sky-600 hover:text-white"
                        aria-label="Scroll to bottom"
                    >
                        ↓
                    </button>
                </div>
            </div>
        </>
    );
}