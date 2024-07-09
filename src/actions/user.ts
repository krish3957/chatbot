"use server"
import dbConnect from "@/lib/db/db";
import { encryptUsingAES256 } from "@/lib/encrypt-decrypt";
import User from "@/models/user";

interface createUserProps {
    username: string,
    password: string
}

export const createUser = async ({
    username,
    password
}: createUserProps) => {
    await dbConnect();

    const u = await User.findOne({ username: username });

    if (u)
        throw new Error("User already exists");
    const user1 = await new User({
        username: username,
        password: encryptUsingAES256(password)

    })

    await user1.save();
    return user1;
}


export const loginUser = async ({
    username,
    password
}: createUserProps) => {
    await dbConnect();
    const user1 = await User.findOne({ username: username });
    if (!user1)
        throw new Error('User not found')
    if (user1.password !== encryptUsingAES256(password)) {
        throw new Error("Password not match");
    }

    return user1;
}

