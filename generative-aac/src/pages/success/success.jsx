import React from 'react'
import styles from './success.module.css'
import { useNavigate } from 'react-router-dom'


const SuccessPage = () => {
    const navigate = useNavigate()

    return (
        <div className={styles.container}>
            <h1>Thank you for your purchase!</h1>
            <p>Your account has been funded.</p>
            <button onClick={() => navigate('/')}>Start Generating!</button>
        </div>
    )
}

export default SuccessPage
