"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  useUpdateMe,
  useGetGuideById,
  useGetMyGuideRatings,
  useUpdateMyGuideProfile,
} from "@/hooks/api";
import { useQueryClient } from "@tanstack/react-query";
import {
  Box,
  Container,
  Typography,
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
  Tabs,
  Tab,
  LinearProgress,
  Rating,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
  IconButton,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  Person as PersonIcon,
  Logout as LogoutIcon,
  DeleteForever as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Close as CloseIcon,
  PhotoCamera as PhotoCameraIcon,
} from "@mui/icons-material";
import { useTranslation } from "@/hooks/useTranslation";
import { User, Language, LocationCode, LOCATION_LABELS } from "@/types";
import type { GuideResponse, RateResponse } from "@/lib/generated";

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
  const queryClient = useQueryClient();
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

  const isGuide = user.userType === "guide";
  const userId = Number(user.id);

  // Fetch guide-specific data if user is a guide
  const { data: guideData, isLoading: isLoadingGuide } = useGetGuideById(
    userId,
    {
      enabled: isGuide,
    }
  );

  // Fetch guide ratings if user is a guide
  const { data: ratingsData, isLoading: isLoadingRatings } =
    useGetMyGuideRatings({
      enabled: isGuide,
    });

  const guideProfile = guideData?.data;
  const ratingSummary = ratingsData?.data?.data;

  // API mutations for profile update
  const updateUserProfile = useUpdateMe({
    onSuccess: () => {
      setEditProfileOpen(false);
      // Invalidate user profile query to refresh data
      queryClient.invalidateQueries({ queryKey: ["users", "me"] });
      // TODO: Show success notification
    },
    onError: (error) => {
      console.error("User profile update failed:", error);
      // TODO: Show error notification
    },
  });

  const updateGuideProfileMutation = useUpdateMyGuideProfile({
    onSuccess: () => {
      setEditProfileOpen(false);
      // Invalidate guide profile and user queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["guides", "detail", userId] });
      queryClient.invalidateQueries({ queryKey: ["users", "me"] });
      // TODO: Show success notification
    },
    onError: (error) => {
      console.error("Guide profile update failed:", error);
      // TODO: Show error notification
    },
  });

  // Edit profile form state
  const [editForm, setEditForm] = useState<{
    nickname: string;
    location: LocationCode | "";
    description: string;
  }>({
    nickname: user.nickname || "",
    location: "",
    description: "",
  });

  // Update form when guide profile is loaded
  useEffect(() => {
    if (isGuide && guideProfile) {
      setEditForm({
        nickname: guideProfile.nickname || user.nickname || "",
        location: guideProfile.location || "",
        description: guideProfile.description || "",
      });
    }
  }, [guideProfile, isGuide, user.nickname]);

  const formatJoinDate = (date: Date) => {
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
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

  const handleEditProfileSave = async () => {
    try {
      if (isGuide) {
        await updateGuideProfileMutation.mutateAsync({
          nickname: editForm.nickname || undefined,
          profileImageUrl: undefined, // TODO: Handle image upload
          location: editForm.location === "" ? undefined : editForm.location,
          description: editForm.description || undefined,
        });
      } else {
        await updateUserProfile.mutateAsync({
          nickname: editForm.nickname || undefined,
          profileImageUrl: undefined, // TODO: Handle image upload
        });
      }
    } catch (error) {
      // Error is handled in onError callback
      console.error("Failed to save profile:", error);
    }
  };

  // Calculate rating distribution from actual ratings data
  const ratingDistribution = useMemo(() => {
    if (!ratingSummary?.ratings) {
      return [];
    }

    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    ratingSummary.ratings.forEach((rating: RateResponse) => {
      const stars = Math.round(rating.rating);
      if (stars >= 1 && stars <= 5) {
        counts[stars as keyof typeof counts]++;
      }
    });

    const total = ratingSummary.totalRatings || 0;

    return [5, 4, 3, 2, 1].map((stars) => ({
      stars,
      count: counts[stars as keyof typeof counts],
      percentage:
        total > 0
          ? Math.round((counts[stars as keyof typeof counts] / total) * 100)
          : 0,
    }));
  }, [ratingSummary]);

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

          {/* Location (for guides) and Join Date */}
          {isGuide && guideProfile?.location && (
            <Typography variant="body1" color="text.secondary" sx={{ mb: 0.5 }}>
              {LOCATION_LABELS[guideProfile.location as LocationCode] || guideProfile.location}
            </Typography>
          )}
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
            <Tab label="Settings" />
          </Tabs>
        </Box>

        {/* Tab Content */}
        <Box sx={{ p: 4 }}>
          {/* About Tab */}
          {currentTab === 0 && (
            <Box>
              <Typography variant="h5" fontWeight={700} gutterBottom>
                {t("profile.about")}
              </Typography>

              {/* User Description */}
              {!isGuide && (
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 4 }}
                >
                  {user.email}
                </Typography>
              )}

              {/* Guide Description */}
              {isGuide && (
                <>
                  {isLoadingGuide ? (
                    <Box
                      sx={{ display: "flex", justifyContent: "center", py: 4 }}
                    >
                      <CircularProgress />
                    </Box>
                  ) : (
                    <>
                      {guideProfile?.description ? (
                        <Typography
                          variant="body1"
                          color="text.secondary"
                          sx={{ mb: 4 }}
                        >
                          {guideProfile.description}
                        </Typography>
                      ) : (
                        <Typography
                          variant="body1"
                          color="text.secondary"
                          sx={{ mb: 4, fontStyle: "italic" }}
                        >
                          No description available.
                        </Typography>
                      )}

                      {/* Ratings Section for Guides */}
                      {isLoadingRatings ? (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            py: 4,
                          }}
                        >
                          <CircularProgress />
                        </Box>
                      ) : ratingSummary && ratingSummary.totalRatings > 0 ? (
                        <Box sx={{ mt: 4 }}>
                          <Typography
                            variant="h5"
                            fontWeight={700}
                            gutterBottom
                          >
                            {t("profile.ratings")}
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
                              <Typography
                                variant="h2"
                                fontWeight={700}
                                sx={{ mb: 1 }}
                              >
                                {ratingSummary.averageRating.toFixed(1)}
                              </Typography>
                              <Rating
                                value={ratingSummary.averageRating}
                                readOnly
                                precision={0.1}
                                sx={{ mb: 1 }}
                              />
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {ratingSummary.totalRatings}{" "}
                                {ratingSummary.totalRatings === 1
                                  ? "review"
                                  : "reviews"}
                              </Typography>
                            </Box>

                            {/* Right: Rating Distribution */}
                            <Box sx={{ flex: 1 }}>
                              {ratingDistribution.map((item) => (
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
                                            item.stars === 5
                                              ? "#5a5a5a"
                                              : "grey.400",
                                          borderRadius: 1,
                                        },
                                      }}
                                    />
                                  </Box>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ minWidth: 60, textAlign: "right" }}
                                  >
                                    {item.percentage}% ({item.count})
                                  </Typography>
                                </Box>
                              ))}
                            </Box>
                          </Box>
                        </Box>
                      ) : (
                        <Box sx={{ mt: 4 }}>
                          <Typography
                            variant="h5"
                            fontWeight={700}
                            gutterBottom
                          >
                            {t("profile.ratings")}
                          </Typography>
                          <Typography
                            variant="body1"
                            color="text.secondary"
                            sx={{ fontStyle: "italic" }}
                          >
                            {t("profile.noRatings")}
                          </Typography>
                        </Box>
                      )}
                    </>
                  )}
                </>
              )}
            </Box>
          )}

          {/* Settings Tab */}
          {currentTab === 1 && (
            <Box>
              {/* Language Settings */}
              <Box sx={{ mb: 5 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  {t("profile.languageSettings")}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  {t("profile.languageDescription")}
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
                  {t("profile.accountActions")}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  {t("profile.accountActionsDescription")}
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
                      color: "white",
                      fontWeight: 600,
                      textTransform: "none",
                      py: 1.5,
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
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
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
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 4,
            }}
          >
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
              label="Email"
              fullWidth
              value={user.email}
              disabled
              variant="outlined"
              helperText="Email cannot be changed"
            />

            <TextField
              label="Nickname"
              fullWidth
              value={editForm.nickname}
              onChange={(e) =>
                setEditForm({ ...editForm, nickname: e.target.value })
              }
              variant="outlined"
              placeholder={user.name}
            />

            {isGuide && (
              <>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Location</InputLabel>
                  <Select
                    value={editForm.location || ""}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        location: e.target.value as LocationCode | "",
                      })
                    }
                    label="Location"
                  >
                    <MenuItem value="">
                      <em>선택 안 함</em>
                    </MenuItem>
                    {(Object.keys(LOCATION_LABELS) as LocationCode[]).map(
                      (code) => (
                        <MenuItem key={code} value={code}>
                          {LOCATION_LABELS[code]}
                        </MenuItem>
                      )
                    )}
                  </Select>
                </FormControl>

                <TextField
                  label="Description"
                  fullWidth
                  multiline
                  rows={4}
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  variant="outlined"
                  helperText={`${editForm.description.length}/500 characters`}
                  inputProps={{ maxLength: 500 }}
                  placeholder="Tell visitors about yourself and your expertise..."
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
