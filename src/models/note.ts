import mongoose from "mongoose"

interface NoteProps {
    title: string,
    content: string,
    userId: string
    _id: string
}

const noteSchema = new mongoose.Schema<NoteProps>({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    }
}, { timestamps: true });

export default mongoose.models?.Note || mongoose.model("Note", noteSchema);