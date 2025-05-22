import { getAuth } from "firebase/auth";
import React, { useEffect, useState } from "react";
import type { Image } from "../type/types";
import ImageCard from "../utils/imageCard";
import Loading from "../utils/Loading";

const Collections: React.FC = () => {
    const [images, setImages] = React.useState<Image[] | []>([]);
    const [loadingVisible, setLoadingVisible] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    //add the userId to see what images belong to the user command it to show all the old function
    const fetchImages = async () => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
            console.warn("User not authenticated");
            return;
        }

        setIsAuthenticated(true);
        setLoadingVisible(true);

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
        setLoadingVisible(false);
    };

    useEffect(() => {
        fetchImages();
    }, []);

    useEffect(() => {
        console.log(images);
    }, [images]);

    if (!isAuthenticated) {
        return (
            <div className="flex h-full items-center justify-center bg-white py-64 dark:bg-[#0F172A]">
                <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
                    PLEASE LOG IN TO VIEW YOUR COLLECTIONS.
                </h1>
            </div>
        );
    }

    return (
        <div>
            <div className="flex flex-col items-center justify-center bg-white dark:bg-[#0F172A]">
                <div>
                    <h1 className="py-5 text-4xl font-bold text-white">Your Image Collections</h1>
                </div>
                <ImageCard cards={images} />
            </div>
            {loadingVisible && <Loading />}
        </div>
    );
};

export default Collections;
