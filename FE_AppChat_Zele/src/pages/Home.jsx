import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Xử lý đăng xuất và chuyển hướng về trang đăng nhập
    navigate("/login");
  };

  return (
    <Box sx={{ textAlign: "center", marginTop: 8 }}>
      <Typography variant="h4" mb={2}>Chào mừng bạn đến với trang chủ!</Typography>
      <Button variant="contained" color="primary" onClick={handleLogout}>
        Đăng xuất
      </Button>
    </Box>
  );
};

export default HomePage;
