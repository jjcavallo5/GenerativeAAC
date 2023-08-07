import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import styles from "./home.module.css";
import { getHFImage } from "../../backend/huggingFaceFunctions";
import GAACImage from "../../components/GAACImage/GAACImage";
import {
    getSavedQueries,
    deleteImageFromList,
    decrementImageTokens,
    getImageTokenCount,
    incrementSubscriptionUsage,
    getSubscriptionActive,
} from "../../backend/firestoreFunctions";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { deleteImage } from "../../backend/storageFunctions";
import loadingAnimation from "../../animations/loading.json";
import Lottie from "lottie-react";
import QueryList from "../../components/QueryList/QueryList";

import IconMenuFold from "../../icons/menuFold";
import IconMenuUnfold from "../../icons/menuUnfold";
import ExampleImage from "../../components/ExampleImage/ExampleImage";
import LoginModal from "../../components/Modal/LoginModal";
import Logo from "../../icons/logo";

function HomePage() {
    const [prompt, setPrompt] = useState("");
    const [fromHF, setFromHF] = useState("");
    const [loading, setLoading] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [previousQueries, setPreviousQueries] = useState([]);
    const [selectedQuery, setSelectedQuery] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loginModalActive, setLoginModalActive] = useState(false);
    const [accountTokens, setAccountTokens] = useState(0);
    const [isSubscriber, setIsSubscriber] = useState(false);
    const [tooltipActive, setTooltipActive] = useState(false)

    const windowSize = useRef(window.innerWidth);
    const [navOverlayShown, setNavOverlayShown] = useState(false);
    const [collapsedSidebar, setCollapsedSidebar] = useState(
        windowSize.current < 520 ? true : false
    );

    const handleWindowResize = () => {
        if (window.innerWidth < 520) setCollapsedSidebar(true);
        else setCollapsedSidebar(false);
    };
    window.addEventListener("resize", handleWindowResize);
    const auth = getAuth();

    const checkKey = (e) => {
        if (e.key === "Enter") {
            handlePromptSubmission();
        }
    };

    const handlePromptSubmission = async () => {
        if (!isLoggedIn) {
            setLoginModalActive(true);
            return;
        }

        if (!isSubscriber) {
            let tokens = await getImageTokenCount();

            if (tokens <= 0) {
                setErrorMessage("Account is out of image tokens!");
                return;
            }
        }

        setLoading(true);
        resetToHomeState();

        let response = await getHFImage(prompt);

        if (isSubscriber) await incrementSubscriptionUsage();
        else {
            decrementImageTokens();
            setAccountTokens(accountTokens - 1);
        }

        setLoading(false);
        setFromHF({
            url: URL.createObjectURL(response),
            blob: response,
            prompt: prompt,
        });
        setPrompt("");
    };

    const resetToHomeState = () => {
        setSelectedQuery("");
        setFromHF("");
    };

    const handleOldQuerySelection = (query) => {
        setFromHF("");
        setSelectedQuery(query.url);
        if (window.innerWidth < 520) setCollapsedSidebar(true);
    };

    const pushImgToPreviousQueries = (url, prompt) => {
        let toPush = {
            url: url,
            prompt: prompt,
        };
        setPreviousQueries([toPush, ...previousQueries]);
    };

    const handleDeleteOldQuery = (event, query) => {
        event.stopPropagation();
        console.log(selectedQuery, query.url);

        deleteImageFromList(query.url, query.prompt);
        deleteImage(query.url);

        let newQueryList = previousQueries.filter((q) => {
            return q.url !== query.url;
        });

        console.log(selectedQuery, fromHF, "JO");
        setPreviousQueries(newQueryList);

        if (selectedQuery === query.url) {
            console.log("asdfasdf");
            resetToHomeState();
        }
    };

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsLoggedIn(true);

                getSavedQueries()
                    .then((queries) => setPreviousQueries(queries))
                    .catch((error) => console.error(error));
                getImageTokenCount().then((tokens) => setAccountTokens(tokens));
                getSubscriptionActive()
                    .then((active) => {
                        if (active) setIsSubscriber(true);
                        else setIsSubscriber(false)
                    })
                    .catch((error) => setIsSubscriber(false));
            } else {
                setIsLoggedIn(false);
            }
        });
    }, [auth, isLoggedIn]);

    return (
        <div className={styles.pageContainer} onClick={() => {
            setNavOverlayShown(false)
            setTooltipActive(false)
        }}>
            <LoginModal active={loginModalActive} deactivate={() => setLoginModalActive(false)} />
            {collapsedSidebar ? null : (
                <div className={styles.sidebar}>
                    {!collapsedSidebar && (
                        <div
                            className={styles.toggleSidebarClose}
                            onClick={() => setCollapsedSidebar(true)}
                        >
                            <IconMenuFold
                                className={styles.toggleMenuIcon}
                                onClick={() => setCollapsedSidebar(false)}
                            />
                        </div>
                    )}
                    {isLoggedIn ? (
                        <QueryList 
                            handleOldQuerySelection={handleOldQuerySelection}
                            handleDeleteOldQuery={handleDeleteOldQuery}
                            selectedQuery={selectedQuery}
                            previousQueries={previousQueries}
                        />
                    ) : (
                        <p className={styles.notLoggedIn}>Log in to save prompts</p>
                    )}
                    {navOverlayShown && (
                        <div className={styles.navModal}>
                            <Link to="/about" style={{ textDecoration: "none" }}>
                                <div className={styles.navModalLink}>
                                    <span className={styles.login}>About</span>
                                </div>
                            </Link>
                            <Link to="/pricing" style={{ textDecoration: "none" }}>
                                <div className={styles.navModalLink}>
                                    <span className={styles.login}>Pricing</span>
                                </div>
                            </Link>
                            <div className={styles.addBreak}></div>
                            {isLoggedIn && (
                                <Link to="/account" style={{ textDecoration: "none" }}>
                                    <div className={styles.navModalLink}>
                                        <span className={styles.login}>Settings</span>
                                    </div>
                                </Link>
                            )}

                            {isLoggedIn && (
                                <div
                                    className={styles.navModalLink}
                                    onClick={() => {
                                        auth.signOut();
                                        resetToHomeState();
                                    }}
                                >
                                    <span>Log out</span>
                                </div>
                            )}

                            {!isLoggedIn && (
                                <span
                                    className={styles.loginButton}
                                    onClick={() => setLoginModalActive(true)}
                                >
                                    Log in
                                </span>
                            )}

                            {!isLoggedIn && (
                                <Link
                                    to="/register"
                                    className={styles.loginButton}
                                    style={{ textDecoration: "none" }}
                                >
                                    <span className={styles.register}>Sign Up</span>
                                </Link>
                            )}

                            {isLoggedIn && !isSubscriber && (
                                <span className={styles.tokenCountText}>
                                    Image Tokens: {accountTokens}
                                </span>
                            )}
                            {isLoggedIn && isSubscriber && (
                                <span className={styles.tokenCountText}>Pay-Per-Image Plan</span>
                            )}
                        </div>
                    )}

                    <div className={styles.account}>
                        <div
                            className={styles.queryContainer}
                            onClick={(e) => {
                                e.stopPropagation();
                                if (navOverlayShown) setNavOverlayShown(false);
                                else setNavOverlayShown(true);
                            }}
                        >
                            <span>Menu</span>
                        </div>
                    </div>
                </div>
            )}

            <div className={!collapsedSidebar ? styles.content : styles.contentFullWidth}>
                {collapsedSidebar && (
                    <div className={styles.toggleSidebar}>
                        <IconMenuUnfold
                            className={styles.toggleMenuIcon}
                            onClick={() => setCollapsedSidebar(false)}
                        />
                    </div>
                )}

                {fromHF === "" && selectedQuery === "" ? (
                    <div className={isLoggedIn ? styles.welcome : styles.welcomeNotLoggedIn}>
                        <h1>Generative AAC</h1>
                        <p>The possibilities are endless!</p>
                    </div>
                ) : null}

                {!isLoggedIn && (
                    <div className={styles.examplesContainer}>
                        <span>Here's what our users have been creating.</span>
                        <ExampleImage
                            numImages={2}
                            onLoading={() => setLoading(true)}
                            onFinishLoading={() => setLoading(false)}
                        />
                    </div>
                )}
                {loading && (
                    <div className={styles.loadingContainer}>
                        <Lottie
                            animationData={loadingAnimation}
                            loop={true}
                            className={styles.loadingAnimation}
                        />
                        <span className={styles.loadingText}>Loading the model may take a few minutes</span>
                        <span className={styles.takingTooLong} 
                        onClick={(e) => {
                            setTooltipActive(true)
                            e.stopPropagation()
                            }}>
                                Why is it taking so long?
                        </span>
                        {tooltipActive &&
                            <div className={styles.tooltip}>
                                <p>
                                    Our model is hosted on HuggingFace, which hosts thousands of models.
                                    If our model hasn't been used for a while, HuggingFace has to reload
                                    it into memory before it can begin a computation.
                                </p>
                            </div>
                        }
                    </div>
                )}
                {fromHF !== "" && (
                    <div className={styles.imgContainer}>
                        <GAACImage
                            blob={fromHF.blob}
                            src={fromHF.url}
                            prompt={fromHF.prompt}
                            saveCallback={(url) => pushImgToPreviousQueries(url, fromHF.prompt)}
                            isLoggedIn={isLoggedIn}
                        />
                    </div>
                )}

                {selectedQuery !== "" && (
                    <div className={styles.imgContainer}>
                        <GAACImage
                            src={selectedQuery}
                            loadedFromCloud={true}
                            isLoggedIn={isLoggedIn}
                        />
                    </div>
                )}
                <div className={styles.promptContainer}>
                    {errorMessage && <span style={{ color: "red" }}>Error: {errorMessage}</span>}
                    <div className={styles.promptBar}>
                        <input
                            type="text"
                            className={styles.prompt}
                            placeholder="Enter a prompt"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            onKeyDown={(e) => checkKey(e)}
                        />
                        <svg
                            height="20"
                            width="20"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 16 16"
                            fill="none"
                            className={styles.submitSvg}
                            strokeWidth="2"
                            onClick={() => handlePromptSubmission()}
                        >
                            <path
                                d="M.5 1.163A1 1 0 0 1 1.97.28l12.868 6.837a1 1 0 0 1 0 1.766L1.969 15.72A1 1 0 0 1 .5 14.836V10.33a1 1 0 0 1 .816-.983L8.5 8 1.316 6.653A1 1 0 0 1 .5 5.67V1.163Z"
                                fill="currentColor"
                            ></path>
                        </svg>
                    </div>
                    <p className={styles.warning}>
                        Images generated by AI may have artifacts that conflict with human
                        interpretations
                    </p>
                </div>
            </div>
        </div>
    );
}

export default HomePage;
