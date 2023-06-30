import React, {useEffect, useState, useRef} from "react";
import { Link } from "react-router-dom";
import styles from './home.module.css';
import { getHFImage } from "../../backend/huggingFaceFunctions";
import GAACImage from "../../components/GAACImage/GAACImage";
import { getSavedQueries, deleteImageFromList } from "../../backend/firestoreFunctions";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import IconTrash from "../../icons/trash";
import { deleteImage } from "../../backend/storageFunctions";


function HomePage() {
    const [prompt, setPrompt] = useState('')
    const [fromHF, setFromHF] = useState('')
    const [loading, setLoading] = useState(false)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [previousQueries, setPreviousQueries] = useState([])
    const [selectedQuery, setSelectedQuery] = useState('')

    const windowSize = useRef(window.innerWidth);
    const [navOverlayShown, setNavOverlayShown] = useState(false)
    const [collapsedSidebar, setCollapsedSidebar] = useState(
        windowSize.current < 520 ? true : false
    )

    const handleWindowResize = () => {
        if (window.innerWidth < 520)
            setCollapsedSidebar(true)
        else setCollapsedSidebar(false)
    }
    window.addEventListener('resize', handleWindowResize)
    const auth = getAuth();
    
    const checkKey = e => {
        if (e.key === 'Enter') {
            handlePromptSubmission();
        }
    }
    
    const handlePromptSubmission = async () => {
        setLoading(true)
        resetToHomeState()
        
        let response = await getHFImage(prompt);
        
        setLoading(false)
        setFromHF({
            url: URL.createObjectURL(response),
            blob: response,
            prompt: prompt
        })
        setPrompt('')
    }

    const resetToHomeState = () => {
        setSelectedQuery('')
        setFromHF('')
    }

    const handleOldQuerySelection = query => {
        setFromHF('')
        setSelectedQuery(query.url)
    }

    const pushImgToPreviousQueries = (url, prompt) => {
        let toPush = {
            url: url,
            prompt: prompt
        }
        setPreviousQueries([toPush, ...previousQueries])
    }

    const handleDeleteOldQuery = (event, query) => {
        event.stopPropagation();
        console.log(selectedQuery , query.url)
       
        deleteImageFromList(query.url, query.prompt)
        deleteImage(query.url)

        let newQueryList = previousQueries.filter(q => {
            return q.url !== query.url
        })
        
        console.log(selectedQuery, fromHF, "JO")
        setPreviousQueries(newQueryList)

        if (selectedQuery === query.url) {
            console.log("asdfasdf")
            resetToHomeState()
        }
    }
    
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log("True")
                setIsLoggedIn(true)
            } else {
                console.log("False")
                
                setIsLoggedIn(false)
            }
        });

        if (isLoggedIn) {
            getSavedQueries().then(queries => setPreviousQueries(queries))
        }
    },[auth, isLoggedIn])
    
    const QueryList = () => {
        return (
            <div className={styles.oldQueryList}>
                <div className={styles.oldQueriesHeaderContainer}>
                    <p className={styles.oldQueriesHeader}>Previous</p>
                </div>
                {previousQueries.map((query, i) => {
                    let containerClassName = styles.queryContainer
                    if (selectedQuery === query.url)
                        containerClassName = styles.queryContainer + ' ' + styles.queryContainerSelected
                    
                    return (
                        <div key={i} className={containerClassName} onClick={() => handleOldQuerySelection(query)}>
                            <div className={styles.queryTextContainer}>
                                <span className={styles.previousQueries}>{query.prompt}</span>
                            </div>
                            <IconTrash className={styles.trashIcon} onClick={(e) => {handleDeleteOldQuery(e, query)}}/>
                        </div>
                    );
                })}
            </div>
        )
    }

    return (
        <div className={styles.pageContainer} onClick={() => setNavOverlayShown(false)}>
            {console.log()}
            {collapsedSidebar ? null :
                <div className={styles.sidebar}>
                    {!collapsedSidebar &&
                        <div className={styles.toggleSidebarClose} onClick={() => setCollapsedSidebar(true)}>
                        </div>
                    }
                    {/* List of old queries */}

                    {isLoggedIn ? <QueryList /> : 
                    <p className={styles.notLoggedIn}>Log in to save prompts</p>
                    }
                    {navOverlayShown &&
                        <div className={styles.navModal}>
                            <div className={styles.navModalLink}>
                                <span>About</span>
                            </div>
                            <div className={styles.navModalLink}>
                                <span>Pricing</span>
                            </div>
                            <div className={styles.addBreak}></div>
                            <div className={styles.navModalLink}>
                                <span>Log out</span>
                            </div>
                        </div>
                    }
                    
                    {!isLoggedIn ?
                        <div className={styles.account}>
                            <Link to="/login" style={{textDecoration: 'none'}}>
                                <span className={styles.login}>Log in</span>
                            </Link>
                            <Link to="/register" style={{textDecoration: 'none'}}>
                                <span className={styles.register}>Sign Up</span>
                            </Link>
                        </div>
                    :
                        <div className={styles.account}>
                            <div className={styles.queryContainer} onClick={(e) => {
                                e.stopPropagation()
                                setNavOverlayShown(true)
                            }}>
                                <span>Account Settings</span>
                            </div>
                        </div>
                    }
                </div>
            }

            <div className={
                !collapsedSidebar ? styles.content : styles.contentFullWidth
            } >
                {collapsedSidebar &&
                    <div className={styles.toggleSidebar} onClick={() => setCollapsedSidebar(false)}>
                    </div>
                }

                {(fromHF === '' && selectedQuery === '') ?
                    <div className={styles.welcome}>
                        <h1>Generative AAC</h1>
                        <p>Jeremy Cavallo</p>
                    </div> : null
                }
                {loading && <span>Loading...</span>}
                {(fromHF !== '') &&
                    <div className={styles.imgContainer}>

                        <GAACImage blob={fromHF.blob} src={fromHF.url} prompt={fromHF.prompt} saveCallback={(url) => pushImgToPreviousQueries(url, fromHF.prompt)}/> 
                    </div>
                }

                {(selectedQuery !== '') && 
                <div className={styles.imgContainer}>
                    <GAACImage src={selectedQuery} loadedFromCloud={true} />
                </div>
                }
                <div className={styles.promptContainer}>
                    <div className={styles.promptBar}>
                        <input type="text" className={styles.prompt} placeholder="Enter a prompt" value={prompt} onChange={(e) => setPrompt(e.target.value)} onKeyDown={(e) => checkKey(e)}/>
                        <svg height="20" width="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none" className={styles.submitSvg} strokeWidth="2" onClick={() => handlePromptSubmission()}><path d="M.5 1.163A1 1 0 0 1 1.97.28l12.868 6.837a1 1 0 0 1 0 1.766L1.969 15.72A1 1 0 0 1 .5 14.836V10.33a1 1 0 0 1 .816-.983L8.5 8 1.316 6.653A1 1 0 0 1 .5 5.67V1.163Z" fill="currentColor"></path></svg>
                    </div>
                    <p className={styles.warning}>Images generated by AI may have artifacts that conflict with human interpretations</p>
                </div>
            </div>
        </div>
    );
}

export default HomePage;
