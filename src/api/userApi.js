import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/user';

const getAuthHeaders = () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
        throw new Error('Token không tồn tại');
    }
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

export const updateUserById = async (userId, data) => {
    if (!userId || typeof userId !== 'string') {
        throw new Error('ID người dùng không hợp lệ');
    }
    if (!data || typeof data !== 'object') {
        throw new Error('Dữ liệu cập nhật không hợp lệ');
    }

    try {
        const res = await axios.put(`${API_URL}/update/${userId}`, data, getAuthHeaders());
        return res.data;
    } catch (error) {
        console.error('Lỗi khi cập nhật người dùng:', error.response?.data || error.message);
        throw error;
    }
};
