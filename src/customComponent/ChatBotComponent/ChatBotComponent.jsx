// "use client";

// import React, { useEffect, useState } from "react";
// import styles from "./ChatBotComponent.module.css";
// import InputBox from "./components/InputBox/InputBox";
// import ChatBotResponse from "./components/ChatBotResponse/ChatBotResponse";
// import SearchBar from "./components/SearchBar/SearchBar";
// import Footer from "./components/Footer/Footer";
// import ElevenLabComponent from "./components/ElevenLabComponent/ElevenLabComponent";
// import SampleQuestions from "./components/SampleQuestions/SampleQuestions";
// import Header from "./components/Header/Header";
// import { AiOutlineMessage } from "react-icons/ai";
// import useChatBot from "@/hooks/useChatBot";


// const ChatBotComponent = ({router}) => {
//   const [messages, setMessages] = useState([]);
//   const [showChatBot, setShowChatBot] = useState(true);
//   const [isFirstSearch, setIsFirstSearch] = useState(true);
//   const [selectedTab, setSelectedTab] = useState("chat");
//   const { postMessage, generatedText } = useChatBot();
//   const [slideDirection, setSlideDirection] = useState("slide-in");

//   useEffect(() => {
//     if (selectedTab === "audio") {
//       setSlideDirection("slide-in");
//     } else {
//       setSlideDirection("slide-out");
//     }
//   }, [selectedTab]);

//   const handleSearch = async (query) => {
//     if (query.trim() !== "") {
//       // Add the user's message
//       setMessages((prevMessages) => [
//         ...prevMessages,
//         { text: query, isUser: true },
//         { text: "Loading...", isUser: false },
//       ]);

//       try {
//         setIsFirstSearch(false);
//         const response = await postMessage(query);
//         setMessages((prevMessages) => {
//           const updatedMessages = [...prevMessages];
//           updatedMessages[updatedMessages.length - 1] = {
//             relatedQuestions: response?.projected_questions?.split(",") || [],
//             text:
//               response.final_answer || "Error getting response from Chatbot.",
//             isUser: false,
//           };
//           return updatedMessages;
//         });
//       } catch (error) {
//         setMessages((prevMessages) => {
//           const updatedMessages = [...prevMessages];
//           updatedMessages[updatedMessages.length - 1] = {
//             relatedQuestions: [],
//             text: "Error: Unable to fetch response.",
//             isUser: false,
//           };
//           return updatedMessages;
//         });
//       }

//       // setIsFirstSearch(false);
//     }
//   };

//   const handleSendMessage = async (query) => {
//     if (query.trim() !== "") {
//       // Display the user's query immediately
//       setMessages((prevMessages) => [
//         ...prevMessages,
//         { text: query, isUser: true },
//         { text: "Loading...", isUser: false }, // Placeholder for the bot's response
//       ]);

//       try {
//         // Fetch the bot's response
//         const response = await postMessage(query);

//         // Replace the loading message with the actual response
//         setMessages((prevMessages) => {
//           const updatedMessages = [...prevMessages];
//           updatedMessages[updatedMessages.length - 1] = {
//             relatedQuestions: response?.projected_questions?.split(",") || [],
//             text:
//               response.final_answer || "Error getting response from Chatbot.",
//             isUser: false,
//           };
//           return updatedMessages;
//         });
//       } catch (error) {
//         // Replace the loading message with an error message
//         setMessages((prevMessages) => {
//           const updatedMessages = [...prevMessages];
//           updatedMessages[updatedMessages.length - 1] = {
//             relatedQuestions: [],
//             text: "Error: Unable to fetch response.",
//             isUser: false,
//           };
//           return updatedMessages;
//         });
//       }
//     }
//   };

//   return (
//     <>
//       {showChatBot ? (
//         <div className={styles.app}>
//           <Header onClose={() => router.back()} />
//             {/* <p>{generatedText}</p> */}
//           {selectedTab === "chat" ? (
//             isFirstSearch ? (
//               <div className={styles.main}>
//                 <h2 className={styles.heading}>What do you want to know?</h2>
//                 <SearchBar onSearch={handleSearch} />
//                 <SampleQuestions onClick={handleSearch} />
//               </div>
//             ) : (
//               <div className={styles.chatbox}>
//                 <div className={styles.messagesContainer}>
//                   {messages.map((message, index) => (
//                     <div
//                       key={index}
//                       className={`${styles.message} ${
//                         message.isUser ? styles.userMessage : styles.botMessage
//                       }`}
//                     >
//                       {message.isUser || message.text === "Loading..." ? (
//                         <span>{message.text}</span>
//                       ) : (
//                         <ChatBotResponse
//                         onClick={handleSearch}
//                           responseString={message.text}
//                           relatedQuestions={message.relatedQuestions}
//                         />
//                       )}
//                     </div>
//                   ))}
//                 </div>

//                 <InputBox onSend={handleSendMessage} />
//               </div>
//             )
//           ) : (
//             <div className={`${styles.main} ${styles[slideDirection]}`}>
//               <ElevenLabComponent />
//             </div>
//           )}{" "}
//           <Footer selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
//         </div>
//       ) : (
//         <button
//           className={styles.floatingButton}
//           onClick={() => setShowChatBot(!showChatBot)}
//         >
//           <AiOutlineMessage size={24} />
//         </button>
//       )}
//     </>
//   );
// };

// export default ChatBotComponent;



import React, { useEffect, useState } from "react";
import styles from "./ChatBotComponent.module.css";
import InputBox from "./components/InputBox/InputBox";
import ChatBotResponse from "./components/ChatBotResponse/ChatBotResponse";
import SearchBar from "./components/SearchBar/SearchBar";
import Footer from "./components/Footer/Footer";
import ElevenLabComponent from "./components/ElevenLabComponent/ElevenLabComponent";
import SampleQuestions from "./components/SampleQuestions/SampleQuestions";
import Header from "./components/Header/Header";
import { AiOutlineMessage } from "react-icons/ai";
import useChatBot from "@/hooks/useChatBot";


const ChatBotComponent = ({router}) => {
  const [messages, setMessages] = useState([]);
  const [showChatBot, setShowChatBot] = useState(true);
  const [isFirstSearch, setIsFirstSearch] = useState(true);
  const [selectedTab, setSelectedTab] = useState("chat");
  const { postMessage, generatedText } = useChatBot();
  const [slideDirection, setSlideDirection] = useState("slide-in");
  const chatbotHeader = sessionStorage.getItem("qus_header")


  useEffect(() => {
    if (selectedTab === "audio") {
      setSlideDirection("slide-in");
    } else {
      setSlideDirection("slide-out");
    }
  }, [selectedTab]);

  const handleSearch = async (query) => {

    console.log("inside handleseacrh");
    if (query.trim() !== "") {
      // Display the user's query immediately
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: query, isUser: true ,  summary:"" , relatedQuestions: [] },
        { text: "Loading...", isUser: false,  summary:"" , relatedQuestions: [] }, // Placeholder for the bot's response
      ]);

      try {
        setIsFirstSearch(false);
        const response = await postMessage(query);
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages];
          updatedMessages[updatedMessages.length - 1] = {
            relatedQuestions: response.questions,
            text: response.answer ||  "Error getting response from Chatbot.",
            summary:  response.summary || 'No information available.',  
            isUser: false,
          };
          return updatedMessages; 
        });
      } catch (error) {
        // Replace the loading message with an error message
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages];
          updatedMessages[updatedMessages.length - 1] = {
            relatedQuestions: [],
            text: "Error: Unable to fetch response.",
            summary:"",
            isUser: false,
          };
          return updatedMessages;
        });
      }

      // setIsFirstSearch(false);
    }
  };


  // const handleSendMessage = async (query) => {

  //   console.log("Inside handlesendmessage");

  //   if (query.trim() !== "") {
  //     // Display the user's query immediately
  //     setMessages((prevMessages) => [
  //       ...prevMessages,
  //       { text: query, isUser: true ,  summary:"" , relatedQuestions: [] },
  //       { text: "Loading...", isUser: false,  summary:"" , relatedQuestions: [] }, // Placeholder for the bot's response
  //     ]);

  //     try {
  //       // Fetch the bot's response
  //       const response = await postMessage(query);
  //       setMessages((prevMessages) => {
  //         const updatedMessages = [...prevMessages];
  //         updatedMessages[updatedMessages.length - 1] = {
  //           relatedQuestions: response.questions,
  //           text: response.answer ||  "Error getting response from Chatbot.",
  //           summary:  response.summary || 'No information available.',  
  //           isUser: false,
  //         };
  //         return updatedMessages; 
  //       });
  //     } catch (error) {
  //       // Replace the loading message with an error message
  //       setMessages((prevMessages) => {
  //         const updatedMessages = [...prevMessages];
  //         updatedMessages[updatedMessages.length - 1] = {
  //           relatedQuestions: [],
  //           text: "Error: Unable to fetch response.",
  //           summary:"",
  //           isUser: false,
  //         };
  //         return updatedMessages;
  //       });
  //     }
  //   }

  // };

  const handleSendMessage = async (query) => {
    console.log("Inside handleSendMessage");
  
    if (query.trim() !== "") {
      // Immediately display the user's query and a placeholder for the bot's response
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: query, isUser: true, summary: "", relatedQuestions: [] },
        { text: "", isUser: false, summary: "", relatedQuestions: [] }, // Placeholder for bot's response
      ]);
  
      try {
        let updatedText = "";
        // Call postMessage with an onChunk callback to update the UI chunk by chunk
        const response = await postMessage(query, (chunk) => {
          updatedText += chunk;
          // Update the last message with the new accumulated text
          setMessages((prevMessages) => {
            const updatedMessages = [...prevMessages];
            updatedMessages[updatedMessages.length - 1] = {
              text: updatedText,
              isUser: false,
              summary: "",
              relatedQuestions: [],
            };
            return updatedMessages;
          });
        });
  
        // Once the stream is complete, update with the final answer, summary, and related questions
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages];
          updatedMessages[updatedMessages.length - 1] = {
            text: response.answer || "Error getting response from Chatbot.",
            summary: response.summary || "No information available.",
            relatedQuestions: response.questions,
            isUser: false,
          };
          return updatedMessages;
        });
      } catch (error) {
        // Replace the loading message with an error message if something goes wrong
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages];
          updatedMessages[updatedMessages.length - 1] = {
            text: "Error: Unable to fetch response.",
            summary: "",
            relatedQuestions: [],
            isUser: false,
          };
          return updatedMessages;
        });
      }
    }
  };
  return (
    <>
      {showChatBot ? (
        <div className={styles.app}>
          <Header onClose={() => router.back()} />
            {/* <p>{generatedText}</p> */}
          {selectedTab === "chat" ? (
            isFirstSearch ? (
              <div className={styles.main}>
                <h2 className={styles.heading}>{chatbotHeader!==null?chatbotHeader:"What do you want to know about?"}</h2>
                <SearchBar onSearch={handleSearch} />
                <SampleQuestions onClick={handleSearch} />
              </div>
            ) : (
              <div className={styles.chatbox}>
                <div className={styles.messagesContainer}>
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`${styles.message} ${
                        message.isUser ? styles.userMessage : styles.botMessage
                      }`}
                    >
                      {message.isUser || message.text === "Loading..." ? (
                       <span>{message.text}</span>
                       
                      ) : (
                   
                        <ChatBotResponse
                            handleSendMessage={handleSendMessage}
                            answer={message.text}
                            summary = {message.summary}
                            relatedQuestions={message.relatedQuestions}
                        />
                      )}
                    </div>
                  ))}
                </div>

                <InputBox onSend={handleSendMessage} />
              </div>
            )
          ) : (
            <div className={`${styles.main} ${styles[slideDirection]}`}>
              <ElevenLabComponent />
            </div>
          )}{" "}
          <Footer selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
        </div>
      ) : (
        <button
          className={styles.floatingButton}
          onClick={() => setShowChatBot(!showChatBot)}
        >
          <AiOutlineMessage size={24} />
        </button>
      )}
    </>
  );
};

export default ChatBotComponent;
