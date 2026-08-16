import usa from "../assets/usa.avif";
import uk from "../assets/uk.avif";
import canada from "../assets/canada.avif";
import australia from "../assets/australia.avif";
import germany from "../assets/germany.avif";
import france from "../assets/france.avif";
import ireland from "../assets/ireland.avif";
import netherlands from "../assets/netherlands.avif";
import sweden from "../assets/sweden.avif";
import newzealand from "../assets/newzealand.avif";
import switzerland from "../assets/switzerland.avif";
import italy from "../assets/italy.avif";
import southkorea from "../assets/southkorea.avif";
import china from "../assets/china.avif";
import japan from "../assets/japan.avif";
import malaysia from "../assets/malaysia.avif";


export const countries = [
    {
        id: 1,
        name: "United States",
        slug: "usa",
        image: usa,

        tagline:
            "World-class universities, diverse programs, and strong career opportunities for international students.",

        overview:
            "The United States is one of the world's most popular study destinations, offering globally recognized universities, a wide range of academic programs, and strong opportunities for research and professional development.",

        tuition: {
            bachelors: "$20k–$50k/year",
            masters: "$22k–$55k/year",
        },

        livingCost: {
            monthly: "$1,200–$2,500",
            accommodation: "$600–$1,500/month",
        },

        intakes: ["Fall", "Spring"],

        workRights: "Up to 20 hrs/week",

        studentWage: "$12–$25/hour",

        postStudyWork:
            "Eligible graduates may apply for Optional Practical Training (OPT) to gain practical work experience related to their field of study.",

        topFields: [
            "Computer Science",
            "Business",
            "Engineering",
            "Data Science",
            "Healthcare",
        ],

        admission: {
            academic:
                "Requirements vary by university and program. Bachelor's applicants generally need secondary education, while master's applicants normally need a relevant bachelor's degree.",

            english:
                "IELTS, TOEFL, or other accepted English proficiency tests may be required. Requirements vary by institution.",

            documents: [
                "Academic transcripts",
                "English proficiency certificate",
                "Passport",
                "Statement of Purpose",
                "CV/Resume",
                "Recommendation letters",
            ],
        },

        visa: {
            name: "F-1 Student Visa",
            financialProof:
                "Students generally need to demonstrate sufficient funds to cover tuition and living expenses.",
            healthInsurance:
                "Health insurance requirements vary by university and state.",
        },

        universities: [
            {
                name: "Massachusetts Institute of Technology",
                location: "Massachusetts",
                ranking: "Top Global University",
                tuition: "$60k+/year",
                popularPrograms: [
                    "Computer Science",
                    "Engineering",
                    "AI",
                ],
            },
            {
                name: "Stanford University",
                location: "California",
                ranking: "Top Global University",
                tuition: "$60k+/year",
                popularPrograms: [
                    "Computer Science",
                    "Business",
                    "Engineering",
                ],
            },
            {
                name: "University of California, Berkeley",
                location: "California",
                ranking: "Top US University",
                tuition: "$30k–$65k/year",
                popularPrograms: [
                    "Computer Science",
                    "Engineering",
                    "Business",
                ],
            },
        ],

        scholarships: [
            {
                name: "Fulbright Foreign Student Program",
                provider: "U.S. Government",
                amount: "Varies",
                type: "Government",
            },
            {
                name: "University Merit Scholarships",
                provider: "U.S. Universities",
                amount: "Partial to full tuition",
                type: "University",
            },
        ],

        pros: [
            "Globally recognized universities",
            "Huge variety of academic programs",
            "Strong research opportunities",
            "Excellent technology and business ecosystem",
            "Strong graduate career opportunities",
        ],

        cons: [
            "High tuition at many universities",
            "Living costs can be expensive",
            "Competitive admission at top institutions",
            "Visa and financial requirements can be demanding",
        ],
    },


    {
        id: 2,
        name: "United Kingdom",
        slug: "uk",
        image: uk,

        tagline:
            "Study at globally respected universities with shorter degree durations and strong academic traditions.",

        overview:
            "The United Kingdom offers internationally recognized degrees, a diverse academic environment, and access to some of the world's oldest and most prestigious universities.",

        tuition: {
            bachelors: "$18k–$40k/year",
            masters: "$20k–$45k/year",
        },

        livingCost: {
            monthly: "$1,000–$2,200",
            accommodation: "$600–$1,400/month",
        },

        intakes: ["September", "January"],

        workRights: "Up to 20 hrs/week",

        studentWage: "$13–$20/hour",

        postStudyWork:
            "Eligible international graduates may apply for the Graduate Route, allowing them to remain in the UK for a period after completing their studies.",

        topFields: [
            "Business",
            "Law",
            "Computer Science",
            "Engineering",
            "Finance",
        ],

        admission: {
            academic:
                "Requirements depend on the university and program. International qualifications are assessed against UK academic standards.",

            english:
                "IELTS and other accepted English language tests are commonly required depending on the university and program.",

            documents: [
                "Academic transcripts",
                "English proficiency certificate",
                "Passport",
                "Personal Statement",
                "CV/Resume",
                "Recommendation letters",
            ],
        },

        visa: {
            name: "Student Visa",
            financialProof:
                "Applicants may need to demonstrate sufficient funds for tuition and living costs.",
            healthInsurance:
                "International students generally pay the Immigration Health Surcharge as part of the visa process.",
        },

        universities: [
            {
                name: "University of Oxford",
                location: "Oxford",
                ranking: "Top Global University",
                tuition: "$35k–$55k/year",
                popularPrograms: [
                    "Business",
                    "Computer Science",
                    "Law",
                ],
            },
            {
                name: "University of Cambridge",
                location: "Cambridge",
                ranking: "Top Global University",
                tuition: "$30k–$55k/year",
                popularPrograms: [
                    "Engineering",
                    "Computer Science",
                    "Business",
                ],
            },
            {
                name: "Imperial College London",
                location: "London",
                ranking: "Top UK University",
                tuition: "$35k–$55k/year",
                popularPrograms: [
                    "Engineering",
                    "Computing",
                    "Business",
                ],
            },
        ],

        scholarships: [
            {
                name: "Chevening Scholarships",
                provider: "UK Government",
                amount: "Fully funded",
                type: "Government",
            },
            {
                name: "University Scholarships",
                provider: "UK Universities",
                amount: "Partial to full funding",
                type: "University",
            },
        ],

        pros: [
            "Globally respected universities",
            "Many master's degrees can be completed in one year",
            "Strong academic and research environment",
            "Large international student community",
            "Excellent cultural diversity",
        ],

        cons: [
            "High living costs in major cities",
            "London can be particularly expensive",
            "Competitive admission for prestigious universities",
            "Tuition can be high for international students",
        ],
    },


    {
        id: 3,
        name: "Canada",
        slug: "canada",
        image: canada,

        tagline:
            "Affordable education, multicultural communities, and strong opportunities for international graduates.",

        overview:
            "Canada is a popular destination for international students because of its high-quality education system, multicultural environment, and opportunities to gain Canadian work experience after graduation.",

        tuition: {
            bachelors: "$15k–$35k/year",
            masters: "$12k–$30k/year",
        },

        livingCost: {
            monthly: "$1,000–$2,000",
            accommodation: "$600–$1,300/month",
        },

        intakes: ["Fall", "Winter", "Summer"],

        workRights: "Up to 24 hrs/week",

        studentWage: "$15–$25/hour",

        postStudyWork:
            "Eligible graduates may qualify for a Post-Graduation Work Permit depending on their program and institution.",

        topFields: [
            "Computer Science",
            "Engineering",
            "Health Sciences",
            "Business",
            "Data Science",
        ],

        admission: {
            academic:
                "Applicants need to meet the academic requirements of their selected university or college and program.",

            english:
                "IELTS, TOEFL, or other accepted English language tests may be required.",

            documents: [
                "Academic transcripts",
                "English proficiency certificate",
                "Passport",
                "Statement of Purpose",
                "CV/Resume",
                "Financial documents",
            ],
        },

        visa: {
            name: "Study Permit",
            financialProof:
                "Students need to demonstrate that they can financially support themselves during their studies.",
            healthInsurance:
                "Health insurance requirements vary by province and institution.",
        },

        universities: [
            {
                name: "University of Toronto",
                location: "Ontario",
                ranking: "Top Canadian University",
                tuition: "$35k–$60k/year",
                popularPrograms: [
                    "Computer Science",
                    "Engineering",
                    "Business",
                ],
            },
            {
                name: "University of British Columbia",
                location: "British Columbia",
                ranking: "Top Canadian University",
                tuition: "$30k–$55k/year",
                popularPrograms: [
                    "Computer Science",
                    "Engineering",
                    "Business",
                ],
            },
            {
                name: "McGill University",
                location: "Quebec",
                ranking: "Top Canadian University",
                tuition: "$20k–$50k/year",
                popularPrograms: [
                    "Medicine",
                    "Engineering",
                    "Business",
                ],
            },
        ],

        scholarships: [
            {
                name: "Vanier Canada Graduate Scholarships",
                provider: "Canadian Government",
                amount: "Up to $50,000/year",
                type: "Government",
            },
            {
                name: "University Scholarships",
                provider: "Canadian Universities",
                amount: "Varies",
                type: "University",
            },
        ],

        pros: [
            "High-quality education",
            "Multicultural and welcoming environment",
            "Strong graduate work opportunities",
            "Good quality of life",
            "Strong demand for skilled professionals",
        ],

        cons: [
            "Housing can be expensive in major cities",
            "Cold winters in many regions",
            "Competitive admission for popular programs",
            "Immigration policies can change",
        ],
    },


    {
        id: 4,
        name: "Australia",
        slug: "australia",
        image: australia,

        tagline:
            "Globally recognized education with excellent student life and strong opportunities for international graduates.",

        overview:
            "Australia is one of the leading destinations for international students, combining internationally recognized universities, high-quality education, multicultural cities, and opportunities for graduates.",

        tuition: {
            bachelors: "$22k–$40k/year",
            masters: "$24k–$45k/year",
        },

        livingCost: {
            monthly: "$1,500–$2,500",
            accommodation: "$700–$1,500/month",
        },

        intakes: ["February", "July"],

        workRights: "Up to 48 hrs/fortnight",

        studentWage: "$24–$35/hour",

        postStudyWork:
            "Eligible graduates may qualify for temporary post-study work arrangements depending on their qualification and circumstances.",

        topFields: [
            "Nursing",
            "Engineering",
            "IT",
            "Business",
            "Data Science",
        ],

        admission: {
            academic:
                "Applicants need to satisfy the academic requirements of their selected university and program.",

            english:
                "IELTS, PTE, TOEFL, or other accepted English tests may be required depending on the course.",

            documents: [
                "Academic transcripts",
                "English proficiency certificate",
                "Passport",
                "Statement of Purpose",
                "CV/Resume",
                "Financial documents",
            ],
        },

        visa: {
            name: "Student Visa (Subclass 500)",
            financialProof:
                "Students may need to demonstrate access to sufficient funds for tuition, living expenses and travel.",
            healthInsurance:
                "Overseas Student Health Cover (OSHC) is generally required.",
        },

        universities: [
            {
                name: "University of Melbourne",
                location: "Melbourne",
                ranking: "Top Australian University",
                tuition: "$30k–$50k/year",
                popularPrograms: [
                    "Computer Science",
                    "Engineering",
                    "Business",
                ],
            },
            {
                name: "Monash University",
                location: "Melbourne",
                ranking: "Top Australian University",
                tuition: "$28k–$48k/year",
                popularPrograms: [
                    "IT",
                    "Business",
                    "Engineering",
                ],
            },
            {
                name: "University of Sydney",
                location: "Sydney",
                ranking: "Top Australian University",
                tuition: "$30k–$55k/year",
                popularPrograms: [
                    "Engineering",
                    "Business",
                    "Computer Science",
                ],
            },
        ],

        scholarships: [
            {
                name: "Australia Awards Scholarships",
                provider: "Australian Government",
                amount: "Fully funded",
                type: "Government",
            },
            {
                name: "University Scholarships",
                provider: "Australian Universities",
                amount: "Partial to full tuition",
                type: "University",
            },
        ],

        pros: [
            "Globally recognized universities",
            "Strong international student community",
            "Good student work opportunities",
            "Excellent quality of life",
            "Strong technology and healthcare sectors",
        ],

        cons: [
            "Tuition can be expensive",
            "Major cities have high living costs",
            "Visa requirements can be demanding",
            "International students need to carefully plan their budget",
        ],
    },

    {
        id: 5,
        name: "Germany",
        slug: "germany",
        image: germany,

        tagline:
            "High-quality education with many affordable or low-tuition study options.",

        overview:
            "Germany is a leading European study destination known for its strong engineering and technology programs, research environment, and relatively affordable public university education.",

        tuition: {
            bachelors: "Free–$8k/year",
            masters: "Free–$10k/year",
        },

        livingCost: {
            monthly: "$900–$1,500",
            accommodation: "$400–$900/month",
        },

        intakes: ["Winter", "Summer"],

        workRights: "140 full or 280 half days/year",

        studentWage: "$13–$20/hour",

        postStudyWork:
            "Graduates may have opportunities to remain in Germany to look for qualified employment after completing their studies.",

        topFields: [
            "Engineering",
            "Computer Science",
            "Automotive",
            "Data Science",
            "Renewable Energy",
        ],

        admission: {
            academic:
                "Academic requirements depend on the university and program. Some applicants may need qualification recognition or preparatory study.",

            english:
                "English-taught programs generally require proof of English proficiency, while German-taught programs may require German language proficiency.",

            documents: [
                "Academic transcripts",
                "Language certificate",
                "Passport",
                "Motivation Letter",
                "CV/Resume",
                "Financial documents",
            ],
        },

        visa: {
            name: "German Student Visa",
            financialProof:
                "Students generally need to demonstrate sufficient funds for their living expenses.",
            healthInsurance:
                "Health insurance is required for students in Germany.",
        },

        universities: [
            {
                name: "Technical University of Munich",
                location: "Munich",
                ranking: "Top German University",
                tuition: "Varies by program",
                popularPrograms: [
                    "Engineering",
                    "Computer Science",
                    "AI",
                ],
            },
            {
                name: "LMU Munich",
                location: "Munich",
                ranking: "Top German University",
                tuition: "Low/varies",
                popularPrograms: [
                    "Computer Science",
                    "Business",
                    "Sciences",
                ],
            },
            {
                name: "RWTH Aachen University",
                location: "Aachen",
                ranking: "Top Engineering University",
                tuition: "Low/varies",
                popularPrograms: [
                    "Engineering",
                    "Computer Science",
                    "Automotive",
                ],
            },
        ],

        scholarships: [
            {
                name: "DAAD Scholarships",
                provider: "German Academic Exchange Service",
                amount: "Varies",
                type: "Government",
            },
            {
                name: "University Scholarships",
                provider: "German Universities",
                amount: "Varies",
                type: "University",
            },
        ],

        pros: [
            "Many affordable public universities",
            "Strong engineering programs",
            "Excellent research opportunities",
            "Strong industrial sector",
            "Good graduate employment prospects",
        ],

        cons: [
            "German language can be important for daily life and employment",
            "Some programs have strict admission requirements",
            "Bureaucratic processes can take time",
            "Housing can be competitive in major cities",
        ],
    },

    {
        id: 6,
        name: "Ireland",
        slug: "ireland",
        image: ireland,

        tagline:
            "A growing European technology hub with English-taught programs and strong graduate opportunities.",

        overview:
            "Ireland has become a popular destination for international students, particularly in technology, business, pharmaceuticals, and data-related fields.",

        tuition: {
            bachelors: "$12k–$28k/year",
            masters: "$14k–$32k/year",
        },

        livingCost: {
            monthly: "$1,000–$2,000",
            accommodation: "$600–$1,300/month",
        },

        intakes: ["September", "January"],

        workRights: "Up to 20 hrs/week",

        studentWage: "$13–$18/hour",

        postStudyWork:
            "Eligible graduates may qualify for the Third Level Graduate Programme, subject to the applicable conditions.",

        topFields: [
            "Computer Science",
            "Business",
            "Pharmaceutical Science",
            "Data Science",
            "Engineering",
        ],

        admission: {
            academic:
                "Requirements depend on the university and selected course.",

            english:
                "IELTS, TOEFL, PTE and other accepted tests may be required.",

            documents: [
                "Academic transcripts",
                "English proficiency certificate",
                "Passport",
                "Statement of Purpose",
                "CV/Resume",
                "Financial documents",
            ],
        },

        visa: {
            name: "Long Stay 'D' Study Visa",
            financialProof:
                "Students may need to demonstrate sufficient funds to support themselves.",
            healthInsurance:
                "Private medical insurance is generally required.",
        },

        universities: [
            {
                name: "Trinity College Dublin",
                location: "Dublin",
                ranking: "Top Irish University",
                tuition: "$20k–$35k/year",
                popularPrograms: [
                    "Computer Science",
                    "Business",
                    "Engineering",
                ],
            },
            {
                name: "University College Dublin",
                location: "Dublin",
                ranking: "Top Irish University",
                tuition: "$18k–$35k/year",
                popularPrograms: [
                    "Business",
                    "Computer Science",
                    "Engineering",
                ],
            },
        ],

        scholarships: [
            {
                name: "Government of Ireland International Education Scholarship",
                provider: "Irish Government",
                amount: "Tuition support + stipend",
                type: "Government",
            },
            {
                name: "University Scholarships",
                provider: "Irish Universities",
                amount: "Varies",
                type: "University",
            },
        ],

        pros: [
            "English-speaking country",
            "Strong technology sector",
            "Good international student environment",
            "Strong pharmaceutical industry",
            "Growing graduate employment opportunities",
        ],

        cons: [
            "Housing shortage in major cities",
            "Dublin can be expensive",
            "Limited number of major cities",
            "Competitive accommodation market",
        ],
    },

    {
        id: 7,
        name: "New Zealand",
        slug: "new-zealand",
        image: newzealand,

        tagline:
            "A welcoming study destination offering quality education, beautiful surroundings, and strong student support.",

        overview:
            "New Zealand combines a high-quality education system with a safe and welcoming environment, making it an attractive destination for international students.",

        tuition: {
            bachelors: "$18k–$32k/year",
            masters: "$20k–$35k/year",
        },

        livingCost: {
            monthly: "$1,000–$1,800",
            accommodation: "$500–$1,100/month",
        },

        intakes: ["February", "July"],

        workRights: "Up to 20 hrs/week",

        studentWage: "$15–$22/hour",

        postStudyWork:
            "Eligible graduates may apply for a Post Study Work Visa depending on their qualification and circumstances.",

        topFields: [
            "Agriculture",
            "Business",
            "Engineering",
            "IT",
            "Environmental Science",
        ],

        admission: {
            academic:
                "Requirements vary by university and program.",

            english:
                "IELTS, TOEFL, PTE, or other recognized English tests may be required.",

            documents: [
                "Academic transcripts",
                "English proficiency certificate",
                "Passport",
                "Statement of Purpose",
                "CV/Resume",
                "Financial documents",
            ],
        },

        visa: {
            name: "Fee Paying Student Visa",
            financialProof:
                "Applicants need to demonstrate sufficient funds for tuition and living expenses.",
            healthInsurance:
                "International students generally need appropriate medical and travel insurance.",
        },

        universities: [
            {
                name: "University of Auckland",
                location: "Auckland",
                ranking: "Top New Zealand University",
                tuition: "$20k–$35k/year",
                popularPrograms: [
                    "Engineering",
                    "Computer Science",
                    "Business",
                ],
            },
            {
                name: "University of Otago",
                location: "Dunedin",
                ranking: "Top New Zealand University",
                tuition: "$18k–$35k/year",
                popularPrograms: [
                    "Health Sciences",
                    "Business",
                    "Sciences",
                ],
            },
        ],

        scholarships: [
            {
                name: "New Zealand Scholarships",
                provider: "New Zealand Government",
                amount: "Fully funded",
                type: "Government",
            },
            {
                name: "University Scholarships",
                provider: "New Zealand Universities",
                amount: "Varies",
                type: "University",
            },
        ],

        pros: [
            "Safe and welcoming environment",
            "High-quality education",
            "Beautiful natural environment",
            "Strong student support",
            "Good quality of life",
        ],

        cons: [
            "Smaller job market",
            "Relatively high living costs",
            "Geographically distant from many countries",
            "Limited number of major cities",
        ],
    },

    {
        id: 8,
        name: "Netherlands",
        slug: "netherlands",
        image: netherlands,

        tagline:
            "Innovative education, English-taught programs, and a strong international environment in the heart of Europe.",

        overview:
            "The Netherlands is known for innovative teaching methods, internationally oriented universities, English-taught programs, and strong connections with European industries.",

        tuition: {
            bachelors: "$10k–$20k/year",
            masters: "$12k–$24k/year",
        },

        livingCost: {
            monthly: "$1,000–$1,800",
            accommodation: "$500–$1,200/month",
        },

        intakes: ["September", "February"],

        workRights: "16 hrs/week (permit required)",

        studentWage: "$12–$18/hour",

        postStudyWork:
            "Graduates may be eligible for an orientation year residence permit to search for employment after graduation.",

        topFields: [
            "Engineering",
            "Business",
            "Agriculture",
            "Computer Science",
            "Sustainability",
        ],

        admission: {
            academic:
                "Academic requirements vary by university and program.",

            english:
                "English-taught programs commonly require IELTS, TOEFL, or another accepted English qualification.",

            documents: [
                "Academic transcripts",
                "English proficiency certificate",
                "Passport",
                "Motivation Letter",
                "CV/Resume",
                "Financial documents",
            ],
        },

        visa: {
            name: "Student Residence Permit",
            financialProof:
                "Students must demonstrate sufficient financial resources according to applicable requirements.",
            healthInsurance:
                "Students must arrange appropriate health insurance.",
        },

        universities: [
            {
                name: "Delft University of Technology",
                location: "Delft",
                ranking: "Top Dutch University",
                tuition: "$15k–$25k/year",
                popularPrograms: [
                    "Engineering",
                    "Computer Science",
                    "Architecture",
                ],
            },
            {
                name: "University of Amsterdam",
                location: "Amsterdam",
                ranking: "Top Dutch University",
                tuition: "$12k–$25k/year",
                popularPrograms: [
                    "Business",
                    "Computer Science",
                    "Economics",
                ],
            },
        ],

        scholarships: [
            {
                name: "NL Scholarship",
                provider: "Dutch Higher Education Institutions",
                amount: "Financial award",
                type: "Government/Institutional",
            },
            {
                name: "University Scholarships",
                provider: "Dutch Universities",
                amount: "Varies",
                type: "University",
            },
        ],

        pros: [
            "Many English-taught programs",
            "Innovative education system",
            "Strong international environment",
            "Excellent transportation",
            "Strong European career opportunities",
        ],

        cons: [
            "Housing shortage",
            "Living costs can be high",
            "Part-time work may require additional arrangements",
            "Competitive admission for popular programs",
        ],
    },

    {
        id: 9,
        name: "Italy",
        slug: "italy",
        image: italy,

        tagline:
            "Affordable European education combined with history, culture, design, and strong academic traditions.",

        overview:
            "Italy offers affordable study options at many public universities and is particularly attractive for students interested in architecture, design, fashion, engineering, business, and arts.",

        tuition: {
            bachelors: "$2k–$12k/year",
            masters: "$3k–$16k/year",
        },

        livingCost: {
            monthly: "$700–$1,400",
            accommodation: "$350–$800/month",
        },

        intakes: ["September", "February"],

        workRights: "20 hrs/week",

        studentWage: "$8–$15/hour",

        postStudyWork:
            "Graduates may have options to remain in Italy depending on their employment and immigration circumstances.",

        topFields: [
            "Architecture",
            "Fashion",
            "Engineering",
            "Business",
            "Design",
        ],

        admission: {
            academic:
                "Academic requirements vary by university and program.",

            english:
                "English-taught programs may require English proficiency, while Italian-taught programs generally require Italian language skills.",

            documents: [
                "Academic transcripts",
                "Language certificate",
                "Passport",
                "Motivation Letter",
                "CV/Resume",
                "Financial documents",
            ],
        },

        visa: {
            name: "Italian Student Visa",
            financialProof:
                "Applicants need to demonstrate sufficient financial resources.",
            healthInsurance:
                "Appropriate health insurance is required.",
        },

        universities: [
            {
                name: "Politecnico di Milano",
                location: "Milan",
                ranking: "Top Italian University",
                tuition: "$4k–$15k/year",
                popularPrograms: [
                    "Engineering",
                    "Architecture",
                    "Design",
                ],
            },
            {
                name: "University of Bologna",
                location: "Bologna",
                ranking: "Historic European University",
                tuition: "$2k–$10k/year",
                popularPrograms: [
                    "Business",
                    "Engineering",
                    "Law",
                ],
            },
        ],

        scholarships: [
            {
                name: "Italian Regional Scholarships",
                provider: "Regional Authorities",
                amount: "Tuition + financial support",
                type: "Government",
            },
            {
                name: "University Scholarships",
                provider: "Italian Universities",
                amount: "Varies",
                type: "University",
            },
        ],

        pros: [
            "Affordable public universities",
            "Strong architecture and design programs",
            "Rich cultural environment",
            "Many scholarship opportunities",
            "Relatively affordable living in smaller cities",
        ],

        cons: [
            "Italian language can be important",
            "Bureaucratic processes can take time",
            "Job market varies by region",
            "Some programs have limited English availability",
        ],
    },

    {
        id: 10,
        name: "France",
        slug: "france",
        image: france,

        tagline:
            "Affordable European education combined with culture, innovation, and international career opportunities.",

        overview:
            "France offers internationally recognized universities and institutions, relatively affordable public education, and strong opportunities in fields such as business, fashion, engineering, hospitality, and technology.",

        tuition: {
            bachelors: "$3k–$12k/year",
            masters: "$4k–$18k/year",
        },

        livingCost: {
            monthly: "$900–$1,700",
            accommodation: "$500–$1,100/month",
        },

        intakes: ["September", "January"],

        workRights: "Up to 964 hrs/year",

        studentWage: "$12–$18/hour",

        postStudyWork:
            "Graduates may have options to remain in France depending on their qualification, employment situation and immigration status.",

        topFields: [
            "Business",
            "Fashion",
            "Hospitality",
            "Engineering",
            "Computer Science",
        ],

        admission: {
            academic:
                "Academic requirements vary depending on the institution and program.",

            english:
                "English-taught programs may require IELTS or another accepted English test. French-taught programs generally require French proficiency.",

            documents: [
                "Academic transcripts",
                "Language certificate",
                "Passport",
                "Motivation Letter",
                "CV/Resume",
                "Financial documents",
            ],
        },

        visa: {
            name: "Long-Stay Student Visa",
            financialProof:
                "Applicants generally need to demonstrate sufficient financial resources.",
            healthInsurance:
                "Students should have appropriate health coverage during their stay.",
        },

        universities: [
            {
                name: "Sorbonne University",
                location: "Paris",
                ranking: "Top French University",
                tuition: "$3k–$10k/year",
                popularPrograms: [
                    "Sciences",
                    "Computer Science",
                    "Business",
                ],
            },
            {
                name: "Université Paris-Saclay",
                location: "Paris",
                ranking: "Top French University",
                tuition: "$3k–$10k/year",
                popularPrograms: [
                    "Engineering",
                    "Science",
                    "Computer Science",
                ],
            },
            {
                name: "HEC Paris",
                location: "Paris",
                ranking: "Top Business School",
                tuition: "$20k+/year",
                popularPrograms: [
                    "Business",
                    "Finance",
                    "Management",
                ],
            },
        ],

        scholarships: [
            {
                name: "Eiffel Excellence Scholarship",
                provider: "French Government",
                amount: "Financial support",
                type: "Government",
            },
            {
                name: "University Scholarships",
                provider: "French Universities",
                amount: "Varies",
                type: "University",
            },
        ],

        pros: [
            "Affordable public education options",
            "Strong business and fashion sectors",
            "Rich cultural environment",
            "Good transportation infrastructure",
            "Strong international student community",
        ],

        cons: [
            "French language can be important outside academic settings",
            "Paris has high living costs",
            "Administrative processes can be complex",
            "Program availability varies by institution",
        ],
    },

    {
        id: 11,
        name: "Sweden",
        slug: "sweden",
        image: sweden,

        tagline:
            "Innovation-driven education with strong sustainability, technology, and research opportunities.",

        overview:
            "Sweden offers a modern education system, strong research culture, innovative industries, and a large selection of English-taught master's programs.",

        tuition: {
            bachelors: "$8k–$18k/year",
            masters: "$10k–$22k/year",
        },

        livingCost: {
            monthly: "$900–$1,600",
            accommodation: "$450–$900/month",
        },

        intakes: ["Autumn", "Spring"],

        workRights: "No official hourly limit",

        studentWage: "$12–$20/hour",

        postStudyWork:
            "Graduates may have opportunities to remain in Sweden to search for employment under applicable residence rules.",

        topFields: [
            "Sustainability",
            "Engineering",
            "IT",
            "Business",
            "Environmental Science",
        ],

        admission: {
            academic:
                "Academic requirements vary depending on the program and university.",

            english:
                "English-taught programs generally require recognized English proficiency.",

            documents: [
                "Academic transcripts",
                "English proficiency certificate",
                "Passport",
                "Motivation Letter",
                "CV/Resume",
                "Financial documents",
            ],
        },

        visa: {
            name: "Residence Permit for Studies",
            financialProof:
                "Students must demonstrate sufficient funds to support themselves.",
            healthInsurance:
                "Health coverage requirements depend on the student's circumstances and length of stay.",
        },

        universities: [
            {
                name: "KTH Royal Institute of Technology",
                location: "Stockholm",
                ranking: "Top Swedish University",
                tuition: "$15k–$25k/year",
                popularPrograms: [
                    "Engineering",
                    "Computer Science",
                    "Architecture",
                ],
            },
            {
                name: "Lund University",
                location: "Lund",
                ranking: "Top Swedish University",
                tuition: "$10k–$20k/year",
                popularPrograms: [
                    "Engineering",
                    "Business",
                    "Computer Science",
                ],
            },
        ],

        scholarships: [
            {
                name: "Swedish Institute Scholarships",
                provider: "Swedish Institute",
                amount: "Scholarship support",
                type: "Government",
            },
            {
                name: "University Scholarships",
                provider: "Swedish Universities",
                amount: "Varies",
                type: "University",
            },
        ],

        pros: [
            "Strong innovation ecosystem",
            "Excellent research opportunities",
            "Many English-taught programs",
            "Strong sustainability focus",
            "High quality of life",
        ],

        cons: [
            "High living costs",
            "Cold and dark winters",
            "Tuition applies to many non-EU students",
            "Housing can be difficult in major cities",
        ],
    },

    {
        id: 12,
        name: "Switzerland",
        slug: "switzerland",
        image: switzerland,

        tagline:
            "Premium education, world-class research, and outstanding opportunities in hospitality, finance, and engineering.",

        overview:
            "Switzerland is internationally recognized for its high-quality education, research institutions, hospitality schools, and strong financial and technology sectors.",

        tuition: {
            bachelors: "$2k–$15k/year",
            masters: "$3k–$18k/year",
        },

        livingCost: {
            monthly: "$1,500–$2,500",
            accommodation: "$800–$1,500/month",
        },

        intakes: ["September", "February"],

        workRights: "15 hrs/week",

        studentWage: "$20–$30/hour",

        postStudyWork:
            "Graduates may have opportunities to seek employment in Switzerland subject to applicable immigration requirements.",

        topFields: [
            "Hospitality",
            "Finance",
            "Engineering",
            "Business",
            "Computer Science",
        ],

        admission: {
            academic:
                "Requirements vary by institution and program.",

            english:
                "English-taught programs may require recognized English proficiency, while other programs may require German, French or Italian.",

            documents: [
                "Academic transcripts",
                "Language certificate",
                "Passport",
                "Motivation Letter",
                "CV/Resume",
                "Financial documents",
            ],
        },

        visa: {
            name: "Swiss Student Visa",
            financialProof:
                "Students may need to demonstrate sufficient financial resources.",
            healthInsurance:
                "Health insurance is required during the stay.",
        },

        universities: [
            {
                name: "ETH Zurich",
                location: "Zurich",
                ranking: "Top Global University",
                tuition: "Relatively low tuition",
                popularPrograms: [
                    "Engineering",
                    "Computer Science",
                    "AI",
                ],
            },
            {
                name: "EPFL",
                location: "Lausanne",
                ranking: "Top Swiss University",
                tuition: "Relatively low tuition",
                popularPrograms: [
                    "Engineering",
                    "Computer Science",
                    "Robotics",
                ],
            },
        ],

        scholarships: [
            {
                name: "Swiss Government Excellence Scholarships",
                provider: "Swiss Government",
                amount: "Scholarship support",
                type: "Government",
            },
            {
                name: "University Scholarships",
                provider: "Swiss Universities",
                amount: "Varies",
                type: "University",
            },
        ],

        pros: [
            "Excellent education quality",
            "Strong research environment",
            "High salaries",
            "Strong hospitality industry",
            "Excellent quality of life",
        ],

        cons: [
            "Very high living costs",
            "Competitive job market",
            "Local language can be important",
            "Student work opportunities can be restricted",
        ],
    },

    {
        id: 13,
        name: "South Korea",
        slug: "south-korea",
        image: southkorea,

        tagline:
            "A technology-driven study destination with strong universities, innovation, and scholarship opportunities.",

        overview:
            "South Korea is known for its advanced technology ecosystem, strong universities, research opportunities, and growing international education sector.",

        tuition: {
            bachelors: "$5k–$15k/year",
            masters: "$6k–$18k/year",
        },

        livingCost: {
            monthly: "$700–$1,400",
            accommodation: "$300–$800/month",
        },

        intakes: ["March", "September"],

        workRights: "Up to 20 hrs/week",

        studentWage: "$8–$15/hour",

        postStudyWork:
            "Graduates may explore employment and residence options depending on their qualification and visa category.",

        topFields: [
            "Computer Science",
            "AI",
            "Electronics",
            "Engineering",
            "Business",
        ],

        admission: {
            academic:
                "Requirements depend on the university and selected program.",

            english:
                "English-taught programs may require IELTS or TOEFL, while Korean-taught programs may require TOPIK.",

            documents: [
                "Academic transcripts",
                "Language certificate",
                "Passport",
                "Study Plan",
                "CV/Resume",
                "Financial documents",
            ],
        },

        visa: {
            name: "D-2 Student Visa",
            financialProof:
                "Students may need to provide evidence of sufficient financial resources.",
            healthInsurance:
                "Students are generally required to have appropriate health coverage.",
        },

        universities: [
            {
                name: "Seoul National University",
                location: "Seoul",
                ranking: "Top Korean University",
                tuition: "$5k–$12k/year",
                popularPrograms: [
                    "Computer Science",
                    "Engineering",
                    "Business",
                ],
            },
            {
                name: "KAIST",
                location: "Daejeon",
                ranking: "Top Science & Technology University",
                tuition: "$5k–$10k/year",
                popularPrograms: [
                    "AI",
                    "Engineering",
                    "Computer Science",
                ],
            },
        ],

        scholarships: [
            {
                name: "Global Korea Scholarship",
                provider: "Korean Government",
                amount: "Fully funded",
                type: "Government",
            },
            {
                name: "University Scholarships",
                provider: "Korean Universities",
                amount: "Partial to full tuition",
                type: "University",
            },
        ],

        pros: [
            "Advanced technology ecosystem",
            "Strong engineering and IT programs",
            "Generous scholarship opportunities",
            "Affordable tuition compared with many Western countries",
            "Excellent public transportation",
        ],

        cons: [
            "Korean language can be important",
            "Competitive academic environment",
            "Cultural adjustment may take time",
            "Work opportunities can have visa restrictions",
        ],
    },

    {
        id: 14,
        name: "China",
        slug: "china",
        image: china,

        tagline:
            "A rapidly growing study destination with world-class universities and strong opportunities in technology, engineering, and business.",

        overview:
            "China offers affordable education, internationally recognized universities, modern infrastructure, and strong connections to major technology, business, and research industries.",

        tuition: {
            bachelors: "$3k–$8k/year",
            masters: "$4k–$10k/year",
        },

        livingCost: {
            monthly: "$400–$900",
            accommodation: "$150–$500/month",
        },

        intakes: ["September", "March"],

        workRights:
            "Part-time work may be possible with university approval and required authorization.",

        studentWage: "$4–$10/hour",

        postStudyWork:
            "Graduates may explore employment opportunities in China by obtaining the appropriate work and residence authorization.",

        topFields: [
            "Computer Science",
            "Engineering",
            "Business",
            "Artificial Intelligence",
            "Data Science",
        ],

        admission: {
            academic:
                "Academic requirements vary by institution and program.",

            english:
                "English-taught programs may require IELTS or TOEFL, while Chinese-taught programs may require HSK.",

            documents: [
                "Academic transcripts",
                "Language proficiency certificate",
                "Passport",
                "Statement of Purpose",
                "CV/Resume",
                "Financial documents",
            ],
        },

        visa: {
            name: "X1 / X2 Student Visa",
            financialProof:
                "Students should be able to demonstrate sufficient financial resources.",

            healthInsurance:
                "Medical insurance is generally required for international students.",
        },

        universities: [
            {
                name: "Tsinghua University",
                location: "Beijing",
                ranking: "Top Chinese University",
                tuition: "$4k–$8k/year",
                popularPrograms: [
                    "Computer Science",
                    "Engineering",
                    "Business",
                ],
            },
            {
                name: "Peking University",
                location: "Beijing",
                ranking: "Top Chinese University",
                tuition: "$4k–$8k/year",
                popularPrograms: [
                    "Computer Science",
                    "Business",
                    "Medicine",
                ],
            },
        ],

        scholarships: [
            {
                name: "Chinese Government Scholarship",
                provider: "Chinese Government",
                amount: "Full or partial funding",
                type: "Government",
            },
            {
                name: "University Scholarships",
                provider: "Chinese Universities",
                amount: "Varies",
                type: "University",
            },
        ],

        pros: [
            "Affordable education",
            "World-class universities",
            "Strong technology and engineering sectors",
            "Extensive scholarship opportunities",
            "Modern infrastructure",
        ],

        cons: [
            "Language barrier outside English-taught programs",
            "Competitive university admission",
            "Student work requires authorization",
            "Living costs are higher in major cities",
        ],
    },
    
    {
        id: 15,
        name: "Japan",
        slug: "japan",
        image: japan,

        tagline:
            "World-leading technology, engineering, robotics, and a unique cultural experience.",

        overview:
            "Japan offers strong academic programs, advanced technology and research opportunities, and a unique combination of modern innovation and traditional culture.",

        tuition: {
            bachelors: "$5k–$12k/year",
            masters: "$6k–$15k/year",
        },

        livingCost: {
            monthly: "$700–$1,500",
            accommodation: "$300–$800/month",
        },

        intakes: ["April", "October"],

        workRights: "Up to 28 hrs/week",

        studentWage: "$8–$15/hour",

        postStudyWork:
            "Graduates may change to an appropriate work status if they secure qualifying employment.",

        topFields: [
            "Robotics",
            "Engineering",
            "Computer Science",
            "AI",
            "Automotive",
        ],

        admission: {
            academic:
                "Academic requirements vary by university and program.",

            english:
                "English-taught programs may accept IELTS or TOEFL. Japanese-taught programs may require Japanese proficiency.",

            documents: [
                "Academic transcripts",
                "Language certificate",
                "Passport",
                "Study Plan",
                "CV/Resume",
                "Financial documents",
            ],
        },

        visa: {
            name: "College Student Visa",
            financialProof:
                "Students need to demonstrate sufficient financial resources for their stay.",
            healthInsurance:
                "Students are generally enrolled in appropriate Japanese health insurance systems.",
        },

        universities: [
            {
                name: "University of Tokyo",
                location: "Tokyo",
                ranking: "Top Japanese University",
                tuition: "$5k–$10k/year",
                popularPrograms: [
                    "Engineering",
                    "Computer Science",
                    "Business",
                ],
            },
            {
                name: "Kyoto University",
                location: "Kyoto",
                ranking: "Top Japanese University",
                tuition: "$5k–$10k/year",
                popularPrograms: [
                    "Engineering",
                    "Sciences",
                    "Computer Science",
                ],
            },
        ],

        scholarships: [
            {
                name: "MEXT Scholarship",
                provider: "Japanese Government",
                amount: "Fully funded",
                type: "Government",
            },
            {
                name: "University Scholarships",
                provider: "Japanese Universities",
                amount: "Varies",
                type: "University",
            },
        ],

        pros: [
            "World-class technology sector",
            "Strong engineering and robotics programs",
            "Excellent public transportation",
            "Safe environment",
            "Strong research opportunities",
        ],

        cons: [
            "Japanese language can be important",
            "Cultural adjustment may take time",
            "Some programs have limited English availability",
            "Work opportunities may require Japanese skills",
        ],
    },


    {
        id: 16,
        name: "Malaysia",
        slug: "malaysia",
        image: malaysia,

        tagline:
            "Affordable international education with lower living costs and a growing higher education sector.",

        overview:
            "Malaysia is an increasingly popular destination for international students seeking affordable tuition, lower living costs, and access to internationally connected universities.",

        tuition: {
            bachelors: "$3k–$10k/year",
            masters: "$4k–$12k/year",
        },

        livingCost: {
            monthly: "$400–$900",
            accommodation: "$150–$450/month",
        },

        intakes: ["February", "July", "September"],

        workRights: "Up to 20 hrs/week (subject to visa conditions)",

        studentWage: "$5–$10/hour",

        postStudyWork:
            "Post-study employment options depend on the student's qualification, employer and applicable immigration rules.",

        topFields: [
            "Medicine",
            "Engineering",
            "Business",
            "Computer Science",
            "Hospitality",
        ],

        admission: {
            academic:
                "Requirements vary according to university and program.",

            english:
                "IELTS, TOEFL, MUET, or other accepted English qualifications may be required.",

            documents: [
                "Academic transcripts",
                "English proficiency certificate",
                "Passport",
                "Personal Statement",
                "CV/Resume",
                "Financial documents",
            ],
        },

        visa: {
            name: "Student Pass",
            financialProof:
                "Students should be prepared to demonstrate sufficient financial resources.",
            healthInsurance:
                "International students are generally required to maintain appropriate medical insurance.",
        },

        universities: [
            {
                name: "University of Malaya",
                location: "Kuala Lumpur",
                ranking: "Top Malaysian University",
                tuition: "$4k–$12k/year",
                popularPrograms: [
                    "Computer Science",
                    "Engineering",
                    "Business",
                ],
            },
            {
                name: "Universiti Putra Malaysia",
                location: "Selangor",
                ranking: "Top Malaysian University",
                tuition: "$3k–$10k/year",
                popularPrograms: [
                    "Agriculture",
                    "Engineering",
                    "Business",
                ],
            },
        ],

        scholarships: [
            {
                name: "Malaysia International Scholarship",
                provider: "Malaysian Government",
                amount: "Tuition/stipend support",
                type: "Government",
            },
            {
                name: "University Scholarships",
                provider: "Malaysian Universities",
                amount: "Varies",
                type: "University",
            },
        ],

        pros: [
            "Affordable tuition",
            "Low living costs",
            "Many English-taught programs",
            "Multicultural environment",
            "Good location within Southeast Asia",
        ],

        cons: [
            "Lower graduate salaries compared with some Western countries",
            "Smaller international job market",
            "Work opportunities can have restrictions",
            "Program quality varies between institutions",
        ],
    },
];