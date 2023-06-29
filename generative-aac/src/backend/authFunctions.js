import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { createNewUser } from "./firestoreFunctions";

const firebaseConfig = require("./firebaseCredentials.json");
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export const registerUser = (email, pass) => {
    createUserWithEmailAndPassword(auth, email, pass)
        .then((userCredential) => {
            const user = userCredential.user;
            createNewUser(email)
        })
        .catch((error) => {
            const errorMessage = error.message;
            console.error(errorMessage)
        });
};

export const loginUser = (email, pass) => {
    signInWithEmailAndPassword(auth, email, pass)
        .then((userCredential) => {
            const user = userCredential.user;
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error(errorMessage);
        });
};

export const getCurrentUserEmail = () => {
    return auth.currentUser.email
}

export const isUserLoggedIn = () => {
    if (auth.currentUser) return true;

    return false
}
