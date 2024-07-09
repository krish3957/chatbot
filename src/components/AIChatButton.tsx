"use client"

import { useState } from "react";
import { AIChatBox } from "./AIChatBox";
import { Bot } from "lucide-react";
import { Button } from "./ui/button";

export const AIChatButton = () => {
    const [chatOpen, setChatOpen] = useState(false);
    return (
        <>
            <Button variant="secondary" className="mx-3" onClick={() => setChatOpen(true)} >
                <Bot size={20} className="mr-2" />
                AI Chat
            </Button>
            <AIChatBox open={chatOpen} onClose={() => {
                setChatOpen(false)
            }} />
        </>
    );
}