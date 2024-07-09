import { z } from "zod";

const createNoteSchema = z.object({
    title: z.string().min(1, { message: "Title is required" }),
    content: z.string().optional()
})

export default createNoteSchema;

export type createNoteSchemaType = z.infer<typeof createNoteSchema>;

export const updateNoteSchema = createNoteSchema.extend({
    _id: z.string().min(1, { message: "Note id is required" })
})

export const deleteNoteSchema = z.object({
    _id: z.string().min(1, { message: "Note id is required" })
})
