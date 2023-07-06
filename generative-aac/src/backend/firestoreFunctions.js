import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove, increment } from "firebase/firestore"; 
import { getCurrentUserEmail } from './authFunctions';

const firebaseConfig = require('./firebaseCredentials.json')
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const createNewUser = async email => {
    await setDoc(doc(db, 'users', email), {
        imageURLs: [],
        imageTokenCount: 5
    })
}

export const pushImageToList = (url, prompt) => {
    let userEmail = getCurrentUserEmail();
    let docRef = doc(db, 'users', userEmail);
    let objectToPush = {
        url: url,
        prompt: prompt
    }

    updateDoc(docRef, {
        imageURLs: arrayUnion(objectToPush)
    }).then(snap => console.log("Added image"))
}

export const deleteImageFromList = (url, prompt) => {
    let userEmail = getCurrentUserEmail();
    let docRef = doc(db, 'users', userEmail);
    let objectToRemove = {
        url: url,
        prompt: prompt
    }

    updateDoc(docRef, {
        imageURLs: arrayRemove(objectToRemove)
    }).then(snap => console.log("Removed image"))
}

export const getImageTokenCount = async () => {
    let userEmail = getCurrentUserEmail()
    
    const docRef = doc(db, "users", userEmail);
    const docSnap = await getDoc(docRef);

    return docSnap.get('imageTokenCount')
}

export const decrementImageTokens = async () => {
    let userEmail = getCurrentUserEmail();
    let docRef = doc(db, 'users', userEmail);

    updateDoc(docRef, {
        imageTokenCount: increment(-1)
    }).then(snap => console.log("Decremented"))
}

export const addImageTokens = async (numTokens) => {
    let userEmail = getCurrentUserEmail();
    let docRef = doc(db, 'users', userEmail);

    updateDoc(docRef, {
        imageTokenCount: increment(numTokens)
    }).then(snap => console.log("Added tokens"))
}

export const getSavedQueries = async () => {
    let userEmail = getCurrentUserEmail()
    
    const docRef = doc(db, "users", userEmail);
    const docSnap = await getDoc(docRef);

    return docSnap.get('imageURLs').reverse()
}