import React, { useEffect, useState } from 'react';
import { Box, Avatar, IconButton, Badge, Tooltip, Menu, MenuItem, ListItemIcon, Divider } from '@mui/material';
import {
    Chat as ChatIcon,
    Group as GroupIcon,
    Contacts as ContactsIcon,
    Settings as SettingsIcon,
    Logout as LogoutIcon,
    Person as PersonIcon,
    Upgrade as UpgradeIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import UserProfileModal from './components/UserProfileModal';
import UserProfileEditModal from './components/UserProfileEditModal';

const decryptData = (data) => {
    try {
        return JSON.parse(data);
    } catch (e) {
        return null;
    }
};

const SidebarIcons = ({ onLogout }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const openMenu = Boolean(anchorEl);
    const navigate = useNavigate();

    const [openProfileModal, setOpenProfileModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);

    useEffect(() => {
        const encrypted = localStorage.getItem('user');
        const user = decryptData(encrypted);
        setCurrentUser(user);
    }, []);

    const handleAvatarClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleCloseMenu();
        onLogout();
    };

    const handleSettings = () => {
        handleCloseMenu();
        navigate('/settings');
    };

    const handleOpenProfileModal = () => {
        handleCloseMenu();
        setOpenProfileModal(true);
    };

    const handleOpenEditModal = () => {
        setOpenProfileModal(false);
        setOpenEditModal(true);
    };

    // const handleProfileSave = (updated) => {
    //     const updatedUser = { ...currentUser, ...updated };
    //     setCurrentUser(updatedUser);
    //     localStorage.setItem('user', JSON.stringify(updatedUser));
    //     setOpenEditModal(false);
    // };

    const handleUserUpdated = (newUserData) => {
        setCurrentUser(newUserData); // hoặc gọi API lấy lại
    };

    return (
        <Box width="70px" bgcolor="#0573ff" display="flex" flexDirection="column" alignItems="center" pt={2}>
            <Tooltip title={currentUser?.name || 'Người dùng'} placement="right">
                <Box mb={3}>
                    <Avatar
                        src={currentUser?.avatar || 'https://i.pravatar.cc/150?img=6'}
                        sx={{ width: 48, height: 48, cursor: 'pointer' }}
                        onClick={handleAvatarClick}
                    />
                </Box>
            </Tooltip>

            {/* Dropdown menu */}
            <Menu
                anchorEl={anchorEl}
                open={openMenu}
                onClose={handleCloseMenu}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            >
                <MenuItem onClick={() => window.open('https://example.com/upgrade', '_blank')}>
                    <ListItemIcon>
                        <UpgradeIcon fontSize="small" />
                    </ListItemIcon>
                    Nâng cấp tài khoản
                </MenuItem>

                <MenuItem onClick={handleOpenProfileModal}>
                    <ListItemIcon>
                        <PersonIcon fontSize="small" />
                    </ListItemIcon>
                    Hồ sơ của bạn
                </MenuItem>

                <MenuItem onClick={handleSettings}>
                    <ListItemIcon>
                        <SettingsIcon fontSize="small" />
                    </ListItemIcon>
                    Cài đặt
                </MenuItem>

                <Divider />

                <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                        <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    Đăng xuất
                </MenuItem>
            </Menu>

            {/* Sidebar Icons */}
            <Tooltip title="Tin nhắn" placement="right">
                <IconButton sx={{ mb: 2, color: '#ffffff' }}>
                    <Badge color="error" badgeContent={5}>
                        <ChatIcon sx={{ fontSize: 28 }} />
                    </Badge>
                </IconButton>
            </Tooltip>

            <Tooltip title="Danh bạ" placement="right">
                <IconButton sx={{ mb: 2, color: '#ffffff' }}>
                    <ContactsIcon sx={{ fontSize: 28 }} />
                </IconButton>
            </Tooltip>

            <Tooltip title="Nhóm chat" placement="right">
                <IconButton sx={{ mb: 2, color: '#ffffff' }}>
                    <GroupIcon sx={{ fontSize: 28 }} />
                </IconButton>
            </Tooltip>

            <Box flex={1} />

            <Tooltip title="Cài đặt" placement="right">
                <IconButton sx={{ mb: 2, color: '#ffffff' }} onClick={handleSettings}>
                    <SettingsIcon sx={{ fontSize: 28 }} />
                </IconButton>
            </Tooltip>

            <Tooltip title="Đăng xuất" placement="right">
                <IconButton sx={{ mb: 2, color: '#ffffff' }} onClick={handleLogout}>
                    <LogoutIcon sx={{ fontSize: 30 }} />
                </IconButton>
            </Tooltip>

            {/* Modals */}
            <UserProfileModal
                open={openProfileModal}
                onClose={() => setOpenProfileModal(false)}
                user={currentUser}
                onEdit={handleOpenEditModal}
            />

            <UserProfileEditModal
                open={openEditModal}
                onClose={() => setOpenEditModal(false)}
                user={currentUser}
                onSave={handleUserUpdated}
            />
        </Box>
    );
};

export default SidebarIcons;
