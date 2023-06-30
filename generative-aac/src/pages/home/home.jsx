import React, {useEffect, useRef, useState} from "react";
import { Link } from "react-router-dom";
import styles from './home.module.css';
import { getHFImage } from "../../backend/huggingFaceFunctions";
import GAACImage from "../../components/GAACImage/GAACImage";
import { getCurrentUserEmail, isUserLoggedIn } from "../../backend/authFunctions";
import { getSavedQueries } from "../../backend/firestoreFunctions";
import { onAuthStateChanged, getAuth } from "firebase/auth";


function HomePage() {
    const [prompt, setPrompt] = useState('')
    const [fromHF, setFromHF] = useState(null)
    const [loading, setLoading] = useState(false)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [previousQueries, setPreviousQueries] = useState([])
    const [selectedQuery, setSelectedQuery] = useState(null)
    const auth = getAuth();
    
    const checkKey = e => {
        if (e.key === 'Enter') {
            handlePromptSubmission();
        }
    }
    
    const handlePromptSubmission = async () => {
        setLoading(true)
        
        let response = await getHFImage(prompt);
        
        setLoading(false)
        setFromHF({
            url: URL.createObjectURL(response),
            blob: response,
            prompt: prompt
        })
        setPrompt('')
    }

    const handleOldQuerySelection = query => {
        setSelectedQuery(query.url)
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
    },[isLoggedIn])
    
    const QueryList = () => {
        return (
            <div className={styles.oldQueryList}>
                <div className={styles.oldQueriesHeaderContainer}>
                    <p className={styles.oldQueriesHeader}>Previous</p>
                </div>
                {previousQueries.map((query, i) => {
                    return (
                        <div key={i} className={styles.queryContainer} onClick={() => handleOldQuerySelection(query)}>
                            <span className={styles.previousQueries}>{query.prompt}</span>
                        </div>
                    );
                })}
            </div>
        )
    }

    return (
        <div className={styles.pageContainer}>
            <div className={styles.sidebar}>
                {/* List of old queries */}

                {isLoggedIn ? <QueryList /> : 
                <p className={styles.notLoggedIn}>Log in to save prompts</p>
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
                        <div className={styles.queryContainer} onClick={() => auth.signOut()}>
                            <span>Account Settings</span>
                        </div>
                    </div>
                }
            </div>
            <div className={styles.content} >
                {(fromHF == null && selectedQuery == null) ?
                    <div className={styles.welcome}>
                        <h1>Generative AAC</h1>
                        <p>Jeremy Cavallo</p>
                    </div> : null
                }
                {loading ? <span>Loading...</span> : null}
                {fromHF != null ? 
                <div className={styles.imgContainer}>
                    <GAACImage blob={fromHF.blob} src={fromHF.url} prompt={fromHF.prompt}/> 
                </div>
                : null}

                {selectedQuery && 
                <div className={styles.imgContainer}>
                    <GAACImage src={selectedQuery} loadedFromCloud={true}/>
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
