import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
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
