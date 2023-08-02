import React from "react";
import Modal from "./Modal";
import styles from "./LoginModal.module.css";

import { useState } from "react";
import { loginUser } from "../../backend/authFunctions";
import IconArrowBackOutline from "../../icons/arrowBack";
import { Link } from "react-router-dom";

const LoginModal = (props) => {
    const [user, setUser] = useState("");
    const [pass, setPass] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleLogin = async () => {
        if (user === "" || pass === "") {
            setErrorMessage("Please fill out all fields");
            return;
        }

        try {
            await loginUser(user, pass);
            props.deactivate();
        } catch (error) {
            if (error.code === "auth/invalid-email") setErrorMessage("Invalid email");
            else if (error.code === "auth/user-not-found") setErrorMessage("Invalid credentials");
            else if (error.code === "auth/wrong-password") setErrorMessage("Invalid credentials");
            else {
                setErrorMessage('An error occurred');
                console.error(error.message)
            }
        }
    };

    return (
        <Modal active={props.active} deactivate={props.deactivate}>
            <div className={styles.loginContainer}>
                <IconArrowBackOutline className={styles.back} onClick={() => props.deactivate()} />
                <h1>Generative AAC</h1>
                <p className={styles.subheader}>Log in to generate your own images!</p>
                <input
                    type="text"
                    name="email"
                    id="email"
                    placeholder="Email"
                    className={styles.textInput}
                    onChange={(e) => setUser(e.target.value)}
                    value={user}
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
                <p className={styles.errorMessage}>{errorMessage}</p>

                <input
                    type="submit"
                    value="Log in"
                    className={styles.submit}
                    onClick={() => handleLogin()}
                />

                <span className={styles.signUpContainer}>
                    <p>Don't have an account?</p>
                    <Link to="/register" style={{ textDecoration: "none" }}>
                        <span className={styles.register}>Sign Up</span>
                    </Link>
                </span>
            </div>
        </Modal>
    );
};

export default LoginModal;
