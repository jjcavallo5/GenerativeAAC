import React, { useEffect, useState } from "react";
import styles from "./pricing.module.css";
import { useNavigate } from "react-router-dom";
import IconArrowBackOutline from "../../icons/arrowBack";
import LoginModal from "../../components/Modal/LoginModal";
import { getCurrentUserEmail } from "../../backend/authFunctions";
import { getSubscriptionID } from "../../backend/firestoreFunctions";
import Modal from "../../components/Modal/Modal";

const PricingPage = () => {
    const [loginModalActive, setLoginModalActive] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isSubscriber, setIsSubscriber] = useState(false);
    const [isSubscriberModalActive, setIsSubscriberModalActive] = useState(false)
    const navigate = useNavigate();

    useEffect(() => {
        try {
            getCurrentUserEmail();
            setIsLoggedIn(true);

            getSubscriptionID().then(id => {
                if (id) setIsSubscriber(true)
                else setIsSubscriber(false)
            })
        } catch (Error) {
            setIsLoggedIn(false);
        }
    }, []);

    return (
        <div className={styles.pageContainer}>
            <LoginModal active={loginModalActive} deactivate={() => setLoginModalActive(false)} />

            <Modal active={isSubscriberModalActive} deactivate={() => setIsSubscriberModalActive(false)}>
                <div className={styles.isSubscriberModalContainer}>
                    <h3>Your account has an active subscription</h3>
                    <p>This can be cancelled from the account settings page</p>
                    <div>
                        <button onClick={() => navigate('/')}>Home</button>
                        <button onClick={() => navigate('/account')}>Settings</button>
                    </div>
                </div>
            </Modal>

            <div className={styles.headerContainer}>
                <IconArrowBackOutline className={styles.back} onClick={() => navigate("/")} />
                <h1>Pricing</h1>
            </div>
            <div className={styles.pricingContainer}>
                <div className={styles.pricingTier}>
                    <h2>Small Image Package</h2>
                    <p>500 generated images</p>
                    <p className={styles.price}>$10</p>
                    <button
                        onClick={() => {
                            if (isSubscriber) {
                                setIsSubscriberModalActive(true)
                                return;
                            }
                            if (isLoggedIn) navigate("/checkout?item=smallImagePackage");
                            else setLoginModalActive(true);
                        }}
                    >
                        Get Started
                    </button>
                </div>
                <div className={styles.pricingTier}>
                    <h2>Large Image Package</h2>
                    <p>1500 generated images</p>
                    <p className={styles.price}>$25</p>
                    <button
                        onClick={() => {
                            if (isSubscriber) {
                                setIsSubscriberModalActive(true)
                                return;
                            }
                            if (isLoggedIn) navigate("/checkout?item=largeImagePackage");
                            else setLoginModalActive(true);
                        }}
                    >
                        Get Started
                    </button>
                </div>
                <div className={styles.pricingTier}>
                    <h2>Pay-as-you-go</h2>
                    <p>Save images on your account</p>
                    <p className={styles.price}>$0.10/image</p>
                    <button
                        
                        onClick={() => {
                            if (isSubscriber) {
                                setIsSubscriberModalActive(true)
                                return;
                            }
                            if (isLoggedIn) navigate("/checkout?item=subscription");
                            else setLoginModalActive(true);
                        }}
                    >
                        Get Started
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PricingPage;
