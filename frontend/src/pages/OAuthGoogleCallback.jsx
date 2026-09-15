import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function OAuthGoogleCallback() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [message, setMessage] = useState(
        "Signing you in with Google..."
    );

    useEffect(() => {
        const exchangeCode = async () => {
            const code = searchParams.get("code");

            if (!code) {
                setMessage("Google authentication code is missing.");
                return;
            }

            try {
                const response = await fetch(
                    `${API_BASE_URL}/api/auth/google/exchange`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            code,
                        }),
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    let errorMessage = "Google login failed.";

                    if (typeof data.detail === "string") {
                        errorMessage = data.detail;
                    } else if (Array.isArray(data.detail)) {
                        errorMessage = data.detail
                            .map((item) => item.msg)
                            .join(", ");
                    } else if (typeof data.message === "string") {
                        errorMessage = data.message;
                    }

                    throw new Error(errorMessage);
                }   

                if (!data.token) {
                    throw new Error(
                        "Authentication token was not returned."
                    );
                }

                // Save ScholarX JWT
                localStorage.setItem(
                    "token",
                    data.token
                );

                // Save user information if returned
                if (data.user) {
                    localStorage.setItem(
                        "user",
                        JSON.stringify(data.user)
                    );
                }

                setMessage(
                    "Google login successful. Redirecting..."
                );

                navigate("/", {
                    replace: true,
                });

            } catch (error) {
                console.error(
                    "Google OAuth error:",
                    error
                );

                setMessage(
                    error.message ||
                    "Google login failed."
                );
            }
        };

        exchangeCode();
    }, [navigate, searchParams]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
                <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-sky-50">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-sky-600 border-t-transparent" />
                </div>

                <h1 className="text-xl font-bold text-slate-800">
                    Google Sign In
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                    {message}
                </p>
            </div>
        </div>
    );
}