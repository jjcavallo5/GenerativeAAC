import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Account.module.css";
import IconArrowBackOutline from "../../icons/arrowBack";
import { getImageTokenCount, getSubscriptionID, cancelSubscription, getSubscriptionDueDate, getSubscriptionUsage } from "../../backend/firestoreFunctions";
import Modal from "../../components/Modal/Modal";
import loadingAnimation from "../../animations/loading.json";
import Lottie from "lottie-react";
import { onAuthStateChanged, getAuth } from "firebase/auth";

function AccountPage() {
    const [isSubscriber, setIsSubscriber] = useState(false);
    const [accountTokens, setAccountTokens] = useState(0);
    const [modalActive, setModalActive] = useState(false);
    const [loading, setLoading] = useState(false)
    const [cancelled, setCancelled] = useState(false)
    const [subscriptionDue, setSubscriptionDue] = useState(0)
    const [subscriptionUsage, setSubscriptionUsage] = useState(0)
    const navigate = useNavigate();
    const auth = getAuth()

    const handleSubscriptionCancel = () => {
        setLoading(true)
        cancelSubscription().then(() => {
            setLoading(false)
            setCancelled(true)
        })
    }

    const getDate = () => {
        let date = new Date(subscriptionDue * 1000)
        
        return date.toLocaleDateString(subscriptionDue)
    }

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                getImageTokenCount().then((tokens) => setAccountTokens(tokens));
                getSubscriptionID()
                    .then((subID) => {
                        if (subID) setIsSubscriber(true);
                        else setIsSubscriber(false)
                    })
                    .catch((error) => setIsSubscriber(false));
            } else {
                navigate('/')
            }
        });

        if (isSubscriber && !cancelled) {
            console.log("Sub")
            getSubscriptionDueDate().then(due => setSubscriptionDue(due))
            getSubscriptionUsage().then(usage => setSubscriptionUsage(usage))
        }
    }, [cancelled, isSubscriber, auth, navigate]);

    return (
        <div className={styles.pageContainer}>
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
                    {isSubscriber && !cancelled ? (
                        <div className={styles.subscriptionContainer}>
                            <h2>Pay-Per-Image Subscription Active</h2>
                            <div className={styles.subscriptionDetails}>
                                <p>Subscription Details</p>
                                <table>
                                    <tr>
                                        <td>Images Generated</td>
                                        <td>{subscriptionUsage}</td>
                                    </tr>
                                    <tr>
                                        <td>Estimated Cost</td>
                                        <td>${(subscriptionUsage * 0.10).toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                        <td>Next Payment</td>
                                        <td>{getDate()}</td>
                                    </tr>
                                </table>
                            </div>
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
    );
}

export default AccountPage;
