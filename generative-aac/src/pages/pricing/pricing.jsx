import React from "react";
import styles from "./pricing.module.css";
import { useNavigate } from "react-router-dom";
import IconArrowBackOutline from "../../icons/arrowBack";


const PricingPage = () => {
    const navigate = useNavigate();

    const updateUsage = () => {
        fetch('http://localhost:4242/update-usage', {
            method: 'POST',
            body: JSON.stringify({
                'subscription_id': 'si_OFEPAejD7hAOCN',
                'usage': 1
            })
        })
    }

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
                    <button onClick={() => navigate('/checkout?item=subscription')}>Get Started</button>
                </div>
                <button onClick={() => updateUsage()}>Test Button</button>
            </div>
        </div>
    );
};

export default PricingPage;
