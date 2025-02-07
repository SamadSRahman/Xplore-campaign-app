import styles from "./ChatBox.module.css";
import ChatBubble from "../ChatBubble/ChatBubble";
import PropTypes from 'prop-types'
import React,{  useRef } from "react";

const ChatBox = ({ messages }) => {
    const chatEndRef = useRef(null);
  
    // useEffect(() => {
    //   chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    // }, [messages]);
  
    return (
      <div className={styles.chatBox}>
        {messages.map((msg, index) => (
          <ChatBubble
            key={index}
            message={msg.text}
            isUser={msg.isUser}
          />
        ))}
        <div ref={chatEndRef} />
      </div>
    );
  };
  

ChatBox.propTypes = {
    messages: PropTypes.array
}

export default ChatBox
