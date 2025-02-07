// import React, { useEffect, useState } from "react";
// import { Conversation } from "@11labs/client";
// import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
// import styles from "./ElevenLabComponent.module.css";

// const ElevenLabComponent = ({ setPlaceHolderMsg }) => {
//   const [isActive, setIsActive] = useState(false);
//   const [agentStatus, setAgentStatus] = useState("listening");
//   const [conversation, setConversation] = useState(null);

//   // Reset placeholder message when conversation ends
//   useEffect(() => {
//     if (!isActive) {
//       setPlaceHolderMsg("Ask anything...");
//     }
//   }, [isActive, setPlaceHolderMsg]);

//   const handleToggleConversation = async () => {
//     if (!isActive) {
//       try {
//         // Request microphone permission
//         await navigator.mediaDevices.getUserMedia({ audio: true });
        
//         // Update placeholder immediately when starting
//         setPlaceHolderMsg("Assistant is listening");

//         // Start the conversation
//         const newConversation = await Conversation.startSession({
//           agentId: "ax0Osh4XhL2w4C0YPkQB",
//           onConnect: () => {
//             setIsActive(true);
//           },
//           onDisconnect: () => {
//             setIsActive(false);
//             setPlaceHolderMsg("Ask anything..."); // Reset message on disconnect
//           },
//           onError: (error) => {
//             console.error("Error:", error);
//             setIsActive(false);
//             setPlaceHolderMsg("Ask anything..."); // Reset message on error
//           },
//           onModeChange: (mode) => {
//             setAgentStatus(mode.mode === "speaking" ? "speaking" : "listening");
//             setPlaceHolderMsg(
//               mode.mode === "speaking" 
//                 ? "Assistant is speaking" 
//                 : "Assistant is listening"
//             );
//           },
//         });

//         setConversation(newConversation);
//       } catch (error) {
//         console.error("Failed to start conversation:", error);
//         setIsActive(false);
//         setPlaceHolderMsg("Ask anything..."); // Reset message on error
//       }
//     } else {
//       if (conversation) {
//         await conversation.endSession();
//         setConversation(null);
//         setIsActive(false);
//         setPlaceHolderMsg("Ask anything..."); // Reset message when stopping
//       }
//     }
//   };

//   return (
//     <div className={styles.interface}>
//       <button
//         className={styles.iconButton}
//         onClick={handleToggleConversation}
//         aria-label={isActive ? "Stop Conversation" : "Start Conversation"}
//       >
//         {isActive ? <FaMicrophoneSlash /> : <FaMicrophone />}
//       </button>
//     </div>
//   );
// };

// export default ElevenLabComponent;

import React, { useState } from 'react';
import { Conversation } from '@11labs/client';
import styles from './ElevenLabComponent.module.css';

const ElevenLabComponent = () => {
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');
  const [agentStatus, setAgentStatus] = useState('listening');
  const [isStartButtonDisabled, setIsStartButtonDisabled] = useState(false);
  const [conversation, setConversation] = useState(null);

  const startConversation = async () => {
    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Start the conversation
      const newConversation = await Conversation.startSession({
        agentId: 'YOUR_AGENT_ID', // Replace with your agent ID
        onConnect: () => {
          setConnectionStatus('Connected');
          setIsStartButtonDisabled(true);
        },
        onDisconnect: () => {
          setConnectionStatus('Disconnected');
          setIsStartButtonDisabled(false);
        },
        onError: (error) => {
          console.error('Error:', error);
        },
        onModeChange: (mode) => {
          setAgentStatus(mode.mode === 'speaking' ? 'speaking' : 'listening');
        },
      });
      
      setConversation(newConversation);
    } catch (error) {
      console.error('Failed to start conversation:', error);
    }
  };

  const stopConversation = async () => {
    if (conversation) {
      await conversation.endSession();
      setConversation(null);
    }
  };

  return (
    <div className={styles.interface}>
      <div className={styles.buttonContainer}>
        <button
          className={styles.button}
          onClick={startConversation}
          disabled={isStartButtonDisabled}
        >
          Start Conversation
        </button>
        <button
          className={styles.button}
          onClick={stopConversation}
          disabled={!isStartButtonDisabled}
        >
          Stop Conversation
        </button>
      </div>
      <div className={styles.status}>
        <p>Status: <span>{connectionStatus}</span></p>
        <p>Agent is <span>{agentStatus}</span></p>
      </div>
    </div>
  );
};

export default ElevenLabComponent;
