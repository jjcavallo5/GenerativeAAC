import { useState } from "react";
import { loginUser } from "../../backend/authFunctions";
import { useNavigate } from "react-router-dom";
import styles from "./login.module.css";
import IconArrowBackOutline from "../../icons/arrowBack";

function LoginPage() {
    const [user, setUser] = useState("");
    const [pass, setPass] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (user === "" || pass === "") {
            setErrorMessage("Please fill out all fields");
            return;
        }

        try {
            await loginUser(user, pass);
            navigate("/");
        } catch (error) {
            if (error.code === "auth/invalid-email") setErrorMessage("Invalid email");
            else if (error.code === "auth/user-not-found") setErrorMessage("Invalid credentials");
            else setErrorMessage(error.message);
        }
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.loginContainer}>
                <IconArrowBackOutline className={styles.back} onClick={() => navigate("/")} />
                <h1>Generative AAC</h1>
                <p className={styles.subheader}>Log in</p>
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
            </div>
        </div>
    );
}

export default LoginPage;
