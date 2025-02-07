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


const ChatBotComponent = () => {
  const [messages, setMessages] = useState([]);
  const [showChatBot, setShowChatBot] = useState(false);
  const [isFirstSearch, setIsFirstSearch] = useState(true);
  const [selectedTab, setSelectedTab] = useState("chat");
  const { postMessage, generatedText } = useChatBot();

  const [slideDirection, setSlideDirection] = useState("slide-in");

  useEffect(() => {
    if (selectedTab === "audio") {
      setSlideDirection("slide-in");
    } else {
      setSlideDirection("slide-out");
    }
  }, [selectedTab]);

  const handleSearch = async (query) => {
    if (query.trim() !== "") {
      // Add the user's message
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: query, isUser: true },
        { text: "Loading...", isUser: false },
      ]);

      try {
        setIsFirstSearch(false);
        const response = await postMessage(query);
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages];
          updatedMessages[updatedMessages.length - 1] = {
            relatedQuestions: response?.projected_questions?.split(",") || [],
            text:
              response.final_answer || "Error getting response from Chatbot.",
            isUser: false,
          };
          return updatedMessages;
        });
      } catch (error) {
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages];
          updatedMessages[updatedMessages.length - 1] = {
            relatedQuestions: [],
            text: "Error: Unable to fetch response.",
            isUser: false,
          };
          return updatedMessages;
        });
      }

      // setIsFirstSearch(false);
    }
  };

  const handleSendMessage = async (query) => {
    if (query.trim() !== "") {
      // Display the user's query immediately
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: query, isUser: true },
        { text: "Loading...", isUser: false }, // Placeholder for the bot's response
      ]);

      try {
        // Fetch the bot's response
        const response = await postMessage(query);

        // Replace the loading message with the actual response
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages];
          updatedMessages[updatedMessages.length - 1] = {
            relatedQuestions: response?.projected_questions?.split(",") || [],
            text:
              response.final_answer || "Error getting response from Chatbot.",
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
          <Header onClose={() => setShowChatBot(false)} />
            {/* <p>{generatedText}</p> */}
          {selectedTab === "chat" ? (
            isFirstSearch ? (
              <div className={styles.main}>
                <h2 className={styles.heading}>What do you want to know?</h2>
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
                        onClick={handleSearch}
                          responseString={message.text}
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
