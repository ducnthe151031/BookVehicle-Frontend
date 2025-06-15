import React, { useState, useEffect } from 'react';
import { Tag } from 'lucide-react';
import CRMLayout from './Crm.jsx';
import axios from 'axios';
import {getCategories} from "../service/authentication.js";

const CategoryList = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchCategories = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await getCategories();
            if (data.httpStatus === 200) {
                setCategories(data.data);
            } else {
                setError(data.message || 'Lỗi khi tải danh sách loại xe');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể kết nối đến server');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-6 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-full mb-3">
                        <Tag className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">Danh Sách Loại Xe</h1>
                    <p className="text-gray-600 text-sm">Quản lý các loại xe hiệu quả</p>
                </div>

                {/* Category List */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                            <Tag className="w-5 h-5" />
                            Danh sách loại xe
                        </h2>
                    </div>

                    <div className="p-4">
                        {loading && (
                            <div className="text-center text-gray-600 text-sm">Đang tải...</div>
                        )}
                        {error && (
                            <div className="mb-3 p-2 rounded-lg text-center font-medium bg-red-50 border border-red-200 text-red-600 text-sm">
                                {error}
                            </div>
                        )}
                        {!loading && categories.length === 0 && !error && (
                            <div className="text-center text-gray-600 text-sm">Không có loại xe nào để hiển thị</div>
                        )}
                        {categories.length > 0 && (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên Loại Xe</th>
                                    </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                    {categories.map((category) => (
                                        <tr key={category.id} className="hover:bg-gray-50">
                                            <td className="px-2 py-1 whitespace-nowrap text-sm text-gray-900">
                                                {category.id}
                                            </td>
                                            <td className="px-2 py-1 whitespace-nowrap text-sm text-gray-900">
                                                {category.name}
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const CategoryListPage = () => (
    <CRMLayout>
        <CategoryList />
    </CRMLayout>
);

export default CategoryListPage;