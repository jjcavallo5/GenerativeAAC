import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, updateDoc, arrayUnion } from "firebase/firestore"; 
import { getCurrentUserEmail } from './authFunctions';

const firebaseConfig = require('./firebaseCredentials.json')
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const createNewUser = async email => {
    await setDoc(doc(db, 'users', email), {
        imageURLs: []
    })
}

export const pushImageToList = (url) => {
    let userEmail = getCurrentUserEmail();
    let docRef = doc(db, 'users', userEmail);

    updateDoc(docRef, {
        imageURLs: arrayUnion(url)
    }).then(snap => console.log("Added image"))
}