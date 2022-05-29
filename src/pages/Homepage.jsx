import React, { useEffect, useRef, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition
} from "react-speech-recognition";
import benefit1 from "../assets/img/benefit1.jpg";
import benefit2 from "../assets/img/benefit2.jpg";
import benefit3 from "../assets/img/benefit3.jpg";
import WFHImage from "../assets/img/WFH.png";
import Message from "../components/Message";
import WaveMessage from "../components/WaveMessage";
import useGetAnswer from "../hooks/use-getAnswer";
import Intro from "./Intro";
import "./homepage.css";

const benefits = [
  {
    img: benefit1,
    title: "GO LIVEIN MINUTES",
    description:
      "Save development time & cost with chatbots developed by conversational design experts to boost conversion",
  },
  {
    img: benefit2,
    title: "100% CUSTOMISABLE DESIGN",
    description:
      "Customize any element including backgrounds, fonts, colors, buttons or choose from predefined designs.",
  },
  {
    img: benefit3,
    title: "PRE-SET APP INTEGRATIONS",
    description:
      "Sync data in realtime across leading apps with ready to setup integrations available in each chatbot template.",
  },
];

const category = [
  {
    key: 1,
    display: "School",
    value: "school",
    popularQuestions: [
      "Tại sao nên học Đại Học Duy Tân",
      "Chi tiết thông tin tuyển sinh của ĐH Duy Tân",
      "Số tài khoản của trường",
      "Xem lịch thi ở đâu",
      "Cách lấy giấy xác nhận sinh viên",
    ],
  },
  {
    key: 2,
    display: "MyDTU",
    value: "mydtu",
    popularQuestions: [
      "Đăng kí những môn đã học rồi thì có hủy được không",
      "Cách lấy lại mật khẩu MyDTU",
      "Vì sao không vào được MyDTU",
      "Cách chuyển hướng mail DTU sang sang mail thường",
      "Đổi lớp trên hệ thống nhưng không có lịch học",
    ],
  },
  {
    key: 3,
    display: "Elearning",
    value: "el",
    popularQuestions: [
      "Đang học thì bị out ra khỏi phòng zoom",
      "Không vào lớp bằng link zoom được",
      "Bấm nút tiếp theo bị lặp lại câu cũ tải lại trang vẫn không được",
      "Trắng bài sau khi submit",
      "Thầy cô không nhận được bài khi hệ thống tự nộp lúc hết giờ",
    ],
  },
];

const Homepage = () => {
  const {
    transcript,
    listening,
    browserSupportsSpeechRecognition,
    resetTranscript,
  } = useSpeechRecognition();

  // init conversation when load firsttime page
  const [conversation, setConversation] = useState(() => {
    const saved = sessionStorage.getItem("conversation");
    const initialValue = JSON.parse(saved);
    return initialValue || [];
  });

  const [categoryCurrent, setCategoryCurrent] = useState();

  const handleClickCategory = (category) => {
    setCategoryCurrent(category);
  };

  const [userInput, setUserInput] = useState("");

  const [numberRequest, setNumberRequest] = useState(0);

  const addMessageToConversation = (message) => {
    setConversation((prevState) => [
      ...prevState,
      {
        sender: "bot",
        content: message,
      },
    ]);
  };

  const {
    isLoading,
    // error,
    sendRequest,
    rateOfConfusedAnwser,
    numberAnwer,
    isConfuse,
  } = useGetAnswer(addMessageToConversation);

  useEffect(() => {
    if (rateOfConfusedAnwser > 0.6 && numberAnwer > 6) {
      addMessageToConversation(
        "Câu trả lời có vẻ như không được chính xác. Bạn có thể nhập câu hỏi bằng chữ để nâng cao sự chính xác của câu trả lời"
      );
    }
  }, [rateOfConfusedAnwser, numberAnwer]);

  const handleQuestionClick = (item) => {
    setConversation((prevState) => {
      return [
        ...prevState,
        {
          sender: "user",
          content: item,
        },
      ];
    });
    sendRequest(item);
  };

  useEffect(() => {
    console.log(isConfuse);
    if (isConfuse) {
      setConversation((pre) => [
        ...pre,
        {
          sender: "bot",
          content: "Bạn có muốn kết nối với chuyên gia không?",
          options: () => (
            <a
              href="https://chatbot-education.atlassian.net/jira/software/projects/CBE/boards/3/roadmap?timeline=WEEKS"
              className="button category-button"
            >
              Chat with Expert
            </a>
          ),
        },
      ]);
    }
  }, [isConfuse]);

  useEffect(() => {
    setConversation((pre) => [
      ...pre,
      {
        sender: "bot",
        content: null,
        options: () => (
          <div className="category-button">
            {categoryCurrent.popularQuestions.map((item, index) => (
              <button
                className="button button-category-item"
                key={index}
                onClick={() => handleQuestionClick(item)}
              >
                {item}
              </button>
            ))}
          </div>
        ),
      },
    ]);
  }, [categoryCurrent]);

  useEffect(() => {
    if (numberRequest === 0) {
      setNumberRequest((numberRequest) => numberRequest + 1);

      setConversation([
        {
          sender: "bot",
          content:
            "Hello nhá. Mình là DTUBot, mình có thể giúp gì cho bạn?. Chọn mục bạn muốn tìm kiếm để có thể nhận kết quả chính xác hơn",
          options: () => (
            <div className="category-button">
              {category.map((item, index) => (
                <button
                  className="button button-category-item"
                  key={index}
                  onClick={() => handleClickCategory(item)}
                >
                  {item.display}
                </button>
              ))}
            </div>
          ),
        },
      ]);
    }
  }, [numberRequest]);

  // auto scroll bottom chatbox
  useEffect(() => {
    if (chatboxRef.current) {
      chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
    }
    sessionStorage.setItem("conversation", JSON.stringify(conversation));
  }, [conversation, transcript]);

  const chatboxRef = useRef();

  const setConversationFnc = () => {
    setConversation((prevState) => {
      return [
        ...prevState,
        {
          sender: "user",
          content: userInput,
        },
      ];
    });
    sendRequest(userInput);
    setUserInput("");
  };

  const submitHandler = (event) => {
    event.preventDefault();
    if (userInput !== "") {
      setConversationFnc();
    }
  };

  // Update conversation when use microphone
  useEffect(() => {
    if (transcript !== "" && !listening) {
      setConversation((prevState) => {
        return [
          ...prevState,
          {
            sender: "user",
            content: transcript,
          },
        ];
      });
      sendRequest(transcript);
      setUserInput("");
      resetTranscript();
    }
  }, [listening, resetTranscript, sendRequest, transcript]);

  return (
    <>
      <Intro />
      <section className="section" id="section-chatbox">
        <p className="section-noty">
          {!browserSupportsSpeechRecognition &&
            `Chức năng nhập câu hỏi bằng giọng nói hiện chỉ hỗ trợ trên trình duyệt Chrome.`}
        </p>
        <div className="chatbox">
          <div className="chatbox-content" ref={chatboxRef}>
            {conversation.map((mess, index) => (
              <Message
                key={index}
                sender={mess.sender}
                content={mess.content}
                options={mess.options}
              />
            ))}
            {transcript.length !== 0 && (
              <div className="message message--user">{transcript}</div>
            )}

            {isLoading && <WaveMessage />}
          </div>
          <div className="chatbox-control">
            <form onSubmit={submitHandler}>
              <div className="input-group">
                <input
                  type="text"
                  className="input-text"
                  placeholder="Enter your message ...."
                  value={userInput}
                  onChange={(event) => {
                    setUserInput(event.target.value);
                  }}
                />
                <div className="chatbox-action">
                  {browserSupportsSpeechRecognition && (
                    <button
                      className={listening ? `chatbox-action-micro` : ""}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        SpeechRecognition.startListening({ language: "vi-VN" });
                      }}
                    >
                      <i className="fa-solid fa-microphone"></i>
                    </button>
                  )}
                  <button type="submit">
                    <i className="fa-solid fa-circle-arrow-right"></i>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

      <section className="section" id="section-about">
        <div className="container d-flex">
          <div className="intro__description">
            <h3 className="section-title mt-5">About product</h3>
            <p>
              We detect one problem when using Sakai: students meet problems and
              do not know how to use Sakai during the study process. The
              evidence includes students get lagged because of the internet
              connection, are unable to enter Zoom or even have no idea how to
              submit assignments. Additionally, many students do not know how to
              use MyDTU masterfully and some of them get some troubles that they
              do not know how to handle. We saw the above situations on the
              university forum on Facebook.
            </p>
            <p>
              To solve this problem, we decided to create an Chatbot For
              Education. This helps students effectively communicate with the
              teachers by answering all common questions. Doing this enables
              both students and teachers to save their time and make the best of
              their learning experiences. Moreover, it also answers the
              question, gives information as well as a way to handle the
              problems that students want to know during the study process.
            </p>
            <p>
              From which, we create the Chatbot For Education that can answer
              all the questions every time. It helps to save the time that
              students wait to get answers. It also helps lecturers not to
              answer the same question many times or answer too many questions.
            </p>
            <p>
              The Chatbot For Education is smart enough to answer all the
              questions related to Elearning, MyDTU, School.
            </p>
          </div>
          <div className="intro__img">
            <img src={WFHImage} alt="" />
          </div>
        </div>
      </section>

      <section className="section" id="section-benefit">
        <div className="container">
          <div className="section-title text-center">
            Why use a Chatbot For Education?
          </div>
          <div className="benefit-list">
            {benefits.map((item, index) => (
              <div key={index} className="benefit-item">
                <div className="benefit-img">
                  <img src={item.img} alt="" />
                </div>
                <p className="benefit-title">{item.title}</p>
                <p className="benefit-description">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Homepage;
