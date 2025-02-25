// import React, { useState, useEffect } from "react";
// import styles from "./ChatBotResponse.module.css";
// import { RiMenu2Fill } from "react-icons/ri";
// import { MdHeadphones, MdAdd } from "react-icons/md";
// import { HiOutlineSpeakerWave } from "react-icons/hi2";
// import { RiMenuAddLine } from "react-icons/ri";

// const ChatBotResponse = ({ responseString,  onClick }) => {
//   const relatedQuestions = [ "Tell me about ADAS in the IONIQ 5.",
//     "Which company manufactures the IONIQ 5?",
//     "Where can more details about the IONIQ 5 be found?",]
//   const [finalAnswer, setFinalAnswer] = useState("");
//   const [index, setIndex] = useState(0);
//   const [isSpeaking, setIsSpeaking] = useState(false);
//   const [isPaused, setIsPaused] = useState(false);

//   const startSpeech = () => {
//     if ("speechSynthesis" in window) {
//       const utterance = new SpeechSynthesisUtterance(responseString);
//       utterance.lang = "en-US";
//       utterance.rate = 1;
//       utterance.pitch = 1;

//       // Speech started
//       utterance.onstart = () => {
//         setIsSpeaking(true);
//         setIsPaused(false);
//       };

//       // Speech ended
//       utterance.onend = () => {
//         setIsSpeaking(false);
//         setIsPaused(false);
//       };

//       window.speechSynthesis.speak(utterance);
//     } else {
//       alert("Sorry, your browser does not support text-to-speech.");
//     }
//   };

//   const pauseSpeech = () => {
//     if ("speechSynthesis" in window && isSpeaking && !isPaused) {
//       window.speechSynthesis.pause();
//       setIsPaused(true);
//     }
//   };

//   const resumeSpeech = () => {
//     if ("speechSynthesis" in window && isSpeaking && isPaused) {
//       window.speechSynthesis.resume();
//       setIsPaused(false);
//     }
//   };

//   const handleIconClick = () => {
//     if (isSpeaking) {
//       if (isPaused) {
//         resumeSpeech();
//       } else {
//         pauseSpeech();
//       }
//     } else {
//       startSpeech();
//     }
//   };

//   useEffect(() => {
//     if (responseString) {
//       const intervalId = setInterval(() => {
//         if (index < responseString.length) {
//           setFinalAnswer((prev) => prev + responseString[index]);
//           setIndex((prev) => prev + 1);
//         } else {
//           clearInterval(intervalId);
//         }
//       }, 10);

//       return () => clearInterval(intervalId);
//     }
//   }, [responseString, index]);

//   return (
//     <div className="final-answer">
//       <div className={styles.header}>
//         <div className={styles.answerSection}>
//           <RiMenu2Fill size={18} />
//           <span>Answer</span>
//         </div>
//         <div className={styles.actionSection}>
//           {isSpeaking && !isPaused ? (
//             <HiOutlineSpeakerWave
//               className={styles.speakerIcon}
//               size={20}
//               onClick={handleIconClick}
//             />
//           ) : (
//             <MdHeadphones
//               className={styles.headphoneIcon}
//               size={20}
//               onClick={handleIconClick}
//             />
//           )}
//         </div>
//       </div>
//       <p>{finalAnswer}</p>
//       {finalAnswer.length === responseString.length && (
//         <div className={styles.relatedQuestionsSection}>
//           <div className={styles.relatedQuestionHeader}>
//             <RiMenuAddLine size={20} /> Related Questions
//           </div>
//           {relatedQuestions.map((ques, i) => (
//             <div onClick={()=>onClick(ques)} className={styles.relatedQuestion} key={i}>
//               <span>{ques}</span>
//               <MdAdd size={20} color="#1db8ce" />
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ChatBotResponse;



import React, { useState, useEffect, useRef } from 'react';
import { RiMenu2Fill, RiMenuAddLine } from 'react-icons/ri';
import { HiOutlineSpeakerWave, HiMiniSpeakerWave  } from "react-icons/hi2";
import {  MdAdd } from 'react-icons/md';
import styles from './ChatBotResponse.module.css';

const ChatBotResponse = ({ answer, handleSendMessage, relatedQuestions, summary }) => {
  const [displayAnswer, setDisplayAnswer] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const bottomRef = useRef(null); // Reference for scrolling
  const [index, setIndex] = useState(0);
  const [finalAnswer, setFinalAnswer] = useState("");
  // Clean the answer as soon as it updates
  useEffect(() => {
    console.log("answer updated", answer);
    const cleanedAnswer = answer
      .replace(/\\n/g, ' ')
      .replace(/\\/g, '')
      .replace("answer", "")
      .replace("{", "")
      .replace("}", "")
      .replace("[", "")
      .replace("]", "")
      .trim();
    setDisplayAnswer(cleanedAnswer);
  }, [answer]);

  useEffect(() => {
    if (displayAnswer) {
      const intervalId = setInterval(() => {
        if (index < displayAnswer.length) {
          setFinalAnswer((prev) => prev + displayAnswer[index]);
          setIndex((prev) => prev + 1);
        } else {
          clearInterval(intervalId);
        }
      }, 10);

      return () => clearInterval(intervalId);
    }
  }, [displayAnswer, index]);

  // Scroll to bottom each time displayAnswer changes
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [finalAnswer]);

  const startSpeech = () => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(answer);
      utterance.lang = "en-US";
      utterance.rate = 1;
      utterance.pitch = 1;

      utterance.onstart = () => {
        setIsSpeaking(true);
        setIsPaused(false);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setIsPaused(false);
      };

      window.speechSynthesis.speak(utterance);
    } else {
      alert("Sorry, your browser does not support text-to-speech.");
    }
  };

  const pauseSpeech = () => {
    if ("speechSynthesis" in window && isSpeaking && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const resumeSpeech = () => {
    if ("speechSynthesis" in window && isSpeaking && isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  };

  const handleIconClick = () => {
    if (isSpeaking) {
      if (isPaused) {
        resumeSpeech();
      } else {
        pauseSpeech();
      }
    } else {
      startSpeech();
    }
  };

  return (
    <div className="final-answer">
      <div className={styles.header}>
        <div className={styles.answerSection}>
          <RiMenu2Fill size={18} />
          <span>Answer</span>
        </div>
        <div className={styles.actionSection}>
          {isSpeaking && !isPaused ? (
            <HiMiniSpeakerWave
              className={styles.speakerIcon}
              size={30}
              onClick={handleIconClick}
            />
          ) : (
            <HiOutlineSpeakerWave
              className={styles.headphoneIcon}
              size={30}
              onClick={handleIconClick}
            />
          )}
        </div>
      </div>
      
      {/* {summary && <p>{summary}</p>} */}
      <br />
      {displayAnswer && <p>{finalAnswer}</p>}
      {/* Empty element to scroll into view */}
      <div ref={bottomRef}></div>
      <br />
      
      {relatedQuestions.length > 0 && (
        <div className={styles.relatedQuestionsSection}>
          <div className={styles.relatedQuestionHeader}>
            <RiMenuAddLine size={20} /> Related Questions
          </div>
          {relatedQuestions.map((ques, i) => (
            <div onClick={() => handleSendMessage(ques)} className={styles.relatedQuestion} key={i}>
              <span>{ques.replace("[", "")}</span>
              <MdAdd size={20} color="#1db8ce" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatBotResponse;