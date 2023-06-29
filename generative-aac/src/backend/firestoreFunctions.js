import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, updateDoc, arrayUnion } from "firebase/firestore"; 
import { getCurrentUserEmail } from './authFunctions';

const firebaseConfig = require('./firebaseCredentials.json')
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const createNewUser = async email => {
    await setDoc(doc(db, 'users', email), {
        imageURLs: []
    })
}

export const pushImageToList = (url, prompt, user) => {
    let userEmail = user.email;
    let docRef = doc(db, 'users', userEmail);
    let objectToPush = {
        url: url,
        prompt: prompt
    }

    updateDoc(docRef, {
        imageURLs: arrayUnion(objectToPush)
    }).then(snap => console.log("Added image"))
}

export const getSavedQueries = async () => {
    let userEmail = getCurrentUserEmail()
    console.log(userEmail)

    const docRef = doc(db, "users", userEmail);
    const docSnap = await getDoc(docRef);

    return docSnap.get('imageURLs')
}