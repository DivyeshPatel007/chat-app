import { z } from "zod";
import { User } from "../model/userModel.js";
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken';
import dotenv from "dotenv"

//TODO:configure .env file
dotenv.config();
const SECRET = process.env.SECRET;


const userRegisterSchema = z.object({
    username: z.string().min(3).max(30),
    password: z.string().min(8),
    email: z.string().email(),
})


const userLoginSchema = z.object({
    username: z.string().min(3).max(30),
    password: z.string().min(8),
})

const register = async (req, res) => {
    try {
        const { username, password, email } = userRegisterSchema.parse(req.body);

        const userNameCheck = await User.findOne({ username });
        if (userNameCheck) {
            return res.status(400).json({ message: "username already exists." })
        }


        const emailCheck = await User.findOne({ email: email.toLowerCase() });
        if (emailCheck) {
            return res.status(400).json({ message: "email already exists." })
        }
        // TODO: use salt for hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Generate a JWT token
        const token = jwt.sign({ username, email }, SECRET);

        const user = await User.create({ username, password: hashedPassword, email: email.toLowerCase(), token });

        const { username: sanitizedUsername, isAvatarImageSet, avatarImage, _id, token: sanitizedToken } = user;

        return res.json(
            {
                message: 'Registration successful',
                status: true,
                chatApp: {
                    username: sanitizedUsername,
                    isAvatarImageSet,
                    avatarImage,
                    id: _id,
                    token: sanitizedToken
                }
            });
    } catch (error) {
        console.log(error);
        return res.json({ message: error, status: false });
    }
};
const login = async (req, res) => {
    try {
        const { username, password } = userLoginSchema.parse(req.body);

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "Incorrect Username or Password." })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.json({ msg: "Incorrect Username or Password", status: false });
        }
        const { username: sanitizedUsername, isAvatarImageSet, avatarImage, _id, token } = user;

        delete user.password;
        return res.json(
            {
                message: 'Login successful',
                status: true,
                chatApp: {
                    username: sanitizedUsername,
                    isAvatarImageSet,
                    avatarImage,
                    id: _id,
                    token
                }
            }
        );


    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: error, status: false });
    }
}
const setAvatar = async (req, res) => {
    try {
        const { image } = req.body;
        const { id } = req.params;

        const user = await User.findByIdAndUpdate(
            { _id: id },
            {
                avatarImage: image,
                isAvatarImageSet: true
            },
            { new: true })

            return res.json({
                isSet: user.isAvatarImageSet,
                image: user.avatarImage,
              });

    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: error, status: false });
    }
}

const getAllUsers =async (req,res)=>{
    try {
        const users = await User.find({_id:{$ne:req.params.id}}).select([
            "email",
            "username",
            "avatarImage",
            "_id",
        ])
        return res.json(users);
    } catch (error) {
        return res.status(400).json({ message: error, status: false });
    }
}


export { register, login, setAvatar,getAllUsers }