import React from 'react'
import styles from  './GAACImage.module.css'

const GAACImage = props => {
    return (
        <div className={styles.container}>
            <img src={props.src} className={styles.loadedImage}/>
            <a className={styles.download} href={props.src} download={'generativeAAC'}>Download</a>
        </div>
    );
}

export default GAACImage