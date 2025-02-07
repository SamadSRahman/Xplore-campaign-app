// src/components/ChatBubble/ChatBubble.jsx
import PropTypes from 'prop-types'
import styles from "./ChatBubble.module.css";
import React from 'react'

const ChatBubble = ({ message, isUser }) => {
  return (
    <div
      className={`${styles.chatBubble} ${
        isUser ? styles.userBubble : styles.botBubble
      }`}
    >
      {message}
    </div>
  );
};

export default ChatBubble;

ChatBubble.propTypes={
    message: PropTypes.string.isRequired,
    isUser: PropTypes.bool.isRequired
}
