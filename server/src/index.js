import express from 'express';
import cors from 'cors';
import dotenv from "dotenv"
import connectDB from './db/index.js';
import authRoutes from "./routes/authRoutes.js"
import messageRoutes from "./routes/messageRoute.js"
import { Server } from "socket.io";
dotenv.config()

const PORT = process.env.PORT
const app = express();

app.use(cors());
app.use(express.json());

connectDB().then(() => {
    const server = app.listen(PORT, () => {
        console.log(`Server is running at port: ${PORT} http://localhost:${PORT}`)
    })
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:5173",
            credentials: true
        }
    });

    global.onlineUsers = new Map();
    io.on("connection", (socket) => {
        global.chatSocket = socket;
        socket.on("add-user", (userId) => {
            onlineUsers.set(userId, socket.id);
        });

        socket.on("send-msg", (data) => {
            const sendUserSocket = onlineUsers.get(data.to);
            if (sendUserSocket) {
                socket.to(sendUserSocket).emit("msg-recieve", data.message);
            }
        });
    });

})
    .catch((err) => {
        console.log("MONGODB connection failed,", err)
    })

app.use('/api/auth', authRoutes)
app.use('/api/messages', messageRoutes)
app.get('/',(req,res)=>{
    return res.json({message:"Welcome to the chap-app-backend"})
})




