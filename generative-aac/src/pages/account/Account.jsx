import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Account.module.css";
import IconArrowBackOutline from "../../icons/arrowBack";
import { getImageTokenCount, getSubscriptionID } from "../../backend/firestoreFunctions";

function AccountPage() {
    const [isSubscriber, setIsSubscriber] = useState(false);
    const [accountTokens, setAccountTokens] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        getImageTokenCount().then((tokens) => setAccountTokens(tokens));
        getSubscriptionID()
            .then((subID) => {
                if (subID) setIsSubscriber(true);
            })
            .catch((error) => setIsSubscriber(false));
    }, []);

    return (
        <div className={styles.pageContainer}>
            <div className={styles.loginContainer}>
                <div className={styles.header}>
                    <IconArrowBackOutline className={styles.back} onClick={() => navigate("/")} />
                    <h1>Account</h1>
                </div>
                <p className={styles.subheader}>Manage your account</p>
                <div className={styles.details}>
                    {isSubscriber ? (
                        <span>Pay-Per-Image Subscription Active</span>
                    ) : (
                        <span>Image Tokens: {accountTokens}</span>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AccountPage;
