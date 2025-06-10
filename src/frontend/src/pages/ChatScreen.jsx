import React, { useEffect, useRef, useState } from "react";
import ChatBubble from "../components/ChatBubble";
import ChatInput from "../components/ChatInput";
import "../styles/styles.css"; // Ensure styles are applied
import Header from "../components/Layout";

const ChatScreen = () => {
    const chatRef = useRef(null);
  const [messages, setMessages] = useState([
    { text: "Woohoo! 🚀 You’ve just taken a giant leap for mankind! Well, at least for chatbots.", sender: "bot" },
    { text: "First things first, I need to know your name 😏", sender: "bot" }
  ]);
  const [userName, setUserName] = useState("");
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);
  const handleSend = (msg) => {
    setMessages([...messages, { text: msg, sender: "user" }]);

    setTimeout(() => {
      if (!userName) {
        setUserName(msg);
        setMessages((prev) => [
          ...prev,
          { text: `Awesome, ${msg}, now please type in your business email 📧`, sender: "bot" }
        ]);
      }
    }, 1000);
  };

  return (
    <>
    <Header />

    <div className="chat-wrapper">
    <div className="chat-container">
      <div className="chat-screen"ref={chatRef}>
        {messages.map((msg, index) => (
          <ChatBubble key={index} text={msg.text} sender={msg.sender} />
        ))}
      </div>
      <ChatInput onSend={handleSend} />
    </div>
    </div>
    </>
  );
};

export default ChatScreen;
