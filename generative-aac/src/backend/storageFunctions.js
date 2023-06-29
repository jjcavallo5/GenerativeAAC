import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = require('./firebaseCredentials.json')

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export const uploadBlob = async blob => {
    let path = new Date().getTime()

    const uploadRef = ref(storage, `images/${path}.jpeg`);

    await uploadBytes(uploadRef, blob);
    
    return await getDownloadURL(uploadRef)
}