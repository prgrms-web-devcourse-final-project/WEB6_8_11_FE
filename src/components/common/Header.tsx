"use client";

import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Avatar,
  useMediaQuery,
  useTheme,
  Badge,
  Button,
} from "@mui/material";
import {
  Search as SearchIcon,
  Person as PersonIcon,
  Menu as MenuIcon,
  Chat as ChatIcon,
  Groups as GuideIcon,
} from "@mui/icons-material";
import { User } from "@/types";
import { LanguageSelector } from "./LanguageSelector";
import { useTranslation } from "@/hooks/useTranslation";

interface HeaderProps {
  user?: User | null;
  onProfileClick?: () => void;
  onMenuClick?: () => void;
  showMenuButton?: boolean;
  variant?: "default" | "chat";
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onProfileClick,
  onMenuClick,
  showMenuButton = false,
  variant = "default",
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { t } = useTranslation();

  const [searchQuery, setSearchQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // 현재 활성 경로 확인
  const isActivePath = (path: string) => {
    return pathname?.startsWith(path);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/guides/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearchSubmit(e as any);
    }
  };

  const handleProfileClick = () => {
    if (onProfileClick) {
      onProfileClick();
    } else {
      router.push("/profile");
    }
  };

  const handleChatClick = () => {
    router.push("/chat");
  };

  const handleGuidesClick = () => {
    router.push("/guides");
  };

  const handleLogoClick = () => {
    router.push("/chat");
  };

  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={variant === "chat" ? 1 : 2}
      sx={{
        bgcolor: "background.paper",
        borderBottom: "1px solid",
        borderColor: "divider",
        borderRadius: 0,
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        {/* Menu Button (Mobile) */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, flex: 1 }}>
          {showMenuButton && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={onMenuClick}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Logo/Brand */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              mr: { xs: 1, md: 2 },
            }}
            onClick={handleLogoClick}
          >
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 700,
                background: `linear-gradient(45deg, ${theme.palette.primary.light} 30%, ${theme.palette.primary.dark} 90%)`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontSize: { xs: "1.1rem", md: "1.25rem" },
              }}
            >
              {t("header.brandName")}
            </Typography>
          </Box>

          {/* Navigation Buttons */}
          {!isMobile && (
            <Box sx={{ display: "flex", gap: 1, mr: 2 }}>
              <Button
                onClick={handleChatClick}
                sx={{
                  color: isActivePath("/chat")
                    ? "primary.main"
                    : "text.secondary",
                  fontWeight: isActivePath("/chat") ? 600 : 400,
                  borderColor: "primary.main",
                  borderRadius: 0,
                  px: 2,
                  "&:hover": {
                    bgcolor: "action.hover",
                    color: "primary.main",
                  },
                }}
              >
                {t("header.chat")}
              </Button>
              <Button
                onClick={handleGuidesClick}
                sx={{
                  color: isActivePath("/guides")
                    ? "primary.main"
                    : "text.secondary",
                  fontWeight: isActivePath("/guides") ? 600 : 400,
                  borderColor: "primary.main",
                  borderRadius: 0,
                  px: 2,
                  "&:hover": {
                    bgcolor: "action.hover",
                    color: "primary.main",
                  },
                }}
              >
                {t("header.guides")}
              </Button>
            </Box>
          )}

          {/* Search Box */}
          <Box
            component="form"
            onSubmit={handleSearchSubmit}
            sx={{
              flex: 1,
              maxWidth: { xs: "none", md: "400px" },
              mx: { xs: 1, md: 2 },
            }}
          >
            <TextField
              fullWidth
              size="small"
              placeholder={
                isMobile
                  ? t("header.searchPlaceholder")
                  : t("header.searchPlaceholderFull")
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleSearchKeyPress}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "text.secondary" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  bgcolor: "grey.50",
                  borderRadius: 2,
                  "&:hover": {
                    bgcolor: "grey.100",
                  },
                  "&.Mui-focused": {
                    bgcolor: "background.paper",
                  },
                },
              }}
            />
          </Box>
        </Box>

        {/* Right Side Actions */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {/* User Profile */}
          {user ? (
            <>
              <IconButton
                color="inherit"
                onClick={handleProfileClick}
                sx={{ ml: 1 }}
              >
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  badgeContent={
                    user.userType === "guide" ? (
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: "50%",
                          bgcolor: "success.main",
                          border: "2px solid",
                          borderColor: "background.paper",
                        }}
                      />
                    ) : null
                  }
                >
                  <Avatar src={user.avatar} sx={{ width: 32, height: 32 }}>
                    {user.avatar ? null : <PersonIcon sx={{ fontSize: 18 }} />}
                  </Avatar>
                </Badge>
              </IconButton>
            </>
          ) : (
            <IconButton
              color="inherit"
              onClick={() => router.push("/login")}
              sx={{ ml: 1 }}
            >
              <PersonIcon />
            </IconButton>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};
