import React, { useEffect, useState } from "react";
import styles from "./ExampleImage.module.css";
import { getRandomImages } from "../../backend/storageFunctions";
import IconReload from "../../icons/reload";

const ExampleImage = (props) => {
    const [randomImages, setRandomImages] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleReload = async () => {
        props.onLoading();
        setLoading(true);
        let urls = await getRandomImages(props.numImages);
        setRandomImages(urls);
        setLoading(false);
        props.onFinishLoading();
    };

    useEffect(() => {
        const getImg = async () => {
            let urls = await getRandomImages(props.numImages);
            setRandomImages(urls);
        };
        getImg();
    }, [props.numImages]);

    return (
        <div className={styles.exampleContainer}>
            {!loading &&
                randomImages.map((url, i) => {
                    return (
                        <div className={styles.container}>
                            <img
                                key={i}
                                src={url}
                                className={styles.loadedImage}
                                alt="Generated by stable diffusion"
                            />
                        </div>
                    );
                })}
            <div>
                <IconReload className={styles.reload} onClick={() => handleReload()} />
            </div>
        </div>
    );
};

export default ExampleImage;
