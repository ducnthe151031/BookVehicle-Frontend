import React, { useState, useEffect } from 'react';
import { User, Edit, Trash2, Plus, X, Search, ChevronLeft, ChevronRight, Filter } from 'lucide-react';import Drawer from 'react-modern-drawer';
import 'react-modern-drawer/dist/index.css';
import { toast } from "react-toastify";
import CRMLayout from "./Crm.jsx";
import { getUserList, createUser } from '../service/authentication.js';
import UserForm from './UserForm.jsx';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize] = useState(5); // Số lượng người dùng mỗi trang
    const [filters, setFilters] = useState({
        username: '',
        fullName: '',
        email: '',
        phoneNumber: '',
        role: '',
        flagActive: ''
    });
    const [showFilterForm, setShowFilterForm] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    const fetchUsers = async (pageNumber) => {
        setLoading(true);
        setError('');
        try {
            const response = await getUserList();
            const data = response.data;
            if (data.httpStatus === 200) {
                const allUsers = data.data || [];
                const filteredUsers = allUsers.filter(user =>
                    (filters.username === '' || user.username.toLowerCase().includes(filters.username.toLowerCase())) &&
                    (filters.fullName === '' || (user.fullName || '').toLowerCase().includes(filters.fullName.toLowerCase())) &&
                    (filters.email === '' || user.email.toLowerCase().includes(filters.email.toLowerCase())) &&
                    (filters.phoneNumber === '' || (user.phoneNumber || '').toLowerCase().includes(filters.phoneNumber.toLowerCase())) &&
                    (filters.role === '' || user.role.toLowerCase().includes(filters.role.toLowerCase())) &&
                    (filters.flagActive === '' || user.flagActive === filters.flagActive)
                );
                const start = pageNumber * pageSize;
                const paginatedUsers = filteredUsers.slice(start, start + pageSize);
                setUsers(paginatedUsers);
                setTotalPages(Math.ceil(filteredUsers.length / pageSize) || 1);
            } else {
                setError(data.message || 'Lỗi khi tải danh sách người dùng');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể kết nối đến server');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers(page);
    }, [page, filters]);

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setPage(newPage);
        }
    };

    const handleEdit = (user) => {
        setSelectedUser(user);
        setEditMode(true);
        setShowAddForm(true);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
        setPage(0); // Reset về trang đầu khi thay đổi filter
    };

    const handleDelete = (userId) => {
        const user = users.find(u => u.id === userId);
        setUserToDelete(user);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!userToDelete) return;

        setLoading(true);
        try {
            await deleteUser(userToDelete.id);
            fetchUsers(page);
            toast.success('Xóa người dùng thành công!');
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Không thể xóa người dùng';
            toast.error('Xóa người dùng thất bại: ' + errorMessage);
        } finally {
            setLoading(false);
            setShowDeleteModal(false);
            setUserToDelete(null);
        }
    };

    const handleAddFormClose = () => {
        setShowAddForm(false);
        setSelectedUser(null);
        setEditMode(false);
    };

    const handleAddFormSuccess = () => {
        setShowAddForm(false);
        setSelectedUser(null);
        setEditMode(false);
        fetchUsers(0);
        setPage(0);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-6 px-4">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-full mb-3">
                        <User className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">Quản Lý Người Dùng</h1>
                    <p className="text-gray-600 text-sm">Quản lý thông tin người dùng trong hệ thống</p>
                </div>

                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                                <User className="w-5 h-5" />
                                Danh sách người dùng
                            </h2>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setShowFilterForm(!showFilterForm)}
                                    className="px-3 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-all duration-200 flex items-center gap-1"
                                    aria-label="Hiện/Ẩn bộ lọc"
                                >
                                    <Filter className="w-4 h-4" />
                                    {showFilterForm ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}
                                </button>
                                <button
                                    onClick={() => {
                                        setSelectedUser(null);
                                        setEditMode(false);
                                        setShowAddForm(true);
                                    }}
                                    className="px-3 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-all duration-200 flex items-center gap-1"
                                    aria-label="Thêm người dùng mới"
                                >
                                    <Plus className="w-4 h-4" />
                                    Thêm
                                </button>
                            </div>
                        </div>
                    </div>

                    {showFilterForm && (
                        <div className="p-4 bg-gray-50 border-b">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tên đăng nhập</label>
                                    <input
                                        type="text"
                                        name="username"
                                        value={filters.username}
                                        onChange={handleFilterChange}
                                        placeholder="Tìm theo tên đăng nhập..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={filters.fullName}
                                        onChange={handleFilterChange}
                                        placeholder="Tìm theo họ và tên..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="text"
                                        name="email"
                                        value={filters.email}
                                        onChange={handleFilterChange}
                                        placeholder="Tìm theo email..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                                    <input
                                        type="text"
                                        name="phoneNumber"
                                        value={filters.phoneNumber}
                                        onChange={handleFilterChange}
                                        placeholder="Tìm theo số điện thoại..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Vai trò</label>
                                    <select
                                        name="role"
                                        value={filters.role}
                                        onChange={handleFilterChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="">Tất cả</option>
                                        <option value="USER">Người dùng</option>
                                        <option value="OPERATOR">Nhân viên</option>
                                        <option value="ADMIN">Quản trị viên</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                                    <select
                                        name="flagActive"
                                        value={filters.flagActive}
                                        onChange={handleFilterChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="">Tất cả</option>
                                        <option value="ACTIVE">Kích hoạt</option>
                                        <option value="INACTIVE">Chưa kích hoạt</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="p-4">
                        {loading && <div className="text-center text-gray-600 text-sm">Đang tải...</div>}
                        {error && <div className="mb-3 p-2 rounded-lg text-center font-medium bg-red-50 border border-red-200 text-red-600 text-sm">{error}</div>}
                        {!loading && users.length === 0 && !error && <div className="text-center text-gray-600 text-sm">Không có người dùng nào để hiển thị</div>}

                        {users.length > 0 && (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên đăng nhập</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Họ và tên</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số điện thoại</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vai trò</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                                    </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                    {users.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                                                <div className="flex items-center gap-2">
                                                    <User className="w-4 h-4 text-gray-500" />
                                                    <span className="font-semibold text-gray-900">{user.username}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">{user.fullName || 'N/A'}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">{user.email}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">{user.phoneNumber || 'N/A'}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">{user.role}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.flagActive === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                        {user.flagActive === 'ACTIVE' ? 'Kích hoạt' : 'Chưa kích hoạt'}
                                                    </span>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleEdit(user)}
                                                        className="p-2 bg-yellow-100 text-yellow-700 rounded-full hover:bg-yellow-200 transition-all duration-200"
                                                        title="Chỉnh sửa"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(user.id)}
                                                        className="p-2 bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition-all duration-200"
                                                        title="Xóa"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                                <div className="flex justify-between items-center mt-4 px-4 py-3 bg-gray-50">
                                    <button
                                        onClick={() => handlePageChange(page - 1)}
                                        disabled={page === 0}
                                        className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:bg-gray-100 disabled:text-gray-400 hover:bg-gray-300"
                                        aria-label="Trang trước"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                        Trước
                                    </button>
                                    <span className="text-sm text-gray-700">
                                        Trang {page + 1} / {totalPages}
                                    </span>
                                    <button
                                        onClick={() => handlePageChange(page + 1)}
                                        disabled={page === totalPages - 1}
                                        className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:bg-gray-100 disabled:text-gray-400 hover:bg-gray-300"
                                        aria-label="Trang sau"
                                    >
                                        Sau
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Delete Confirmation Modal */}
                    {showDeleteModal && userToDelete && (
                        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 transition-opacity">
                            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md m-4 transform transition-all animate-fade-in-up">
                                <div className="flex justify-between items-center mb-4 border-b pb-3">
                                    <h3 className="text-xl font-bold text-gray-800">Xác nhận xóa</h3>
                                    <button
                                        onClick={() => {
                                            setShowDeleteModal(false);
                                            setUserToDelete(null);
                                        }}
                                        className="text-gray-400 hover:text-gray-600"
                                        aria-label="Đóng"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>
                                <p className="text-gray-600 mb-6">
                                    Bạn có chắc chắn muốn xóa người dùng <span className="font-semibold">{userToDelete.username}</span> không?
                                </p>
                                <div className="flex justify-end gap-3 pt-4 border-t">
                                    <button
                                        onClick={() => {
                                            setShowDeleteModal(false);
                                            setUserToDelete(null);
                                        }}
                                        className="px-5 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-semibold text-sm"
                                        aria-label="Hủy xóa"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        onClick={confirmDelete}
                                        className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold text-sm"
                                        aria-label="Xác nhận xóa"
                                    >
                                        Xóa
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <Drawer open={showAddForm} onClose={handleAddFormClose} direction="right" size={400}>
                        <div className="p-6 bg-white h-full overflow-y-auto">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-gray-900">{editMode ? 'Chỉnh sửa Người Dùng' : 'Thêm Người Dùng Mới'}</h3>
                                <button onClick={handleAddFormClose} className="text-gray-500 hover:text-gray-800" aria-label="Đóng">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <UserForm
                                key={selectedUser ? selectedUser.id : 'new-user'}
                                onClose={handleAddFormClose}
                                onSuccess={handleAddFormSuccess}
                                initialData={editMode ? selectedUser : null}
                                isEditMode={editMode}
                            />
                        </div>
                    </Drawer>
                </div>
            </div>
        </div>
    );
};

const UserListPage = () => (
    <CRMLayout>
        <UserList />
    </CRMLayout>
);

export default UserListPage;