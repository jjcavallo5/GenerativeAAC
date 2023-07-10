import React, { useEffect, useState } from "react";
import styles from "./checkout.module.css";
import { useNavigate } from "react-router-dom";
import IconArrowBackOutline from "../../icons/arrowBack";
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import CheckoutForm from "./CheckoutForm";
import { getCurrentUserEmail } from "../../backend/authFunctions";

const stripe = loadStripe(process.env.REACT_APP_PUBLIC_STRIPE_PUBLISHABLE_KEY)

const CheckoutPage = () => {
    const navigate = useNavigate();
    const [clientSecret, setClientSecret] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const userEmail = getCurrentUserEmail()
    const urlParams = new URLSearchParams(window.location.search);
    const item = urlParams.get('item')

    useEffect(() => {

        // Create PaymentIntent as soon as the page loads
        fetch("http://localhost:4242/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
                'userEmail': userEmail,
                'item': item
            })
        })
          .then((res) => res.json())
          .then((data) => setClientSecret(data.clientSecret))
          .catch((error) => setErrorMessage("Can't connect to payment server"))
      }, [userEmail, item]);

      const options = {
        clientSecret
      };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.headerContainer}>
                <IconArrowBackOutline className={styles.back} onClick={() => navigate("/pricing")} />
                <h1>Checkout</h1>

            </div>
            {item === 'smallImagePackage' &&
                <div className={styles.purchaseInfo}>
                    <p>Small Image Package</p>
                    <h2>$10</h2>
                </div>
            }
            {item === 'largeImagePackage' &&
                <div className={styles.purchaseInfo}>
                    <p>Large Image Package</p>
                    <h2>$25</h2>
                </div>
            }

            {item === 'subscription' &&
                <div className={styles.purchaseInfo}>
                    <p>Pay-As-You-Go</p>
                    <h2>$0.10/image</h2>
                </div>
            }
            {clientSecret && (
                <Elements options={options} stripe={stripe}>
                    <CheckoutForm />
                </Elements>
            )}
            {errorMessage &&
                <p className={styles.errorMessage}>{errorMessage}</p>
            }
            
        </div>
    );
};

export default CheckoutPage;
