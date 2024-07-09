"use client";
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { Button } from './ui/button';
import { Bot, LogOutIcon, Plus } from 'lucide-react';
import axios from 'axios';
import { AddNoteDialog } from './AddNoteDialog';
import { AIChatButton } from './AIChatButton';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { useRouter } from 'next/navigation';


export const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };
    const [user, setUser] = useState<{ username: string; email: string, _id: string } | null>(null);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get('/api/auth/user');
                setUser(res.data);
            } catch (error: any) {
                console.error(error.response.data);
            }
        };
        fetchUser();
    }, []);

    const logOut = async () => {
        try {
            await axios.post('/api/auth/logout');
            router.push("/auth/signin");
            setUser(null);
        } catch (error: any) {
            console.error(error.response.data);
        }
    }
    return (
        <div className="bg-gray-800 mb-2 shadow-2xl">
            <div className="mx-auto px-4 py-1 sm:px-6 lg:px-8 max-w-screen-2xl">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <Link href="/" className='flex items-center justify-center'>
                                <Bot className='text-white mr-3' size={36} />
                                <p className="text-white text-3xl font-semibold">ChatBot</p>
                            </Link>
                        </div>
                    </div>
                    <AddNoteDialog open={open} setOpen={setOpen} />
                    <div className='flex'>
                        {(user && user._id) ?
                            <div className='flex items-center'>
                                <Button variant="secondary" onClick={() => setOpen(true)}>
                                    <div className='flex items-center justify-between'>
                                        <Plus size="24" className='mr-3 font-bold' />
                                        Add Note
                                    </div>
                                </Button>
                                <AIChatButton />
                                <TooltipProvider>
                                    <Tooltip delayDuration={0}>
                                        <TooltipTrigger asChild>
                                            <Button variant="secondary" onClick={logOut}>
                                                <LogOutIcon />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent side='right'>
                                            <p>Logout</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                <AddNoteDialog open={open} setOpen={setOpen} />
                            </div>
                            :
                            <div>
                                <Link href="/auth/signin">
                                    <Button variant="secondary" className='text-lg px-4'>
                                        Sign In
                                    </Button>
                                </Link>
                                <Link href="/auth/signup">
                                    <Button variant="secondary" className='text-lg px-4 ml-2'>
                                        Sign Up
                                    </Button>
                                </Link>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
