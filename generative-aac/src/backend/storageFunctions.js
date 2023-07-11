import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { list as listAlias } from "firebase/storage";

const firebaseConfig = require("./firebaseCredentials.json");

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export const uploadBlob = async (blob) => {
    let path = new Date().getTime();

    const uploadRef = ref(storage, `images/${path}.jpeg`);

    try {
        await uploadBytes(uploadRef, blob);
    } catch (error) {
        console.error(error);
    }

    return await getDownloadURL(uploadRef);
};

export const deleteImage = (url) => {
    const deleteRef = ref(storage, url);

    deleteObject(deleteRef)
        .then(() => console.log("Deleted image"))
        .catch((err) => console.error("An error occured"));
};

export const getRandomImages = async (numImages) => {
    const listRef = ref(storage, "images");

    const response = await listAlias(listRef, { maxResults: 100 });
    let list = response.items;

    let urlList = [];

    for (let i = 0; i < numImages; i++) {
        let randomIndex = Math.floor(Math.random() * list.length)
        let randomRef = ref(storage, list[randomIndex].fullPath);
        let url = await getDownloadURL(randomRef);
        urlList.push(url);
    }

    return urlList;
};
