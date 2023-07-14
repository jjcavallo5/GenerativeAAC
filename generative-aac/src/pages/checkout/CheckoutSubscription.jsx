import React, { useState } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { getCurrentUserEmail } from "../../backend/authFunctions";
import { storeSubscriptionID } from "../../backend/firestoreFunctions";
import styles from "./CheckoutForm.module.css";

import Modal from "../../components/Modal/Modal";
import Lottie from "lottie-react";
import loadingAnimation from "../../animations/loading.json";

export default function CheckoutSubscription() {
    const stripe = useStripe();
    const elements = useElements();

    const [errorMessage, setErrorMessage] = useState();
    const [loading, setLoading] = useState(false);

    const handleError = (error) => {
        setLoading(false);
        setErrorMessage(error.message);
    };

    const handleSubmit = async (event) => {
        // We don't want to let default form submission happen here,
        // which would refresh the page.
        event.preventDefault();

        if (!stripe) {
            // Stripe.js hasn't yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return;
        }

        setLoading(true);

        // Trigger form validation and wallet collection
        const { error: submitError } = await elements.submit();
        if (submitError) {
            handleError(submitError);
            return;
        }

        // Create the Subscription
        let data = { email: getCurrentUserEmail() };
        console.log(data);
        const res = await fetch("http://localhost:4242/create-subscription", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        const { subscriptionId, clientSecret } = await res.json();

        storeSubscriptionID(subscriptionId);

        // Confirm the Subscription using the details collected by the Payment Element
        const { error } = await stripe.confirmSetup({
            elements,
            clientSecret,
            confirmParams: {
                return_url: "http://localhost:3000/success",
            },
        });

        if (error) {
            // This point is only reached if there's an immediate error when
            // confirming the payment. Show the error to your customer (for example, payment details incomplete)
            handleError(error);
        } else {
            // Your customer is redirected to your `return_url`. For some payment
            // methods like iDEAL, your customer is redirected to an intermediate
            // site first to authorize the payment, then redirected to the `return_url`.
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.paymentForm}>
            <PaymentElement />
            <button type="submit" disabled={!stripe || loading}>
                {!loading ? (
                    "Submit Payment"
                ) : (
                    <Lottie
                        animationData={loadingAnimation}
                        loop={true}
                        className={styles.loadingAnimation}
                        style={{ height: "50px" }}
                    />
                )}
            </button>
            {errorMessage && <div>{errorMessage}</div>}
        </form>
    );
}
