import User from '@/models/user';
import dbConnect from '@/lib/db/db';
import { sign } from 'jsonwebtoken';
import { serialize } from 'cookie';
import { cookies } from 'next/headers';
import { NextApiResponse } from 'next';
import { encryptUsingAES256 } from '@/lib/encrypt-decrypt';

export async function POST(req: Request, res: NextApiResponse) {
    await dbConnect();
    const body = await req.json();
    const { username, email, password } = body;
    if (!username || !email || !password) {
        return Response.json({ message: 'Please fill all fields' }, { status: 400 });
    }

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return Response.json({ message: 'User already exists' }, { status: 400 });
        }

        const newUser = new User({
            username,
            email,
            password: encryptUsingAES256(password),
        });
        await newUser.save();
        const token = sign({ userId: newUser._id }, process.env.JWT_SECRET as string, {
            expiresIn: '60d',
        });

        const cookie = serialize('auth', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 3600,
            path: '/',
        });

        cookies().set('Set-Cookie', token);
        return Response.json({
            _id: newUser._id,
            username: newUser.username,
            email: newUser.email,
        }, { status: 201 });
    } catch (error) {
        console.log(error);
        return Response.json({ message: 'Server error' }, { status: 500 });
    }
}
