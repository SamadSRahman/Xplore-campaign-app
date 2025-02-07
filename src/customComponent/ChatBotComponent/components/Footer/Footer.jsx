import React from "react";
import styles from "./Footer.module.css";
import { FaMicrophone, FaKeyboard } from "react-icons/fa";
import PropTypes from "prop-types";

const Footer = ({ selectedTab, setSelectedTab }) => {
  return (
    <footer className={styles.footer}>
      <div
        onClick={() => setSelectedTab("chat")}
        className={`${styles.icon} ${selectedTab === "chat" ? styles.active : ""}`}
      >
        <FaKeyboard />
        <span>Chat</span>
      </div>
      <div
        onClick={() => setSelectedTab("audio")}
        className={`${styles.icon} ${selectedTab === "audio" ? styles.active : ""}`}
      >
        <FaMicrophone />
        <span>Audio</span>
      </div>
    </footer>
  );
};

Footer.propTypes = {
  selectedTab: PropTypes.string.isRequired,
  setSelectedTab: PropTypes.func.isRequired,
};

export default Footer;
