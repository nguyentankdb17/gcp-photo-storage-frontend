import { getAuth } from "firebase/auth";
import React, { useEffect, useRef, useState } from "react";
import ImagePreview from "./imagePreview";
import Loading from "./Loading";
import SuccessMessage from "./successMessage";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/bmp", "image/webp", "image/x-icon", "image/tiff"];

const FileUpload: React.FC = () => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [uploadedBytes, setUploadedBytes] = useState(0);
    const [messageVisible, setMessageVisible] = useState(false);
    const [loadingVisible, setLoadingVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isDraggingOver, setIsDraggingOver] = useState(false);

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            if (!ALLOWED_IMAGE_TYPES.includes(files[0].type)) {
                setFile(null);
                setErrorMessage(
                    `Invalid file type. Allowed types: ${ALLOWED_IMAGE_TYPES.map((type) => type.split("/")[1]).join(
                        ", ",
                    )}`,
                );
                return;
            }
            setFile(files[0]);
            setUploadedBytes(0);
        }
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDraggingOver(true);
    };

    const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDraggingOver(false);
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDraggingOver(false);
        const files = event.dataTransfer.files;
        if (files && files.length > 0) {
            if (!ALLOWED_IMAGE_TYPES.includes(files[0].type)) {
                setFile(null);
                setErrorMessage(
                    `Invalid file type. Allowed types: ${ALLOWED_IMAGE_TYPES.map((type) => type.split("/")[1]).join(
                        ", ",
                    )}`,
                );
                return;
            }
            setFile(files[0]);
            setUploadedBytes(0);
        }
    };

    const uploadFile = async (file: File) => {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) {
            console.error("No user logged in");
            setErrorMessage("User not logged in, please log in to continue using our service.");
            throw new Error("User not logged in");
        }

        setLoadingVisible(true);

        const idToken = await user.getIdToken(); // Lấy token Firebase
        console.log("ID Token for upload:", idToken); // Debug token

        const formData = new FormData();
        formData.append("image", file);

        try {
            const response = await fetch("https://upload-image-function-432052083194.asia-southeast1.run.app", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${idToken}`,
                },
                body: formData,
            });
            setLoadingVisible(false);

            if (!response.ok) {
                const errorText = await response.json();
                setErrorMessage(errorText.message);
                console.error("Server error:", response.status, errorText);
                throw new Error("File upload failed");
            }

            setMessageVisible(true);
            setFile(null);
            setUploadedBytes(0);
            console.log("File uploaded successfully:", await response.json());
        } catch (error) {
            console.error("Error uploading file:", error);
            throw error; // Đảm bảo lỗi được xử lý bên ngoài nếu cần
        }
    };

    const handleUpload = () => {
        if (file) {
            uploadFile(file);
        }
    };

    useEffect(() => {
        if (!file) return;

        let uploaded = 0;
        const interval = setInterval(() => {
            uploaded += file.size / 20;
            if (uploaded >= file.size) {
                uploaded = file.size;
                clearInterval(interval);
            }
            setUploadedBytes(uploaded);
        }, 100);

        return () => clearInterval(interval);
    }, [file]);

    if (loadingVisible) {
        return (
            <div className="flex h-full items-center justify-center bg-[#0F172A] opacity-100">
                <Loading />
            </div>
        );
    }

    return (
        <section className="bg-dark py-15">
            <div className="container">
                <div
                    className={`relative mx-auto w-full max-w-[570px] rounded-[20px] border-2 bg-white/10 p-4 shadow-lg transition-all duration-300 ease-in-out ${
                        isDraggingOver ? "border-blue-500" : "border-white/10"
                    }`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                >
                    <div
                        className={`transition-all duration-300 ease-in-out ${
                            isDraggingOver ? "opacity-50 blur-sm filter" : "opacity-100 filter-none"
                        }`}
                    >
                        <div className="border-dark-6 relative z-10 flex min-h-[328px] items-center justify-center rounded-2xl border border-dashed bg-white/10 p-6 md:p-10">
                            <div className="w-full text-center">
                                {!file && (
                                    <div>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
                                            className="sr-only"
                                            accept={ALLOWED_IMAGE_TYPES.join(",")}
                                        />
                                        <div
                                            className="text-dark mx-auto mb-5 flex aspect-square w-[68px] cursor-pointer items-center justify-center rounded-full bg-white"
                                            onClick={handleButtonClick}
                                        >
                                            <svg
                                                width="28"
                                                height="28"
                                                viewBox="0 0 28 28"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M24.5438 4.85623H14.4376L13.5188 3.10623C13.0376 2.23123 12.1626 1.66248 11.1563 1.66248H3.45635C1.96885 1.66248 0.787598 2.84373 0.787598 4.33123V23.6687C0.787598 25.1562 1.96885 26.3375 3.45635 26.3375H24.5876C26.0751 26.3375 27.2563 25.1562 27.2563 23.6687V7.52498C27.2563 6.03748 26.0313 4.85623 24.5438 4.85623ZM25.2876 23.6687C25.2876 24.0625 24.9813 24.3687 24.5876 24.3687H3.45635C3.0626 24.3687 2.75635 24.0625 2.75635 23.6687V4.33123C2.75635 3.93748 3.0626 3.63123 3.45635 3.63123H11.1563C11.4188 3.63123 11.6376 3.76248 11.7688 4.02498L12.9938 6.29998C13.1688 6.60623 13.5188 6.82498 13.8688 6.82498H24.5876C24.9813 6.82498 25.2876 7.13123 25.2876 7.52498V23.6687Z"
                                                    fill="currentColor"
                                                />
                                                <path
                                                    d="M14.7 10.675C14.3063 10.2812 13.6938 10.2812 13.3 10.675L9.4938 14.4375C9.10005 14.8312 9.10005 15.4437 9.4938 15.8375C9.88755 16.2312 10.5 16.2312 10.8938 15.8375L13.0375 13.7375V20.125C13.0375 20.65 13.475 21.1312 14.0438 21.1312C14.6125 21.1312 15.0063 20.6937 15.0063 20.125V13.6937L17.1938 15.8375C17.3688 16.0125 17.6313 16.1 17.8938 16.1C18.1563 16.1 18.4188 16.0125 18.5938 15.7937C18.9875 15.4 18.9875 14.7875 18.5938 14.3937L14.7 10.675Z"
                                                    fill="currentColor"
                                                />
                                            </svg>
                                        </div>

                                        <h3 className="mb-3 text-xl font-bold text-white">Drop Image Here or Browse</h3>
                                        <p className="mb-5 text-base text-gray-400">
                                            We support JPEG, PNG, BMP, WebP, ICO, or TIFF images
                                        </p>
                                    </div>
                                )}
                                <div className="mx-auto w-full max-w-[290px] text-center">
                                    {file && (
                                        <ImagePreview
                                            file={file}
                                            uploadedBytes={uploadedBytes}
                                            onRemove={() => {
                                                setFile(null);
                                                setUploadedBytes(0);
                                            }}
                                        />
                                    )}

                                    <div className="mx-auto my-5 flex w-full max-w-[210px] items-center justify-center gap-2.5">
                                        <div className="block h-px w-full bg-white/10"></div>
                                        <span className="text-base text-gray-400"> THEN </span>
                                        <div className="block h-px w-full bg-white/10"></div>
                                    </div>
                                    <div className="z-10 w-full">
                                        <div className="-mx-4 flex flex-wrap">
                                            <div className="w-full px-4">
                                                <div className="py-3 text-center">
                                                    <div className="relative mb-8 inline-block text-left">
                                                        <button
                                                            onClick={handleUpload}
                                                            className="flex cursor-pointer items-center rounded-[5px] bg-blue-500 px-5 py-[13px] text-base font-medium text-white hover:scale-110 hover:bg-blue-700"
                                                        >
                                                            LABEL IMAGE
                                                        </button>
                                                    </div>
                                                </div>
                                                {errorMessage === "" && (
                                                    <p className="mb-5 text-base text-white">
                                                        Your image will be processed and automatically saved in your
                                                        collection.
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    {errorMessage != "" && (
                                        <div className="mt-4 text-sm text-red-500">{errorMessage}</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {isDraggingOver && (
                        <div className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center rounded-[20px] bg-slate-900/70">
                            <svg
                                className="mb-4 h-20 w-20 animate-bounce text-blue-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.5"
                                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                ></path>
                            </svg>
                            <h3 className="text-3xl font-bold text-white">Drop Image Here</h3>
                            <p className="mt-2 text-lg text-blue-200">Release to upload the image</p>
                        </div>
                    )}
                </div>
            </div>
            {messageVisible && <SuccessMessage message="Image added to collection successfully!" duration={3000} />}
        </section>
    );
};

export default FileUpload;
