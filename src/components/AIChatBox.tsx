import { cn } from "@/lib/utils";
import { ArrowRight, Bot, XCircle } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import LoadingButton from "./ui/loading-button";
import { ScrollArea } from "./ui/scroll-area";
import axios from "axios";

interface AIChatBoxProps {
    open: boolean,
    onClose: () => void
}

export const AIChatBox = ({
    open,
    onClose
}: AIChatBoxProps) => {
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get('/api/auth/user');
                setUserId(res.data._id);
            } catch (error: any) {
                console.error(error.response.data);
            }
        };
        fetchUser();
    }, []);
    const [chatHistory, setChatHistory] = useState<{
        role: string,
        parts: { text: string }[]
    }[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const data = await fetch("/api/chat", {
            method: "POST",
            body: JSON.stringify({
                history: chatHistory,
                message: input,
                id: userId
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
        const data1 = await data.json();
        console.log(data1);
        const text = data1.response.text;
        setChatHistory(oldHistory => [
            ...oldHistory, {
                role: "user",
                parts: [{ text: input }]
            },
            {
                role: "model",
                parts: [{ text: text }]
            }
        ])
        setInput("");
        setLoading(false);
    }

    return (
        <div className={cn("bottom-0 right-0 z-10 w-full max-w-[500px] p-1 xl:right-36", open ? "fixed" : "hidden")}>
            <button onClick={onClose} className="mb-1 ms-auto block">
                <XCircle size={30} />
            </button>
            <div className="h-[600px] flex flex-col bg-background border shadow-2xl p-2">
                <ScrollArea className="h-full">
                    <div className="h-full py-2">
                        {chatHistory.length > 0 ? chatHistory.map((messages, index) => (
                            <div key={index} className="flex-1 overflow-y-auto mb-4">
                                <ChatMessage message={messages} index={index} />
                            </div>
                        )
                        ) : <div className="m-auto flex">
                            <Bot size={96} />
                            <div className="w-96 mb-1 p-2 rounded bg-gray-200 self-end ml-1">
                                Hi! I am your assistant. How can I help you today?
                            </div>
                        </div>
                        }
                    </div>
                </ScrollArea>
                <form onSubmit={handleSubmit} className="m-3 flex gap-2">
                    <Input
                        value={input}
                        onChange={handleInputChange}
                        placeholder="Ask Something"
                    />
                    <LoadingButton loading={loading} disabled={loading} type="submit">
                        <ArrowRight />
                    </LoadingButton>
                </form>
            </div>
        </div>
    );
}


function ChatMessage({
    message: {
        role,
        parts
    },
    index
}: {
    message: {
        role: string,
        parts: { text: string }[]
    },
    index: number
}) {
    return (
        <div
            key={index}
            className={`w-96 mb-1 p-2 rounded ${role === 'user'
                ? 'bg-black text-white self-start ml-20'
                : 'bg-gray-200 self-end ml-1'
                }`}
        >
            {parts[0].text}
        </div>
    )
}