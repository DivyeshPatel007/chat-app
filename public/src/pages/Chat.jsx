import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Contacts from "../components/Contacts";
import { useEffect, useState,useRef } from "react";
import { allUsersRoute ,host} from "../utils/APIRoutes";
import axios from "axios";
import Welcome from "../components/Welcome";
import ChatContainer from "../components/ChatContainer";
import { io } from "socket.io-client";

function Chat() {
  const [currentUser, setCurrentUser] = useState(undefined);
  const [contacts, setContacts] = useState(undefined);
  const [currentChat, setCurrentChat] = useState(undefined);

  const socket =useRef()

  const navigate = useNavigate();

  // getting data from localstorage
  useEffect(() => {
    const getUserFromLocal = async () => {
      if (!localStorage.getItem("chatApp")) {
        navigate("/login");
      } else {
        setCurrentUser(await JSON.parse(localStorage.getItem("chatApp")));
      }
    };
    getUserFromLocal();
  }, []);

  useEffect(()=>{
    if(currentUser){
      socket.current= io(host)
      socket.current.emit("add-user",currentUser.id);
    }
  },[currentUser])

  // hitting api to get user from backend
  useEffect(() => {
    const getUserFromDB = async () => {
      if (currentUser) {
        if (currentUser.isAvatarImageSet) {
          const { data } = await axios.get(
            `${allUsersRoute}/${currentUser.id}`
          );
          setContacts(data);
        } else {
          navigate("/setAvatar");
        }
      }
    };
    getUserFromDB();
  }, [currentUser]);

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };

  return (
    <>
      <Container>
        <div className="container">
          <Contacts contacts={contacts} changeChat={handleChatChange} socket={socket} />
          {currentChat === undefined ? (
            <Welcome />
          ) : (
            <ChatContainer
              currentChat={currentChat}
              currentUser={currentUser}
              socket={socket}
            />
          )}
        </div>
      </Container>
    </>
  );
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;

export default Chat;
