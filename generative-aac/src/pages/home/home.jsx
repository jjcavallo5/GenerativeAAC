import React, {useEffect, useRef, useState} from "react";
import { Link } from "react-router-dom";
import styles from './home.module.css';
import { getHFImage } from "../../backend/huggingFaceFunctions";
import GAACImage from "../../components/GAACImage/GAACImage";
import { getCurrentUserEmail, isUserLoggedIn } from "../../backend/authFunctions";

function HomePage() {
    const [prompt, setPrompt] = useState('')
    const [fromHF, setFromHF] = useState(null)
    const [loading, setLoading] = useState(false)
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    const ref = useRef(null)
    
    const checkKey = e => {
        if (e.key === 'Enter') {
            handlePromptSubmission();
        }
    }

    const handlePromptSubmission = async () => {
        setPrompt('')
        setLoading(true)

        let response = await getHFImage(prompt);
        
        setLoading(false)
        setFromHF({
            url: URL.createObjectURL(response),
            blob: response
        })
        
    }

    useEffect(() => {
        isUserLoggedIn() ? setIsLoggedIn(true) : setIsLoggedIn(false)
    }, [])

    return (
        <div className={styles.pageContainer}>
            <div className={styles.sidebar}>
                {/* List of old queries */}

                {isLoggedIn ? null : 
                <p className={styles.notLoggedIn}>Log in to save prompts</p>
                }

                <div className={styles.account}>
                    <Link to="/login" style={{textDecoration: 'none'}}>
                        <span className={styles.login}>Log in</span>
                    </Link>
                    <Link to="/register" style={{textDecoration: 'none'}}>
                        <span className={styles.register}>Sign Up</span>
                    </Link>
                </div>
            </div>
            <div className={styles.content} ref={ref}>
                {fromHF == null ?
                    <div className={styles.welcome}>
                        <h1>Generative AAC</h1>
                        <p>Jeremy Cavallo</p>
                    </div> : null
                }
                {loading ? <span>Loading...</span> : null}
                {fromHF != null ? 
                <div className={styles.imgContainer}>
                    <GAACImage blob={fromHF.blob} src={fromHF.url}/> 
                </div>
                : null}
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
