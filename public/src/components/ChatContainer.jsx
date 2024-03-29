/* eslint-disable react/prop-types */
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";
import { recieveMessageRoute, sendMessageRoute } from "../utils/APIRoutes";
import ChatInput from "./ChatInput";
import Logout from "./Logout";

function ChatContainer({ currentChat, currentUser, socket }) {
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [msgID, setMsgID] = useState("");
  const scrollRef = useRef();
  const [isTyping, setIsTyping] = useState(false);
  const [userTyping, setUserTyping] = useState(false);
  const [userTypingID, setUserTypingID] = useState(null);



  // Backend call when chat-user changes
  useEffect(() => {
    const getAllMsg = async () => {
      const { data } = await axios.post(recieveMessageRoute, {
        from: currentUser.id,
        to: currentChat._id,
      });
      setMessages(data);
    };

    getAllMsg();
  }, [currentChat]);

  // Get user data from localstorage
  useEffect(() => {
    const getCurrentChat = async () => {
      if (currentChat) {
        await JSON.parse(localStorage.getItem("chatApp")).id;
      }
    };
    getCurrentChat();
  }, [currentChat]);

  const handleSendMsg = async (msg) => {
    await axios.post(sendMessageRoute, {
      from: currentUser.id,
      to: currentChat._id,
      message: msg,
    });
    socket.current.emit("send-msg", {
      to: currentChat._id,
      from: currentUser.id,
      message: { msg, id: currentUser.id },
    });
    setMessages([...messages, { fromSelf: true, message: msg }]);
  };

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg) => {
        setArrivalMessage({ fromSelf: false, message: msg.msg });
        setMsgID(msg.id);
      });
      socket.current.on("user-typing", (msg) => {
        setUserTyping(msg.isTyping);
        setUserTypingID(msg.userID);
      });
    }
  }, []);

  useEffect(() => {
    socket.current.emit("typing", {
      to: currentChat._id,
      from: currentUser.id,
      message: { isTyping, userID: currentUser.id },
    });
   const timerID =  setTimeout(() => {
      setIsTyping(false);
    },2000);

    return ()=>{
      clearTimeout(timerID)
    }
  }, [isTyping]);

  useEffect(() => {
    if (msgID === currentChat._id) {
      arrivalMessage && setMessages((prevMsg) => [...prevMsg, arrivalMessage]);
    }
  }, [arrivalMessage, msgID]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, userTyping]);

  const handleTyping = () => {
    setIsTyping(true);
   
  };

  return (
    <Container>
      <div className="chat-header">
        <div className="user-details">
          <div className="avatar">
            <img
              src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
              alt=""
            />
          </div>
          <div className="username">
            <h3>{currentChat.username}</h3>
          </div>
        </div>
        <Logout />
      </div>

      <div className="chat-messages">
        {messages.map((message, index) => {
          return (
            <div ref={scrollRef} key={index}>
              <div
                className={`message ${
                  message.fromSelf ? "sended" : "recieved"
                }`}
              >
                <div className="content ">
                  <p>{message.message}</p>
                </div>
              </div>
            </div>
          );
        })}
        {userTyping && userTypingID === currentChat._id && (
          <TypingParagraph>
            typing <span className="dot">.</span>
            <span className="dot">.</span>
            <span className="dot">.</span>
          </TypingParagraph>
        )}
      </div>
      <ChatInput handleSendMsg={handleSendMsg} handleTyping={handleTyping} />
    </Container>
  );
}
const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 80% 10%;
  gap: 0.1rem;
  overflow: hidden;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: white;
        }
        p {
          color: #10af10;
        }
      }
    }
  }
  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    .typing {
      color: #10af10;
    }
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .message {
      display: flex;
      align-items: center;
      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #d1d1d1;
        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }
      }
    }
    .sended {
      justify-content: flex-end;
      .content {
        background-color: #4f04ff21;
      }
    }
    .recieved {
      justify-content: flex-start;
      .content {
        background-color: #9900ff20;
      }
    }
  }
`;

const typingAnimation = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
`;

// Styled component for the paragraph
const TypingParagraph = styled.p`
  max-width: 40%;
  overflow-wrap: break-word;
  padding: 0.5rem;
  font-size: 1.1rem;
  font-weight: 800;
  border-radius: 1rem;
  color: #d1d1d1;
  .dot {
    /* width:10px;
    height:10px; */
    font-size: 35px;
    display: inline-block;
    animation: ${typingAnimation} 1.25s ease-in-out infinite;
  }

  .dot:nth-child(2) {
    animation-delay: 0.25s;
  }

  .dot:nth-child(3) {
    animation-delay: 0.5s;
  }
`;

export default ChatContainer;
