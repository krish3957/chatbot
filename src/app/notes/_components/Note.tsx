"use client";
import { AddNoteDialog } from '@/components/AddNoteDialog';
import { Button } from '@/components/ui/button'
import note from '@/models/note';
import { Edit } from 'lucide-react'
import React, { useState } from 'react'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

interface NoteProps {
    note: {
        _id: string,
        content: string,
        title: string,
        userId: string
    }
}
const Note = ({ note }: NoteProps) => {
    const [open, setOpen] = useState(false);
    return (
        <div className="bg-white p-4 rounded-lg shadow-lg mb-4 flex justify-between hover:shadow-2xl">
            <div>
                <h2 className="text-2xl font-bold">{note.title}</h2>
                <p className="text-lg">{note.content}</p>
            </div>
            <div>
                <TooltipProvider>
                    <Tooltip delayDuration={0}>
                        <TooltipTrigger asChild>
                            <Button className="p-2 rounded-lg" onClick={() => setOpen(true)}>
                                <Edit />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side='right' className='bg-black text-white text-lg'>
                            <p>Edit</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <AddNoteDialog open={open} setOpen={setOpen} title={note.title} content={note.content} _id={note._id} />
            </div>
        </div>
    )
}

export default Note