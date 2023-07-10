import React, { useEffect, useState } from "react";
import styles from "./pricing.module.css";
import { useNavigate } from "react-router-dom";
import IconArrowBackOutline from "../../icons/arrowBack";
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import CheckoutForm from "./CheckoutForm";
import Modal from "../../components/Modal/Modal";
import { getCurrentUserEmail } from "../../backend/authFunctions";

const stripe = loadStripe(process.env.REACT_APP_PUBLIC_STRIPE_PUBLISHABLE_KEY)

const PricingPage = () => {
    const navigate = useNavigate();
    const [clientSecret, setClientSecret] = useState('')
    const [paymentModalActive, setPaymentModalActive] = useState(false)
    const userEmail = getCurrentUserEmail()

    useEffect(() => {
        // Create PaymentIntent as soon as the page loads
        fetch("http://localhost:4242/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({'userEmail': userEmail})
        })
          .then((res) => res.json())
          .then((data) => setClientSecret(data.clientSecret));
      }, []);

      const options = {
        clientSecret
      };

    return (
        <div className={styles.pageContainer}>
            {clientSecret && (
                <Modal active={paymentModalActive} deactivate={() => setPaymentModalActive(false)}>
                    <Elements options={options} stripe={stripe}>
                        <CheckoutForm />
                    </Elements>
                </Modal>
            )}
            <div className={styles.headerContainer}>
                <IconArrowBackOutline className={styles.back} onClick={() => navigate("/")} />
                <h1>Pricing</h1>
            </div>
            <div className={styles.pricingContainer}>
                <div className={styles.pricingTier}>
                    <h2>Small Image Package</h2>
                    <p>500 generated images</p>
                    <p className={styles.price}>$10</p>
                    <button onClick={() => setPaymentModalActive(true)}>Get Started</button>
                </div>
                <div className={styles.pricingTier}>
                    <h2>Large Image Package</h2>
                    <p>1500 generated images</p>
                    <p className={styles.price}>$25</p>
                    <button>Get Started</button>
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
