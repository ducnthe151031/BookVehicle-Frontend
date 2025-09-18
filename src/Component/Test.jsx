import {useEffect, useRef, useState} from "react";
import {GoogleGenAI} from "@google/genai";
import { getVehiclesIsApproved } from '../service/authentication.js';

const Test = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const ai = new GoogleGenAI({ apiKey: "AIzaSyBq_3GlnpHgtU3LhQmZPz1BgSvupVtOQGE" });


    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const getFullImageUrl = (filename) => {
        if (!filename) return 'https://via.placeholder.com/300x200?text=No+Image';
        const first = filename.split(',')[0].trim();
        if (!first) return 'https://via.placeholder.com/300x200?text=No+Image';
        // Keep existing backend image path used elsewhere in the project
        return `http://localhost:8080/v1/user/images/${first}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        // Add user message
        const userMessage = { text: input, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        // Check for Vietnamese search pattern: "tìm kiếm xe tại <location>"
        // More flexible Vietnamese search detection.
        // We support variants like:
        //  - "tìm xe ở Đà Nẵng"
        //  - "tìm kiếm xe tại Hà Nội"
        //  - "tìm xe Đà Nẵng"
        //  - "xe ở Hà Nội"
        // This uses multiple patterns and a small cleanup step for the extracted location.
        const cleanInput = input.trim();
        const patterns = [
            /tìm(?: kiếm)?\s*(?:xe)?\s*(?:ở|tại)\s*(.+)/i, // tìm [kiếm] xe ở/tại <location>
            /tìm(?: kiếm)?\s*(?:xe)?\s+(.+)/i, // tìm [kiếm] xe <location>
            /xe\s*(?:ở|tại)\s*(.+)/i // xe ở/tại <location>
        ];

        let locationQuery = null;
        for (const p of patterns) {
            const m = cleanInput.match(p);
            if (m) {
                // prefer the second capture if present (some patterns might have two), otherwise the first
                locationQuery = (m[2] || m[1] || '').trim();
                if (locationQuery) break;
            }
        }

        if (locationQuery) {
            // Strip trailing punctuation and common Vietnamese filler words that users append
            locationQuery = locationQuery
                .replace(/[?!.，,]+$/g, '') // trailing punctuation
                .replace(/\b(?:không|nhé|ạ|giùm|giúp|được không|cho tôi)\b\s*$/i, '')
                .trim();

            try {
                // Fetch approved vehicles (uses existing service function)
                const response = await getVehiclesIsApproved(0, 100, {});
                const data = response.data;
                if (data && data.httpStatus === 200) {
                    const allVehicles = data.data?.content || [];
                    const matched = allVehicles.filter(v => v.location && v.location.toLowerCase().includes(locationQuery.toLowerCase()));

                    if (matched.length === 0) {
                        const aiMessage = { text: `Không tìm thấy xe tại "${locationQuery}".`, sender: 'ai' };
                        setMessages(prev => [...prev, aiMessage]);
                    } else {
                        // Add a special vehicle_list message that the renderer will treat differently
                        const vehicleMessage = { sender: 'ai', type: 'vehicle_list', location: locationQuery, vehicles: matched };
                        setMessages(prev => [...prev, vehicleMessage]);
                    }
                } else {
                    const aiMessage = { text: 'Đã có lỗi khi tải dữ liệu xe. Vui lòng thử lại sau.', sender: 'ai' };
                    setMessages(prev => [...prev, aiMessage]);
                }
            } catch (error) {
                console.error('Error fetching vehicles for location search:', error);
                const errorMessage = { text: "Không thể kết nối đến server để tìm xe.", sender: 'ai' };
                setMessages(prev => [...prev, errorMessage]);
            } finally {
                setIsLoading(false);
            }

            return; // skip the AI call for this specific search flow
        }

        try {
            // Get AI response
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: "Cơ sở dữ liệu vehicle_rental_system\n" +
                    "Cơ sở dữ liệu quản lý việc đặt xe, bao gồm thông tin về xe, người dùng, yêu cầu thuê, thanh toán và đánh giá. Dưới đây là mô tả chi tiết các bảng và quan hệ giữa chúng.\n" +
                    "1. Bảng brands\n" +
                    "\n" +
                    "Mô tả: Lưu trữ thông tin về các hãng xe.\n" +
                    "Cột:\n" +
                    "id (varchar, Khóa chính)\n" +
                    "name (varchar)\n" +
                    "\n" +
                    "\n" +
                    "Dữ liệu mẫu:\n" +
                    "\n" +
                    "\n" +
                    "id\n" +
                    "name\n" +
                    "\n" +
                    "\n" +
                    "\n" +
                    "87496fe6-7ae9-42ea-9dc7-3010f56f65c5\n" +
                    "1\n" +
                    "\n" +
                    "\n" +
                    "ec006acd-bffc-4762-ac6e-e3c3b42b5fb9\n" +
                    "2\n" +
                    "\n" +
                    "\n" +
                    "993c105b-ad2a-4747-a631-df9c2af2472d\n" +
                    "3\n" +
                    "\n" +
                    "\n" +
                    "\n" +
                    "\n" +
                    "2. Bảng categories\n" +
                    "\n" +
                    "Mô tả: Lưu trữ danh mục xe.\n" +
                    "Cột:\n" +
                    "id (varchar, Khóa chính)\n" +
                    "name (varchar)\n" +
                    "\n" +
                    "\n" +
                    "Dữ liệu mẫu:\n" +
                    "\n" +
                    "\n" +
                    "id\n" +
                    "name\n" +
                    "\n" +
                    "\n" +
                    "\n" +
                    "9\n" +
                    "Xe gắn máy\n" +
                    "\n" +
                    "\n" +
                    "9\n" +
                    "Xe gắn máy\n" +
                    "\n" +
                    "\n" +
                    "c47bb974-5064-47c0-8ab9-e5e2b1139937\n" +
                    "90\n" +
                    "\n" +
                    "\n" +
                    "\n" +
                    "\n" +
                    "3. Bảng coupons\n" +
                    "\n" +
                    "Mô tả: Lưu trữ mã giảm giá.\n" +
                    "Cột:\n" +
                    "Id (varchar, Khóa chính)\n" +
                    "coupon_code (varchar, Duy nhất)\n" +
                    "discount_amount (decimal)\n" +
                    "\n" +
                    "\n" +
                    "Dữ liệu mẫu:\n" +
                    "\n" +
                    "\n" +
                    "Id\n" +
                    "coupon_code\n" +
                    "discount_amount\n" +
                    "\n" +
                    "\n" +
                    "\n" +
                    "0b421422-4072-4a1e-9b02-069a2a30714f\n" +
                    "232322323\n" +
                    "23233232323.00\n" +
                    "\n" +
                    "\n" +
                    "33c40828-ec34-4880-a4aa-6560a0227a01\n" +
                    "23\n" +
                    "2323.00\n" +
                    "\n" +
                    "\n" +
                    "459f399f-0b4d-43dd-8d2b-f800132881b9\n" +
                    "TEST1\n" +
                    "25000.00\n" +
                    "\n" +
                    "\n" +
                    "\n" +
                    "\n" +
                    "4. Bảng discount_codes\n" +
                    "\n" +
                    "Mô tả: Lưu trữ chi tiết mã giảm giá (ngày hết hạn, số lần sử dụng).\n" +
                    "Cột:\n" +
                    "id (varchar, Khóa chính)\n" +
                    "code (varchar)\n" +
                    "discount_amount (decimal)\n" +
                    "expiry_date (datetime)\n" +
                    "used_count (int)\n" +
                    "max_use (int)\n" +
                    "created_by (varchar)\n" +
                    "\n" +
                    "\n" +
                    "Dữ liệu mẫu: (Không có)\n" +
                    "\n" +
                    "5. Bảng images\n" +
                    "\n" +
                    "Mô tả: Lưu trữ URL hình ảnh xe.\n" +
                    "Cột:\n" +
                    "id (varchar, Khóa chính)\n" +
                    "vehicle_id (varchar)\n" +
                    "url (varchar)\n" +
                    "uploaded_at (datetime)\n" +
                    "\n" +
                    "\n" +
                    "Dữ liệu mẫu: (Không có)\n" +
                    "\n" +
                    "6. Bảng notifications\n" +
                    "\n" +
                    "Mô tả: Lưu trữ thông báo gửi đến người dùng.\n" +
                    "Cột:\n" +
                    "id (varchar, Khóa chính)\n" +
                    "user_id (varchar)\n" +
                    "title (varchar)\n" +
                    "message (text)\n" +
                    "is_read (tinyint)\n" +
                    "created_at (datetime)\n" +
                    "type (varchar, ví dụ: SYSTEM, EMAIL, REMINDER)\n" +
                    "\n" +
                    "\n" +
                    "Dữ liệu mẫu: (Không có)\n" +
                    "\n" +
                    "7. Bảng payments\n" +
                    "\n" +
                    "Mô tả: Ghi lại giao dịch thanh toán.\n" +
                    "Cột:\n" +
                    "amount (decimal)\n" +
                    "id (bigint, Khóa chính, Tự tăng)\n" +
                    "is_payment (tinyint)\n" +
                    "description (varchar)\n" +
                    "user_id (varchar)\n" +
                    "url (varchar)\n" +
                    "booking_id (varchar)\n" +
                    "\n" +
                    "\n" +
                    "Dữ liệu mẫu:\n" +
                    "\n" +
                    "\n" +
                    "amount\n" +
                    "id\n" +
                    "is_payment\n" +
                    "description\n" +
                    "user_id\n" +
                    "url\n" +
                    "booking_id\n" +
                    "\n" +
                    "\n" +
                    "\n" +
                    "12121.00\n" +
                    "1\n" +
                    "0\n" +
                    "test\n" +
                    "121212\n" +
                    "https://pay.payos.vn/web/d5c631e64723455cb16005966dc0c58c\n" +
                    "\n" +
                    "\n" +
                    "\n" +
                    "30000.00\n" +
                    "2\n" +
                    "0\n" +
                    "description\n" +
                    "cca764c1-2e39-40c9-97c5-fb0087914f0f\n" +
                    "https://pay.payos.vn/web/6ea700fcdb27471cb1713f4a7343858f\n" +
                    "a9d1c82a-5e09-456e-be1c-90eea8690001\n" +
                    "\n" +
                    "\n" +
                    "40000.00\n" +
                    "3\n" +
                    "0\n" +
                    "description\n" +
                    "cca764c1-2e39-40c9-97c5-fb0087914f0f\n" +
                    "https://pay.payos.vn/web/d923fb6be9864ce6b0a25eb752b54b1a\n" +
                    "c7b119b7-5f23-401a-8edc-2332cc41b86c\n" +
                    "\n" +
                    "\n" +
                    "\n" +
                    "\n" +
                    "8. Bảng promotions\n" +
                    "\n" +
                    "Mô tả: Lưu trữ chương trình khuyến mãi xe.\n" +
                    "Cột:\n" +
                    "id (varchar, Khóa chính)\n" +
                    "vehicle_id (varchar)\n" +
                    "title (varchar)\n" +
                    "discount_percent (int)\n" +
                    "start_date (datetime)\n" +
                    "end_date (datetime)\n" +
                    "\n" +
                    "\n" +
                    "Dữ liệu mẫu: (Không có)\n" +
                    "\n" +
                    "9. Bảng rental_requests\n" +
                    "\n" +
                    "Mô tả: Lưu trữ yêu cầu thuê xe.\n" +
                    "Cột:\n" +
                    "id (varchar, Khóa chính)\n" +
                    "customer_id (varchar)\n" +
                    "vehicle_id (varchar)\n" +
                    "start_date (datetime)\n" +
                    "end_date (datetime)\n" +
                    "status (varchar, ví dụ: PENDING, APPROVED, CANCELLED, COMPLETED)\n" +
                    "deposit_paid (tinyint)\n" +
                    "total_price (decimal)\n" +
                    "late_fee (decimal)\n" +
                    "created_at (datetime)\n" +
                    "created_by (varchar)\n" +
                    "approved_by (varchar)\n" +
                    "brand_id (varchar)\n" +
                    "category_id (varchar)\n" +
                    "rent_type (varchar, ví dụ: DAY, HOUR)\n" +
                    "url (varchar)\n" +
                    "order_code (bigint)\n" +
                    "payment_status (tinyint)\n" +
                    "is_late (tinyint)\n" +
                    "late_fee_paid (tinyint)\n" +
                    "return_date (datetime)\n" +
                    "delivery_status (varchar)\n" +
                    "\n" +
                    "\n" +
                    "Dữ liệu mẫu:\n" +
                    "\n" +
                    "\n" +
                    "id\n" +
                    "customer_id\n" +
                    "vehicle_id\n" +
                    "start_date\n" +
                    "end_date\n" +
                    "status\n" +
                    "total_price\n" +
                    "rent_type\n" +
                    "\n" +
                    "\n" +
                    "\n" +
                    "07ad27a8-11ef-4688-baca-e01a27c3318e\n" +
                    "cca764c1-2e39-40c9-97c5-fb0087914f0f\n" +
                    "8892720c-117c-4cf2-ac13-21a5fe87d530\n" +
                    "2025-09-24 18:09:00\n" +
                    "2025-09-24 21:09:00\n" +
                    "AVAILABLE\n" +
                    "30000.00\n" +
                    "hour\n" +
                    "\n" +
                    "14e978cc-075c-49ca-8054-011da68a6dfe\n" +
                    "cca764c1-2e39-40c9-97c5-fb0087914f0f\n" +
                    "8892720c-117c-4cf2-ac13-21a5fe87d530\n" +
                    "2025-08-30 18:41:00\n" +
                    "2025-09-01 18:41:00\n" +
                    "AVAILABLE\n" +
                    "200000.00\n" +
                    "day\n" +
                    "\n" +
                    "\n" +
                    "\n" +
                    "\n" +
                    "10. Bảng reviews\n" +
                    "\n" +
                    "Mô tả: Lưu trữ đánh giá về xe/dịch vụ.\n" +
                    "Cột:\n" +
                    "id (varchar, Khóa chính)\n" +
                    "user_id (varchar)\n" +
                    "vehicle_id (varchar)\n" +
                    "booking_id (varchar)\n" +
                    "rating (tinyint, 1-5)\n" +
                    "comment (text)\n" +
                    "created_at (timestamp)\n" +
                    "updated_at (timestamp)\n" +
                    "\n" +
                    "\n" +
                    "Dữ liệu mẫu:\n" +
                    "\n" +
                    "\n" +
                    "id\n" +
                    "user_id\n" +
                    "vehicle_id\n" +
                    "rating\n" +
                    "comment\n" +
                    "created_at\n" +
                    "\n" +
                    "\n" +
                    "\n" +
                    "0ca319d5-fc17-44e0-ae7a-d87d50a3d39f\n" +
                    "cca764c1-2e39-40c9-97c5-fb0087914f0f\n" +
                    "8892720c-117c-4cf2-ac13-21a5fe87d530\n" +
                    "2\n" +
                    "\n" +
                    "2025-08-02 07:09:14\n" +
                    "\n" +
                    "\n" +
                    "8f903b36-e443-45c0-ae19-ce2c92032f17\n" +
                    "cca764c1-2e39-40c9-97c5-fb0087914f0f\n" +
                    "\n" +
                    "3\n" +
                    "324234\n" +
                    "2025-06-25 13:22:37\n" +
                    "\n" +
                    "\n" +
                    "\n" +
                    "\n" +
                    "11. Bảng token\n" +
                    "\n" +
                    "Mô tả: Lưu trữ token truy cập/refresh.\n" +
                    "Cột:\n" +
                    "id (varchar, Khóa chính)\n" +
                    "user_id (varchar)\n" +
                    "access_token (varchar)\n" +
                    "refresh_token (varchar)\n" +
                    "revoked (bit)\n" +
                    "expired (bit)\n" +
                    "token_type (varchar)\n" +
                    "\n" +
                    "\n" +
                    "Dữ liệu mẫu:\n" +
                    "\n" +
                    "\n" +
                    "id\n" +
                    "user_id\n" +
                    "access_token\n" +
                    "token_type\n" +
                    "\n" +
                    "\n" +
                    "\n" +
                    "01c5b971-10f1-4a98-bf97-f3fb11c04dfc\n" +
                    "5c8324d7-4280-42de-b480-f4069d09d7ae\n" +
                    "eyJhbGciOiJIUzI1NiJ9...\n" +
                    "BEARER\n" +
                    "\n" +
                    "\n" +
                    "05cd2bb3-a188-419b-9fa8-021be17a4c6e\n" +
                    "cca764c1-2e39-40c9-97c5-fb0087914f0f\n" +
                    "eyJhbGciOiJIUzI1NiJ9...\n" +
                    "BEARER\n" +
                    "\n" +
                    "\n" +
                    "\n" +
                    "\n" +
                    "12. Bảng user\n" +
                    "\n" +
                    "Mô tả: Lưu trữ thông tin người dùng (khách hàng, chủ xe, admin, operator).\n" +
                    "Cột:\n" +
                    "id (varchar, Khóa chính)\n" +
                    "username (varchar)\n" +
                    "password (varchar)\n" +
                    "email (varchar)\n" +
                    "created_at (datetime)\n" +
                    "updated_at (datetime)\n" +
                    "role (varchar)\n" +
                    "flag_active (varchar)\n" +
                    "full_name (varchar)\n" +
                    "phone_number (varchar)\n" +
                    "avartar_url (varchar)\n" +
                    "address (varchar)\n" +
                    "citizen_id_card_url (varchar)\n" +
                    "driver_license_url (varchar)\n" +
                    "\n" +
                    "\n" +
                    "Dữ liệu mẫu:\n" +
                    "\n" +
                    "\n" +
                    "id\n" +
                    "username\n" +
                    "email\n" +
                    "role\n" +
                    "flag_active\n" +
                    "\n" +
                    "\n" +
                    "\n" +
                    "0167eef4-7b31-4e72-b5e7-4f97efbad43c\n" +
                    "vinhtnhe163160@fpt.edu.vn\n" +
                    "vinhtnhe163160@fpt.edu.vn\n" +
                    "ADMIN\n" +
                    "ACTIVE\n" +
                    "\n" +
                    "\n" +
                    "054dba68-0456-4c0f-9519-ce3b5a46ce16\n" +
                    "user\n" +
                    "btung548@gmail.com\n" +
                    "USER\n" +
                    "ACTIVE\n" +
                    "\n" +
                    "\n" +
                    "\n" +
                    "\n" +
                    "13. Bảng user_transactions\n" +
                    "\n" +
                    "Mô tả: Ghi lại hành động giao dịch của người dùng.\n" +
                    "Cột:\n" +
                    "id (varchar, Khóa chính)\n" +
                    "user_id (varchar)\n" +
                    "action (varchar, ví dụ: Created Rental, Canceled Rental, Made Payment)\n" +
                    "description (varchar)\n" +
                    "created_at (datetime)\n" +
                    "\n" +
                    "\n" +
                    "Dữ liệu mẫu: (Không có)\n" +
                    "\n" +
                    "14. Bảng vehicle_reviews\n" +
                    "\n" +
                    "Mô tả: Đánh giá cụ thể về xe.\n" +
                    "Cột:\n" +
                    "id (varchar, Khóa chính)\n" +
                    "vehicle_id (varchar)\n" +
                    "user_id (varchar)\n" +
                    "rating (int, 1-5)\n" +
                    "comment (text)\n" +
                    "created_at (datetime)\n" +
                    "created_by (varchar)\n" +
                    "\n" +
                    "\n" +
                    "Dữ liệu mẫu: (Không có)\n" +
                    "\n" +
                    "15. Bảng vehicle_type\n" +
                    "\n" +
                    "Mô tả: Định nghĩa loại phương tiện.\n" +
                    "Cột:\n" +
                    "id (int, Khóa chính)\n" +
                    "type (varchar)\n" +
                    "\n" +
                    "\n" +
                    "Dữ liệu mẫu:\n" +
                    "\n" +
                    "\n" +
                    "id\n" +
                    "type\n" +
                    "\n" +
                    "\n" +
                    "\n" +
                    "1\n" +
                    "CAR\n" +
                    "\n" +
                    "\n" +
                    "2\n" +
                    "BIKE\n" +
                    "\n" +
                    "\n" +
                    "\n" +
                    "\n" +
                    "16. Bảng vehicles\n" +
                    "\n" +
                    "Mô tả: Lưu trữ thông tin chi tiết xe.\n" +
                    "Cột:\n" +
                    "id (varchar, Khóa chính)\n" +
                    "owner_id (varchar)\n" +
                    "vehicle_name (varchar)\n" +
                    "branch_id (varchar)\n" +
                    "category_id (varchar)\n" +
                    "fuel_type (varchar)\n" +
                    "seat_count (int)\n" +
                    "liecense_plate (varchar)\n" +
                    "price_per_day (decimal)\n" +
                    "description (text)\n" +
                    "status (varchar)\n" +
                    "image_url (longtext)\n" +
                    "created_at (datetime)\n" +
                    "created_by (varchar)\n" +
                    "vehicle_type_id (int)\n" +
                    "price_per_hour (decimal)\n" +
                    "gear_box (varchar)\n" +
                    "location (varchar)\n" +
                    "registration_document_url (longtext)\n" +
                    "approved (tinyint)\n" +
                    "user_id (varchar)\n" +
                    "reason (varchar)\n" +
                    "\n" +
                    "\n" +
                    "Dữ liệu mẫu:\n" +
                    "\n" +
                    "\n" +
                    "id\n" +
                    "vehicle_name\n" +
                    "category_id\n" +
                    "fuel_type\n" +
                    "price_per_day\n" +
                    "status\n" +
                    "vehicle_type_id\n" +
                    "\n" +
                    "\n" +
                    "\n" +
                    "8892720c-117c-4cf2-ac13-21a5fe87d530\n" +
                    "Vinfast\n" +
                    "9\n" +
                    "Electric\n" +
                    "100000.00\n" +
                    "AVAILABLE\n" +
                    "1\n" +
                    "\n" +
                    "\n" +
                    "8e2e81c6-b46d-499b-98b7-429a7d589af1\n" +
                    "Vinfast2\n" +
                    "9\n" +
                    "Gasoline\n" +
                    "222222.00\n" +
                    "PENDING\n" +
                    "2\n" +
                    "\n" +
                    "\n" +
                    "\n" +
                    "\n" +
                    "Quan hệ giữa các bảng\n" +
                    "\n" +
                    "Bảng reviews:\n" +
                    "user_id → user.id (ON DELETE CASCADE)\n" +
                    "vehicle_id → vehicles.id (ON DELETE CASCADE)\n" +
                    "booking_id → rental_requests.id (ON DELETE CASCADE)\n" +
                    "\n" +
                    "\n" +
                    "Bảng token:\n" +
                    "user_id → user.id (ON DELETE CASCADE)\n" +
                    "\n" +
                    "\n" +
                    "Lưu ý: Một số cột như rental_requests.customer_id, rental_requests.vehicle_id, vehicles.owner_id, vehicles.branch_id, vehicles.category_id, payments.user_id, payments.booking_id, images.vehicle_id, notifications.user_id, user_transactions.user_id, promotions.vehicle_id, vehicle_reviews.user_id, vehicle_reviews.vehicle_id có thể là khóa ngoại nhưng không được định nghĩa trực tiếp trong SQL. Chúng có thể được quản lý qua logic ứng dụng.\n" +
                    "đừng trả lời kiểu kỹ thuật nhé, hãy hiểu là user bên ngoài đang muốn hỏi thông tin" + input,
            });

            // Add AI message
            const aiMessage = { text: response.text, sender: 'ai' };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error('Error calling Gemini API:', error);
            const errorMessage = { text: "Sorry, I couldn't process your request.", sender: 'ai' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-screen max-w-3xl mx-auto bg-gray-50">
            <header className="bg-blue-600 text-white p-4 shadow-md">
                <h1 className="text-xl font-bold">Gemini AI Chat</h1>
            </header>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500">Start a conversation with Gemini AI</p>
                    </div>
                ) : (
                    messages.map((message, index) => (
                        <div
                            key={index}
                            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            {/* If this is a vehicle list message render cards */}
                            {message.type === 'vehicle_list' ? (
                                <div className="bg-gray-100 text-gray-800 rounded-lg p-3 max-w-full">
                                    <p className="font-semibold mb-2">Kết quả tìm kiếm xe tại "{message.location}":</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {message.vehicles.map((v) => (
                                            <div key={v.id} className="flex border rounded overflow-hidden bg-white">
                                                <img src={getFullImageUrl(v.image_url)} alt={v.vehicle_name} className="w-32 h-24 object-cover" />
                                                <div className="p-2 flex flex-col justify-between flex-1">
                                                    <div>
                                                        <p className="font-medium">{v.vehicle_name || v.vehicleName || 'Xe'}</p>
                                                        <p className="text-sm text-gray-500">{v.location || 'N/A'}</p>
                                                    </div>
                                                    <div className="mt-2">
                                                        <a href={`/${v.id}`} className="text-blue-600 hover:underline text-sm mr-3" target="_blank" rel="noreferrer">Xem chi tiết</a>
                                                        <a href={getFullImageUrl(v.image_url)} className="text-blue-600 hover:underline text-sm" target="_blank" rel="noreferrer">Ảnh</a>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div
                                    className={`max-w-xs md:max-w-md lg:max-w-lg rounded-lg px-4 py-2 ${
                                        message.sender === 'user'
                                            ? 'bg-blue-500 text-white rounded-br-none'
                                            : 'bg-gray-200 text-gray-800 rounded-bl-none'
                                    }`}
                                >
                                    {message.text}
                                </div>
                            )}
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-gray-200 text-gray-800 rounded-lg rounded-bl-none px-4 py-2">
                            <div className="flex space-x-2">
                                <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"></div>
                                <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce delay-100"></div>
                                <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce delay-200"></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 bg-white">
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 text-white rounded-full px-6 py-2 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                        disabled={!input.trim() || isLoading}
                    >
                        Send
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Test;

