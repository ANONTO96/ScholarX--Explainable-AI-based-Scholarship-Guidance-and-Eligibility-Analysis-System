import {
  Search,
  BookOpen,
  GraduationCap,
  Globe,
  Sparkles,
  TrendingUp,
  ArrowRight,
  CalendarDays,
  Clock3,
  Eye,
  Bookmark,
  UserCircle2,
  BadgeCheck,
} from "lucide-react";
import { useState } from "react";

const popularSearches = [
  "Australia",
  "Canada",
  "Scholarships",
  "Student Visa",
  "IELTS",
  "Computer Science",
  "MBA",
  "Medicine",
];

const stats = [
  {
    number: "250+",
    label: "Articles",
    icon: BookOpen,
  },
  {
    number: "16",
    label: "Study Destinations",
    icon: Globe,
  },
  {
    number: "5K+",
    label: "Scholarships",
    icon: GraduationCap,
  },
  {
    number: "50K+",
    label: "Monthly Readers",
    icon: TrendingUp,
  },
];

const featuredArticles = [
  {
    id: 1,
    title: "The Complete Guide to Studying in Australia (2027)",
    description:
      "Discover everything you need to know before studying in Australia—from choosing the right university and finding scholarships to understanding tuition fees, visas, part-time jobs, and PR pathways.",
    category: "Australia Guide",
    author: "ScholarX Editorial Team",
    date: "August 05, 2026",
    readTime: "12 min read",
    views: "6.2K",
    image:
      "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?auto=format&fit=crop&w=1600&q=80",
  },

  {
    id: 2,
    title: "Study in Canada: Universities, Scholarships & Student Visa Guide",
    description:
      "Everything international students need to know about studying in Canada, including top universities, tuition fees, scholarships, work opportunities and the student visa process.",
    category: "Canada Guide",
    author: "ScholarX Editorial Team",
    date: "August 12, 2026",
    readTime: "11 min read",
    views: "5.8K",
    image:
      "https://images.unsplash.com/photo-1517935706615-2717063c2225?auto=format&fit=crop&w=1600&q=80",
  },

  {
    id: 3,
    title: "Top Fully Funded Scholarships for International Students in 2027",
    description:
      "Explore the world's best fully funded scholarships including government, university and private funding opportunities for undergraduate and postgraduate students.",
    category: "Scholarships",
    author: "ScholarX Editorial Team",
    date: "August 18, 2026",
    readTime: "10 min read",
    views: "7.9K",
    image:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1600&q=80",
  },

  {
    id: 4,
    title: "How to Choose the Right University for Your Career Goals",
    description:
      "Learn how to compare universities based on rankings, tuition fees, employability, scholarships, campus life and graduate outcomes before making your final decision.",
    category: "University Guide",
    author: "ScholarX Editorial Team",
    date: "August 22, 2026",
    readTime: "9 min read",
    views: "4.6K",
    image:
      "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1600&q=80",
  },

  {
    id: 5,
    title: "Student Visa Checklist: Documents You Should Never Miss",
    description:
      "Avoid common visa mistakes with this complete checklist covering financial documents, language requirements, medical tests and interview preparation.",
    category: "Visa Guide",
    author: "ScholarX Editorial Team",
    date: "August 27, 2026",
    readTime: "8 min read",
    views: "6.5K",
    image:
      "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1600&q=80",
  },

  {
    id: 6,
    title: "Best Computer Science Universities Around the World",
    description:
      "Compare the world's leading universities for Computer Science based on research excellence, tuition fees, scholarships and graduate employability.",
    category: "Computer Science",
    author: "ScholarX Editorial Team",
    date: "September 02, 2026",
    readTime: "9 min read",
    views: "5.4K",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80",
  },
];

const Blog = () => {
  const [search, setSearch] = useState("");
  const filteredArticles = featuredArticles.filter((article) => {
  const keyword = search.toLowerCase();

  return (
    article.title.toLowerCase().includes(keyword) ||
    article.category.toLowerCase().includes(keyword) ||
    article.description.toLowerCase().includes(keyword)
  );
});

const articlesToShow =
  search.trim() === ""
    ? featuredArticles
    : filteredArticles;

const featuredArticle = articlesToShow[0];

const smallArticles = articlesToShow.slice(1);

  return (
    <section className="relative overflow-hidden bg-linear-to-b from-blue-50 via-white to-slate-50 pt-40 pb-20">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-blue-300/20 blur-3xl" />

        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-indigo-300/20 blur-3xl" />

        <div className="absolute bottom-0 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-sky-200/20 blur-3xl" />

        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
            linear-gradient(to right,#2563eb 1px,transparent 1px),
            linear-gradient(to bottom,#2563eb 1px,transparent 1px)
          `,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Floating Icons */}

      <BookOpen
        className="absolute left-25 top-60 hidden rotate-12 text-blue-200 lg:block"
        size={90}
      />

      <GraduationCap
        className="absolute right-25 top-30 hidden -rotate-12 text-indigo-200 lg:block"
        size={90}
      />

      <Sparkles
        className="absolute right-[50%] top-190 hidden rotate-12 text-blue-200 lg:block"
        size={55}
      />

      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Left */}

          <div>
            {/* Badge */}

            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-100 px-5 py-2 text-sm font-semibold text-sky-600 shadow-sm backdrop-blur-3xl">
              <Sparkles size={16} />
              ScholarX Knowledge Hub
            </div>

            {/* Heading */}

            <h1 className="mt-7 text-5xl font-black leading-tight text-slate-900 lg:text-7xl">
              ScholarX{" "}
              <span className="bg-linear-to-r from-blue-600 via-indigo-600 to-sky-500 bg-clip-text text-transparent">
                Insights
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              Explore expert guides on scholarships, universities, visas,
              career planning and study abroad opportunities—all curated to
              help you make smarter decisions.
            </p>

            {/* Search */}

            <div className="mt-10">
              <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl md:flex-row">
                <div className="flex flex-1 items-center gap-3 px-5">
                  <Search
                    size={20}
                    className="text-slate-400"
                  />

                  <input
                    type="text"
                    value={search}
  onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search scholarships, countries, universities..."
                    className="h-16 w-full bg-transparent outline-none placeholder:text-slate-400"
                  />
                </div>

                <button className="flex h-16 items-center justify-center gap-2 bg-linear-to-r from-blue-600 to-indigo-600 px-8 font-semibold text-white transition hover:opacity-90">
                  Search
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>

            {/* Popular */}

            <div className="mt-8">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">
                Popular Searches
              </h3>

              <div className="flex flex-wrap gap-3">
                {popularSearches.map((item) => (
                  <button
                    key={item}
                    className="rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-medium text-slate-600 transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:bg-blue-600 hover:text-white hover:shadow-lg"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right */}

          <div className="relative">
            {/* Main Card */}

            <div className="relative overflow-hidden rounded-8 border rounded-3xl border-white/60 bg-white/80 p-8 shadow-2xl backdrop-blur-xl">
              <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-blue-100 blur-3xl" />

              {/* Top */}

              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Weekly Reads</p>

                  <h2 className="mt-2 text-4xl font-black text-slate-900">
                    1K+
                  </h2>
                </div>

                <div className="rounded-2xl bg-blue-100 p-4">
                  <TrendingUp className="text-blue-600" />
                </div>
              </div>

              {/* Divider */}

              <div className="my-8 h-px bg-slate-200" />

              {/* Trending */}

              <div className="space-y-5">
                {[
                  "Ultimate Australia Guide",
                  "Top Scholarships 2027",
                  "Student Visa Checklist",
                  "How AI Finds Universities",
                ].map((article, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 transition hover:bg-blue-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-blue-100 p-2">
                        <BookOpen
                          size={18}
                          className="text-blue-600"
                        />
                      </div>

                      <div>
                        <p className="font-semibold text-slate-800">
                          {article}
                        </p>

                        <span className="text-sm text-slate-500">
                          Tap to know more about this topic
                        </span>
                      </div>
                    </div>

                    <ArrowRight
                      size={18}
                      className="text-slate-400"
                    />
                  </div>
                ))}
              </div>

              {/* Bottom Badge for new articles */}

              <div className="mt-8 rounded-2xl bg-linear-to-r from-blue-600 to-indigo-600 p-5 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-100">
                      New This Week
                    </p>

                    <h3 className="mt-1 text-xl font-bold">
                      18 Fresh Articles
                    </h3>
                  </div>

                  <Sparkles />
                </div>
              </div>
            </div>

            {/* Floating Cards */}

            <div className="absolute -right-8 -top-14 rotate-14 hidden rounded-2xl border border-white bg-white px-5 py-4 shadow-lg lg:block">
              <p className="text-2xl font-bold text-sky-600">
                250+
              </p>

              <span className="text-sm text-slate-500">
                Articles
              </span>
            </div>
          </div>
        </div>

        {/* Statistics */}

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="group rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-blue-100 hover:shadow-xl"
              >
                <div className="flex items-center justify-between">
                  <div className="rounded-2xl bg-blue-100 p-4 transition group-hover:-translate-y-2
group-hover:rotate-3
group-hover:shadow-lg group-hover:bg-sky-600">
                    <Icon
                      className="text-blue-600 transition group-hover:text-white"
                      size={26}
                    />
                  </div>

                  <ArrowRight
                    size={18}
                    className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-sky-600"
                  />
                </div>

                <h2 className="mt-8 text-4xl font-black text-slate-900">
                  {item.number}
                </h2>

                <p className="mt-2 text-slate-500">
                  {item.label}
                </p>
              </div>
            );
          })}
        </div>

        {/* Section Header */}

        <div className="my-14 flex flex-col items-center text-center mx-auto">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-100 px-5 py-2 text-sm font-semibold text-sky-600">
            <BookOpen size={16} />
            Featured Article
          </span>

          <h2 className="mt-5 text-4xl font-black text-slate-900 lg:text-5xl">
            Editor's Pick This Week
          </h2>

          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
            Hand-picked guides and expert insights to help students make
            informed study abroad decisions.
          </p>
        </div>

        {/* Featured Card */}

        {featuredArticle ? (

  <div className="group overflow-hidden rounded-[34px] border border-slate-200 bg-white shadow-xl transition-all duration-500 hover:shadow-2xl">

          <div className="grid lg:grid-cols-[1.2fr_1fr]">

            {/* IMAGE */}

            <div className="relative overflow-hidden">

              <img

                src={featuredArticle.image}

                alt={featuredArticle.title}

                className="h-100 lg:h-full w-full object-cover transition duration-700 group-hover:scale-105"

              />



              {/* Overlay */}



              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />



              {/* Category */}



              <div className="absolute left-6 top-6">

                <span className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white">

                  {featuredArticle.category}

                </span>

              </div>



              {/* Bottom Info */}



              <div className="absolute bottom-6 left-6 right-6">

                <div className="rounded-3xl border border-white/20 bg-white/15 p-5 backdrop-blur-xl">

                  <div className="grid grid-cols-3 gap-4 text-white">

                    <div>

                      <p className="text-2xl font-black">4.9★</p>

                      <span className="text-sm text-white/80">

                        Reader Rating

                      </span>

                    </div>



                    <div>

                      <p className="text-2xl font-black">1.8K</p>

                      <span className="text-sm text-white/80">

                        Bookmarked

                      </span>

                    </div>



                    <div>

                      <p className="text-2xl font-black">250+</p>

                      <span className="text-sm text-white/80">

                        Comments

                      </span>

                    </div>

                  </div>

                </div>

              </div>

            </div>

            {/* CONTENT */}

            <div className="flex flex-col justify-center p-8 lg:p-12">

              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-green-200 bg-green-100 px-5 py-2 text-sm font-semibold text-green-700">

                <BadgeCheck size={16} />

                Featured Guide

              </div>



              <h2 className="mt-6 text-4xl font-black leading-tight text-slate-900 transition group-hover:text-sky-700">

                {featuredArticle.title}

              </h2>



              <p className="mt-4 leading-8 text-slate-600">

                {featuredArticle.description}

              </p>



              {/* Metadata */}



              <div className="mt-8 flex flex-wrap gap-6 text-sm text-slate-500">

                <div className="flex items-center gap-2">

                  <UserCircle2 size={18} />

                  {featuredArticle.author}

                </div>



                <div className="flex items-center gap-2">

                  <CalendarDays size={18} />

                  {featuredArticle.date}

                </div>



                <div className="flex items-center gap-2">

                  <Clock3 size={18} />

                  {featuredArticle.readTime}

                </div>



                <div className="flex items-center gap-2">

                  <Eye size={18} />

                  {featuredArticle.views} Views

                </div>

              </div>



              {/* CTA */}



              <div className="mt-6 flex flex-wrap gap-4">

                <button className="flex items-center gap-2 rounded-2xl bg-linear-to-r from-blue-600 to-indigo-600 px-8 py-4 font-semibold text-white hover:-translate-y-1

hover:shadow-xl

active:translate-y-0

transition-all

duration-300">

                  Read Full Article

                  <ArrowRight size={18} />

                </button>



                <button className="flex items-center gap-2 rounded-2xl border border-slate-200 px-7 py-4 font-semibold text-slate-700 hover:-translate-y-1

hover:shadow-xl

active:translate-y-0

transition-all

duration-300 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-500">

                  <Bookmark size={18} />

                  Save for Later

                </button>

              </div>



              {/* Bottom Tags */}



              <div className="mt-8 flex flex-wrap gap-3">

                {[

                  "Scholarships",

                  "Visa Guide",

                  "PR Pathway",

                  "Universities",

                  "Student Life",

                ].map((tag) => (

                  <span

                    key={tag}

                    className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-blue-600 hover:text-white"

                  >

                    #{tag}

                  </span>

                ))}

              </div>

            </div>

          </div>

        </div> 

) : (

  <div className="flex min-h-105 flex-col items-center justify-center rounded-[34px] border border-dashed border-slate-300 bg-slate-50 text-center">



    <Search size={60} className="text-slate-300" />



    <h2 className="mt-6 text-3xl font-bold text-slate-800">

      No Articles Found

    </h2>



    <p className="mt-3 max-w-md text-slate-500">

      We couldn't find any articles matching "

      <span className="font-semibold">{search}</span>".

      Try another keyword.

    </p>



    <button

      onClick={() => setSearch("")}

      className="mt-8 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"

    >

      Clear Search

    </button>



  </div>

)}

        {/* Small Featured Cards */}

        <div className="flex flex-col gap-6 items-center">
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {smallArticles.map((article) => (
              <div
                key={article.id}
                className="group rounded-3xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-2 hover:border-blue-100 hover:shadow-xl"
              >
                <span className="rounded-full border border-blue-200 bg-blue-100 px-3 py-1 text-xs font-semibold text-sky-600">
                  {article.category}
                </span>

                <h3 className="mt-5 text-xl font-bold text-slate-900 transition group-hover:text-blue-600">
                  {article.title}
                </h3>

                <div className="mt-6 flex items-center justify-between">
                  <span className="text-sm text-slate-500">
                    {article.readTime}
                  </span>

                  <button className="flex items-center gap-2 font-semibold text-blue-600 transition hover:gap-3">
                    Read
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-100 px-5 py-2 text-sm font-semibold text-sky-600 transition hover:bg-blue-600 hover:text-white">
            View All Articles
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Blog;