import React from "react";
import "./wave-message.css";

const WaveMessage = () => {
  return (
    <div className="message message--bot">
      <div className="is-typing">
        <div className="jump1"></div>
        <div className="jump2"></div>
        <div className="jump3"></div>
        <div className="jump4"></div>
        <div className="jump5"></div>
      </div>
    </div>
  );
};

export default WaveMessage;
