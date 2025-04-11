import React from 'react';
import { Box, Typography, Avatar, IconButton } from '@mui/material';
import { Search as SearchIcon, MoreVert as MoreVertIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import axios from 'axios';
import { useEffect, useState } from 'react';

const messages = [
    { sender: 'me', content: 'Hello bạn, bạn khỏe không?', time: '10:30 AM' },
    { sender: 'friend', content: 'Mình khỏe, cảm ơn bạn! Còn bạn?', time: '10:31 AM' },
    { sender: 'me', content: 'Mình cũng khỏe, đang làm dự án mới', time: '10:32 AM' },
    { sender: 'friend', content: 'Nghe hay quá, chiều nay cafe nói thêm nhé', time: '10:33 AM' },
];

const ChatWindow = ({ selectedConversation, setSelectedConversation }) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const [messages, setMessages] = React.useState([]);
    const [receiverId, setReceiverId] = React.useState(null);
    const [receiver, setReceiver] = React.useState(null);
    // http://localhost:5000/api/message/getByConversation/:conversationId
    const fetchMessages = async () => {
        try {
            const response = await axios.get(
                `http://localhost:5000/api/message/getByConversation/${selectedConversation._id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                },
            );
            setMessages(response.data.data);
            const newReceiver = selectedConversation.participants.find((p) => p.user_id !== user._id);
            setReceiver(newReceiver);
            setReceiverId(newReceiver?.user_id);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, [selectedConversation]);

    return (
        <Box flex={1} display="flex" flexDirection="column">
            <Box p={1.5} bgcolor="white" display="flex" alignItems="center" borderBottom="1px solid #e5e5e5">
                <IconButton sx={{ display: { sm: 'none' }, mr: 1 }} onClick={() => setSelectedConversation(null)}>
                    <ArrowBackIcon />
                </IconButton>
                <Avatar
                    src={
                        receiver?.primary_avatar?.length > 0
                            ? receiver?.primary_avatar
                            : 'https://i.pravatar.cc/150?img=0'
                    }
                    sx={{ mr: 2 }}
                />
                <Box flex={1}>
                    <Typography fontWeight="bold">
                        {selectedConversation.participants.find((p) => p.user_id !== user._id)?.name}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                        {setSelectedConversation?.online ? 'Online' : 'Offline'}
                    </Typography>
                </Box>
                <IconButton>
                    <SearchIcon />
                </IconButton>
                <IconButton>
                    <MoreVertIcon />
                </IconButton>
            </Box>

            <Box
                flex={1}
                p={2}
                overflow="auto"
                bgcolor="#e5efff"
                sx={{
                    backgroundImage: 'url(https://zalo.zadn.vn/web/assets/img/background-chat.7d3e1e8b.png)',
                    backgroundSize: 'cover',
                }}
            >
                {messages.map((message, index) => (
                    <MessageBubble
                        key={index}
                        sender={message?.sender_id?._id === user._id ? 'me' : 'friend'}
                        content={message.content}
                        time={message.time}
                    />
                ))}
            </Box>

            <MessageInput receiverId={receiverId} setMessages={setMessages} />
        </Box>
    );
};

export default ChatWindow;
