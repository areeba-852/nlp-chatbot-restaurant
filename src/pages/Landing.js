import React from "react";
import Pikachu from "../assets/images/BOT.jpg";
import Chatbot from "../components/chatbot/Chatbot";
const Landing = () => {
  return (
    <div>
      <h1>I am Restaurant BOT</h1>
      <img src={Pikachu} style={{ width: "35%" }} alt="pikachu" />
      <Chatbot />

    </div>
  );
};

export default Landing;
