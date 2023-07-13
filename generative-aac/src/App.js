import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/home/home";
import LoginPage from "./pages/login/login";
import RegistrationPage from "./pages/login/register";
import PricingPage from "./pages/pricing/pricing";
import CheckoutPage from "./pages/checkout/checkout";
import SuccessPage from "./pages/success/success";
import AccountPage from "./pages/account/Account";

function App() {
    return (
        <Router>
            <Routes>
                <Route exact path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegistrationPage />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/success" element={<SuccessPage />} />
                <Route path="/account" element={<AccountPage /> } />
            </Routes>
        </Router>
    );
}

export default App;
