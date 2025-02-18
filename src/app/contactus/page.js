// ContactUs.jsx

import React from 'react';
import styles from './ContactUs.module.css';

const ContactUs = () => {
    return (
    <div className={styles.wrapper}>
        <div className={styles.container}>
      <h1 className={styles.title}>Contact Us</h1>
      <p className={styles.subtitle}>
        Feel free to reach out to us at any time. We are here to help you with any questions or support you may need!
      </p>

      <div className={styles.contactCard}>
        <h2 className={styles.cardTitle}>Xircular Tech Private Limited</h2>
        <p className={styles.contactInfo}>
          <strong>Legal Entity:</strong> Xircular Tech Private Limited
        </p>
        <p className={styles.contactInfo}>
          <strong>Registered Address:</strong> 18, 3rd Floor, 9th Main Road, 2nd Block, Jayanagar, Bangalore, Karnataka, India - 560011
        </p>
        <p className={styles.contactInfo}>
          <strong>Operational Address:</strong> 18, 3rd Floor, 9th Main Road, 2nd Block, Jayanagar, Bangalore, Karnataka, India - 560011
        </p>
        <p className={styles.contactInfo}>
          <strong>PIN Code:</strong> 560011
        </p>
        <p className={styles.contactInfo}>
          <strong>Telephone:</strong> +91 8951142369
        </p>
        <p className={styles.contactInfo}>
          <strong>Email:</strong> <a href="mailto:info@xircular.io" className={styles.emailLink}>info@xircular.io</a>
        </p>
      </div>
    </div>
    </div>
    );
};

export default ContactUs;
