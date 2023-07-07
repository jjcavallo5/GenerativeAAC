import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject, listAll } from "firebase/storage";

const firebaseConfig = require('./firebaseCredentials.json')

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export const uploadBlob = async blob => {
    let path = new Date().getTime()

    const uploadRef = ref(storage, `images/${path}.jpeg`);

    try {
        await uploadBytes(uploadRef, blob);
    } catch(error) {
        console.error(error)
    }
    
    return await getDownloadURL(uploadRef)
}

export const deleteImage = url => {
    const deleteRef = ref(storage, url)

    deleteObject(deleteRef)
        .then(() => console.log("Deleted image"))
        .catch(err => console.error("An error occured"))
}

export const getRandomImages = async numImages => {
    const listRef = ref(storage, 'images');

    let response = await listAll(listRef)
    let list = response.items

    const shuffled = [...list].sort(() => 0.5 - Math.random());
    const items = shuffled.slice(0, numImages);
    
    let urlList = []
    
    for (let i = 0; i < items.length; i++) {
        let randomRef = ref(storage, items[i].fullPath)
        let url = await getDownloadURL(randomRef)
        urlList.push(url)
    }

    return urlList
}   