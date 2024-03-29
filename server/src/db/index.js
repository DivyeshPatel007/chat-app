import mongoose from "mongoose";
import { DB_NAME } from "../contants.js";
import dotenv from 'dotenv'
dotenv.config()

const MONGODB_URL = process.env.MONGODB_URL


const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${MONGODB_URL}/${DB_NAME}`)
        console.log(`\n MongoDB Connected, DB host: ${connectionInstance.connection.host}`)

    } catch (error) {
        console.error("MONGODB connection error ", error);
        process.exit(1)
    }
}

export default connectDB;