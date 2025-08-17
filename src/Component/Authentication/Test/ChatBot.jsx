import React, { useState } from "react";
import { Send, MessageCircle, X } from "lucide-react";

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { sender: "bot", text: "Xin chào! Mình có thể giúp gì cho bạn?" }
    ]);
    const [input, setInput] = useState("");

    const handleSend = () => {
        if (!input.trim()) return;
        setMessages([...messages, { sender: "user", text: input }]);
        setInput("");

        // Fake bot reply
        setTimeout(() => {
            setMessages(prev => [
                ...prev,
                { sender: "bot", text: "Mình đã nhận được tin nhắn của bạn nhé!" }
            ]);
        }, 800);
    };

    return (
        <>
            {/* Floating button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all"
            >
                {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
            </button>

            {/* Chat window */}
            {isOpen && (
                <div className="fixed bottom-20 right-6 w-80 bg-white rounded-lg shadow-lg border flex flex-col">
                    <div className="bg-blue-600 text-white px-4 py-2 rounded-t-lg font-semibold">
                        Chatbot Hỗ Trợ
                    </div>
                    <div className="flex-1 overflow-y-auto p-3 space-y-2 max-h-80">
                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                className={`p-2 rounded-lg text-sm max-w-[80%] ${
                                    msg.sender === "bot"
                                        ? "bg-gray-100 text-gray-800 self-start"
                                        : "bg-blue-600 text-white self-end ml-auto"
                                }`}
                            >
                                {msg.text}
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center border-t p-2">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                            placeholder="Nhập tin nhắn..."
                            className="flex-1 p-2 text-sm border rounded-l-md focus:outline-none"
                        />
                        <button
                            onClick={handleSend}
                            className="bg-blue-600 text-white px-3 py-2 rounded-r-md hover:bg-blue-700"
                        >
                            <Send size={16} />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Chatbot;
