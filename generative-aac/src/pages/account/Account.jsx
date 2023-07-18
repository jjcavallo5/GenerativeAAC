import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Account.module.css";
import IconArrowBackOutline from "../../icons/arrowBack";
import { getImageTokenCount, getSubscriptionID, cancelSubscription } from "../../backend/firestoreFunctions";
import Modal from "../../components/Modal/Modal";
import loadingAnimation from "../../animations/loading.json";
import Lottie from "lottie-react";

function AccountPage() {
    const [isSubscriber, setIsSubscriber] = useState(false);
    const [accountTokens, setAccountTokens] = useState(0);
    const [modalActive, setModalActive] = useState(false);
    const [loading, setLoading] = useState(false)
    const [cancelled, setCancelled] = useState(false)
    const navigate = useNavigate();

    const handleSubscriptionCancel = () => {
        setLoading(true)
        cancelSubscription().then(() => {
            setLoading(false)
            setCancelled(true)
        })
    }

    useEffect(() => {
        getImageTokenCount().then((tokens) => setAccountTokens(tokens));
        getSubscriptionID()
            .then((subID) => {
                if (subID !== undefined) setIsSubscriber(true);
                else setIsSubscriber(false)
            })
            .catch((error) => setIsSubscriber(false));
    }, [cancelled]);

    return (
        <div className={styles.pageContainer}>
            <div className={styles.loginContainer}>
                <div className={styles.header}>
                    <IconArrowBackOutline className={styles.back} onClick={() => navigate("/")} />
                    <h1>Account</h1>
                </div>
                <Modal active={modalActive} deactivate={() => setModalActive(false)}>
                    <div className={styles.modal}>
                        {!cancelled && <h2>Are you sure?</h2>}
                        {!cancelled && <p>After cancelling your subscriptions you will need tokens to generate new images</p>}
                        {!loading && !cancelled &&
                            <div className={styles.modalButtonContainer}>
                                <button onClick={() => handleSubscriptionCancel()}>Cancel Subscription</button>
                                <button onClick={() => setModalActive(false)}>Keep Subscription</button>
                            </div>
                        }

                        {loading &&
                            <Lottie
                                animationData={loadingAnimation}
                                loop={true}
                                className={styles.loadingAnimation}
                            />
                        }

                        {cancelled &&
                            <span>Subscription Cancelled</span>
                        }

                        {cancelled && <button onClick={() => setModalActive(false)}>Close</button>}
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
