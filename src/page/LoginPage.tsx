import { signInWithPopup } from "firebase/auth";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider } from "../../src/config/firebase";

const AuthForm: React.FC = () => {
    const [message, setMessage] = useState<string>("");
    const navigate = useNavigate();

    const handleGoogleLogin = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            setMessage("Login via Google successfully!");
            navigate("/");
        } catch (error: unknown) {
            if (error instanceof Error) setMessage(error.message);
        }
    };

    return (
        <section className="flex flex-col items-center bg-[#0F172A] py-15">
            <div className="container">
                <div className="relative mx-auto w-full max-w-lg rounded-[20px] bg-white/10 p-4 shadow-lg">
                    <div className="border-dark-6 relative z-10 flex min-h-[328px] items-center justify-center rounded-2xl border border-dashed bg-white/10 p-6 md:p-10">
                        <div className="w-full text-center">
                            <div className="mx-auto w-full max-w-[290px] text-center">
                                <h3 className="mb-10 text-4xl font-bold text-white">LOG IN</h3>
                                <p className="mx-auto mb-5 text-base text-gray-400">
                                    Continue by signing in with your Google account
                                </p>

                                <div className="mx-auto my-5 flex w-full max-w-[210px] items-center justify-center">
                                    <div className="block h-px w-full bg-white/10"></div>

                                    <div className="block h-px w-full bg-white/10"></div>
                                </div>
                                <div className="max-w-sm px-6 sm:px-0">
                                    <button
                                        type="button"
                                        onClick={handleGoogleLogin}
                                        className="mr-2 mb-2 inline-flex w-full cursor-pointer items-center justify-between rounded-lg bg-[#4285F4] px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-[#4285F4]/90 focus:ring-4 focus:ring-[#4285F4]/50 focus:outline-none"
                                    >
                                        <svg
                                            className="mr-2 -ml-1 h-4 w-4"
                                            aria-hidden="true"
                                            focusable="false"
                                            data-prefix="fab"
                                            data-icon="google"
                                            role="img"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 488 512"
                                        >
                                            <path
                                                fill="currentColor"
                                                d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                                            ></path>
                                        </svg>
                                        Continue with Google<div></div>
                                    </button>
                                    {message == "Login via Google successfully!" ? (
                                        <div className="mt-4 text-sm text-green-500">{message}</div>
                                    ) : (
                                        <div className="mt-4 text-sm text-red-500">{message}</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AuthForm;
