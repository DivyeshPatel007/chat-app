import styled from "styled-components";
import { useNavigate } from "react-router-dom";
// import {BiPowerOff} from "react-icons/bi"

function Logout() {
  const navigate = useNavigate();
  const handleClick = async () => {
    console.log("first")
    const id = await JSON.parse(
      localStorage.getItem("chatApp")
    ).id;
    if (id) {
      localStorage.clear();
      navigate("/login");
    }
  };
  return (
    <Button onClick={handleClick}>
      {/* <BiPowerOff /> */}
      Logout
    </Button>
  );
}
const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: #9a86f3;
  border: none;
  cursor: pointer;
  text-transform:uppercase;
  font-size:10px;
  svg {
    font-size: 1.3rem;
    color: #ebe7ff;
  }
`;

export default Logout;
