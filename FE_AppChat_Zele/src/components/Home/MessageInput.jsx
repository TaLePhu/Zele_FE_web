import React, { useState } from 'react';
import { Box, TextField, IconButton } from '@mui/material';
import { AttachFile as AttachFileIcon, TagFaces as EmojiIcon, Mic as MicIcon } from '@mui/icons-material';
import useChatStore from '../../store/chatStore';

const MessageInput = ({ receiverId }) => {
    const [messageContent, setMessageContent] = useState('');
    const { sendMessage } = useChatStore();

    const handleSendMessage = async () => {
        console.log('Sending message:', messageContent, receiverId);
        if (!messageContent.trim() || !receiverId) return;
        await sendMessage(receiverId, messageContent);
        setMessageContent('');
    };

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
                        handleSendMessage();
                    }
                }}
            />
            <IconButton onClick={handleSendMessage} disabled={!messageContent.trim()}>
                <MicIcon />
            </IconButton>
        </Box>
    );
};

export default MessageInput;
