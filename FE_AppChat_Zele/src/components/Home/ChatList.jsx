import React from 'react';
import { useState, useEffect } from 'react';
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
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import axios from 'axios';

const ChatList = ({ selectedFriend, setSelectedFriend }) => {
    const [conversations, setSonversations] = useState([]);
    const [user, setUser] = useState({});

    const fetchConversations = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/conversation/getAll', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
            });
            setSonversations(response.data.data);
            // set user from local storage
            const userInfo = JSON.parse(localStorage.getItem('user'));

            setUser(userInfo);
        } catch (error) {
            console.error('Error fetching conversations:', error);
        }
    };

    useEffect(() => {
        fetchConversations();
    }, []);

    return (
        <Box width="360px" bgcolor="white" display="flex" flexDirection="column" borderRight="1px solid #e5e5e5">
            <Box p={2} bgcolor="#f5f5f5">
                <TextField
                    fullWidth
                    placeholder="Tìm kiếm"
                    variant="outlined"
                    size="small"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="disabled" />
                            </InputAdornment>
                        ),
                        sx: {
                            backgroundColor: 'white',
                            borderRadius: '20px',
                        },
                    }}
                />
            </Box>

            <Box flex={1} overflow="auto">
                <List disablePadding>
                    {conversations.map((con, index) => (
                        <React.Fragment key={index}>
                            <ListItem
                                button
                                alignItems="flex-start"
                                selected={selectedFriend === index}
                                onClick={() => setSelectedFriend(con)}
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
                                        invisible={false}
                                    >
                                        {/* Lấy từ participants trong conversation, trong đó participant có id không phải là id của useruser */}
                                        <Avatar src={con.participants.find((p) => p.user_id !== user._id).avatar} />
                                    </Badge>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={
                                        <Box display="flex" justifyContent="space-between">
                                            {/* Lấy từ participants trong conversation, trong đó participant có id không phải là id của useruser */}
                                            <Typography fontWeight="bold">
                                                {con.participants.find((p) => p.user_id !== user._id).name}
                                            </Typography>
                                            <Typography variant="caption" color="textSecondary">
                                                {/* Lấy từ last_message.timestamp trong conversation */}
                                                {/* Chuyển đổi timestamp thành thời gian hiển thị */}
                                                {/* 2025-04-10T17:02:22.400+00:00 chuyển đổi sang giờ việt nam,
                                                    nếu không phải ngày hôm nay thì hiển thị ngày tháng năm,
                                                    nếu là ngày hôm nay thì hiển thị giờ phút */}
                                                {new Date(con.last_message.timestamp).toLocaleString('vi-VN', {
                                                    year: 'numeric',
                                                    month: '2-digit',
                                                    day: '2-digit',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </Typography>
                                        </Box>
                                    }
                                    secondary={
                                        <Box display="flex" justifyContent="space-between" alignItems="center">
                                            <Typography
                                                variant="body2"
                                                color="textSecondary"
                                                sx={{
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    maxWidth: '200px',
                                                }}
                                            >
                                                {con.last_message.content}
                                            </Typography>
                                            {con.unread > 0 && (
                                                <Box
                                                    bgcolor="#0084ff"
                                                    color="white"
                                                    borderRadius="50%"
                                                    width="20px"
                                                    height="20px"
                                                    display="flex"
                                                    justifyContent="center"
                                                    alignItems="center"
                                                    fontSize="0.75rem"
                                                >
                                                    {con.unread}
                                                </Box>
                                            )}
                                        </Box>
                                    }
                                    secondaryTypographyProps={{ component: 'div' }}
                                />
                            </ListItem>
                            <Divider variant="inset" component="li" />
                        </React.Fragment>
                    ))}
                </List>
            </Box>
        </Box>
    );
};

export default ChatList;
