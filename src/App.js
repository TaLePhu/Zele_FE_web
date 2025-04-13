import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { privateRoutes } from '~/routes';
import { DefaultLayout } from '~/components/Layout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VerifyOtpPage from './pages/VerifyOtpPage';
import { useState, useEffect } from 'react';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('accessToken'));

    useEffect(() => {
        const handleStorageChange = () => {
            setIsAuthenticated(!!localStorage.getItem('accessToken'));
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    return (
        <Router>
            <Routes>
                {/* Trang đăng nhập */}
                <Route
                    path="/"
                    element={
                        isAuthenticated ? (
                            <Navigate to="/home" replace />
                        ) : (
                            <LoginPage setIsAuthenticated={setIsAuthenticated} />
                        )
                    }
                />

                {/* Trang đăng ký */}
                <Route
                    path="/register"
                    element={
                        isAuthenticated ? (
                            <Navigate to="/home" replace />
                        ) : (
                            <RegisterPage />
                        )
                    }
                />

                {/* Trang xác thực OTP */}
                <Route
                    path="/verify-otp"
                    element={
                        isAuthenticated ? (
                            <Navigate to="/home" replace />
                        ) : (
                            <VerifyOtpPage setIsAuthenticated={setIsAuthenticated} />
                        )
                    }
                />

                {/* Các route riêng tư (yêu cầu đăng nhập) */}
                {privateRoutes.map((route, index) => {
                    const Layout = route.layout || DefaultLayout;
                    const Page = route.component;

                    return (
                        <Route
                            key={index}
                            path={route.path}
                            element={
                                isAuthenticated ? (
                                    <Layout>
                                        <Page />
                                    </Layout>
                                ) : (
                                    <Navigate to="/" replace />
                                )
                            }
                        />
                    );
                })}
            </Routes>
        </Router>
    );
}

export default App;
