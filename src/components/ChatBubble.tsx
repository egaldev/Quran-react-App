import React from "react";
import { Copy, Check } from "lucide-react";

type From = "user" | "bot";

interface ChatBubbleProps {
    from: From;
    text: string;
    time?: string;
    showCopy?: boolean;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ from, text, time, showCopy = true }) => {
    const isUser = from === "user";

    return (
        <div className={`flex ${isUser ? "justify-end" : "justify-start"} px-2`}>
            <div
                className={`
          max-w-[90%] md:max-w-[70%] lg:max-w-[60%] p-4 rounded-lg shadow-sm
          ${isUser ? "bg-primary text-primary-foreground rounded-br-none" : "bg-card text-foreground rounded-bl-none"}
        `}
            >
                <div className="whitespace-pre-line break-words text-sm leading-relaxed">
                    {text}
                </div>

                <div className="mt-2 flex items-center justify-between gap-2 text-xs text-muted-foreground">
                    <div>{time}</div>
                    {showCopy && (
                        <CopyButton text={text} />
                    )}
                </div>
            </div>
        </div>
    );
};

const CopyButton: React.FC<{ text: string }> = ({ text }) => {
    const [copied, setCopied] = React.useState(false);

    const doCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
            // ignore
        }
    };

    return (
        <button
            onClick={doCopy}
            className="ml-2 inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
            aria-label="Copy message"
            title="Salin jawaban"
        >
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
        </button>
    );
};

export default ChatBubble;
