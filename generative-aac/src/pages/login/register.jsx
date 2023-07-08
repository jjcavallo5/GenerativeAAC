import { useState } from "react";
import { registerUser } from "../../backend/authFunctions";
import { useNavigate } from "react-router-dom";
import styles from "./login.module.css";
import IconArrowBackOutline from "../../icons/arrowBack";

function RegistrationPage() {
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const [confirmPass, setConfirmPass] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();

    const handleRegistration = async () => {
        if (email === "" || pass === "" || confirmPass === "") {
            setErrorMessage("Please fill out all fields");
            return;
        }

        if (pass !== confirmPass) {
            setErrorMessage("Passwords do not match");
            return;
        }

        try {
            await registerUser(email, pass);
            navigate("/");
        } catch (error) {
            if (error.code === "auth/invalid-email") setErrorMessage("Invalid email");
            else if (error.code === "auth/email-already-in-use")
                setErrorMessage("Email already in use");
            else if (error.code === "auth/weak-password")
                setErrorMessage("Password must be at least 6 characters");
            else setErrorMessage(error.message);
        }
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.loginContainer}>
                <IconArrowBackOutline className={styles.back} onClick={() => navigate("/")} />
                <h1>Generative AAC</h1>
                <p className={styles.subheader}>Sign up</p>
                <input
                    type="text"
                    name="email"
                    id="email"
                    placeholder="Email"
                    className={styles.textInput}
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                />
                <input
                    type="password"
                    name="pass"
                    id="pass"
                    placeholder="Password"
                    className={styles.textInput}
                    onChange={(e) => setPass(e.target.value)}
                    value={pass}
                />
                <input
                    type="password"
                    name="pass-confirm"
                    id="pass-confirm"
                    placeholder="Confirm password"
                    className={styles.textInput}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    value={confirmPass}
                />
                <p className={styles.errorMessage}>{errorMessage}</p>

                <input
                    type="submit"
                    value="Register"
                    className={styles.submit}
                    onClick={() => handleRegistration()}
                />
            </div>
        </div>
    );
}

export default RegistrationPage;
