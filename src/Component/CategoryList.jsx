import React, { useState, useEffect } from 'react';
import { Tag, Plus, Edit, Trash2, X } from 'lucide-react';
import CRMLayout from './Crm.jsx';
import { getCategories, createCategory, updateCategory, deleteCategory } from "../service/authentication.js";

// Reusable Modal Component
const CategoryModal = ({ mode, isOpen, onClose, onSubmit, loading, error, categoryName, setCategoryName }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md m-4 transform transition-all">
                <div className="flex justify-between items-center mb-4 border-b pb-3">
                    <h2 className="text-xl font-bold text-gray-800">
                        {mode === 'create' ? 'Tạo Loại Xe Mới' : 'Chỉnh Sửa Loại Xe'}
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
                        <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 mb-2">
                            Tên Loại Xe
                        </label>
                        <input
                            type="text"
                            id="categoryName"
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div className="flex justify-end gap-3 pt-4 border-t mt-4">
                        <button type="button" onClick={onClose} className="px-5 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-semibold text-sm">
                            Hủy
                        </button>
                        <button type="submit" disabled={loading} className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 font-semibold text-sm flex items-center justify-center">
                            {loading ? 'Đang lưu...' : 'Lưu'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const CategoryList = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState('');
    const [actionError, setActionError] = useState('');

    // State for modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('create');
    const [currentCategory, setCurrentCategory] = useState(null);
    const [categoryName, setCategoryName] = useState('');

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

    // Modal Handlers
    const handleOpenModal = (mode, category = null) => {
        setModalMode(mode);
        setActionError('');
        if (mode === 'edit' && category) {
            setCurrentCategory(category);
            setCategoryName(category.name);
        } else {
            setCurrentCategory(null);
            setCategoryName('');
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    // CRUD Handlers
    const handleSubmit = async (e) => {
        e.preventDefault();
        setActionLoading(true);
        setActionError('');
        try {
            if (modalMode === 'edit' && currentCategory) {
                await updateCategory(currentCategory.id, { name: categoryName });
            } else {
                await createCategory({ name: categoryName });
            }
            handleCloseModal();
            await fetchCategories();
        } catch (err) {
            setActionError(err.response?.data?.message || `Failed to ${modalMode} category`);
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async (categoryId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa loại xe này không?')) {
            // Optimistically update UI
            const originalCategories = [...categories];
            setCategories(categories.filter(c => c.id !== categoryId));
            setError('');
            try {
                await deleteCategory(categoryId);
            } catch (err) {
                // Revert on error
                setCategories(originalCategories);
                setError(err.response?.data?.message || 'Không thể xóa loại xe.');
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-6 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                    <div className="text-left">
                        <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-full mb-3 shadow-md">
                            <Tag className="w-7 h-7 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Danh Sách Loại Xe</h1>
                        <p className="text-gray-600 text-sm">Quản lý các loại xe hiệu quả</p>
                    </div>
                    <button
                        onClick={() => handleOpenModal('create')}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Thêm Loại Xe
                    </button>
                </div>

                {/* Category List */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="p-4">
                        {error && (
                            <div className="mb-3 p-3 rounded-lg text-center font-medium bg-red-50 border border-red-200 text-red-600 text-sm">
                                {error}
                            </div>
                        )}
                        {loading ? (
                            <div className="text-center text-gray-600 text-sm py-8">Đang tải...</div>
                        ) : !categories.length ? (
                            <div className="text-center text-gray-600 text-sm py-8">Không có loại xe nào để hiển thị</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên Loại Xe</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                                    </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                    {categories.map((category) => (
                                        <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{category.name}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                                                <div className="flex items-center justify-end gap-3">
                                                    <button onClick={() => handleOpenModal('edit', category)} className="text-blue-600 hover:text-blue-800" title="Chỉnh sửa">
                                                        <Edit className="w-5 h-5" />
                                                    </button>
                                                    <button onClick={() => handleDelete(category.id)} className="text-red-600 hover:text-red-800" title="Xóa">
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
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

            <CategoryModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleSubmit}
                mode={modalMode}
                loading={actionLoading}
                error={actionError}
                categoryName={categoryName}
                setCategoryName={setCategoryName}
            />
        </div>
    );
};

const CategoryListPage = () => (
    <CRMLayout>
        <CategoryList />
    </CRMLayout>
);

export default CategoryListPage;