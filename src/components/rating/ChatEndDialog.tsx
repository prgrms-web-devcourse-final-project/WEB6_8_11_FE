"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Rating,
  TextField,
  Avatar,
  Alert,
  Divider,
} from "@mui/material";
import {
  Send as SendIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import { GuideProfile, ChatRating } from "@/types";
import { useTranslation } from "@/hooks/useTranslation";

interface ChatEndDialogProps {
  open: boolean;
  onClose: () => void;
  guide: GuideProfile;
  chatId: string;
  onSubmitRating: (
    rating: Omit<ChatRating, "id" | "createdAt">
  ) => Promise<void>;
}

export const ChatEndDialog: React.FC<ChatEndDialogProps> = ({
  open,
  onClose,
  guide,
  chatId,
  onSubmitRating,
}) => {
  const { t } = useTranslation();
  const [rating, setRating] = useState<number | null>(null);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitRating = async () => {
    if (!rating) {
      setError(t("rating.selectRating"));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await onSubmitRating({
        chatId,
        userId: "current-user-id", // 실제로는 context에서 가져와야 함
        guideId: guide.id.toString(),
        rating,
        review: review.trim() || undefined,
      });
      setSubmitted(true);
    } catch (err) {
      setError(t("rating.submitError"));
      console.error("Rating submission error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setRating(null);
    setReview("");
    setError(null);
    setSubmitted(false);
    onClose();
  };

  const getRatingText = (value: number) => {
    switch (value) {
      case 1:
        return t("rating.veryDissatisfied");
      case 2:
        return t("rating.dissatisfied");
      case 3:
        return t("rating.neutral");
      case 4:
        return t("rating.satisfied");
      case 5:
        return t("rating.verySatisfied");
      default:
        return "";
    }
  };

  if (submitted) {
    return (
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogContent>
          <Box sx={{ textAlign: "center", py: 4 }}>
            <CheckCircleIcon sx={{ fontSize: 64, color: "success.main", mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              {t("rating.submitted")}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t("rating.thankYou")}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleClose} variant="contained" fullWidth>
            {t("rating.done")}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Typography variant="h6" component="div" textAlign="center">
          {t("rating.title")}
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ py: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ textAlign: "center" }}>
            {t("rating.howWasService")}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: "center", mb: 3 }}
          >
            {t("rating.leaveHonestReview", { guideName: guide.nickname })}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* 가이드 정보 */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 3,
              p: 2,
              bgcolor: "grey.50",
              borderRadius: 2,
            }}
          >
            <Avatar src={guide.profileImageUrl} sx={{ mr: 2 }}>
              {guide.nickname.charAt(0)}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" fontWeight={600}>
                {guide.nickname}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {guide.description}
              </Typography>
            </Box>
          </Box>

          {/* 평점 선택 */}
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              {t("rating.selectRatingPrompt")}
            </Typography>
            <Rating
              value={rating}
              onChange={(event, newValue) => {
                setRating(newValue);
                setError(null);
              }}
              size="large"
              sx={{ mb: 1 }}
            />
            {rating && (
              <Typography
                variant="body2"
                color="primary.main"
                fontWeight={500}
              >
                {getRatingText(rating)}
              </Typography>
            )}
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* 리뷰 작성 */}
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              {t("rating.writeReview")}
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder={t("rating.reviewPlaceholder")}
              value={review}
              onChange={(e) => setReview(e.target.value)}
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <Typography variant="caption" color="text.secondary">
              {review.length}/500{t("profile.review") === "review" ? " characters" : "자"}
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} color="inherit">
          {t("common.cancel")}
        </Button>
        <Button
          onClick={handleSubmitRating}
          variant="contained"
          disabled={!rating || loading}
          startIcon={loading ? null : <SendIcon />}
        >
          {loading ? t("rating.submitting") : t("rating.submit")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
