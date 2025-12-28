import React from "react";
import { Send, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ChatInputProps {
    value: string;
    onChange: (v: string) => void;
    onSend: () => Promise<void> | void;
    loading?: boolean;
    placeholder?: string;
}

const ChatInput: React.FC<ChatInputProps> = ({ value, onChange, onSend, loading = false, placeholder = "Tulis pesan..." }) => {
    const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (!loading && value.trim()) onSend();
        }
    };

    return (
        <div className="p-3 border-t bg-card">
            <div className="max-w-4xl mx-auto flex gap-2">
                <Input
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={handleKey}
                    placeholder={placeholder}
                    className="flex-1"
                />
                <Button
                    onClick={() => onSend()}
                    disabled={loading || !value.trim()}
                    aria-label="Kirim pesan"
                >
                    {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <Send className="w-4 h-4" />}
                </Button>
            </div>
        </div>
    );
};

export default ChatInput;
