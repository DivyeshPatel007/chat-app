import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

function Welcome() {
    const [username,setUsername] =useState("");
    const navigate =useNavigate()


    useEffect(()=>{
        const getUserFromLocal = async () => {
            if (!localStorage.getItem("chatApp")) {
              navigate("/login");
            } else {
              const data = await JSON.parse(localStorage.getItem("chatApp"));
              setUsername(data.username);
            }
          };
          getUserFromLocal();
    },[])
  return (
    <Container>
    <h1>
      Welcome, <span>{username}!</span>
    </h1>
    <h3>Please select a chat to Start messaging.</h3>
  </Container>
  )
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  flex-direction: column;
  img {
    height: 20rem;
  }
  span {
    color: #4e0eff;
  }
`;
export default Welcome