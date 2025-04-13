import { create } from 'zustand';
import axios from 'axios';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

const useChatStore = create((set, get) => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    conversations: [],
    messages: [],
    selectedConversation: null,
    receiver: null,

    fetchConversations: async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/conversation/getAll', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
            });
            set({ conversations: response.data.data });
        } catch (error) {
            console.error('Error fetching conversations:', error);
        }
    },

    fetchMessages: async (conversationId) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/message/getByConversation/${conversationId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
            });
            set({ messages: response.data.data });
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    },

    sendMessage: async (receiverId, messageContent) => {
        try {
            const response = await axios.post(
                'http://localhost:5000/api/message/send',
                {
                    receiverId,
                    message_type: 'text',
                    content: messageContent,
                    file_id: null,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                },
            );
            set((state) => ({
                messages: [...state.messages, response.data.data],
            }));
        } catch (error) {
            console.error('Error sending message:', error);
        }
    },

    setSelectedConversation: (conversation) => {
        set({ selectedConversation: conversation });
        console.log('Selected conversation:', conversation);
        // Set receiver based on selected conversation

        let receiver = null;
        if (conversation) {
            receiver = conversation.participants.find((p) => p.user_id !== get().user?._id);
        }
        set({ receiver });
        console.log('Receiver set to:', receiver);
    },

    setReceiver: (receiver) => {
        set({ receiver });
    },

    initializeSocket: () => {
        const user = get().user;
        console.log('Initializing socket for user:', user);
        if (user) {
            // Đăng ký userId với server qua Socket.IO
            socket.emit('registerUser', user._id);

            // Xóa listener cũ trước khi đăng ký mới
            socket.off('receiveMessage');
            socket.off('newConversation');
            socket.off('updateLastMessage');

            // Lắng nghe sự kiện nhận tin nhắn
            socket.on('receiveMessage', (message) => {
                // Kiểm tra xem tin nhắn có thuộc về người dùng hiện tại không
                if (message?.receiver_id?._id !== user?._id) {
                    return;
                }
                console.log('New message received:', message);

                // Cập nhật danh sách tin nhắn
                set((state) => ({
                    messages: [...state.messages, message],
                }));
            });

            // Lắng nghe sự kiện đoạn hội thoại mới
            socket.on('newConversation', (conversation) => {
                console.log('New conversation received:', conversation);
                set((state) => ({
                    conversations: [...state.conversations, conversation],
                }));
            });

            // Lắng nghe sự kiện cập nhật tin nhắn cuối cùng
            socket.on('updateLastMessage', (updatedConversation) => {
                console.log('Conversation updated with last message:', updatedConversation);
                set((state) => ({
                    conversations: state.conversations.map((conv) =>
                        conv._id === updatedConversation._id ? updatedConversation : conv,
                    ),
                }));
            });
        }
    },

    disconnectSocket: () => {
        socket.disconnect(); // Ngắt kết nối socket
        console.log('Socket disconnected');
    },
}));

export default useChatStore;
