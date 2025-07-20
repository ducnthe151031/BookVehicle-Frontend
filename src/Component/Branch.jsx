import React, { useState, useEffect } from 'react';
import {RefreshCw, Search, Plus, Edit, Trash2, X, Factory} from 'lucide-react';
import CRMLayout from './Crm.jsx';
import { getBrands, createBrand, updateBrand, deleteBrand } from '../service/authentication.js';

// Reusable Modal Component for Brands
const BrandModal = ({ mode, isOpen, onClose, onSubmit, loading, error, brandName, setBrandName }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 transition-opacity">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md m-4 transform transition-all animate-fade-in-up">
                <div className="flex justify-between items-center mb-4 border-b pb-3">
                    <h2 className="text-xl font-bold text-gray-800">
                        {mode === 'create' ? 'Tạo Hãng Xe Mới' : 'Chỉnh Sửa Hãng Xe'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <form onSubmit={onSubmit}>
                    {error && (
                        <div className="mb-4 p-3 rounded-lg text-center font-medium bg-red-50 border border-red-200 text-red-600 text-sm">
                            {error}
                        </div>
                    )}
                    <div className="mb-5">
                        <label htmlFor="brandName" className="block text-sm font-medium text-gray-700 mb-2">
                            Tên Hãng Xe
                        </label>
                        <input
                            type="text"
                            id="brandName"
                            value={brandName}
                            onChange={(e) => setBrandName(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                            autoFocus
                        />
                    </div>
                    <div className="flex justify-end gap-3 pt-4 border-t mt-4">
                        <button type="button" onClick={onClose} className="px-5 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-semibold text-sm">
                            Hủy
                        </button>
                        <button type="submit" disabled={loading} className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 font-semibold text-sm flex items-center justify-center min-w-[80px]">
                            {loading ? 'Lưu...' : 'Lưu'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const BrandList = () => {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    // State for modal and actions
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('create');
    const [currentBrand, setCurrentBrand] = useState(null);
    const [brandName, setBrandName] = useState('');
    const [actionLoading, setActionLoading] = useState(false);
    const [actionError, setActionError] = useState('');

    const fetchBrands = async () => {
        setLoading(true);
        setMessage('');
        try {
            const data = await getBrands();
            if (data.httpStatus === 200) {
                const uniqueBrands = [...new Map(data.data.map(item => [item.name, item])).values()];
                setBrands(uniqueBrands);
            } else {
                setMessage('Lỗi khi tải danh sách hãng xe.');
            }
        } catch (error) {
            setMessage('Không thể kết nối đến server.');
        } finally {
            setLoading(false);
        }
    };
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [brandToDelete, setBrandToDelete] = useState(null);

    useEffect(() => {
        fetchBrands();
    }, []);

    // Modal Handlers
    const handleOpenModal = (mode, brand = null) => {
        setModalMode(mode);
        setActionError('');
        if (mode === 'edit' && brand) {
            setCurrentBrand(brand);
            setBrandName(brand.name);
        } else {
            setCurrentBrand(null);
            setBrandName('');
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => setIsModalOpen(false);

    // CRUD Handlers
    const handleSubmit = async (e) => {
        e.preventDefault();
        setActionLoading(true);
        setActionError('');
        try {
            if (modalMode === 'edit' && currentBrand) {
                await updateBrand(currentBrand.id, { name: brandName });
            } else {
                await createBrand({ name: brandName });
            }
            handleCloseModal();
            await fetchBrands();
        } catch (err) {
            setActionError(err.response?.data?.message || `Không thể ${modalMode === 'edit' ? 'cập nhật' : 'tạo'} hãng xe.`);
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = (brandId) => {
        const brand = brands.find(b => b.id === brandId);
        setBrandToDelete(brand);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!brandToDelete) return;

        const originalBrands = [...brands];
        setBrands(brands.filter(b => b.id !== brandToDelete.id));
        setMessage('');
        try {
            await deleteBrand(brandToDelete.id);
        } catch (err) {
            setBrands(originalBrands); // Revert on error
            setMessage(err.response?.data?.message || 'Không thể xóa hãng xe.');
        } finally {
            setShowDeleteModal(false);
            setBrandToDelete(null);
        }
    };
    const filteredBrands = brands.filter(brand =>
        brand.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <CRMLayout>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-white flex items-center gap-3">
                                <Factory className="w-6 h-6" />
                                Danh sách hãng xe
                            </h2>
                            <button onClick={() => handleOpenModal('create')} className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-lg shadow font-semibold hover:bg-gray-100 transition-colors">
                                <Plus className="w-5 h-5" />
                                Thêm Hãng Xe
                            </button>
                        </div>

                        <div className="p-6 md:p-8">
                            <div className="mb-6 flex justify-between items-center gap-4">
                                <div className="relative flex-grow">
                                    <input
                                        type="text"
                                        placeholder="Tìm kiếm loại xe..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 pl-10"
                                    />
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                </div>

                            </div>


                            {message && <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg text-center mb-4">{message}</div>}

                            {loading ? (<p className="text-center text-gray-500 py-10">Đang tải...</p>) :
                                filteredBrands.length > 0 ? (
                                    <div className="overflow-x-auto border rounded-lg">
                                        <table className="w-full text-sm text-left text-gray-700">
                                            <thead className="bg-gray-50 text-xs text-gray-600 uppercase">
                                            <tr>
                                                <th className="px-6 py-3">Tên hãng xe</th>
                                                <th className="px-6 py-3 text-right">Hành động</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {filteredBrands.map((brand) => (
                                                <tr key={brand.id} className="border-b hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4 font-medium text-gray-900">{brand.name}</td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-4">
                                                            <button onClick={() => handleOpenModal('edit', brand)} className="text-blue-600 hover:text-blue-800" title="Chỉnh sửa">
                                                                <Edit className="w-5 h-5" />
                                                            </button>
                                                            <button onClick={() => handleDelete(brand.id)} className="text-red-600 hover:text-red-800" title="Xóa">
                                                                <Trash2 className="w-5 h-5" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    !message && <p className="text-center text-gray-500 py-10">Không tìm thấy hãng xe nào.</p>
                                )}
                        </div>
                    </div>
                </div>
            </div>
            {showDeleteModal && brandToDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 transition-opacity">
                    <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md m-4 transform transition-all animate-fade-in-up">
                        <div className="flex justify-between items-center mb-4 border-b pb-3">
                            <h3 className="text-xl font-bold text-gray-800">Xác nhận xóa</h3>
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setBrandToDelete(null);
                                }}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <p className="text-gray-600 mb-6">
                            Bạn có chắc chắn muốn xóa hãng xe <span className="font-semibold">{brandToDelete.name}</span> không?
                        </p>
                        <div className="flex justify-end gap-3 pt-4 border-t">
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setBrandToDelete(null);
                                }}
                                className="px-5 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-semibold text-sm"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold text-sm"
                            >
                                Xóa
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <BrandModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleSubmit}
                mode={modalMode}
                loading={actionLoading}
                error={actionError}
                brandName={brandName}
                setBrandName={setBrandName}
            />
        </CRMLayout>
    );
};

export default BrandList;