import React from 'react';
import styles from './pricing.module.css'

const PricingPage = () => {
  return (
    <div className={styles.pageContainer}>
      <h1>Pricing</h1>
      <div className={styles.pricingContainer}>
        <div className={styles.pricingTier}>
            <h2>Small Image Package</h2>
            <p>500 generated images</p>
            <p className={styles.price}>$10</p>
          < button>Get Started</button>
        </div>
        <div className={styles.pricingTier}>
          <h2>Large Image Package</h2>
            <p>1500 generated images</p>
          <p className={styles.price}>$25</p>
          <button>Get Started</button>
        </div>
        <div className={styles.pricingTier}>
          <h2>Pay-as-you-go</h2>
            <p>Save images on your account</p>
          <p className={styles.price}>$0.10/image</p>
          <button>Get Started</button>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
