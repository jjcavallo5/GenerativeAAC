import { useState } from "react";
import { registerUser } from "../backend/authFunctions";
import { useNavigate } from "react-router-dom";

function RegistrationPage() {
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const [confirmPass, setConfirmPass] = useState("");
    const [errorMessage, setErrorMessage] = useState('')

    const navigate = useNavigate()

    const handleRegistration = async () => {
        if (pass !== confirmPass) {
            setErrorMessage("Passwords do not match")
            return
        }

        await registerUser(email, pass)

        navigate('/')
    }

    return (
        <div className="App">
            <h1>Generative AAC</h1>
            <h2>Register</h2>

            <div class="register-container">
                <input
                    type="text"
                    name="email"
                    id="email"
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                />
                <input
                    type="text"
                    name="pass"
                    id="pass"
                    placeholder="Password"
                    onChange={(e) => setPass(e.target.value)}
                    value={pass}
                />
                <input
                    type="text"
                    name="pass-confirm"
                    id="pass-confirm"
                    placeholder="Confirm password"
                    onChange={(e) => setConfirmPass(e.target.value)}
                    value={confirmPass}
                />
                <input
                    type="submit"
                    value="Register"
                    onClick={() => handleRegistration()}
                />
            </div>
        </div>
    );
}

export default RegistrationPage;
