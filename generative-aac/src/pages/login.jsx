import { useState } from "react";
import { loginUser } from "../backend/firebaseFunctions";

function LoginPage() {
    const [user, setUser] = useState("");
    const [pass, setPass] = useState("");

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
        </div>
    );
}

export default LoginPage;
