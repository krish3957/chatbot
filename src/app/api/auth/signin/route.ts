import { NextApiResponse } from 'next';
import { sign } from 'jsonwebtoken';
import { serialize } from 'cookie';
import dbConnect from '@/lib/db/db';
import User from '@/models/user';
import { decryptUsingAES256, encryptUsingAES256 } from '@/lib/encrypt-decrypt';
import { cookies } from 'next/headers';


export async function POST(req: Request, res: NextApiResponse) {
    await dbConnect();
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
        return Response.json({ message: 'Please fill all fields' }, { status: 400 });
    }

    try {
        const foundUser = await User.findOne({ email });

        if (!foundUser || !(encryptUsingAES256(password) !== foundUser.password)) {
            return Response.json({ message: 'Invalid credentials' }, { status: 401 });
        }

        const token = sign({ userId: foundUser._id }, process.env.JWT_SECRET as string, {
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
            _id: foundUser._id,
            username: foundUser.username,
            email: foundUser.email,
        }, { status: 200 });

    } catch (error) {
        console.log(error);
        return Response.json({ message: error }, { status: 500 });
    }
}
