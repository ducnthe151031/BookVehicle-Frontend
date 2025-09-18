import React, { useState } from "react";
import { Send, MessageCircle, X } from "lucide-react";

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { sender: "bot", text: "Xin chào! Mình có thể giúp gì cho bạn?" }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Hàm tìm kiếm xe từ API backend
    const searchVehicles = async (query) => {
        try {
            setIsLoading(true);
            // Ví dụ: API GET /api/vehicles?search=query
            const res = await fetch(`/api/vehicles?search=${encodeURIComponent(query)}`);
            if (!res.ok) return [];
            const data = await res.json();
            // data là mảng các xe, mỗi xe có id, vehicle_name, location, category_name, image_url
            return data;
        } catch (e) {
            return [];
        } finally {
            setIsLoading(false);
        }
    };

    const handleSend = async () => {
        if (!input.trim()) return;
        const userMsg = { sender: "user", text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput("");

        setIsLoading(true);
        const found = await searchVehicles(input);
        if (found.length > 0) {
            // Tạo message dạng danh sách xe kèm ảnh và link
            const list = found.map(
                v => ({
                    sender: "bot",
                    type: "vehicle",
                    vehicle: {
                        id: v.id,
                        name: v.vehicle_name,
                        location: v.location,
                        category: v.category_name,
                        image: v.image_url?.split(",")[0] // lấy ảnh đầu tiên nếu có nhiều ảnh
                    }
                })
            );
            setMessages(prev => [...prev, ...list]);
        } else {
            setMessages(prev => [
                ...prev,
                { sender: "bot", text: "Không tìm thấy xe phù hợp với yêu cầu của bạn." }
            ]);
        }
        setIsLoading(false);
    };

    const goToDetail = (id) => {
        window.location.href = `/vehicle/${id}`;
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
                        {messages.map((msg, i) =>
                            msg.type === "vehicle" ? (
                                <div
                                    key={i}
                                    className="bg-gray-100 text-gray-800 self-start p-2 rounded-lg flex items-center space-x-2 cursor-pointer hover:bg-blue-50"
                                    onClick={() => goToDetail(msg.vehicle.id)}
                                >
                                    <img
                                        src={msg.vehicle.image}
                                        alt={msg.vehicle.name}
                                        className="w-12 h-12 object-cover rounded"
                                    />
                                    <div>
                                        <div className="font-semibold">{msg.vehicle.name}</div>
                                        <div className="text-xs text-gray-500">{msg.vehicle.location} - {msg.vehicle.category}</div>
                                        <span className="text-blue-600 underline text-xs cursor-pointer">
                                            Xem chi tiết
                                        </span>
                                    </div>
                                </div>
                            ) : (
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
                            )
                        )}
                        {isLoading && (
                            <div className="text-xs text-gray-400">Đang tìm kiếm xe...</div>
                        )}
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
