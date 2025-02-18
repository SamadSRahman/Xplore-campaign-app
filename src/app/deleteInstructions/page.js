import React from 'react';
import { FaTrash, FaUser, FaCheck, FaExclamationTriangle } from 'react-icons/fa';
import styles from './DeleteInstructions.module.css';

const DeleteInstructions = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        <FaTrash className={styles.titleIcon} /> Steps to Delete Your Account
      </h1>
      
      <div className={styles.instructionSection}>
        <div className={styles.instructionStep}>
          <div className={styles.stepNumber}>1</div>
          <div className={styles.stepContent}>
            <h2>Navigate to the Profile Screen</h2>
            <ul>
              <li>
                <FaUser className={styles.listIcon} /> 
                Open the app and log in using your credentials if {"you're"} not already logged in.
              </li>
              <li>
                From the Landing Page, tap on the Profile option (usually located in the bottom navigation bar).
              </li>
            </ul>
          </div>
        </div>
        
        <div className={styles.instructionStep}>
          <div className={styles.stepNumber}>2</div>
          <div className={styles.stepContent}>
            <h2>Initiate the Account Deletion Process</h2>
            <ul>
              <li>
                In the Profile Screen, locate and tap the Delete Account option.
              </li>
            </ul>
          </div>
        </div>
        
        <div className={styles.instructionStep}>
          <div className={styles.stepNumber}>3</div>
          <div className={styles.stepContent}>
            <h2>Confirm Deletion</h2>
            <ul>
              <li>
                <FaCheck className={styles.listIcon} /> 
                A pop-up message will appear asking, {`"Are you sure you want to delete your account? This action cannot be undone."`}
              </li>
              <li>
                If you are certain you want to delete your account, select Yes.
              </li>
            </ul>
          </div>
        </div>
        
        <div className={styles.instructionStep}>
          <div className={styles.stepNumber}>4</div>
          <div className={styles.stepContent}>
            <h2>Account Deletion Complete</h2>
            <ul>
              <li>
                <FaCheck className={styles.listIcon} /> 
                Upon confirmation, your account will be deleted from the app.
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className={styles.warningSection}>
        <h2>
          <FaExclamationTriangle className={styles.warningIcon} /> 
          Important Notes
        </h2>
        <p>
          Once you delete your account, all associated data may be permanently removed.
        </p>
      </div>
    </div>
  );
};

export default DeleteInstructions;