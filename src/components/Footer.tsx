import React from "react";

const Footer: React.FC = () => {
    return (
        <div>
            <div className="flex flex-col items-center bg-white pt-10 dark:bg-[#0F172A]">
                <h6 className="mb-6 flex items-center text-center text-4xl font-bold text-white">OUR PARTNER</h6>
                <a href="https://cloud.google.com/" target="_blank" className="block py-3">
                    <img src="/gcp.svg" alt="gcp" className="h-xs w-xs" />
                </a>
            </div>
        </div>
    );
};

export default Footer;
