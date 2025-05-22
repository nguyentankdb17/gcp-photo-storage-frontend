import { getAuth, onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import type { Image } from "../type/types";
import Loading from "../utils/Loading";
import PopUp from "../utils/PopUp";
import SuccessMessage from "../utils/successMessage";

const Collections: React.FC = () => {
    const [images, setImages] = React.useState<Image[] | []>([]);
    const [loadingVisible, setLoadingVisible] = useState(false);

    const [open, setOpen] = useState<boolean>(false);
    const [selectedImage, setSelectedImage] = useState<Image | null>(null);
    const [messageVisible, setMessageVisible] = useState(false);
    const [message, setMessage] = useState("");
    const [noImages, setNoImages] = useState(false);

    const auth = getAuth();
    const user = auth.currentUser;

    const openPopUp = (image: Image) => {
        setSelectedImage(image);
        setOpen(true);
    };

    const closePopUp = () => {
        setOpen(false);
        setSelectedImage(null);
    };

    const downloadImage = async (imageUrl: string, filename: string) => {
        try {
            const response = await fetch(imageUrl, { mode: "cors" });
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();

            // Clean up the URL object
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Lỗi khi tải ảnh:", error);
        }
    };

    const copyURL = async (imageUrl: string) => {
        try {
            await navigator.clipboard.writeText(imageUrl);
            setMessageVisible(true);
            setMessage("URL copied to clipboard successfully!");
            setTimeout(() => {
                setMessageVisible(false);
            }, 3000);
        } catch (err) {
            console.error("Error copied:", err);
            alert("Can not copy the url.");
        }
    };

    const deleteImage = async (fileName: string) => {
        if (!user) {
            console.error("No user logged in");
            throw new Error("User not logged in");
        }
        const idToken = await user.getIdToken(); // Lấy token Firebase
        console.log("ID Token for upload:", idToken); // Debug token
        try {
            const url = `https://delete-image-function-432052083194.asia-southeast1.run.app?fileName=${fileName}`;
            const response = await fetch(url, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${idToken}`,
                },
            });
            if (!response.ok) {
                const text = await response.text();
                console.error("Server error:", response.status, text);
                return;
            }
            setMessageVisible(true);
            setMessage("Image deleted successfully!");
            setTimeout(() => {
                setMessageVisible(false);
            }, 3000);
            // Refresh the images after deletion
            images.filter((image) => image.fileName !== fileName);
            setImages((prevImages) => prevImages.filter((image) => image.fileName !== fileName));
        } catch (error) {
            console.error("Error deleting image:", error);
        }
    };

    const handleDelete = (fileName: string) => {
        if (window.confirm("Are you sure you want to delete this image?")) {
            deleteImage(fileName);
        }
    };

    //add the userId to see what images belong to the user command it to show all the old function
    useEffect(() => {
        const auth = getAuth();

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setLoadingVisible(true);

                try {
                    const idToken = await user.getIdToken();
                    console.log("ID Token:", idToken);
                    console.log("User ID:", user.uid);
                    console.log("user", user);

                    const response = await fetch(
                        "https://get-images-metadata-function-432052083194.asia-southeast1.run.app/",
                        {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${idToken}`,
                            },
                        },
                    );

                    if (!response.ok) {
                        const text = await response.text();
                        console.error("Server error:", response.status, text);
                        return;
                    }

                    const data = await response.json();
                    setImages(data);
                    if (data.length === 0) {
                        setNoImages(true);
                    }
                } catch (error) {
                    console.error("Error fetching images:", error);
                } finally {
                    setLoadingVisible(false);
                }
            } else {
                console.warn("User not authenticated");
            }
        });

        return () => unsubscribe(); // Dọn dẹp listener khi component unmount
    }, []);

    useEffect(() => {
        console.log(images);
    }, [images]);

    if (!user) {
        return (
            <div className="flex h-full items-center justify-center bg-[#0F172A] py-64">
                <h1 className="text-4xl font-bold text-white">PLEASE LOG IN TO VIEW YOUR COLLECTIONS.</h1>
            </div>
        );
    }

    if (noImages) {
        return (
            <div className="flex h-full items-center justify-center bg-[#0F172A] py-64">
                <h1 className="text-4xl font-bold text-white">YOU HAVEN'T UPLOADED ANY IMAGES YET.</h1>
            </div>
        );
    }

    return (
        <div>
            <div className="flex flex-col items-center justify-center bg-[#0F172A]">
                <div>
                    <h1 className="py-5 text-4xl font-bold text-white">Your Image Collections</h1>
                </div>

                <section className="bg-gray-2 dark:bg-dark mt-5">
                    <div className="container mx-auto">
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
                            {images.map((image) => (
                                <ImageCard
                                    key={image.fileName}
                                    image={image}
                                    openPopUp={openPopUp}
                                    downloadImage={downloadImage}
                                    copyURL={copyURL}
                                    handleDelete={handleDelete}
                                />
                            ))}
                        </div>
                    </div>
                </section>
                {selectedImage && <PopUp openPopUp={open} closePopUp={closePopUp} imageUrl={selectedImage.signedUrl} />}
                {messageVisible && <SuccessMessage message={message} duration={3000} />}
            </div>
            {loadingVisible && <Loading />}
        </div>
    );
};

type ImageCardProps = {
    image: Image;
    openPopUp: (image: Image) => void;
    downloadImage: (imageUrl: string, filename: string) => void;
    copyURL: (imageUrl: string) => void;
    handleDelete: (fileName: string) => void;
};

const ImageCard = (props: ImageCardProps) => {
    return (
        <div className="">
            <div className="shadow-1 hover:shadow-3 mb-10 flex flex-col overflow-hidden rounded-lg bg-[#1B2532] duration-300">
                <div className="h-52 overflow-hidden">
                    <img src={props.image.signedUrl} alt="card image" className="h-full w-full object-cover" />
                </div>
                <div className="min-h-xs flex h-40 flex-col p-8 text-center sm:p-9 md:p-7 xl:p-9">
                    <h3>
                        <a className="mb-4 block text-xl font-semibold text-white">{props.image.fileName.slice(23)}</a>
                    </h3>
                    <p className="flex flex-wrap items-center justify-center text-gray-500">
                        {props.image.labels.map((label) => label.description).join(", ")}
                    </p>
                </div>
                <div className="flex flex-col items-center pb-5">
                    <div className="flex flex-row space-x-5">
                        <button
                            onClick={() => props.openPopUp(props.image)}
                            title="View"
                            className="cursor-pointer rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em">
                                <path
                                    fill="currentColor"
                                    d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5M12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5s5 2.24 5 5s-2.24 5-5 5m0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3s3-1.34 3-3s-1.34-3-3-3"
                                ></path>
                            </svg>
                        </button>
                        <button
                            className="cursor-pointer rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
                            onClick={() => props.downloadImage(props.image.signedUrl, props.image.fileName.slice(23))}
                            title="Download"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em">
                                <path
                                    fill="currentColor"
                                    d="M19.35 10.04A7.49 7.49 0 0 0 12 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 0 0 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5c0-2.64-2.05-4.78-4.65-4.96M17 13l-5 5l-5-5h3V9h4v4z"
                                ></path>
                            </svg>
                        </button>
                        <button
                            className="cursor-pointer rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
                            onClick={() => props.copyURL(props.image.signedUrl)}
                            title="Copy URL"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em">
                                <path
                                    fill="currentColor"
                                    d="m12.922 16.587l-3.671 3.671a3.896 3.896 0 0 1-5.504-5.509l-.002.002l3.671-3.671a1.3 1.3 0 0 0-1.837-1.835l.001-.001l-3.671 3.671a6.494 6.494 0 0 0 9.187 9.175l-.003.002l3.671-3.671a1.3 1.3 0 0 0-1.837-1.835l.001-.001zM24.007 6.489A6.494 6.494 0 0 0 12.921 1.9L9.25 5.571a1.3 1.3 0 1 0 1.835 1.837l.001-.001l3.671-3.671a3.896 3.896 0 0 1 5.504 5.509l.002-.002l-3.671 3.671a1.3 1.3 0 1 0 1.835 1.837l.001-.001l3.671-3.671a6.43 6.43 0 0 0 1.908-4.58V6.49z"
                                ></path>
                                <path
                                    fill="currentColor"
                                    d="M7.412 16.592c.235.235.559.38.918.38s.683-.145.918-.38L16.59 9.25a1.3 1.3 0 0 0-1.837-1.835l.001-.001l-7.342 7.342c-.235.235-.38.559-.38.918s.145.683.38.918"
                                ></path>
                            </svg>
                        </button>
                        <button
                            className="cursor-pointer rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700"
                            onClick={() => props.handleDelete(props.image.fileName)}
                            title="Delete"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em">
                                <path
                                    fill="currentColor"
                                    d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zM8 9h8v10H8zm7.5-5l-1-1h-5l-1 1H5v2h14V4z"
                                ></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Collections;
