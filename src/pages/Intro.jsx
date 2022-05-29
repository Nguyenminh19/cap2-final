import React from "react";
import ChatbotBackground from "../assets/img/chatbot-background2.jpg";
import "./intro.css";

const About = () => {
  return (
    <section className="section" id="section-intro">
      <div className="container">
        <div className="row">
          <div className="col col-6">
            <div className="description">
              <h3 className="description-heading">
                resolve all problem with our chatbot
              </h3>
              <p className="description-detail font-weight-light">
                Chatbot for education answers the question about how to use
                MyDTU and some information that students want to know during
                study process.
              </p>

              <button
                className="button button-24"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.replace("/#section-chatbox");
                }}
              >
                Start to use
              </button>
            </div>
          </div>
          <div className="col col-6">
            <div className="header-img">
              <img src={ChatbotBackground} alt="" className="card-img" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
