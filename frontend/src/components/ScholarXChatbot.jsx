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

        // Temporary demo response
        setTimeout(() => {
            const aiMessage = {
                id: crypto.randomUUID(),
                role: "assistant",
                content:
                    "I'm currently in demo mode. Soon, ScholarX AI will be connected to your scholarship database and AI engine to give you personalized answers.",
                time: new Date(),
            };

            setMessages((prev) => [...prev, aiMessage]);
            setIsTyping(false);
        }, 1000);
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

        setIsDragging(true);

        slider.setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e) => {
        if (!isDragging) return;

        const slider = suggestionsRef.current;

        if (!slider) return;

        const currentX = e.clientX;
        const distance = currentX - dragState.current.lastX;

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

        cancelAnimationFrame(dragState.current.animationFrame);

        dragState.current.animationFrame = requestAnimationFrame(animate);
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
                                                {message.content}
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
                                        onClick={() => {
                                            if (!isDragging) {
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