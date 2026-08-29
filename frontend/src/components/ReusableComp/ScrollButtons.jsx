import { ArrowDown, ArrowUp } from "lucide-react";

const ScrollButtons = () => {
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const scrollToBottom = () => {
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: "smooth",
        });
    };

    const buttonClass =
        "group flex h-13 w-13 items-center justify-center rounded-full " +
        "border border-blue-200/70 bg-white/70 text-blue-500 " +
        "shadow-[0_10px_30px_rgba(14,165,233,0.16)] backdrop-blur-sm " +
        "transition-all duration-300 " +
        "hover:border-white/90 hover:bg-blue-500 hover:text-white " +
        "hover:shadow-[0_0px_30px_rgba(14,165,233,0.66)] " +
        "active:scale-90";

    return (
        <div
            className="
                fixed
                bottom-5 right-5
                sm:bottom-6 sm:right-6
                lg:bottom-7 lg:right-7
                z-50
                flex flex-col gap-2
            "
        >
            {/* Scroll to Top */}
            <button
                type="button"
                onClick={scrollToTop}
                aria-label="Scroll to top"
                className={buttonClass}
            >
                <ArrowUp
                    size={18}
                    strokeWidth={2.3}
                    className="transition-transform duration-300 group-hover:-translate-y-0.5"
                />
            </button>

            {/* Scroll to Bottom */}
            <button
                type="button"
                onClick={scrollToBottom}
                aria-label="Scroll to bottom"
                className={buttonClass}
            >
                <ArrowDown
                    size={18}
                    strokeWidth={2.3}
                    className="transition-transform duration-300 group-hover:translate-y-0.5"
                />
            </button>
        </div>
    );
};

export default ScrollButtons;