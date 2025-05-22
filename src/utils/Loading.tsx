import React from "react";

const Loading: React.FC = () => {
    return (
        <div>
            <div className="h-full w-full bg-[#0F172A] opacity-100">
                <link
                    rel="stylesheet"
                    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.10.0/css/all.min.css"
                    integrity="sha512-PgQMlq+nqFLV4ylk1gwUOgm6CtIIXkKwaIHp/PAIWHzig/lKZSEGKEysh0TCVbHJXCLN7WetD8TFecIky75ZfQ=="
                    crossOrigin="anonymous"
                    referrerPolicy="no-referrer"
                />
                <div className="flex items-center justify-center py-[30vh]">
                    <div className="fas fa-circle-notch fa-spin fa-5x text-blue-700"></div>
                </div>
            </div>
        </div>
    );
};

export default Loading;
