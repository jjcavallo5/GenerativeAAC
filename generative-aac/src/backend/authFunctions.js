import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
} from "firebase/auth";
import { initializeApp } from "firebase/app";
import { createNewUser } from "./firestoreFunctions";

const firebaseConfig = require("./firebaseCredentials.json");
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export const registerUser = async (email, pass) => {
    await createUserWithEmailAndPassword(auth, email, pass);
    await createNewUser(email);
};

export const loginUser = async (email, pass) => {
    await signInWithEmailAndPassword(auth, email, pass);
};

export const getCurrentUserEmail = () => {
    if (auth.currentUser) return auth.currentUser.email;
    else throw new Error("User not logged in");
};

export const isUserLoggedIn = async () => {
    onAuthStateChanged(auth, (user) => {
        console.log(user);
        if (user) return true;

        return false;
    });
};
