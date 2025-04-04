import React, { useEffect, useState, useCallback } from "react";
import { Button, Tooltip, Typography, useTheme, useMediaQuery } from "@mui/material";
import { CompressOutlined, OpenInFullOutlined } from "@mui/icons-material";

declare global {
  interface Window {
    electron: {
      maximizeWindow: () => void;
      minimizeWindow: () => void;
      toggleAlwaysOnTop: () => Promise<boolean>;
    };
  }
}

export default function WindowControls() {
  const [isMinimized, setIsMinimized] = useState(false);
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.only("xs"));
  // EditModeToggle와 동일하게 xs, sm, md에 따라 스타일이 달라지도록 처리
  // (여기서는 xs와 sm만 사용합니다.)

  const handleToggleSize = useCallback(() => {
    if (isMinimized) {
      window.electron.maximizeWindow();
    } else {
      window.electron.minimizeWindow();
    }
    setIsMinimized(!isMinimized);
  }, [isMinimized]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const modifierPressed = event.ctrlKey || event.metaKey;
      if (modifierPressed && event.key === "2") {
        handleToggleSize();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleToggleSize]);

  const titleText = isMinimized ? "원래 크기로 복원" : "창 크기 축소";

  return (
    <Tooltip
      title={
        <>
          <Typography variant="caption">{titleText}</Typography>
          <Typography variant="caption" color="inherit">
            (Control + 2 / Cmd + 2)
          </Typography>
        </>
      }
      arrow
    >
      <Button
        onClick={handleToggleSize}
        variant="outlined"
        size="small"
        startIcon={
          isMinimized ? (
            <OpenInFullOutlined sx={{ fontSize: { xs: 18, sm: 18, md: 18 } }} />
          ) : (
            <CompressOutlined sx={{ fontSize: { xs: 18, sm: 18, md: 18 } }} />
          )
        }
        sx={{
          minWidth: { xs: "auto", sm: "120px" },
          height: { xs: 32, sm: 36 },
          px: { xs: 1.5, sm: 2.5 },
          fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.815rem" },
          fontWeight: 600,
          borderRadius: "10px",
          border: "1px solid",
          boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          backgroundColor: isMinimized ? "#eef2ff" : "white",
          borderColor: isMinimized ? "#2563eb" : "grey.200",
          color: isMinimized ? "#2563eb" : "grey.600",
          "&:hover": {
            backgroundColor: isMinimized ? "#e0e7ff" : "#f0f6ff",
            borderColor: isMinimized ? "#2563eb" : "#3b82f6",
            color: isMinimized ? "#2563eb" : "#3b82f6",
            boxShadow: "0 2px 4px rgba(37,99,235,0.06)",
          },
          "&:active": {
            backgroundColor: isMinimized ? "#c7d2fe" : "#dbeafe",
            transform: "translateY(1px)",
          },
          "& .MuiSvgIcon-root": {
            transition: "all 0.2s ease",
          },
        }}
      >
        {isMinimized ? "확대" : "축소"}
      </Button>
    </Tooltip>
  );
}