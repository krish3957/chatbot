"use client"
import React, { useState } from 'react'
import { AddNoteDialog } from '../AddNoteDialog'

export const Note = ({
    title,
    content,
    _id,
    createdAt,
    updatedAt
}: {
    title: string,
    content: string,
    _id: string,
    createdAt: Date,
    updatedAt?: Date
}) => {
    const [showOpenDialog, setShowOpenDialog] = useState(false);
    return (
        <div key={_id} className="bg-muted p-4 rounded-md shadow-md mt-4 mr-4 hover:shadow-2xl" onClick={() => setShowOpenDialog(true)}>
            <h1 className="text-lg font-semibold">{title}</h1>
            <div className='flex justify-between items-center'>
                {(updatedAt && updatedAt > createdAt) ? <span className="text-sm opacity-80 mr-5">{updatedAt.toDateString()}(Updated)</span>
                    : <span className="text-sm opacity-80 mr-5">{createdAt.toDateString()}</span>}
            </div>
            <p className="text-sm">{content}</p>
            <AddNoteDialog open={showOpenDialog} setOpen={setShowOpenDialog} title={title} content={content} _id={_id} />
        </div>
    )
}
