import React from 'react';
import { Dialog, DialogContent, Avatar, Box, Typography, Divider, IconButton, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import { format } from 'date-fns';

const UserProfileModal = ({ open, onClose, user, onEdit }) => {
    if (!user) return null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <Box position="relative" borderRadius="8px">
                {/* Ảnh bìa */}
                <Box
                    sx={{
                        height: 180,
                        backgroundImage: `url(${user.cover || 'https://source.unsplash.com/random/800x200'})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        borderTopLeftRadius: '8px',
                        borderTopRightRadius: '8px',
                    }}
                />

                {/* Nút đóng */}
                <IconButton
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        color: 'white',
                        backgroundColor: 'rgba(0,0,0,0.3)',
                        '&:hover': { backgroundColor: 'rgba(0,0,0,0.5)' },
                    }}
                >
                    <CloseIcon />
                </IconButton>

                {/* Avatar và Tên người dùng */}
                <Box display="flex" alignItems="center" px={3} mt={-6} mb={2}>
                    <Avatar
                        src={user.avatar}
                        sx={{
                            width: 72,
                            height: 72,
                            border: '3px solid white',
                            boxShadow: 2,
                            backgroundColor: '#eee',
                        }}
                    />
                    <Box ml={2} display="flex" alignItems="center">
                        <Typography variant="h6" fontWeight="bold">
                            {user.name || 'Tên người dùng'}
                        </Typography>
                        <IconButton size="small" sx={{ ml: 1 }}>
                            <EditIcon fontSize="small" />
                        </IconButton>
                    </Box>
                </Box>
            </Box>

            <DialogContent>
                {/* Thông tin cá nhân */}
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Thông tin cá nhân
                </Typography>

                {/* <Box mb={1}>
                    <Typography variant="body2" color="textSecondary">
                        Giới tính
                    </Typography>
                    <Typography>{user.gender || 'Chưa cập nhật'}</Typography>
                </Box> */}

                <Box mb={1}>
                    <Typography variant="body2" color="textSecondary">
                        Ngày sinh
                    </Typography>
                    <Typography>{user.dob ? format(new Date(user.dob), 'dd/MM/yyyy') : 'Chưa cập nhật'}</Typography>
                </Box>

                <Box mb={1}>
                    <Typography variant="body2" color="textSecondary">
                        Điện thoại
                    </Typography>
                    <Typography>{user.phone || 'Chưa cập nhật'}</Typography>
                    <Typography variant="caption" color="textSecondary">
                        Chỉ bạn bè có lưu số trong danh bạ mới xem được số này
                    </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Nút cập nhật */}
                <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<EditIcon />}
                    sx={{ borderRadius: '20px', textTransform: 'none' }}
                    onClick={onEdit}
                >
                    Cập nhật
                </Button>
            </DialogContent>
        </Dialog>
    );
};

export default UserProfileModal;
