import { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
    ArrowRight,
    CheckCircle2,
    Eye,
    EyeOff,
    Globe2,
    GraduationCap,
    LockKeyhole,
    Mail,
    ShieldCheck,
    Sparkles,
    UserRound,
} from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";

const Register = () => {
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(false);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
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

        if (!agreeTerms) {
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            return;
        }

        // Add your registration/authentication logic here

        // After successful registration
        navigate("/logIn");
    };

    return (
        <main className="min-h-screen bg-[#f4faff] px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-7xl items-center justify-center">
                <div
                    className="
                        grid w-full overflow-hidden
                        rounded-4xl
                        border border-sky-100
                        bg-white
                        shadow-[0_25px_80px_rgba(14,165,233,0.12)]
                        lg:grid-cols-[0.95fr_1.05fr]
                    "
                >
                    {/* ================================================= */}
                    {/* LEFT - REGISTER FORM */}
                    {/* ================================================= */}

                    <section className="flex items-center justify-center p-6 sm:p-10 lg:p-12 xl:p-14">
                        <div className="w-full max-w-md">

                            {/* Mobile brand */}
                            <div className="mb-8 flex justify-center lg:hidden">
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
                                            Scholar
                                            <span className="text-sky-500">
                                                X
                                            </span>
                                        </h1>

                                        <p className="text-[10px] font-medium tracking-wide text-slate-400">
                                            AI-POWERED SCHOLARSHIP GUIDANCE SYSTEM
                                        </p>
                                    </div>
                                </Link>
                            </div>

                            {/* Heading */}
                            <div className="mb-7 flex flex-col items-center justify-center">
                                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50">
                                    <UserRound
                                        size={21}
                                        className="text-sky-600"
                                    />
                                </div>

                                <h2 className="text-3xl font-extrabold tracking-tight text-slate-800 sm:text-4xl">
                                    Create your account
                                </h2>

                                <p className="mt-2 text-sm leading-6 text-slate-500">
                                    Start discovering scholarships that match
                                    your academic journey.
                                </p>
                            </div>

                            {/* Form */}
                            <form
                                onSubmit={handleSubmit}
                                className="space-y-4"
                            >
                                {/* First + Last name */}
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                                    {/* First name */}
                                    <div>
                                        <label
                                            htmlFor="firstName"
                                            className="mb-2 block text-sm font-semibold text-slate-700"
                                        >
                                            First name
                                        </label>

                                        <div className="group relative">
                                            <UserRound
                                                size={18}
                                                className="
                                                    absolute left-4 top-1/2
                                                    -translate-y-1/2
                                                    text-slate-400
                                                    transition-colors
                                                    group-focus-within:text-sky-500
                                                "
                                            />

                                            <input
                                                id="firstName"
                                                type="text"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                required
                                                autoComplete="given-name"
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

                                    {/* Last name */}
                                    <div>
                                        <label
                                            htmlFor="lastName"
                                            className="mb-2 block text-sm font-semibold text-slate-700"
                                        >
                                            Last name
                                        </label>

                                        <div className="group relative">
                                            <UserRound
                                                size={18}
                                                className="
                                                    absolute left-4 top-1/2
                                                    -translate-y-1/2
                                                    text-slate-400
                                                    transition-colors
                                                    group-focus-within:text-sky-500
                                                "
                                            />

                                            <input
                                                id="lastName"
                                                type="text"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleChange}
                                                required
                                                autoComplete="family-name"
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
                                </div>

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
                                            className="
                                                absolute left-4 top-1/2
                                                -translate-y-1/2
                                                text-slate-400
                                                transition-colors
                                                group-focus-within:text-sky-500
                                            "
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
                                    <label
                                        htmlFor="password"
                                        className="mb-2 block text-sm font-semibold text-slate-700"
                                    >
                                        Password
                                    </label>

                                    <div className="group relative">
                                        <LockKeyhole
                                            size={19}
                                            className="
                                                absolute left-4 top-1/2
                                                -translate-y-1/2
                                                text-slate-400
                                                transition-colors
                                                group-focus-within:text-sky-500
                                            "
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
                                            placeholder="Create a password"
                                            required
                                            minLength={6}
                                            autoComplete="new-password"
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
                                                absolute right-3 top-1/2
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

                                {/* Confirm password */}
                                <div>
                                    <label
                                        htmlFor="confirmPassword"
                                        className="mb-2 block text-sm font-semibold text-slate-700"
                                    >
                                        Confirm password
                                    </label>

                                    <div className="group relative">
                                        <LockKeyhole
                                            size={19}
                                            className="
                                                absolute left-4 top-1/2
                                                -translate-y-1/2
                                                text-slate-400
                                                transition-colors
                                                group-focus-within:text-sky-500
                                            "
                                        />

                                        <input
                                            id="confirmPassword"
                                            type={
                                                showConfirmPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            name="confirmPassword"
                                            value={
                                                formData.confirmPassword
                                            }
                                            onChange={handleChange}
                                            placeholder="Confirm your password"
                                            required
                                            autoComplete="new-password"
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
                                                setShowConfirmPassword(
                                                    (prev) => !prev
                                                )
                                            }
                                            className="
                                                absolute right-3 top-1/2
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
                                                showConfirmPassword
                                                    ? "Hide password"
                                                    : "Show password"
                                            }
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff size={18} />
                                            ) : (
                                                <Eye size={18} />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Terms */}
                                <div className="pt-1">
                                    <label className="flex cursor-pointer items-start gap-3">
                                        <input
                                            type="checkbox"
                                            checked={agreeTerms}
                                            onChange={(e) =>
                                                setAgreeTerms(
                                                    e.target.checked
                                                )
                                            }
                                            required
                                            className="
                                                mt-0.5 h-4 w-4
                                                shrink-0 cursor-pointer
                                                rounded
                                                border-slate-300
                                                accent-sky-500
                                                focus:ring-sky-400
                                            "
                                        />

                                        <span className="text-xs leading-5 text-slate-500">
                                            I agree to ScholarX's{" "}
                                            <Link
                                                to="/terms"
                                                className="font-semibold text-sky-600 hover:text-sky-700"
                                            >
                                                Terms of Service
                                            </Link>{" "}
                                            and{" "}
                                            <Link
                                                to="/privacy-policy"
                                                className="font-semibold text-sky-600 hover:text-sky-700"
                                            >
                                                Privacy Policy
                                            </Link>
                                            .
                                        </span>
                                    </label>
                                </div>

                                {/* Register button */}
                                <button
                                    type="submit"
                                    className="
                                        group mt-1
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
                                    Create account

                                    <ArrowRight
                                        size={18}
                                        className="transition-transform duration-200 group-hover:translate-x-1"
                                    />
                                </button>
                            </form>

                            {/* Divider */}
                            <div className="my-6 flex items-center gap-4">
                                <div className="h-px flex-1 bg-slate-200" />

                                <span className="text-xs font-medium text-slate-400">
                                    OR SIGN UP WITH
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
                                        size={18}
                                        className="text-[#1877F2]"
                                    />

                                    <span>Facebook</span>
                                </button>
                            </div>

                            {/* Login */}
                            <p className="mt-7 text-center text-sm text-slate-500">
                                Already have a ScholarX account?{" "}
                                <Link
                                    to="/login"
                                    className="font-bold text-sky-600 transition-colors hover:text-sky-700"
                                >
                                    Sign in
                                </Link>
                            </p>

                            {/* Security */}
                            <div className="mt-6 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                                <ShieldCheck size={14} />
                                Your information is securely protected
                            </div>
                        </div>
                    </section>

                    {/* ================================================= */}
                    {/* RIGHT - BRAND PANEL */}
                    {/* ================================================= */}

                    <section className="relative hidden overflow-hidden bg-linear-to-br from-sky-600 via-sky-500 to-cyan-400 p-10 lg:flex lg:items-center xl:p-14">

                        {/* Decorative circles */}
                        <div className="absolute -right-28 -top-28 h-80 w-80 rounded-full bg-white/10" />

                        <div className="absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-cyan-300/10" />

                        <div className="absolute right-16 top-1/2 h-32 w-32 rounded-full bg-white/5" />

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
                                            Scholar
                                            <span className="text-cyan-100">
                                                X
                                            </span>
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
                                    Begin your scholarship journey
                                </div>
                                

                                <h2 className="text-4xl font-extrabold leading-[1.15] tracking-tight text-white xl:text-5xl">
                                    One account.
                                    <br />
                                    <span className="text-cyan-100">
                                        Endless possibilities.
                                    </span>
                                </h2>

                                <p className="mt-6 max-w-lg text-base leading-7 text-sky-50/90">
                                    Create your ScholarX account and get a
                                    smarter way to discover, evaluate, and
                                    manage scholarship opportunities.
                                </p>

                                {/* Benefits */}
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
                                                Find Your Best Matches
                                            </p>

                                            <p className="mt-0.5 text-sm text-sky-100/80">
                                                Discover scholarships based on
                                                your profile.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15">
                                            <Sparkles
                                                size={20}
                                                className="text-white"
                                            />
                                        </div>

                                        <div>
                                            <p className="font-semibold text-white">
                                                AI-Powered Guidance
                                            </p>

                                            <p className="mt-0.5 text-sm text-sky-100/80">
                                                Get personalized insights about
                                                your eligibility.
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
                                                Explore Global Destinations
                                            </p>

                                            <p className="mt-0.5 text-sm text-sky-100/80">
                                                Explore opportunities around
                                                the world.
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
                </div>
            </div>
        </main>
    );
};

export default Register;