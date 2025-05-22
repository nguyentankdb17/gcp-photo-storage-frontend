import { getAuth } from "firebase/auth";
import React, { useEffect } from "react";
import type { Image } from "../type/types";
import ImageCard from "../utils/imageCard";

const Collections: React.FC = () => {
    const [images, setImages] = React.useState<Image[] | []>([]);

    //add the userId to see what images belong to the user command it to show all the old function
    const fetchImages = async () => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
            console.warn("User not authenticated");
            return;
        }

        const idToken = await user.getIdToken();
        console.log("ID Token:", idToken);
        console.log("User ID:", user.uid);
        console.log("user", user);
        const response = await fetch("https://get-images-metadata-function-432052083194.asia-southeast1.run.app/", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${idToken}`,
            },
        });

        if (!response.ok) {
            const text = await response.text(); // lấy raw text để debug
            console.error("Server error:", response.status, text);
            return;
        }

        const data = await response.json();
        setImages(data);
    };

    useEffect(() => {
        fetchImages();
    }, []);

    useEffect(() => {
        console.log(images);
    }, [images]);

    return (
        <div className="flex flex-col items-center justify-center bg-white dark:bg-[#0F172A]">
            <div>
                <h1 className="py-5 text-4xl font-bold text-white">Your Image Collections</h1>
            </div>
            <ImageCard cards={images} />
        </div>
    );
};

export default Collections;
