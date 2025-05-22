import React, { useState } from "react";
import type { Image } from "../type/types";
import PopUp from "./PopUp";

type ImageCardProps = {
    cards: Image[];
};

const ImageCard: React.FC<ImageCardProps> = ({ cards }) => {
    const [open, setOpen] = useState<boolean>(false);
    const [selectedImage, setSelectedImage] = useState<Image | null>(null);

    const openPopUp = (image: Image) => {
        setSelectedImage(image);
        setOpen(true);
    };

    const closePopUp = () => {
        setOpen(false);
        setSelectedImage(null);
    };

    return (
        <div>
            <section className="bg-gray-2 dark:bg-dark mt-5">
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
                        {cards.map((card, index) => (
                            <div key={index} className="">
                                <div className="shadow-1 hover:shadow-3 mb-10 flex flex-col overflow-hidden rounded-lg bg-[#1B2532] duration-300">
                                    <div className="h-52 overflow-hidden">
                                        <img
                                            src={card.signedUrl}
                                            alt="card image"
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <div className="min-h-xs flex h-40 flex-col p-8 text-center sm:p-9 md:p-7 xl:p-9">
                                        <h3>
                                            <a className="mb-4 block text-xl font-semibold text-white">
                                                {card.fileName.slice(23)}
                                            </a>
                                        </h3>
                                        <p className="flex flex-wrap items-center justify-center text-gray-500">
                                            {card.labels.map((label) => label.description).join(", ")}
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-center pb-5">
                                        <div className="flex flex-row space-x-5">
                                            <button
                                                onClick={() => openPopUp(card)}
                                                className="cursor-pointer rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
                                            >
                                                View
                                            </button>
                                            <button className="cursor-pointer rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700">
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                {selectedImage && (
                                    <PopUp
                                        openPopUp={open}
                                        closePopUp={closePopUp}
                                        imageUrl={selectedImage.signedUrl}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ImageCard;
