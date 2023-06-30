import React, {useState} from 'react'
import styles from  './GAACImage.module.css'
import { uploadBlob } from '../../backend/storageFunctions';
import { pushImageToList } from '../../backend/firestoreFunctions';

const GAACImage = props => {
    const [saved, setSaved] = useState(props.loadedFromCloud)

    const handleSave = async () => {
        await uploadBlob(props.blob).then(url =>{ 
            pushImageToList(url, props.prompt)
            props.saveCallback(url)
            setSaved(true)
        })
    }

    return (
        <div className={styles.container}>
            <img src={props.src} className={styles.loadedImage} alt="Generated by stable diffusion"/>
            <a className={styles.download} href={props.src} download={'generativeAAC'}>Download</a>
            {saved ? 
                <span className={styles.saved} >Saved to cloud</span> 
                :
                <span className={styles.save} onClick={() => handleSave()}>Save to cloud</span> 
            }      
        </div>
    );
}

export default GAACImage