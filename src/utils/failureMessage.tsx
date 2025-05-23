import React, { useEffect, useState } from "react";
import type { Message } from "../type/types";

const FailureMessage: React.FC<Message> = ({ message, duration }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
        }, duration);

        return () => clearTimeout(timer);
    }, [duration]);

    if (!visible) return null;

    return (
        <div className="fixed top-4 left-1/2 z-[9999] inline-flex -translate-x-1/2 rounded-lg bg-red-100 px-[18px] py-4 shadow-lg">
            <p className="flex items-center text-sm font-medium text-red-700">
                <span className="mr-3 flex h-5 w-5 items-center justify-center rounded-full bg-red-500">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="white" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_961_15641)">
                            <path
                                d="M6.00002 0.337494C2.86877 0.337494 0.337524 2.86874 0.337524 5.99999C0.337524 9.13124 2.86877 11.6812 6.00002 11.6812C9.13128 11.6812 11.6813 9.13124 11.6813 5.99999C11.6813 2.86874 9.13128 0.337494 6.00002 0.337494ZM6.00002 10.8375C3.33752 10.8375 1.18127 8.66249 1.18127 5.99999C1.18127 3.33749 3.33752 1.18124 6.00002 1.18124C8.66252 1.18124 10.8375 3.35624 10.8375 6.01874C10.8375 8.66249 8.66252 10.8375 6.00002 10.8375Z"
                                fill="white"
                            />
                            <path
                                d="M9.5 3.205 L8.795 2.5 L6 5.295 L3.205 2.5 L2.5 3.205 L5.295 6 L2.5 8.795 L3.205 9.5 L6 6.705 L8.795 9.5 L9.5 8.795 L6.705 6 Z"
                                fill="white"
                            />
                        </g>
                        <defs>
                            <clipPath id="clip0_961_15641">
                                <rect width="12" height="12" fill="white" />
                            </clipPath>
                        </defs>
                    </svg>
                </span>
                {message}
            </p>
        </div>
    );
};

export default FailureMessage;
