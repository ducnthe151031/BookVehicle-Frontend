import React, { useState, useEffect } from 'react';
import { RefreshCw, Search } from 'lucide-react';
import CRMLayout from './Crm.jsx';
import { getBrands } from '../service/authentication.js';

const BrandList = () => {
    const [brands, setBrands] = useState([]);
    const [message, setMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    //   Fetch brand list
    const fetchBrands = async () => {
        try {
            const data = await getBrands();
            if (data.httpStatus === 200) {
                // Remove duplicates based on name using Map
                const uniqueBrands = [...new Map(data.data.map(item => [item.name, item])).values()];
                setBrands(uniqueBrands);
                setMessage('');
            } else {
                setMessage('Lỗi khi tải danh sách hãng xe.');
            }
        } catch (error) {
            setMessage('Không thể kết nối đến server để lấy danh sách hãng xe.');
        }
    };

    useEffect(() => {
        fetchBrands();
    }, []);

    // Filter brands based on search term
    const filteredBrands = brands.filter(brand =>
        brand.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <CRMLayout>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                                <RefreshCw className="w-5 h-5" />
                                Danh sách hãng xe
                            </h2>
                            <button
                                onClick={fetchBrands}
                                className="text-white hover:text-gray-200 focus:outline-none flex items-center gap-2"
                            >
                                <RefreshCw className="w-5 h-5" />
                                Làm mới
                            </button>
                        </div>

                        <div className="p-8">
                            {/* Search Input */}
                            <div className="mb-6">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Tìm kiếm hãng xe..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 pl-10"
                                    />
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                </div>
                            </div>

                            {/* Brand Table */}
                            {message && (
                                <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg text-center mb-4">
                                    {message}
                                </div>
                            )}
                            {filteredBrands.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left text-gray-700">
                                        <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 border-b">ID</th>
                                            <th className="px-4 py-3 border-b">Tên hãng xe</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {filteredBrands.map((brand) => (
                                            <tr key={brand.id} className="border-b hover:bg-gray-50 transition-colors">
                                                <td className="px-4 py-3">{brand.id}</td>
                                                <td className="px-4 py-3">{brand.name}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                !message && <p className="text-center text-gray-500">Không có hãng xe nào.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </CRMLayout>
    );
};

export default BrandList;