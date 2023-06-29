import { useState } from "react";
import { registerUser, loginUser } from "../backend/firebaseFunctions";

function LoginPage() {
    const [user, setUser] = useState("");
    const [pass, setPass] = useState("");

    const [userReg, setUserReg] = useState("");
    const [passReg, setPassReg] = useState("");
    const [passConfReg, setPassConfReg] = useState("");

    return (
        <div className="App">
            <h1>Generative AAC</h1>
            <h2>Login</h2>
            <div class="login-container">
                <input
                    type="text"
                    name="email"
                    id="email"
                    placeholder="Email"
                    onChange={(e) => setUser(e.target.value)}
                    value={user}
                />
                <input
                    type="text"
                    name="pass"
                    id="pass"
                    placeholder="Password"
                    onChange={(e) => setPass(e.target.value)}
                    value={pass}
                />
                <input type="submit" value="Login" onClick={() => loginUser(user, pass)} />
            </div>

            <h2>Register</h2>

            <div class="register-container">
                <input
                    type="text"
                    name="email"
                    id="email"
                    placeholder="Email"
                    onChange={(e) => setUserReg(e.target.value)}
                    value={userReg}
                />
                <input
                    type="text"
                    name="pass"
                    id="pass"
                    placeholder="Password"
                    onChange={(e) => setPassReg(e.target.value)}
                    value={passReg}
                />
                <input
                    type="text"
                    name="pass-confirm"
                    id="pass-confirm"
                    placeholder="Confirm password"
                    onChange={(e) => setPassConfReg(e.target.value)}
                    value={passConfReg}
                />
                <input
                    type="submit"
                    value="Register"
                    onClick={() => registerUser(userReg, passReg)}
                />
            </div>
        </div>
    );
}

export default LoginPage;
