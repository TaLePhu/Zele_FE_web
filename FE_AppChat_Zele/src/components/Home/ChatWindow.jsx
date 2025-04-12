import React from 'react';
import { Box, Typography, Avatar, IconButton } from '@mui/material';
import { Search as SearchIcon, MoreVert as MoreVertIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import { useEffect } from 'react';
import useChatStore from '../../store/chatStore';

const ChatWindow = () => {
    const { user, messages, selectedConversation, fetchMessages, setSelectedConversation, receiver } = useChatStore();

    useEffect(() => {
        if (selectedConversation) {
            fetchMessages(selectedConversation?._id);
        }
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
                        {selectedConversation.participants.find((p) => p.user_id !== user?._id)?.name}
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
                        sender={message?.sender_id?._id === user?._id ? 'me' : 'friend'}
                        content={message.content}
                        time={message.time}
                    />
                ))}
            </Box>

            <MessageInput receiverId={receiver?.user_id} />
        </Box>
    );
};

export default ChatWindow;
