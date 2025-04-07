import React, { useState } from 'react';
import { TextField, Button, Box, Typography, CircularProgress, Divider } from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Container = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  backgroundColor: '#dfe8ef', // Màu nền nhẹ nhàng giống Zalo
});

const LoginBox = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: '400px',
  padding: theme.spacing(4),
  borderRadius: '8px',
  backgroundColor: 'white',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  textAlign: 'center',
}));

const Title = styled(Typography)({
  fontSize: '32px',
  fontWeight: 'bold',
  color: '#0068ff', // Màu xanh đặc trưng
  marginBottom: '24px',
});

const ErrorText = styled(Typography)({
  color: 'red',
  marginTop: '8px',
});

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      const { user, accessToken } = response.data.data;

      // Lưu thông tin đăng nhập (JWT) vào localStorage
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('user', JSON.stringify(user));

      // Chuyển hướng người dùng sau khi đăng nhập thành công
      navigate('/home'); // Thay đổi route nếu cần
    } catch (err) {
      setError('Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <LoginBox>
        <Title>Zele</Title>
        {/* Logo hoặc biểu tượng có thể được thêm vào đây nếu muốn */}

        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="Mật khẩu"
          variant="outlined"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          required
          sx={{ marginBottom: 2 }}
        />

        {error && <ErrorText>{error}</ErrorText>}

        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleLogin}
          disabled={loading}
          sx={{ padding: '12px', marginTop: 2 }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Đăng nhập'}
        </Button>

        {/* Option for other actions like Register */}
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
          <Typography variant="body2" color="textSecondary">
            Chưa có tài khoản? <a href="/register">Đăng ký</a>
          </Typography>
        </Box>

        {/* <Divider sx={{ margin: '16px 0' }} />

        <Button fullWidth variant="outlined" sx={{ marginTop: 2 }}>
          Đăng nhập với Google
        </Button> */}
      </LoginBox>
    </Container>
  );
};

export default LoginPage;
