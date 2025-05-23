import React, { useRef, useState } from "react";
import FailureMessage from "../utils/failureMessage.tsx";
import Loading from "../utils/Loading.tsx";
import SuccessMessage from "../utils/successMessage.tsx";

const ALLOWED_OCR_IMAGE_TYPES = ["image/jpeg", "image/png", "image/bmp", "image/webp", "image/tiff"];

interface OCRBox {
    x: number;
    y: number;
    width: number;
    height: number;
    text: string;
}

const ImageToText: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const [text, setText] = useState("");
    const [img, setImg] = useState<HTMLImageElement | null>(null);
    const [boxes, setBoxes] = useState<OCRBox[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isMountDown, setIsMountDown] = useState(false);
    const [startX, setStartX] = useState(0);
    const [startY, setStartY] = useState(0);
    const [successMessageVisible, setSuccessMessageVisible] = useState(false);
    const [failureMessageVisible, setFailureMessageVisible] = useState(false);
    const [message, setMessage] = useState("");
    const [isDraggingOver, setIsDraggingOver] = useState(false);

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDraggingOver(true);
    };

    const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDraggingOver(false);
    };

    const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDraggingOver(false);
        const files = event.dataTransfer.files;
        if (files && files.length > 0) {
            await processFile(files[0]);
        }
    };

    const handleCopy = async () => {
        if (textAreaRef.current) {
            try {
                await navigator.clipboard.writeText(textAreaRef.current.value);
                setSuccessMessageVisible(true);
                setMessage("Copied to clipboard successfully!");
                setTimeout(() => {
                    setSuccessMessageVisible(false);
                }, 3000);
            } catch (err) {
                console.error("Error copied:", err);
                alert("Copy unsuccessfully.");
            }
        }
    };

    const chooseFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            await processFile(file);
        }
    };

    const processFile = async (file: File) => {
        if (!file) return;

        if (!ALLOWED_OCR_IMAGE_TYPES.includes(file.type)) {
            setFailureMessageVisible(true);
            setMessage(
                `Invalid file type. Allowed types: ${ALLOWED_OCR_IMAGE_TYPES.map((type) => type.split("/")[1]).join(", ")}`,
            );
            setTimeout(() => {
                setFailureMessageVisible(false);
            }, 3000);
            return;
        }

        setIsLoading(true);
        setBoxes([]);
        const reader = new FileReader();
        reader.onload = async () => {
            // Upload image and render to canvas
            const image = new Image();
            image.src = reader?.result as string;
            await image.decode();
            setImg(image);
            const canvas = canvasRef.current;
            if (canvas) {
                canvas.width = image.width;
                canvas.height = image.height;
            }

            const ctx = canvas?.getContext("2d");
            ctx?.drawImage(image, 0, 0);

            // Call OCR API
            const formData = new FormData();
            formData.append("image", file);
            try {
                const response = await fetch("https://ocr-image-function-432052083194.asia-southeast1.run.app", {
                    method: "POST",
                    body: formData,
                });
                if (!response.ok) throw new Error("OCR API request failed, please try again.");

                const result = await response.json();
                setBoxes(result.boxes);
                const selectedText = result.boxes.map((box: { text: string }) => box.text).join(" ");
                setText(selectedText);

                // Draw boxes
                if (!ctx) return;
                result.boxes.forEach((box: { x: number; y: number; width: number; height: number }) => {
                    ctx.strokeStyle = "red";
                    ctx.strokeRect(box.x, box.y, box.width, box.height);
                });
            } catch (error) {
                setMessage(
                    error instanceof Error
                        ? error.message
                        : "An error occurred during OCR processing. Please try again.",
                );
                setFailureMessageVisible(true);
                setTimeout(() => setFailureMessageVisible(false), 3000);
                setImg(null);
            } finally {
                setIsLoading(false);
            }
        };

        reader.readAsDataURL(file);
    };

    const handleMouseDown = async (e: React.MouseEvent) => {
        setIsMountDown(true);
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        setStartX(e.clientX - rect.left);
        setStartY(e.clientY - rect.top);
    };

    const handleMouseUp = async (e: React.MouseEvent) => {
        if (!isMountDown) return;
        setIsMountDown(false);
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (!img) return;
        ctx.drawImage(img, 0, 0);
        boxes.forEach((box) => {
            ctx.strokeStyle = "red";
            ctx.strokeRect(box.x, box.y, box.width, box.height);
        });
        const selectedText = boxes
            .filter((box) => isInsideSelectedZone(box, startX, startY, e.clientX - rect.left, e.clientY - rect.top))
            .map((box) => box.text)
            .join(" ");

        setText(selectedText);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isMountDown) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (!img) return;
        ctx.drawImage(img, 0, 0);
        boxes.forEach((box) => {
            ctx.strokeStyle = "red";
            ctx.strokeRect(box.x, box.y, box.width, box.height);
        });

        // Draw selection rectangle
        const x = Math.min(startX, currentX);
        const y = Math.min(startY, currentY);
        const width = Math.abs(currentX - startX);
        const height = Math.abs(currentY - startY);
        ctx.fillStyle = "rgba(0, 0, 255, 0.3)";
        ctx.fillRect(x, y, width, height);
        ctx.strokeStyle = "blue";
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, width, height);
    };

    const isInsideSelectedZone = (box: OCRBox, x1: number, y1: number, x2: number, y2: number) => {
        const p_startX = Math.min(x1, x2);
        const p_startY = Math.min(y1, y2);
        const p_endX = Math.max(x1, x2);
        const p_endY = Math.max(y1, y2);
        return (
            (box.x >= p_startX && box.x <= p_endX && box.y >= p_startY && box.y <= p_endY) ||
            (box.x + box.width >= p_startX && box.x + box.width <= p_endX && box.y >= p_startY && box.y <= p_endY) ||
            (box.x >= p_startX && box.x <= p_endX && box.y + box.height >= p_startY && box.y + box.height <= p_endY) ||
            (box.x + box.width >= p_startX &&
                box.x + box.width <= p_endX &&
                box.y + box.height >= p_startY &&
                box.y + box.height <= p_endY)
        );
    };

    const restart = () => {
        setImg(null);
        setText("");
        setBoxes([]);
        setIsLoading(false);
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext("2d");
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        if (textAreaRef.current) {
            textAreaRef.current.value = "";
        }
    };

    return (
        <div className="relative flex flex-col items-center bg-[#0F172A] pt-10">
            {!img && (
                <div
                    className={`relative w-full max-w-md rounded-[20px] border-2 bg-white/10 p-4 shadow-lg transition-all duration-300 ease-in-out ${
                        isDraggingOver ? "border-blue-500" : "border-white/10"
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <div
                        className={`transition-all duration-300 ease-in-out ${
                            isDraggingOver ? "opacity-50 blur-sm filter" : "opacity-100 filter-none"
                        }`}
                    >
                        <div className="border-dark-6 relative z-10 flex min-h-[328px] items-center justify-center rounded-2xl border border-dashed bg-white/10 p-6 md:p-10">
                            <div className="w-full text-center">
                                <div>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={chooseFile}
                                        className="sr-only"
                                        accept={ALLOWED_OCR_IMAGE_TYPES.join(",")}
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
                                    <p className="mb-5 text-base text-gray-400">Supports: JPEG, PNG, BMP, WEBP, TIFF</p>
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
            )}

            {img && (
                <div className="container flex w-full gap-4">
                    <div className="w-1/3">
                        <div className="relative mx-0 w-full max-w-[570px] rounded-[20px] bg-white/10 p-4 shadow-lg">
                            <div className="border-dark-6 relative z-10 flex min-h-[328px] flex-col items-center justify-center space-y-5 rounded-2xl border border-dashed bg-white/10 p-6 md:p-10">
                                <h1 className="text-2xl font-bold text-white">Original Image</h1>
                                <img src={img.src} className="h-48 w-full rounded-lg object-fill" />
                            </div>
                        </div>
                    </div>
                    <div className="flex h-90 w-2/3 items-center justify-center">
                        {isLoading ? (
                            <Loading />
                        ) : (
                            img && (
                                <div className="rounded bg-[#0F172A] p-4">
                                    <div className="flex items-center">
                                        <textarea
                                            ref={textAreaRef}
                                            value={text}
                                            onChange={(e) => setText(e.target.value)}
                                            className="h-[300px] w-[700px] resize-none rounded border border-gray-500 bg-[#0F172A] p-3 text-white focus:outline-none"
                                        />
                                        <div className="flex flex-col items-center space-y-10">
                                            <button
                                                onClick={handleCopy}
                                                title="Copy to clipboard"
                                                className="ml-4 cursor-pointer rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 24 24"
                                                    width="1.5em"
                                                    height="1.5em"
                                                >
                                                    <path
                                                        fill="currentColor"
                                                        d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2m0 16H8V7h11z"
                                                    ></path>
                                                </svg>
                                            </button>
                                            <button
                                                onClick={restart}
                                                title="Restart"
                                                className="ml-4 cursor-pointer rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 24 24"
                                                    width="1.5em"
                                                    height="1.5em"
                                                >
                                                    <path
                                                        fill="currentColor"
                                                        d="M12 5V2L8 6l4 4V7c3.31 0 6 2.69 6 6c0 2.97-2.17 5.43-5 5.91v2.02c3.95-.49 7-3.85 7-7.93c0-4.42-3.58-8-8-8m-6 8c0-1.65.67-3.15 1.76-4.24L6.34 7.34A8 8 0 0 0 4 13c0 4.08 3.05 7.44 7 7.93v-2.02c-2.83-.48-5-2.94-5-5.91"
                                                    ></path>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                </div>
            )}

            <canvas
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                className="max-h-4xl mt-10 max-w-4xl"
            />
            {successMessageVisible && <SuccessMessage message={message} duration={3000} />}
            {failureMessageVisible && <FailureMessage message={message} duration={3000} />}
        </div>
    );
};

export default ImageToText;
