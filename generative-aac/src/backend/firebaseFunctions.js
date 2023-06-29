import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { initializeApp } from "firebase/app";

const firebaseConfig = require("./firebaseCredentials.json");

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export const registerUser = (email, pass) => {
    const firebaseConfig = require("./firebaseCredentials.json");

    const app = initializeApp(firebaseConfig);

    const auth = getAuth(app);

    console.log(firebaseConfig);
    createUserWithEmailAndPassword(auth, email, pass)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            // ..
        });
};

export const loginUser = (email, pass) => {
    const firebaseConfig = require("./firebaseCredentials.json");

    const app = initializeApp(firebaseConfig);

    const auth = getAuth(app);

    signInWithEmailAndPassword(auth, email, pass)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            console.log("signed in");
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error(errorMessage);
        });
};
