import React from 'react';
import { Box, TextField, IconButton } from '@mui/material';
import { AttachFile as AttachFileIcon, TagFaces as EmojiIcon, Mic as MicIcon } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import axios from 'axios';

const MessageInput = ({ receiverId, setMessages }) => {
    const [messageContent, setMessageContent] = useState('');

    const sendMessage = async () => {
        if (!messageContent || !receiverId) return;
        // Unauthorized
        try {
            const response = await axios.post(
                'http://localhost:5000/api/message/send',
                {
                    receiverId,
                    message_type: 'text',
                    content: messageContent,
                    file_id: null, // Optional, replace with a valid file ID if needed
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                },
            );
            let newMessage = response.data.data;
            setMessages((prevMessages) => [...prevMessages, newMessage]); // Update the messages state with the new message
            setMessageContent(''); // Clear the input field after sending the message
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleSendMessage = async () => {
        if (!messageContent || !receiverId) return;
        sendMessage();
    };

    // http://localhost:5000/api/message/send
    // {
    //     "receiverId": "67f4add9274138610aaf19a7", // Replace with a valid receiver ID
    //     "message_type": "text",
    //     "content": "I'm. fine! lala",
    //     "file_id": null // Optional, replace with a valid file ID if needed
    //   }

    return (
        <Box p={2} bgcolor="white" borderTop="1px solid #e5e5e5" display="flex" alignItems="center">
            <IconButton>
                <AttachFileIcon />
            </IconButton>
            <IconButton>
                <EmojiIcon />
            </IconButton>
            <TextField
                fullWidth
                variant="outlined"
                placeholder="Nhập tin nhắn..."
                size="small"
                sx={{ mx: 1 }}
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                        sendMessage();
                    }
                }}
                onFocus={() => {}}
            />
            <IconButton onClick={() => handleSendMessage()} disabled={!messageContent.trim()}>
                <MicIcon />
            </IconButton>
        </Box>
    );
};

export default MessageInput;
