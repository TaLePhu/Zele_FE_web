import React, { useState } from 'react';
import { TextField, Button, Box, Typography, CircularProgress } from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Container = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  backgroundColor: '#dfe8ef',
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
  color: '#0068ff',
  marginBottom: '24px',
});

const ErrorText = styled(Typography)({
  color: 'red',
  marginTop: '8px',
});

const LoginPage = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    setLoading(true);

    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    let isValid = true;

    if (!gmailRegex.test(email)) {
      setError('Chỉ chấp nhận email hợp lệ (ví dụ: example@gmail.com).');
      isValid = false;
    }

    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự.');
      isValid = false;
    }

    if (!isValid) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });

      const { user, accessToken } = response.data.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('user', JSON.stringify(user));

      setIsAuthenticated(true); 
      navigate('/home'); 
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

        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
          <Typography variant="body2" color="textSecondary">
            Chưa có tài khoản? <a href="/register">Đăng ký</a>
          </Typography>
        </Box>
      </LoginBox>
    </Container>
  );
};

export default LoginPage;
