"use client";
import createNoteSchema, { createNoteSchemaType } from "@/lib/validation/note"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogClose, DialogFooter } from "./ui/dialog"
import { Button } from "./ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import LoadingButton from "./ui/loading-button"
import { useRouter } from "next/navigation"
import { Trash } from "lucide-react"
import { useState } from "react"
import Router from 'next/router';
import { revalidatePath } from "next/cache";

interface AddNoteDialogProps {
    open: boolean,
    setOpen: (open: boolean) => void,
    title?: string
    content?: string,
    _id?: string
}

export const AddNoteDialog = ({
    open,
    setOpen,
    title,
    content,
    _id
}: AddNoteDialogProps) => {

    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const form = useForm<createNoteSchemaType>({
        resolver: zodResolver(createNoteSchema),
        defaultValues: {
            title: title || "",
            content: content || ""
        }
    });

    const onSubmit = async (input: createNoteSchemaType) => {
        try {
            if (_id) {
                console.log(input, _id);
                const response = await fetch("/api/notes/", {
                    method: "PUT",
                    body: JSON.stringify({
                        _id: _id.toString(),
                        ...input
                    }),
                });
                if (!response.ok) {
                    throw new Error("Something went wrong")
                }
            }
            else {

                const response = await fetch("/api/notes", {
                    method: "POST",
                    body: JSON.stringify(input),
                });
                if (!response.ok) {
                    throw new Error("Something went wrong")
                }
                form.reset();
            }
            setOpen(false);
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    }

    async function deleteNote() {
        if (!_id) return console.log("No _id");
        try {
            setLoading(true);
            const response = await fetch("/api/notes", {
                method: "DELETE",
                body: JSON.stringify({ _id }),
            });
            if (!response.ok) {
                throw new Error("Something went wrong")
            }
            setOpen(false);
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-2xl text-lg">
                <DialogHeader>
                    <DialogTitle className="text-center">
                        Add Note
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-md tracking-wider text-black">Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter Note title" className="text-lg" {...field} />
                                    </FormControl>
                                    {form.formState.errors.title && (
                                        <p className="text-red-500 text-sm">{form.formState.errors.title.message}</p>
                                    )}
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-md tracking-wider">Content</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Enter Note Content" className="text-lg" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <div className="w-full flex justify-between">
                                {_id && <Button type="button" disabled={loading} className="flex justify-between items-center text-white p-2 rounded-md bg-primary" variant="ghost" onClick={deleteNote}>
                                    <Trash className="mr-2" size={18} />
                                    Delete
                                </Button>}
                                <LoadingButton loading={form.formState.isSubmitting} type="submit" className="w-full">
                                    Submit
                                </LoadingButton>
                            </div>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}