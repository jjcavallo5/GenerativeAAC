import React, { useEffect, useState } from "react";
import styles from "./pricing.module.css";
import { useNavigate } from "react-router-dom";
import IconArrowBackOutline from "../../icons/arrowBack";
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import CheckoutForm from "../checkout/CheckoutForm";
import Modal from "../../components/Modal/Modal";
import { getCurrentUserEmail } from "../../backend/authFunctions";

const PricingPage = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.pageContainer}>
            <div className={styles.headerContainer}>
                <IconArrowBackOutline className={styles.back} onClick={() => navigate("/")} />
                <h1>Pricing</h1>
            </div>
            <div className={styles.pricingContainer}>
                <div className={styles.pricingTier}>
                    <h2>Small Image Package</h2>
                    <p>500 generated images</p>
                    <p className={styles.price}>$10</p>
                    <button onClick={() => navigate('/checkout?item=smallImagePackage')}>Get Started</button>
                </div>
                <div className={styles.pricingTier}>
                    <h2>Large Image Package</h2>
                    <p>1500 generated images</p>
                    <p className={styles.price}>$25</p>
                    <button onClick={() => navigate('/checkout?item=largeImagePackage')}>Get Started</button>
                </div>
                <div className={styles.pricingTier}>
                    <h2>Pay-as-you-go</h2>
                    <p>Save images on your account</p>
                    <p className={styles.price}>$0.10/image</p>
                    <button>Get Started</button>
                </div>
            </div>
        </div>
    );
};

export default PricingPage;
