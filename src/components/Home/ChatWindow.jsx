import React, { useState, useEffect, useRef } from 'react';
import {
    Box, Typography, Avatar, IconButton
} from '@mui/material';
import {
    Search as SearchIcon, MoreVert as MoreVertIcon, ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import axios from 'axios';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import socket from '../../socket/socket';

const ChatWindow = ({ selectedFriend, setSelectedFriend }) => {
    const [messages, setMessages] = useState([]);
    const [conversationId, setConversationId] = useState(null);
    const [hasJoinedRoom, setHasJoinedRoom] = useState(false);
    const token = localStorage.getItem('accessToken');
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?._id;
    const messagesEndRef = useRef(null); // để scroll
    

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

     useEffect(() => {
        if (!conversationId) return;

        console.log('🔌 Đang tham gia phòng:', conversationId);

        // Lắng nghe sự kiện nhận tin nhắn
        const handleReceiveMessage = (newMsg) => {
            console.log('📩 Nhận tin nhắn:', newMsg);
            if (newMsg.conversationId === conversationId) {
                setMessages(prev => [...prev, newMsg]);
            }
        };

        socket.on('receiveMessage', handleReceiveMessage);

        // Cleanup khi component unmount
        return () => {
            socket.off('receiveMessage', handleReceiveMessage);
            console.log('🔌 Đã rời khỏi phòng:', conversationId);
        };
    }, [conversationId]);

    useEffect(() => {
        if (selectedFriend) {
            const fetchConversationId = async () => {
                try {
                    const res = await axios.get('http://localhost:5000/api/conversation/getAll', {
                        headers: { Authorization: `Bearer ${token}` }
                    });

                    const found = res.data.data.find(convo => {
                        const ids = convo.participants.map(p => p.user_id);
                        return ids.includes(userId) && ids.includes(selectedFriend._id);
                    });

                    setConversationId(found?._id || null);
                } catch (err) {
                    console.error("❗ Lỗi lấy conversation:", err);
                }
            };

            fetchConversationId();
        }
    }, [selectedFriend, token, userId]);

    useEffect(() => {
        if (conversationId) {
            const fetchMessages = async () => {
                try {
                    const res = await axios.get(`http://localhost:5000/api/message/getByConversation/${conversationId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setMessages(res.data.data);
                } catch (error) {
                    console.error("❗ Lỗi lấy tin nhắn", error);
                }
            };
            fetchMessages();
        }
    }, [conversationId, token]);

    const sendMessage = (message) => {
        socket.emit('sendMessage', {
            ...message,
            participants: [userId, selectedFriend._id], // bắt buộc để backend biết gửi cho ai
            
        });
        console.log('📤 Gửi tin nhắn:', message)
        console.log('📤 Gửi tin nhắn:', userId);
        console.log('📤 Gửi tin nhắn:', selectedFriend._id);

        // Có thể thêm: cập nhật tạm thời trước khi server phản hồi
        setMessages(prev => [...prev, {
            ...message,
            sender_id: { _id: userId }, // để hiển thị ngay lập tức
            timestamp: new Date().toISOString(),
        }]);
    };

    const handleBackClick = () => {
        setSelectedFriend(null);
    };

    return (
        <Box flex={1} display="flex" flexDirection="column">
            {/* Header */}
            <Box p={1.5} bgcolor="white" display="flex" alignItems="center" borderBottom="1px solid #e5e5e5">
                <IconButton sx={{ display: { sm: 'none' }, mr: 1 }} onClick={handleBackClick}>
                    <ArrowBackIcon />
                </IconButton>
                <Avatar src={selectedFriend?.avatar || ''} sx={{ mr: 2 }} />
                <Box flex={1}>
                    <Typography fontWeight="bold">{selectedFriend?.name || 'Tên người dùng'}</Typography>
                    <Typography variant="caption" color="textSecondary">
                        {selectedFriend?.online ? 'Online' : 'Offline'}
                    </Typography>
                </Box>
                <IconButton><SearchIcon /></IconButton>
                <IconButton><MoreVertIcon /></IconButton>
            </Box>

            {/* Tin nhắn */}
            <Box flex={1} p={2} overflow="auto" bgcolor="#e5efff"
                sx={{
                    backgroundImage: 'url(https://zalo.zadn.vn/web/assets/img/background-chat.7d3e1e8b.png)',
                    backgroundSize: 'cover'
                }}
            >
                {messages.length > 0 ? (
                    messages.map((msg) => (
                        <MessageBubble
                            key={msg._id}
                            sender={msg.sender_id._id}
                            content={msg.content}
                            time={new Date(msg.timestamp).toLocaleTimeString()}
                            userId={userId}
                        />
                    ))
                ) : (
                    <Typography variant="body2" color="textSecondary">
                        Chưa có tin nhắn nào.
                    </Typography>
                )}
                <div ref={messagesEndRef} /> {/* 👈 Scroll target */}
            </Box>

            {/* Input */}
            <MessageInput
                selectedFriend={selectedFriend}
                conversationId={conversationId}
                hasJoinedRoom={hasJoinedRoom}
                onMessageSent={(newMsg) => {
                    sendMessage(newMsg); // chỉ cần gọi đây
                }}
            />
        </Box>
    );
};

export default ChatWindow;
