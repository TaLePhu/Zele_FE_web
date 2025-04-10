import React from "react";
import { Box, Typography } from "@mui/material";

const Header = ({ username }) => {
  return (
    <Box
      sx={{
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e0e0e0",
        padding: "8px 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "50px"
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: "bold", color: "#1976d2" }}>
        Zele
      </Typography>
      <Typography variant="body1" sx={{ fontStyle: "italic", color: "#555" }}>
        {username ? `Xin chào, ${username}` : "Đang tải..."}
      </Typography>
    </Box>
  );
};

export default Header;
