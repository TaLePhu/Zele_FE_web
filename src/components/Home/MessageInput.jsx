import React, { useState } from 'react';
import { Box, TextField, IconButton } from '@mui/material';
import {
    AttachFile as AttachFileIcon,
    TagFaces as EmojiIcon,
    Mic as MicIcon,
    Send as SendIcon
} from '@mui/icons-material';
import axios from 'axios';
import socket from '../../socket/socket';

const MessageInput = ({ selectedFriend, conversationId, onMessageSent }) => {
    const [messageContent, setMessageContent] = useState('');
    const token = localStorage.getItem('accessToken');

    const updateLastMessage = (recipientId, messageContent) => {
        let saved = JSON.parse(localStorage.getItem('savedUsers')) || [];
        saved = saved.map(user =>
            user._id === recipientId ? { ...user, lastMessage: messageContent } : user
        );
        localStorage.setItem('savedUsers', JSON.stringify(saved));
    };

    const handleSendMessage = async () => {
        if (!selectedFriend || !messageContent.trim()) return;

        try {
            const res = await axios.post(
                'http://localhost:5000/api/message/send',
                {
                    receiverId: selectedFriend._id,
                    message_type: 'text',
                    content: messageContent,
                    file_id: null
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const sentMessage = res.data.data;

            // 🔄 Cập nhật tin nhắn cuối cùng vào localStorage
            updateLastMessage(selectedFriend._id, messageContent);

            // 🔄 Xóa nội dung input
            setMessageContent('');

            // ✅ Gửi socket đến người nhận
            socket.emit('sendMessage', {
                senderId: sentMessage.sender_id,     // ID người gửi
                receiverId: selectedFriend._id,      // ID người nhận
                conversation_id: conversationId,
                content: messageContent,
                _id: sentMessage._id,                // ID tin nhắn
                createdAt: sentMessage.createdAt     // thời gian gửi
            });

            // ✅ Hiển thị ngay ở UI của người gửi
            if (onMessageSent) onMessageSent(sentMessage);

        } catch (error) {
            console.error("❗ Lỗi gửi tin nhắn:", error);
        }
    };


    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <Box
            p={2}
            bgcolor="white"
            borderTop="1px solid #e5e5e5"
            display="flex"
            alignItems="center"
        >
            <IconButton><AttachFileIcon /></IconButton>
            <IconButton><EmojiIcon /></IconButton>

            <TextField
                fullWidth
                variant="outlined"
                placeholder={selectedFriend ? "Nhập tin nhắn..." : "Chọn người để nhắn..."}
                size="small"
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                onKeyPress={handleKeyPress}
                sx={{ mx: 1 }}
                disabled={!selectedFriend}
            />

            <IconButton><MicIcon /></IconButton>
            <IconButton
                onClick={handleSendMessage}
                disabled={!messageContent.trim() || !selectedFriend}
            >
                <SendIcon />
            </IconButton>
        </Box>
    );
};

export default MessageInput;
