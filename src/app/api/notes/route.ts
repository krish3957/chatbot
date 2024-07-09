import mongoose from 'mongoose';;
import createNoteSchema, { updateNoteSchema } from '@/lib/validation/note';
import { NextApiResponse } from 'next';
import dbConnect from '@/lib/db/db';
import note from '@/models/note';
import { pineIndex } from '@/lib/db/pinecone';
import { getEmbedingsForNote } from '@/lib/openai';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

export async function POST(req: Request) {
    let session: mongoose.ClientSession | null = null;
    const auth = cookies().get('Set-Cookie')?.value;
    if (!auth) {
        return Response.json({ message: 'Not authenticated' }, { status: 401 });
    }

    const decoded = verifyToken(auth);
    if (!decoded) {
        return Response.json({ message: 'Invalid token' }, { status: 401 });
    }
    try {
        const body = await req.json();
        const { title, content } = body;
        const parseResult = createNoteSchema.safeParse(body);

        if (!parseResult.success) {
            console.error(parseResult.error);
            return Response.json({ error: "Invalid Input" }, { status: 400 });
        }
        const { userId } = decoded;
        if (!userId) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const embedding = await getEmbedingsForNote(title, content);
        await dbConnect();
        session = await mongoose.startSession();

        session.startTransaction();

        try {
            const newNote = new note({
                title,
                content,
                userId
            });
            await newNote.save({ session });
            // const newNote = await note.create([{ title, content, userId }], { session });

            await pineIndex.upsert([
                {
                    id: newNote._id.toString(),
                    values: embedding,
                    metadata: { userId }
                }
            ]);

            await session.commitTransaction();

            return Response.json({ newNote }, { status: 201 });
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    } catch (error) {
        console.log(error);
        return Response.json({ error: "Something went wrong" }, { status: 500 });
    }
}


export const PUT = async (req: Request, res: NextApiResponse) => {
    let session: mongoose.ClientSession | null = null;
    const auth = cookies().get('Set-Cookie')?.value;
    if (!auth) {
        return Response.json({ message: 'Not authenticated' }, { status: 401 });
    }

    const decoded = verifyToken(auth);
    if (!decoded) {
        return Response.json({ message: 'Invalid token' }, { status: 401 });
    }
    try {
        const body = await req.json();
        const { title, content, _id } = body;
        const parseResult = updateNoteSchema.safeParse(body);

        if (!parseResult.success) {
            console.error(parseResult.error);
            return Response.json({ error: "Invalid Input" }, { status: 400 });
        }
        const { userId } = decoded;
        if (!userId) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const embedding = await getEmbedingsForNote(title, content);
        await dbConnect();
        session = await mongoose.startSession();

        session.startTransaction();

        try {
            const updatedNote = await note.findByIdAndUpdate(_id
                , {
                    title,
                    content,
                    userId
                }, { session });
            // const newNote = await note.create([{ title, content, userId }], { session });

            await pineIndex.upsert([
                {
                    id: updatedNote._id.toString(),
                    values: embedding,
                    metadata: { userId }
                }
            ]);

            await session.commitTransaction();

            return Response.json({ message: "Note Updated Succesfully" }, { status: 200 });
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    } catch (error) {
        return Response.json({ message: "Something went wrong" }, { status: 500 });
    }
}

export const DELETE = async (req: Request, res: NextApiResponse) => {
    let session: mongoose.ClientSession | null = null;
    const auth = cookies().get('Set-Cookie')?.value;
    if (!auth) {
        return Response.json({ message: 'Not authenticated' }, { status: 401 });
    }

    const decoded = verifyToken(auth);
    if (!decoded) {
        return Response.json({ message: 'Invalid token' }, { status: 401 });
    }
    try {
        const body = await req.json();
        const { _id } = body;
        const { userId } = decoded;
        if (!userId) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }
        await dbConnect();
        session = await mongoose.startSession();

        session.startTransaction();

        try {
            const deleteNote = await note.findByIdAndDelete(_id
                , { session });
            // const newNote = await note.create([{ title, content, userId }], { session });

            await pineIndex._deleteOne(_id);

            await session.commitTransaction();

            return Response.json({ message: "Note Deleted Succesfully" }, { status: 200 });
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    } catch (error) {
        return Response.json({ message: "Something went wrong" }, { status: 500 });
    }
}

export const GET = async () => {
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
        const notes = await note.find({ userId: decoded.userId })
        return Response.json(notes, { status: 200 });
    } catch (err) {
        console.log(err);
        return Response.json({ message: err }, { status: 500 });
    }
}