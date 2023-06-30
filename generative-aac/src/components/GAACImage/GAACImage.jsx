import React from 'react'
import styles from  './GAACImage.module.css'
import { uploadBlob } from '../../backend/storageFunctions';
import { pushImageToList } from '../../backend/firestoreFunctions';

const GAACImage = props => {
    const handleSave = () => {
        uploadBlob(props.blob).then(url => pushImageToList(url, props.prompt))
    }

    return (
        <div className={styles.container}>
            <img src={props.src} className={styles.loadedImage}/>
            <a className={styles.download} href={props.src} download={'generativeAAC'}>Download</a>
            {props.loadedFromCloud ? 
                <span className={styles.saved} >Saved to cloud</span> 
                :
                <span className={styles.save} onClick={() => handleSave()}>Save to cloud</span> 
            }      
        </div>
    );
}

export default GAACImage