import { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
    ArrowRight,
    Eye,
    EyeOff,
    GraduationCap,
    LockKeyhole,
    Mail,
    Sparkles,
    CheckCircle2,
    ShieldCheck,
    Globe2,
} from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";

const Login = () => {
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Add your authentication logic here
        console.log("Login data:", {
            ...formData,
            rememberMe,
        });

        // Example:
        // navigate("/dashboard");
        navigate("/");
    };

    return (
        <main className="min-h-screen bg-[#f4faff] px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-7xl items-center justify-center">
                <div className="grid w-full overflow-hidden rounded-4xl border border-sky-100 bg-white shadow-[0_25px_80px_rgba(14,165,233,0.12)] lg:grid-cols-[1.05fr_0.95fr]">

                    {/* ================================================= */}
                    {/* LEFT - BRAND / INFORMATION PANEL */}
                    {/* ================================================= */}

                    <section className="relative hidden overflow-hidden bg-linear-to-br from-sky-600 via-sky-500 to-cyan-400 p-10 lg:flex xl:p-14">
                        
                        {/* Decorative circles */}
                        <div className="absolute -right-28 -top-28 h-80 w-80 rounded-full bg-white/10" />
                        <div className="absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-cyan-300/10" />
                        <div className="absolute right-20 top-1/2 h-32 w-32 rounded-full bg-white/5" />

                        <div className="relative z-10 flex w-full flex-col justify-between">

                            {/* Brand */}
                            <div>
                                <Link
                                    to="/"
                                    className="inline-flex items-center gap-3"
                                >
                                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-lg shadow-sky-700/20">
                                        <GraduationCap
                                            size={25}
                                            className="text-sky-600"
                                        />
                                    </div>

                                    <div>
                                        <h1 className="text-2xl font-extrabold tracking-tight text-white">
                                            Scholar<span className="text-cyan-100">X</span>
                                        </h1>

                                        <p className="text-[11px] font-medium tracking-wide text-sky-100">
                                            SMART SCHOLARSHIP GUIDANCE
                                        </p>
                                    </div>
                                </Link>
                            </div>

                            {/* Main content */}
                            <div className="my-auto max-w-xl py-8">

                                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-md shadow-sm hover:shadow-lg hover:scale-101 transition-all duration-300">
                                    <Sparkles size={15} />
                                    AI-powered scholarship guidance
                                </div>

                                <h2 className="text-4xl font-extrabold leading-[1.15] tracking-tight text-white xl:text-5xl">
                                    Your scholarship journey starts{" "}
                                    <span className="text-cyan-100">
                                        here.
                                    </span>
                                </h2>

                                <p className="mt-6 max-w-lg text-base leading-7 text-sky-50/90">
                                    Discover scholarships, understand your
                                    eligibility, track opportunities, and
                                    move closer to studying at your dream
                                    destination.
                                </p>

                                {/* Feature cards */}
                                <div className="mt-9 space-y-4">

                                    <div className="flex items-center gap-4 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15">
                                            <CheckCircle2
                                                size={20}
                                                className="text-white"
                                            />
                                        </div>

                                        <div>
                                            <p className="font-semibold text-white">
                                                Smart Eligibility Analysis
                                            </p>

                                            <p className="mt-0.5 text-sm text-sky-100/80">
                                                Understand which scholarships
                                                match your profile.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15">
                                            <Globe2
                                                size={20}
                                                className="text-white"
                                            />
                                        </div>

                                        <div>
                                            <p className="font-semibold text-white">
                                                Global Opportunities
                                            </p>

                                            <p className="mt-0.5 text-sm text-sky-100/80">
                                                Explore opportunities across
                                                leading study destinations.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15">
                                            <ShieldCheck
                                                size={20}
                                                className="text-white"
                                            />
                                        </div>

                                        <div>
                                            <p className="font-semibold text-white">
                                                Your Journey, Organized
                                            </p>

                                            <p className="mt-0.5 text-sm text-sky-100/80">
                                                Keep your scholarship planning
                                                in one place.
                                            </p>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            {/* Bottom */}
                            <div className="flex items-center justify-between border-t border-white/15 pt-6">
                                <p className="text-sm text-sky-100/90">
                                    Plan. Track. Submit.
                                </p>

                                <div className="flex items-center gap-1.5 text-sm font-medium text-white">
                                    <Sparkles size={14} />
                                    ScholarX AI
                                </div>
                            </div>
                        </div>
                    </section>


                    {/* ================================================= */}
                    {/* RIGHT - LOGIN FORM */}
                    {/* ================================================= */}

                    <section className="flex items-center justify-center p-6 sm:p-10 lg:p-12 xl:p-14">

                        <div className="w-full max-w-md">

                            {/* Mobile brand */}
                            <div className="mb-10 flex justify-center lg:hidden">
                                <Link
                                    to="/"
                                    className="inline-flex items-center gap-3"
                                >
                                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50">
                                        <GraduationCap
                                            size={25}
                                            className="text-sky-600"
                                        />
                                    </div>

                                    <div>
                                        <h1 className="text-2xl font-extrabold tracking-tight text-slate-800">
                                            Scholar<span className="text-sky-500">X</span>
                                        </h1>

                                        <p className="text-[10px] font-medium tracking-wide text-slate-400">
                                            AI-POWERED SCHOLARSHIP GUIDANCE SYSTEM
                                        </p>
                                    </div>
                                </Link>
                            </div>


                            {/* Heading */}
                            <div className="mb-8 flex flex-col items-center justify-center">
                                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50">
                                    <LockKeyhole
                                        size={21}
                                        className="text-sky-600"
                                    />
                                </div>

                                <h2 className="text-3xl font-extrabold tracking-tight text-slate-800 sm:text-4xl">
                                    Welcome back
                                </h2>

                                <p className="mt-2 text-sm leading-6 text-slate-500">
                                    Sign in to continue your scholarship
                                    journey with ScholarX.
                                </p>
                            </div>


                            {/* Form */}
                            <form
                                onSubmit={handleSubmit}
                                className="space-y-5"
                            >

                                {/* Email */}
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="mb-2 block text-sm font-semibold text-slate-700"
                                    >
                                        Email address
                                    </label>

                                    <div className="group relative">
                                        <Mail
                                            size={19}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-sky-500"
                                        />

                                        <input
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="you@example.com"
                                            required
                                            autoComplete="email"
                                            className="
                                                h-13 w-full rounded-xl
                                                border border-slate-200
                                                bg-slate-50/70
                                                pl-11 pr-4
                                                text-sm text-slate-800
                                                outline-none
                                                transition-all
                                                placeholder:text-slate-400
                                                hover:border-sky-200
                                                focus:border-sky-400
                                                focus:bg-white
                                                focus:ring-4
                                                focus:ring-sky-100
                                            "
                                        />
                                    </div>
                                </div>


                                {/* Password */}
                                <div>
                                    <div className="mb-2 flex items-center justify-between">
                                        <label
                                            htmlFor="password"
                                            className="block text-sm font-semibold text-slate-700"
                                        >
                                            Password
                                        </label>

                                        <Link
                                            to="/forgot-password"
                                            className="text-xs font-semibold text-sky-600 transition-colors hover:text-sky-700"
                                        >
                                            Forgot password?
                                        </Link>
                                    </div>

                                    <div className="group relative">
                                        <LockKeyhole
                                            size={19}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-sky-500"
                                        />

                                        <input
                                            id="password"
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="Enter your password"
                                            required
                                            autoComplete="current-password"
                                            className="
                                                h-13 w-full rounded-xl
                                                border border-slate-200
                                                bg-slate-50/70
                                                pl-11 pr-12
                                                text-sm text-slate-800
                                                outline-none
                                                transition-all
                                                placeholder:text-slate-400
                                                hover:border-sky-200
                                                focus:border-sky-400
                                                focus:bg-white
                                                focus:ring-4
                                                focus:ring-sky-100
                                            "
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword(
                                                    (prev) => !prev
                                                )
                                            }
                                            className="
                                                absolute right-3
                                                top-1/2
                                                flex h-9 w-9
                                                -translate-y-1/2
                                                items-center justify-center
                                                rounded-lg
                                                text-slate-400
                                                transition
                                                hover:bg-sky-50
                                                hover:text-sky-600
                                            "
                                            aria-label={
                                                showPassword
                                                    ? "Hide password"
                                                    : "Show password"
                                            }
                                        >
                                            {showPassword ? (
                                                <EyeOff size={18} />
                                            ) : (
                                                <Eye size={18} />
                                            )}
                                        </button>
                                    </div>
                                </div>


                                {/* Remember */}
                                <div className="flex items-center justify-between pt-1">

                                    <label className="flex cursor-pointer items-center gap-2.5">
                                        <input
                                            type="checkbox"
                                            checked={rememberMe}
                                            onChange={(e) =>
                                                setRememberMe(
                                                    e.target.checked
                                                )
                                            }
                                            className="
                                                h-4 w-4
                                                cursor-pointer
                                                rounded
                                                border-slate-300
                                                text-sky-600
                                                accent-sky-500
                                                focus:ring-sky-400
                                            "
                                        />

                                        <span className="text-sm text-slate-500">
                                            Remember me
                                        </span>
                                    </label>

                                    <span className="flex items-center gap-1.5 text-xs text-slate-400">
                                        <ShieldCheck size={14} />
                                        Secure login
                                    </span>
                                </div>


                                {/* Login button */}
                                <button
                                    type="submit"
                                    className="
                                        group
                                        flex h-13 w-full
                                        items-center justify-center gap-2
                                        rounded-xl
                                        bg-sky-500
                                        px-5
                                        text-sm font-bold text-white
                                        shadow-lg
                                        shadow-sky-500/20
                                        transition-all
                                        duration-200
                                        hover:bg-sky-600
                                        hover:shadow-xl
                                        hover:shadow-sky-500/25
                                        active:scale-[0.99]
                                    "
                                >
                                    Sign in

                                    <ArrowRight
                                        size={18}
                                        className="transition-transform duration-200 group-hover:translate-x-1"
                                    />
                                </button>

                            </form>


                            {/* Divider */}
                            <div className="my-7 flex items-center gap-4">
                                <div className="h-px flex-1 bg-slate-200" />

                                <span className="text-xs font-medium text-slate-400">
                                    OR CONTINUE WITH
                                </span>

                                <div className="h-px flex-1 bg-slate-200" />
                            </div>


                            {/* Social buttons */}
<div className="grid grid-cols-2 gap-3">
    {/* Google */}
    <button
        type="button"
        className="
            flex h-12 items-center
            justify-center gap-2.5
            rounded-xl
            border border-slate-200
            bg-white
            text-sm font-semibold
            text-slate-600
            transition-all duration-200
            hover:border-sky-200
            hover:bg-sky-50/50
            hover:shadow-sm
            active:scale-[0.98]
        "
    >
        <FcGoogle size={21} />
        <span>Google</span>
    </button>

    {/* Facebook */}
    <button
        type="button"
        className="
            flex h-12 items-center
            justify-center gap-2.5
            rounded-xl
            border border-slate-200
            bg-white
            text-sm font-semibold
            text-slate-600
            transition-all duration-200
            hover:border-sky-200
            hover:bg-sky-50/50
            hover:shadow-sm
            active:scale-[0.98]
        "
    >
        <FaFacebookF
            size={19}
            className="text-[#1877F2]"
        />
        <span>Facebook</span>
    </button>
</div>


                            {/* Register */}
                            <p className="mt-8 text-center text-sm text-slate-500">
                                Don't have a ScholarX account?{" "}
                                <Link
                                    to="/register"
                                    className="font-bold text-sky-600 transition-colors hover:text-sky-700"
                                >
                                    Create an account
                                </Link>
                            </p>


                            {/* Footer */}
                            <p className="mt-8 text-center text-[11px] leading-5 text-slate-400">
                                By continuing, you agree to ScholarX's{" "}
                                <Link
                                    to="/terms-of-service"
                                    className="font-medium text-slate-500 hover:text-sky-600"
                                >
                                    Terms of Service
                                </Link>{" "}
                                and{" "}
                                <Link
                                    to="/privacy-policy"
                                    className="font-medium text-slate-500 hover:text-sky-600"
                                >
                                    Privacy Policy
                                </Link>
                                .
                            </p>

                        </div>
                    </section>

                </div>
            </div>
        </main>
    );
};

export default Login;