// const { addMessage, getMessages } = require("../controllers/messageController");

import express from "express";
import { addMessages, getMessages } from "../controller/messageController.js";

const router = express.Router()

router.post("/addmsg/", addMessages);
router.post("/getmsg/", getMessages);


export default router
