import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { string } from "zod";
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    image: {
        type: String,
        default:
            "https://res.cloudinary.com/dmhcnhtng/image/upload/v1664642479/992490_sskqn3.png",
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    role: {
        type: String,
        default: "user"
    }
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword: string) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Encrypt password using bcrypt
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});
