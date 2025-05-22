import React, { useEffect } from "react";

interface PopUpProps {
    openPopUp: boolean;
    closePopUp: () => void;
    imageUrl?: string;
}

const PopUp: React.FC<PopUpProps> = ({ openPopUp, closePopUp, imageUrl }) => {
    const handleClosePopUp = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target instanceof HTMLElement && e.target.id === "ModelContainer") {
            closePopUp();
        }
    };

    // Khóa cuộn khi popup mở
    useEffect(() => {
        if (openPopUp) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }

        // Clean up khi unmount
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [openPopUp]);

    if (!openPopUp) return null;

    return (
        <div
            id="ModelContainer"
            onClick={handleClosePopUp}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-xs"
        >
            <div className="rounded-lg bg-none p-5 shadow-lg">
                <div className="text-center">
                    <img src={imageUrl} alt="Popup" className="max-h-[70vh] w-full rounded object-contain" />
                </div>
                <div className="mt-4 text-center text-white select-none">Click anywhere outside the image to close</div>
            </div>
        </div>
    );
};

export default PopUp;
