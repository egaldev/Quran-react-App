import React, { useEffect, useRef, useState } from "react";
import ChatBubble from "@/components/ChatBubble";
import ChatInput from "@/components/ChatInput";
import { askGroq } from "@/services/groq";
import { v4 as uuidv4 } from "uuid";
import { Helmet } from "react-helmet";

type Msg = {
    id: string;
    from: "user" | "bot";
    text: string;
    createdAt: number;
};

const STORAGE_KEY = "chat_history_v1";

const ChatbotPage: React.FC = () => {
    const [messages, setMessages] = useState<Msg[]>(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch {
            return [];
        }
    });

    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }, [messages]);

    const send = async () => {
        const text = input.trim();
        if (!text) return;

        const userMsg: Msg = {
            id: uuidv4(),
            from: "user",
            text,
            createdAt: Date.now()
        };

        setMessages((m) => [...m, userMsg]);
        setInput("");
        setLoading(true);

        try {
            const reply = await askGroq(text);
            const botMsg: Msg = {
                id: uuidv4(),
                from: "bot",
                text: reply,
                createdAt: Date.now()
            };
            setMessages((m) => [...m, botMsg]);
        } catch (err) {
            setMessages((m) => [
                ...m,
                { id: uuidv4(), from: "bot", text: "Server error, coba lagi.", createdAt: Date.now() }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const clearHistory = () => {
        setMessages([]);
        localStorage.removeItem(STORAGE_KEY);
    };

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Helmet>
                <title>Chat Asisten Qur'an</title>
            </Helmet>

            <header className="p-4 border-b bg-card">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <h1 className="text-lg font-semibold">Asisten Al-Qur'an</h1>
                    <button onClick={clearHistory} className="text-sm text-destructive hover:underline">
                        Hapus Riwayat
                    </button>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto py-6">
                <div className="max-w-4xl mx-auto space-y-4 px-4">
                    {messages.length === 0 && (
                        <div className="text-center text-muted-foreground">
                            Halo 👋, tanya apa saja tentang Al-Qur’an, tafsir, atau doa.
                        </div>
                    )}

                    {messages.map((m) => (
                        <ChatBubble
                            key={m.id}
                            from={m.from}
                            text={m.text}
                            time={new Date(m.createdAt).toLocaleTimeString()}
                        />
                    ))}

                    {loading && (
                        <div className="flex justify-start px-2">
                            <div className="bg-card p-3 rounded-lg shadow-sm max-w-[60%]">
                                <TypingDots />
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>
            </main>

            <ChatInput
                value={input}
                onChange={setInput}
                onSend={send}
                loading={loading}
                placeholder="Tanyakan tentang doa, tafsir, atau surah..."
            />
        </div>
    );
};

const TypingDots = () => (
    <div className="flex items-center gap-1">
        <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce delay-75" />
        <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce delay-150" />
        <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce delay-200" />
    </div>
);

export default ChatbotPage;
