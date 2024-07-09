"use client";
import { Navbar } from '@/components/Navbar';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Note from './_components/Note';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const Notes = () => {
    const [user, setUser] = useState<{ username: string; email: string, _id: string } | null>(null);
    const [notes, setNotes] = useState<{
        _id: string
        content: string,
        title: string,
        userId: string
    }[]>([]);
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get('/api/auth/user');
                setUser(res.data);
            } catch (error: any) {
                console.error(error);
            }
        };
        fetchUser();
        const getNotes = async () => {
            try {
                const res = await axios.get("/api/notes");
                setNotes(res.data);
            }
            catch (err) {
                console.log(err);
            }
        }
        getNotes();
    }, [])
    console.log(notes);

    if (!user) return (
        <div>
            <Navbar />
            <div className="mx-auto px-4 py-1 sm:px-6 lg:px-8 max-w-screen-2xl">
                <h1 className='font-bold text-2xl mb-2'>Please sign in to view the notes.</h1>
                <Link href="/auth/signin">
                    <Button className='text-lg px-4'>
                        Sign In
                    </Button>
                </Link>
            </div>
        </div>
    )

    return (
        <div>
            <Navbar />
            <div className="mx-auto px-4 py-1 sm:px-6 lg:px-8 max-w-screen-2xl">
                <h1 className='font-bold text-2xl mb-2'>These are the data that will be used by the bot.</h1>
                <div>
                    {notes.map((note, index) => {
                        return (
                            <Note key={index} note={note} />
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default Notes