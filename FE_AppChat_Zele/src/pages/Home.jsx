import React from 'react';
import ChatList from '../components/Home/ChatList';
import SidebarIcons from '../components/Home/SidebarIcons';
import ChatWindow from '../components/Home/ChatWindow';
import WelcomeScreen from '../components/Home/WelcomeScreen';
import Header from '../components/Home/Header';
import { Box } from '@mui/material';
// import { useSelector } from "react-redux";

const Home = () => {
    const [selectedConversation, setSelectedConversation] = React.useState(null);
    const user = JSON.parse(localStorage.getItem('user'));
    // const currentUser = useSelector((state) => state.user.currentUser);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        window.location.href = '/';
        console.log('Đăng xuất thành công');
    };
    return (
        <Box display="flex" height="100vh" bgcolor="#f0f2f5">
            <Header username={user ? user.name : ''} />
            <SidebarIcons onLogout={handleLogout} />
            <ChatList selectedConversation={selectedConversation} setSelectedConversation={setSelectedConversation} />

            {selectedConversation === null ? (
                <WelcomeScreen />
            ) : (
                <ChatWindow selectedConversation={selectedConversation} />
            )}
        </Box>
    );
};

export default Home;
