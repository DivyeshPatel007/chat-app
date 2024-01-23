import {BrowserRouter as Router,Routes,Route} from "react-router-dom"
import Chat from "./pages/Chat"
import Register from "./pages/Register"
import Login from "./pages/Login"
import SetAvatar from "./pages/SetAvatar"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/" element={<Chat/>}/>
        <Route path="/setAvatar" element={<SetAvatar/>}/>
      </Routes>
    </Router>
  )
}

export default App