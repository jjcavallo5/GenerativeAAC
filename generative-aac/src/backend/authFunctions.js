import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged} from "firebase/auth";
import { initializeApp } from "firebase/app";
import { createNewUser } from "./firestoreFunctions";

const firebaseConfig = require("./firebaseCredentials.json");
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export const registerUser = async (email, pass) => {
    try {
        await createUserWithEmailAndPassword(auth, email, pass)
    } catch(err) {
        console.error(err)
    }
};

export const loginUser = async (email, pass) => {
    try{
        await signInWithEmailAndPassword(auth, email, pass)
    } catch(err) {
        console.error(err)
    }

};

export const getCurrentUserEmail = () => {
    return auth.currentUser.email
}

export const isUserLoggedIn = async () => {
    onAuthStateChanged(auth, (user) => {
        console.log(user)
        if (user) return true;
        
        return false
    })
}
