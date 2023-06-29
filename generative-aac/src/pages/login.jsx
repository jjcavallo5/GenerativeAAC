import { useState } from "react";
import { loginUser } from "../backend/authFunctions";
import { useNavigate } from "react-router-dom";

function LoginPage() {
    const [user, setUser] = useState("");
    const [pass, setPass] = useState("");
    const navigate = useNavigate()

    const handleLogin = () => {
        loginUser(user, pass)
        navigate('/')
    }

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
                <input type="submit" value="Login" onClick={() => handleLogin()} />
            </div>
        </div>
    );
}

export default LoginPage;
