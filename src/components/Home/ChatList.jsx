import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Divider,
    TextField,
    InputAdornment,
    Typography,
    Badge,
    Avatar,
    Menu,
    MenuItem,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import axios from 'axios';
import socket from '../../socket/socket';  // Import socket client

const ChatList = ({ selectedFriend, setSelectedFriend }) => {
    const [searchId, setSearchId] = useState('');
    const [loading, setLoading] = useState(false);
    const [savedUsers, setSavedUsers] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedUserToDelete, setSelectedUserToDelete] = useState(null);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

    const token = localStorage.getItem('accessToken');
    const rawUser  = localStorage.getItem('user');
    const user = JSON.parse(rawUser); 
    const userId = user?._id;

    // Effect for socket connection
    useEffect(() => {
        const storedUsers = JSON.parse(localStorage.getItem('savedUsers')) || [];
        setSavedUsers(storedUsers);
        loadChatListWithLastMessages();

        // Thiết lập kết nối socket
        socket.connect();

        // Lắng nghe sự kiện tin nhắn mới từ server
        socket.on('new_message', (message) => {
            loadChatListWithLastMessages();
        });

        // Lắng nghe sự kiện tin nhắn bị thu hồi
        socket.on('messageRevoked', ({ messageId, is_revoked }) => {
            if (is_revoked) {
                // Handle revoke message (có thể cập nhật trạng thái tin nhắn trên giao diện)
                console.log(`Message ${messageId} has been revoked.`);
            }
        });

        return () => {
            // Ngắt kết nối socket khi component unmount
            socket.disconnect();
        };
    }, []);

    // Handle search input
    const handleSearch = async (e) => {
        if (e.key === 'Enter' && searchId.trim()) {
            try {
                setLoading(true);
                const res = await axios.get(
                    `http://localhost:5000/api/user/getUser?email=${searchId.trim()}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                
                const foundUser = {
                    ...res.data.data,
                    last_message: res.data.data.conversation?.last_message?.content || null
                };

                saveUserToLocalStorage(foundUser);
            } catch (error) {
                console.error("Không tìm thấy người dùng", error);
            } finally {
                setLoading(false);
            }
        }
    };

    // Load chat list and last message
    const loadChatListWithLastMessages = useCallback(async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/conversation/getAll', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const conversations = res.data.data;

            const users = conversations.map((convo) => {
                const otherParticipant = convo.participants.find(p => p.user_id !== userId);

                return {

                    _id: otherParticipant.user_id,
                    name: otherParticipant.name,
                    avatar: otherParticipant.avatar || '',
                    lastMessage: convo.last_message?.content || "Chưa có tin nhắn nào",
                    lastMessageTime: convo.last_message?.createdAt || new Date(),

                };
            });

            // Sắp xếp người dùng theo thời gian tin nhắn mới nhất
            users.sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));

            localStorage.setItem('savedUsers', JSON.stringify(users));
            setSavedUsers(users); // Cập nhật state
        } catch (err) {
            console.error("Lỗi khi lấy danh sách hội thoại:", err);
        }
    }, [token, userId]);

    // Save user to localStorage
    const saveUserToLocalStorage = (userData) => {
        let storedUsers = JSON.parse(localStorage.getItem('savedUsers')) || [];
        if (!storedUsers.some((storedUser) => storedUser._id === userData._id)) {
            storedUsers.push(userData);
            localStorage.setItem('savedUsers', JSON.stringify(storedUsers));
            setSavedUsers(storedUsers);
        }
    };

    // Remove user from localStorage
    const removeUserFromLocalStorage = (userId) => {
        let storedUsers = JSON.parse(localStorage.getItem('savedUsers')) || [];
        storedUsers = storedUsers.filter((user) => user._id !== userId);
        localStorage.setItem('savedUsers', JSON.stringify(storedUsers));
        setSavedUsers(storedUsers);
    };

    // Context menu (right click) event handlers
    const handleRightClick = (event, user) => {
        event.preventDefault();
        setSelectedUserToDelete(user);
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleDeleteUser = () => {
        setOpenConfirmDialog(true);
        handleCloseMenu();
    };

    const handleConfirmDelete = () => {
        if (!selectedUserToDelete) return;
        removeUserFromLocalStorage(selectedUserToDelete._id);
        if (selectedFriend?._id === selectedUserToDelete._id) {
            setSelectedFriend(null);
        }
        setOpenConfirmDialog(false);
    };

    const handleCancelDelete = () => {
        setOpenConfirmDialog(false);
        setSelectedUserToDelete(null);
    };

    return (
        <Box width="360px" bgcolor="white" display="flex" flexDirection="column" borderRight="1px solid #e5e5e5">
            <Box p={2} bgcolor="#f5f5f5">
                <TextField
                    fullWidth
                    placeholder="Nhập email để tìm..."
                    variant="outlined"
                    size="small"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    onKeyDown={handleSearch}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="disabled" />
                            </InputAdornment>
                        ),
                        sx: {
                            backgroundColor: 'white',
                            borderRadius: '20px'
                        }
                    }}
                />
            </Box>

            <Box flex={1} overflow="auto">
                <List disablePadding>
                    {savedUsers.length > 0 && savedUsers.map((userItem) => (
                        <div key={userItem._id}>
                            <ListItem
                                button
                                alignItems="flex-start"
                                selected={selectedFriend?._id === userItem._id}
                                onClick={() => setSelectedFriend(userItem)}
                                onContextMenu={(e) => handleRightClick(e, userItem)}
                                sx={{
                                    '&.Mui-selected': {
                                        backgroundColor: '#e5efff',
                                    },
                                    '&.Mui-selected:hover': {
                                        backgroundColor: '#e5efff',
                                    },
                                }}
                            >
                                <ListItemAvatar>
                                    <Badge
                                        overlap="circular"
                                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                        variant="dot"
                                        color="success"
                                        invisible={!userItem.online}
                                    >
                                        <Avatar src={userItem.avatar || ''} />
                                    </Badge>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={userItem.name || userItem.username}
                                    secondary={
                                        <Typography 
                                            variant="body2"
                                            color="textSecondary"
                                            noWrap
                                        >
                                            {userItem.lastMessage || 'Chưa có tin nhắn nào hết'}
                                        </Typography>
                                    }
                                />
                            </ListItem>
                            <Divider variant="inset" component="li" />
                        </div>
                    ))}
                </List>
            </Box>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
            >
                <MenuItem onClick={handleDeleteUser}>Xóa</MenuItem>
            </Menu>

            <Dialog
                open={openConfirmDialog}
                onClose={handleCancelDelete}
            >
                <DialogTitle>Xác nhận</DialogTitle>
                <DialogContent>
                    <Typography>Bạn có chắc chắn muốn xóa người dùng này không?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelDelete}>Hủy</Button>
                    <Button onClick={handleConfirmDelete} color="secondary">Xóa</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ChatList;
