"use server";
import User from '@/models/user';
import dbConnect from '@/lib/db/db';
import { verifyToken } from '@/lib/auth';
import { NextApiRequest } from 'next';
import { cookies } from 'next/headers';


export async function GET(req: NextApiRequest) {
    await dbConnect();
    const auth = cookies().get('Set-Cookie')?.value;
    if (!auth) {
        return Response.json({ message: 'Not authenticated' }, { status: 401 });
    }

    const decoded = verifyToken(auth);

    if (!decoded) {
        return Response.json({ message: 'Invalid token' }, { status: 401 });
    }

    try {
        const user = await User.findById(decoded.userId).select('-password');
        return Response.json(user, { status: 200 });
    } catch (error) {
        return Response.json({ message: 'Server error' }, { status: 500 });
    }
}
