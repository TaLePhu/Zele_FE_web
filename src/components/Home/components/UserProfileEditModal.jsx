import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    Radio,
    RadioGroup,
    FormControlLabel,
    Typography,
    Button,
    Select,
    MenuItem,
    Box,
    IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { updateUserById } from '~/api/userApi';
// import { updateUserById } from '~/services/UserApi'; // 🟢 Import API gọi backend

const days = Array.from({ length: 31 }, (_, i) => i + 1);
const months = Array.from({ length: 12 }, (_, i) => i + 1);
const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);

const UserProfileEditModal = ({ open, onClose, user, onBack, onSave }) => {
    const [form, setForm] = useState({
        name: '',
        // gender: 'Nam',
        day: '',
        month: '',
        year: '',
        phone: '',
    });

    useEffect(() => {
        if (user) {
            const [day, month, year] = (user.dob || '').split('/') || [];
            setForm({
                name: user.name || '',
                // gender: user.gender || 'Nam',
                day: day || '',
                month: month || '',
                year: year || '',
                phone: user.phone || '',
            });
        }
    }, [user]);

    const handleChange = (field) => (e) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

    const handleSave = async () => {
        // const { name, gender, day, month, year } = form;
        const { name, day, month, year, phone } = form;
        const dob = `${day}/${month}/${year}`;

        try {
            const res = await updateUserById(user._id, {
                name,
                dob,
                // gender,
                phone,
            });

            // ✅ Cập nhật lại localStorage
            localStorage.setItem('user', JSON.stringify(res.data));

            // ✅ Gọi callback onSave để cập nhật user ở component cha (Sidebar chẳng hạn)
            onSave(res.data);

            onClose(); // Đóng modal
        } catch (err) {
            console.error('Lỗi cập nhật thông tin:', err.response?.data || err.message);
            alert('Cập nhật thất bại. Vui lòng thử lại.');
        }
    };

    const isFormValid = form.name && form.day && form.month && form.year;

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
            <Box display="flex" alignItems="center" px={2} py={1}>
                <IconButton onClick={onBack}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Cập nhật thông tin cá nhân
                </Typography>
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </Box>

            <DialogContent dividers>
                <Typography variant="body2" mb={1}>
                    Tên hiển thị
                </Typography>
                <TextField
                    value={form.name}
                    onChange={handleChange('name')}
                    fullWidth
                    size="small"
                    placeholder="Nhập tên hiển thị"
                />

                <Typography mt={3} mb={1} fontWeight="bold">
                    Thông tin cá nhân
                </Typography>
                {/* <RadioGroup row value={form.gender} onChange={handleChange('gender')}>
                    <FormControlLabel value="Nam" control={<Radio />} label="Nam" />
                    <FormControlLabel value="Nữ" control={<Radio />} label="Nữ" />
                </RadioGroup> */}

                <Typography mt={2} mb={1}>
                    Số điện thoại
                </Typography>
                <TextField
                    value={form.phone}
                    onChange={handleChange('phone')}
                    fullWidth
                    size="small"
                    placeholder="Nhập số điện thoại"
                />

                <Typography mt={2} mb={1}>
                    Ngày sinh
                </Typography>
                <Box display="flex" gap={1}>
                    <Select value={form.day} onChange={handleChange('day')} size="small" fullWidth>
                        {days.map((d) => (
                            <MenuItem key={d} value={String(d).padStart(2, '0')}>
                                {String(d).padStart(2, '0')}
                            </MenuItem>
                        ))}
                    </Select>
                    <Select value={form.month} onChange={handleChange('month')} size="small" fullWidth>
                        {months.map((m) => (
                            <MenuItem key={m} value={String(m).padStart(2, '0')}>
                                {String(m).padStart(2, '0')}
                            </MenuItem>
                        ))}
                    </Select>
                    <Select value={form.year} onChange={handleChange('year')} size="small" fullWidth>
                        {years.map((y) => (
                            <MenuItem key={y} value={y}>
                                {y}
                            </MenuItem>
                        ))}
                    </Select>
                </Box>
            </DialogContent>

            <Box display="flex" justifyContent="flex-end" px={3} py={2} gap={1}>
                <Button onClick={onClose}>Huỷ</Button>
                <Button variant="contained" disabled={!isFormValid} onClick={handleSave}>
                    Cập nhật
                </Button>
            </Box>
        </Dialog>
    );
};

export default UserProfileEditModal;
