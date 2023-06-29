import React from "react";
import { Link } from "react-router-dom";

function HomePage() {
    return (
        <div>
            <h1>Generative AAC</h1>
            <h2>Jeremy Cavallo</h2>

            <Link to="/login">Login</Link>
        </div>
    );
}

export default HomePage;
