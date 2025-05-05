import React from "react";


const ChatBubble = ({ text, sender }) => {
    return (
      <div className={`chat-bubble-container ${sender}`}>
        {sender === "bot" && <i className="bi bi-robot avatar"></i>}
        <div className="chat-bubble">
          <p>{text}</p>
        </div>
        {sender === "user" && <i className="bi bi-person-circle avatar"></i>}
      </div>
    );
  };

export default ChatBubble;
