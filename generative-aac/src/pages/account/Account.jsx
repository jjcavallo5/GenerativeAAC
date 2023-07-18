import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Account.module.css";
import IconArrowBackOutline from "../../icons/arrowBack";
import { getImageTokenCount, getSubscriptionID } from "../../backend/firestoreFunctions";
import Modal from "../../components/Modal/Modal";

function AccountPage() {
    const [isSubscriber, setIsSubscriber] = useState(false);
    const [accountTokens, setAccountTokens] = useState(0);
    const [modalActive, setModalActive] = useState(false)
    const navigate = useNavigate();

    const handleSubscriptionCancel = () => {
        console.log("cancel")
    }

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
                <Modal active={modalActive} deactivate={() => setModalActive(false)}>
                    <div className={styles.modal}>
                        <h2>Are you sure?</h2>
                        <p>After cancelling your subscriptions you will need tokens to generate new images</p>
                        <div className={styles.modalButtonContainer}>
                            <button onClick={() => handleSubscriptionCancel()}>Cancel Subscription</button>
                            <button onClick={() => setModalActive(false)}>Keep Subscription</button>
                        </div>
                    </div>
                </Modal>
                <p className={styles.subheader}>Manage your account</p>
                <div className={styles.details}>
                    {isSubscriber ? (
                        <div className={styles.subscriptionContainer}>
                            <span>Pay-Per-Image Subscription Active</span>
                            <button onClick={() => setModalActive(true)}>Cancel Subscription</button>
                        </div>
                    ) : (
                        <div className={styles.subscriptionContainer}>
                            <span>{accountTokens} Image Tokens Remaining</span>
                            <button onClick={() => navigate('/pricing')}>Get More Tokens</button>
                        </div>
                        
                    )}
                </div>
            </div>
        </div>
    );
}

export default AccountPage;
