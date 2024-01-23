import mongoose from 'mongoose';


const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, 'username is required'],
            min: 3,
            max: 30,
            unique: [true, "username should be unique"],
        },
        email: {
            type: String,
            required: [true, 'email is required'],
            min: 3,
            max: 30,
            unique: [true, "email should be unique"],
        },
        password: {
            type: String,
            required: [true, "password is required"],
            min: 8,
        },
        isAvatarImageSet: {
            type: Boolean,
            default: false
        },
        avatarImage: {
            type: String,
            default: ''
        },
        token:{
            type:String
        }
    }
)


export const User = mongoose.model("User",userSchema)

