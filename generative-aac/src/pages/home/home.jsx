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
    getSubscriptionID,
    incrementSubscriptionUsage,
} from "../../backend/firestoreFunctions";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { deleteImage } from "../../backend/storageFunctions";
import OldQuery from "../../components/OldQueries/OldQuery";
import loadingAnimation from "../../animations/loading.json";
import Lottie from "lottie-react";

import IconMenuFold from "../../icons/menuFold";
import IconMenuUnfold from "../../icons/menuUnfold";
import ExampleImage from "../../components/ExampleImage/ExampleImage";
import LoginModal from "../../components/Modal/LoginModal";

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
            } else {
                setIsLoggedIn(false);
            }
        });

        if (isLoggedIn) {
            getSavedQueries()
                .then((queries) => setPreviousQueries(queries))
                .catch((error) => console.error(error));
            getImageTokenCount().then((tokens) => setAccountTokens(tokens));
            getSubscriptionID()
                .then((subID) => {
                    if (subID) setIsSubscriber(true);
                })
                .catch((error) => setIsSubscriber(false));
        }
    }, [auth, isLoggedIn]);

    const QueryList = () => {
        return (
            <div className={styles.oldQueryList}>
                <div className={styles.oldQueriesHeaderContainer}>
                    <p className={styles.oldQueriesHeader}>Previous</p>
                </div>
                <div className={styles.scrollable}>
                    {previousQueries.map((query, i) => {
                        return (
                            <OldQuery
                                query={query}
                                onSelect={handleOldQuerySelection}
                                onDeleteSelected={handleDeleteOldQuery}
                                isSelected={selectedQuery === query.url}
                                key={i}
                            />
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className={styles.pageContainer} onClick={() => setNavOverlayShown(false)}>
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
                        <QueryList />
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
                            <Link to="/account" style={{ textDecoration: "none" }}>
                                <div className={styles.navModalLink}>
                                    <span className={styles.login}>Settings</span>
                                </div>
                            </Link>
                            <div
                                className={styles.navModalLink}
                                onClick={() => {
                                    auth.signOut();
                                    resetToHomeState();
                                }}
                            >
                                <span>Log out</span>
                            </div>
                            {!isSubscriber && (
                                <span className={styles.tokenCountText}>
                                    Account Tokens: {accountTokens}
                                </span>
                            )}
                            {isSubscriber && (
                                <span className={styles.tokenCountText}>Pay-Per-Image Plan</span>
                            )}
                        </div>
                    )}

                    {!isLoggedIn ? (
                        <div className={styles.account}>
                            <span
                                className={styles.login}
                                onClick={() => setLoginModalActive(true)}
                            >
                                Log in
                            </span>
                            <Link to="/register" style={{ textDecoration: "none" }}>
                                <span className={styles.register}>Sign Up</span>
                            </Link>
                        </div>
                    ) : (
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
                    )}
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
                        <span>Loading the model may take a few minutes</span>
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
