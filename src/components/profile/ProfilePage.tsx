"use client";

import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Avatar,
  Stack,
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
  Chip,
  Tabs,
  Tab,
  LinearProgress,
  Rating,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
  IconButton,
} from "@mui/material";
import {
  Person as PersonIcon,
  Logout as LogoutIcon,
  DeleteForever as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  Email as EmailIcon,
  CalendarToday as CalendarIcon,
  Star as StarIcon,
  Language as LanguageIcon,
  Circle as CircleIcon,
  Badge as BadgeIcon,
  Edit as EditIcon,
  Close as CloseIcon,
  PhotoCamera as PhotoCameraIcon,
} from "@mui/icons-material";
import { useTranslation } from "@/hooks/useTranslation";
import { User, GuideProfile, Language } from "@/types";
import { LanguageSelector } from "@/components/common/LanguageSelector";

const languages: { code: Language; name: string; flag: string }[] = [
  { code: "ko", name: "한국어", flag: "🇰🇷" },
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "zh-CN", name: "中文", flag: "🇨🇳" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
  { code: "es", name: "Español", flag: "🇪🇸" },
];

interface ProfilePageProps {
  user: User;
  onLogout: () => void;
  onDeleteAccount: () => void;
  onBack: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  user,
  onLogout,
  onDeleteAccount,
  onBack,
}) => {
  const { t } = useTranslation();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [currentLanguage, setCurrentLanguage] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("language") as Language) || "ko";
    }
    return "ko";
  });

  // Edit profile form state
  const [editForm, setEditForm] = useState({
    name: user.name,
    email: user.email,
    nickname: user.nickname || "",
    bio: "Hi, I'm a passionate local guide in Seoul, eager to share the city's hidden gems and rich culture with you. Let's explore together!",
    location: "Seoul, South Korea",
    specialties: (user as GuideProfile).specialties || [],
    languages: (user as GuideProfile).languages || [],
  });

  const formatJoinDate = (date: Date) => {
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  const getProviderDisplayName = (provider: string) => {
    switch (provider) {
      case "google":
        return "Google";
      case "kakao":
        return "Kakao";
      case "naver":
        return "Naver";
      default:
        return provider;
    }
  };

  const handleLogoutConfirm = () => {
    setLogoutDialogOpen(false);
    onLogout();
  };

  const handleDeleteConfirm = () => {
    setDeleteDialogOpen(false);
    onDeleteAccount();
  };

  const handleLanguageChange = (newLanguage: Language) => {
    setCurrentLanguage(newLanguage);
    localStorage.setItem("language", newLanguage);

    // Trigger a custom event for language change
    window.dispatchEvent(
      new CustomEvent("languageChange", { detail: newLanguage })
    );
  };

  const handleEditProfileSave = () => {
    // TODO: Implement actual save functionality (API call)
    console.log("Saving profile:", editForm);
    setEditProfileOpen(false);
    // Show success message or handle errors
  };

  // Calculate rating distribution (mock data - replace with real data)
  const getRatingDistribution = () => {
    return [
      { stars: 5, percentage: 70, count: 87 },
      { stars: 4, percentage: 20, count: 25 },
      { stars: 3, percentage: 5, count: 6 },
      { stars: 2, percentage: 3, count: 4 },
      { stars: 1, percentage: 2, count: 3 },
    ];
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        py: 4,
      }}
    >
      {/* Back Button */}
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={onBack}
          sx={{ color: "text.secondary" }}
        >
          {t("common.back")}
        </Button>
      </Box>

      {/* Centered Profile Card */}
      <Box
        sx={{
          bgcolor: "background.paper",
          borderRadius: 3,
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          overflow: "hidden",
        }}
      >
        {/* Profile Header */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            pt: 6,
            pb: 3,
            px: 4,
          }}
        >
          {/* Profile Avatar */}
          <Avatar
            src={user.avatar}
            sx={{
              width: 160,
              height: 160,
              bgcolor: "#f5d5c8",
              mb: 3,
              border: "4px solid white",
              boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
            }}
          >
            {!user.avatar && <PersonIcon sx={{ fontSize: 80 }} />}
          </Avatar>

          {/* User Name */}
          <Typography
            variant="h4"
            component="h1"
            fontWeight={700}
            color="text.primary"
            sx={{ mb: 1 }}
          >
            {user.name}
          </Typography>

          {/* Location and Join Date */}
          <Typography variant="body1" color="text.secondary" sx={{ mb: 0.5 }}>
            Seoul, South Korea
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Joined in {user.joinDate.getFullYear()}
          </Typography>

          {/* Edit Profile Button */}
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => setEditProfileOpen(true)}
            sx={{
              mt: 3,
              bgcolor: "#5a5a5a",
              color: "white",
              borderRadius: 2,
              px: 4,
              py: 1.5,
              textTransform: "none",
              fontWeight: 600,
              "&:hover": {
                bgcolor: "#4a4a4a",
              },
            }}
          >
            Edit Profile
          </Button>
        </Box>

        {/* Tabs Navigation */}
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={currentTab}
            onChange={(e, newValue) => setCurrentTab(newValue)}
            sx={{
              px: 4,
              "& .MuiTab-root": {
                textTransform: "none",
                fontSize: "1rem",
                fontWeight: 500,
                color: "text.secondary",
                "&.Mui-selected": {
                  color: "text.primary",
                  fontWeight: 600,
                },
              },
            }}
          >
            <Tab label="About" />
            <Tab label="Reviews" />
            <Tab label="Guides" />
            <Tab label="Settings" />
          </Tabs>
        </Box>

        {/* Tab Content */}
        <Box sx={{ p: 4 }}>
          {/* About Tab */}
          {currentTab === 0 && (
            <Box>
              <Typography variant="h5" fontWeight={700} gutterBottom>
                About
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Hi, I'm {user.name}! I'm a passionate local guide in Seoul,
                eager to share the city's hidden gems and rich culture with you.
                Let's explore together!
              </Typography>

              {/* Ratings Section */}
              {user.userType === "guide" && (
                <Box>
                  <Typography variant="h5" fontWeight={700} gutterBottom>
                    Ratings
                  </Typography>
                  <Box sx={{ display: "flex", gap: 6, mt: 3 }}>
                    {/* Left: Overall Rating */}
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        minWidth: 120,
                      }}
                    >
                      <Typography variant="h2" fontWeight={700} sx={{ mb: 1 }}>
                        {(user as GuideProfile).averageRating?.toFixed(1) ||
                          "4.8"}
                      </Typography>
                      <Rating
                        value={(user as GuideProfile).averageRating || 4.8}
                        readOnly
                        precision={0.1}
                        sx={{ mb: 1 }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {(user as GuideProfile).totalReviews || 125} reviews
                      </Typography>
                    </Box>

                    {/* Right: Rating Distribution */}
                    <Box sx={{ flex: 1 }}>
                      {getRatingDistribution().map((item) => (
                        <Box
                          key={item.stars}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            mb: 1.5,
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ minWidth: 12, fontWeight: 500 }}
                          >
                            {item.stars}
                          </Typography>
                          <Box sx={{ flex: 1, position: "relative" }}>
                            <LinearProgress
                              variant="determinate"
                              value={item.percentage}
                              sx={{
                                height: 8,
                                borderRadius: 1,
                                bgcolor: "grey.200",
                                "& .MuiLinearProgress-bar": {
                                  bgcolor:
                                    item.stars === 5 ? "#5a5a5a" : "grey.400",
                                  borderRadius: 1,
                                },
                              }}
                            />
                          </Box>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ minWidth: 40, textAlign: "right" }}
                          >
                            {item.percentage}%
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>
          )}

          {/* Reviews Tab */}
          {currentTab === 1 && (
            <Box>
              <Typography variant="h5" fontWeight={700} gutterBottom>
                Reviews
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Reviews content will be displayed here.
              </Typography>
            </Box>
          )}

          {/* Guides Tab */}
          {currentTab === 2 && (
            <Box>
              <Typography variant="h5" fontWeight={700} gutterBottom>
                Guides
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Guides content will be displayed here.
              </Typography>
            </Box>
          )}

          {/* Settings Tab */}
          {currentTab === 3 && (
            <Box>
              {/* Language Settings */}
              <Box sx={{ mb: 5 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Language
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  Select your preferred language for the interface.
                </Typography>

                <RadioGroup
                  value={currentLanguage}
                  onChange={(e) =>
                    handleLanguageChange(e.target.value as Language)
                  }
                >
                  {languages.map((language) => (
                    <Box
                      key={language.code}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        p: 2,
                        mb: 1,
                        borderRadius: 2,
                        border: "1px solid",
                        borderColor:
                          currentLanguage === language.code
                            ? "primary.main"
                            : "divider",
                        bgcolor:
                          currentLanguage === language.code
                            ? "primary.50"
                            : "transparent",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          borderColor: "primary.main",
                          bgcolor:
                            currentLanguage === language.code
                              ? "primary.50"
                              : "action.hover",
                        },
                      }}
                      onClick={() => handleLanguageChange(language.code)}
                    >
                      <FormControlLabel
                        value={language.code}
                        control={<Radio />}
                        label={
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1.5,
                              ml: 1,
                            }}
                          >
                            <Typography variant="h6">
                              {language.flag}
                            </Typography>
                            <Typography variant="body1" fontWeight={500}>
                              {language.name}
                            </Typography>
                          </Box>
                        }
                        sx={{
                          flex: 1,
                          m: 0,
                          "& .MuiFormControlLabel-label": {
                            flex: 1,
                          },
                        }}
                      />
                    </Box>
                  ))}
                </RadioGroup>
              </Box>

              <Divider sx={{ my: 4 }} />

              {/* Account Actions */}
              <Box>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Account Actions
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  Manage your account security and data.
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    maxWidth: 400,
                  }}
                >
                  <Button
                    variant="contained"
                    size="medium"
                    startIcon={<LogoutIcon />}
                    onClick={() => setLogoutDialogOpen(true)}
                    sx={{
                      borderRadius: 2,
                      bgcolor: "warning.main",
                      color: "white",
                      fontWeight: 600,
                      textTransform: "none",
                      py: 1.5,
                      "&:hover": {
                        bgcolor: "warning.dark",
                      },
                    }}
                  >
                    {t("auth.logout")}
                  </Button>

                  <Button
                    variant="outlined"
                    size="medium"
                    startIcon={<DeleteIcon />}
                    onClick={() => setDeleteDialogOpen(true)}
                    sx={{
                      borderRadius: 2,
                      borderWidth: 2,
                      borderColor: "error.main",
                      color: "error.main",
                      fontWeight: 600,
                      textTransform: "none",
                      py: 1.5,
                      "&:hover": {
                        borderWidth: 2,
                        borderColor: "error.dark",
                        backgroundColor: "error.50",
                      },
                    }}
                  >
                    {t("auth.deleteAccount")}
                  </Button>
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      </Box>

      {/* Logout Confirmation Dialog */}
      <Dialog
        open={logoutDialogOpen}
        onClose={() => setLogoutDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{t("auth.logout")}</DialogTitle>
        <DialogContent>
          <DialogContentText>정말로 로그아웃하시겠습니까?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLogoutDialogOpen(false)} color="inherit">
            {t("common.cancel")}
          </Button>
          <Button
            onClick={handleLogoutConfirm}
            color="primary"
            variant="contained"
          >
            {t("auth.logout")}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Account Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ color: "error.main" }}>
          {t("auth.deleteAccount")}
        </DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            이 작업은 되돌릴 수 없습니다!
          </Alert>
          <DialogContentText>
            계정을 삭제하면 모든 채팅 기록과 개인정보가 영구적으로 삭제됩니다.
            정말로 계정을 삭제하시겠습니까?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="inherit">
            {t("common.cancel")}
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            {t("auth.deleteAccount")}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Profile Dialog */}
      <Dialog
        open={editProfileOpen}
        onClose={() => setEditProfileOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
          },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Typography variant="h6" fontWeight={700}>
              Edit Profile
            </Typography>
            <IconButton
              onClick={() => setEditProfileOpen(false)}
              size="small"
              sx={{ color: "text.secondary" }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 3 }}>
          {/* Avatar Section */}
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 4 }}>
            <Box sx={{ position: "relative" }}>
              <Avatar
                src={user.avatar}
                sx={{
                  width: 120,
                  height: 120,
                  bgcolor: "#f5d5c8",
                  mb: 2,
                }}
              >
                {!user.avatar && <PersonIcon sx={{ fontSize: 60 }} />}
              </Avatar>
              <IconButton
                sx={{
                  position: "absolute",
                  bottom: 16,
                  right: -4,
                  bgcolor: "primary.main",
                  color: "white",
                  "&:hover": {
                    bgcolor: "primary.dark",
                  },
                  boxShadow: 2,
                }}
                size="small"
              >
                <PhotoCameraIcon fontSize="small" />
              </IconButton>
            </Box>
            <Typography variant="caption" color="text.secondary">
              Click to change profile photo
            </Typography>
          </Box>

          {/* Form Fields */}
          <Stack spacing={3}>
            <TextField
              label="Name"
              fullWidth
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              variant="outlined"
            />

            <TextField
              label="Email"
              fullWidth
              value={editForm.email}
              disabled
              variant="outlined"
              helperText="Email cannot be changed"
            />

            {user.userType === "guide" && (
              <TextField
                label="Nickname"
                fullWidth
                value={editForm.nickname}
                onChange={(e) => setEditForm({ ...editForm, nickname: e.target.value })}
                variant="outlined"
              />
            )}

            <TextField
              label="Location"
              fullWidth
              value={editForm.location}
              onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
              variant="outlined"
            />

            <TextField
              label="Bio"
              fullWidth
              multiline
              rows={4}
              value={editForm.bio}
              onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
              variant="outlined"
              helperText={`${editForm.bio.length}/500`}
              inputProps={{ maxLength: 500 }}
            />

            {user.userType === "guide" && (
              <>
                <TextField
                  label="Specialties (comma separated)"
                  fullWidth
                  value={editForm.specialties.join(", ")}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      specialties: e.target.value.split(",").map((s) => s.trim()),
                    })
                  }
                  variant="outlined"
                  helperText="e.g., History, Food, Culture"
                />

                <TextField
                  label="Languages (comma separated)"
                  fullWidth
                  value={editForm.languages.join(", ")}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      languages: e.target.value.split(",").map((s) => s.trim()),
                    })
                  }
                  variant="outlined"
                  helperText="e.g., Korean, English, Japanese"
                />
              </>
            )}
          </Stack>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ p: 2.5, gap: 1 }}>
          <Button
            onClick={() => setEditProfileOpen(false)}
            variant="outlined"
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleEditProfileSave}
            variant="contained"
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              bgcolor: "#5a5a5a",
              "&:hover": {
                bgcolor: "#4a4a4a",
              },
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
