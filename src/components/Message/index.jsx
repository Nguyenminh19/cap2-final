import React from "react";
import './message.css'

const Message = ({ content, sender, options }) => {
  const splitIntoMessage = (mess) => {
    if (mess.includes("\n")) {
      return mess.split("\n").map((item, index) => (
        <div
          className={`message ${
            sender === "user" ? "message--user" : "message--bot"
          }`}
          key={index}
        >
          {item}
        </div>
      ));
    } else {
      return mess.split(". ").map((item, index) => (
        <div
          className={`message ${
            sender === "user" ? "message--user" : "message--bot"
          }`}
          key={index}
        >
          {item}
        </div>
      ));
    }
  };

  return (
    <div>
      {content && splitIntoMessage(content)}
      {options && <div>{options()}</div>}
    </div>
  );
};

export default Message;
