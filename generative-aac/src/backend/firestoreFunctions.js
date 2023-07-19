import { initializeApp } from "firebase/app";
import {
    getFirestore,
    doc,
    setDoc,
    getDoc,
    updateDoc,
    arrayUnion,
    arrayRemove,
    increment,
} from "firebase/firestore";
import { getCurrentUserEmail } from "./authFunctions";

const firebaseConfig = require("./firebaseCredentials.json");
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const createNewUser = async (email) => {
    await setDoc(doc(db, "users", email), {
        imageURLs: [],
        imageTokenCount: 5,
    });
};

export const pushImageToList = (url, prompt) => {
    let userEmail = getCurrentUserEmail();
    let docRef = doc(db, "users", userEmail);
    let objectToPush = {
        url: url,
        prompt: prompt,
    };

    updateDoc(docRef, {
        imageURLs: arrayUnion(objectToPush),
    }).then((snap) => console.log("Added image"));
};

export const deleteImageFromList = (url, prompt) => {
    let userEmail = getCurrentUserEmail();
    let docRef = doc(db, "users", userEmail);
    let objectToRemove = {
        url: url,
        prompt: prompt,
    };

    updateDoc(docRef, {
        imageURLs: arrayRemove(objectToRemove),
    }).then((snap) => console.log("Removed image"));
};

export const getImageTokenCount = async () => {
    let userEmail = getCurrentUserEmail();

    const docRef = doc(db, "users", userEmail);
    const docSnap = await getDoc(docRef);

    return docSnap.get("imageTokenCount");
};

export const decrementImageTokens = async () => {
    let userEmail = getCurrentUserEmail();
    let docRef = doc(db, "users", userEmail);

    updateDoc(docRef, {
        imageTokenCount: increment(-1),
    }).then((snap) => console.log("Decremented"));
};

export const addImageTokens = async (numTokens) => {
    let userEmail = getCurrentUserEmail();
    let docRef = doc(db, "users", userEmail);

    updateDoc(docRef, {
        imageTokenCount: increment(numTokens),
    }).then((snap) => console.log("Added tokens"));
};

export const getSavedQueries = async () => {
    let userEmail = getCurrentUserEmail();

    const docRef = doc(db, "users", userEmail);
    const docSnap = await getDoc(docRef);

    return docSnap.get("imageURLs").reverse();
};

export const storeSubscriptionID = async (subscriptionID, subscriptionItemID) => {
    let userEmail = getCurrentUserEmail();
    let docRef = doc(db, "users", userEmail);

    await setDoc(doc(db, "subscriptions", subscriptionItemID), {
        email: userEmail,
        subscriptionUsage: 0,
    });

    updateDoc(docRef, {
        subscriptionID: subscriptionID,
        subscriptionItemID: subscriptionItemID
    }).then((snap) => console.log("Added subscription ID"));
};

export const getSubscriptionItemID = async () => {
    let userEmail = getCurrentUserEmail();
    let docRef = doc(db, "users", userEmail);

    const docSnap = await getDoc(docRef);
    return docSnap.get("subscriptionItemID");
};

export const getSubscriptionID = async () => {
    let userEmail = getCurrentUserEmail();
    let docRef = doc(db, "users", userEmail);

    const docSnap = await getDoc(docRef);
    return docSnap.get("subscriptionID");
};

export const incrementSubscriptionUsage = async () => {
    let subscriptionID = await getSubscriptionItemID();
    let docRef = doc(db, "subscriptions", subscriptionID);

    updateDoc(docRef, {
        subscriptionUsage: increment(1),
    }).then((snap) => console.log("Incremented"));
};

export const cancelSubscription = async () => {
    let subID = await getSubscriptionID()
    await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/cancel-subscription`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            subscriptionId: subID,
        }),
    })
}
