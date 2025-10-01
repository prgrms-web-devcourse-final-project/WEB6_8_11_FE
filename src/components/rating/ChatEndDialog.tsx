'use client';

import React, { useState } from 'react';
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
  Chip,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Divider,
} from '@mui/material';
import {
  Chat as ChatIcon,
  Star as StarIcon,
  Send as SendIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { GuideProfile, ChatRating } from '@/types';

interface ChatEndDialogProps {
  open: boolean;
  onClose: () => void;
  guide: GuideProfile;
  chatId: string;
  onSubmitRating: (rating: Omit<ChatRating, 'id' | 'createdAt'>) => Promise<void>;
}

const steps = ['채팅 종료 확인', '가이드 평가', '완료'];

export const ChatEndDialog: React.FC<ChatEndDialogProps> = ({
  open,
  onClose,
  guide,
  chatId,
  onSubmitRating,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [rating, setRating] = useState<number | null>(null);
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNext = () => {
    if (activeStep === 0) {
      setActiveStep(1);
    } else if (activeStep === 1) {
      handleSubmitRating();
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleSubmitRating = async () => {
    if (!rating) {
      setError('평점을 선택해주세요.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await onSubmitRating({
        chatId,
        userId: 'current-user-id', // 실제로는 context에서 가져와야 함
        guideId: guide.id,
        rating,
        review: review.trim() || undefined,
      });
      setActiveStep(2);
    } catch (err) {
      setError('평가 제출 중 오류가 발생했습니다.');
      console.error('Rating submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setActiveStep(0);
    setRating(null);
    setReview('');
    setError(null);
    onClose();
  };

  const getRatingText = (value: number) => {
    switch (value) {
      case 1: return '매우 불만족';
      case 2: return '불만족';
      case 3: return '보통';
      case 4: return '만족';
      case 5: return '매우 만족';
      default: return '';
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <ChatIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              채팅을 종료하시겠습니까?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {guide.nickname} 가이드와의 채팅이 종료됩니다.
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <Avatar src={guide.profileImage} sx={{ mr: 2 }}>
                {guide.nickname.charAt(0)}
              </Avatar>
              <Box sx={{ textAlign: 'left' }}>
                <Typography variant="subtitle1" fontWeight={600}>
                  {guide.nickname}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Rating value={guide.averageRating} precision={0.1} readOnly size="small" />
                  <Typography variant="body2" color="text.secondary">
                    {guide.averageRating.toFixed(1)} ({guide.totalReviews}개 리뷰)
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
              {guide.specialties.map((specialty, index) => (
                <Chip key={index} label={specialty} size="small" variant="outlined" />
              ))}
            </Box>
          </Box>
        );

      case 1:
        return (
          <Box sx={{ py: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ textAlign: 'center' }}>
              가이드 서비스는 어떠셨나요?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mb: 3 }}>
              {guide.nickname} 가이드에 대한 솔직한 평가를 남겨주세요.
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {/* 가이드 정보 */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
              <Avatar src={guide.profileImage} sx={{ mr: 2 }}>
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
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                평점을 선택해주세요
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
                <Typography variant="body2" color="primary.main" fontWeight={500}>
                  {getRatingText(rating)}
                </Typography>
              )}
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* 리뷰 작성 */}
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                리뷰 작성 (선택사항)
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                placeholder="가이드 서비스에 대한 구체적인 리뷰를 작성해주세요..."
                value={review}
                onChange={(e) => setReview(e.target.value)}
                variant="outlined"
                sx={{ mb: 2 }}
              />
              <Typography variant="caption" color="text.secondary">
                {review.length}/500자
              </Typography>
            </Box>
          </Box>
        );

      case 2:
        return (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CheckCircleIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom fontWeight={600}>
              평가가 완료되었습니다!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              소중한 의견 감사합니다. 더 나은 서비스를 위해 노력하겠습니다.
            </Typography>

            {rating && (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
                <Typography variant="body1" sx={{ mr: 1 }}>나의 평점:</Typography>
                <Rating value={rating} readOnly size="small" />
                <Typography variant="body2" color="primary.main" fontWeight={500} sx={{ ml: 1 }}>
                  {getRatingText(rating)}
                </Typography>
              </Box>
            )}

            {review && (
              <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2, textAlign: 'left' }}>
                <Typography variant="subtitle2" gutterBottom>
                  작성한 리뷰
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  "{review}"
                </Typography>
              </Box>
            )}
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={activeStep === 2 ? handleClose : undefined}
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown={activeStep === 1}
    >
      <DialogTitle>
        <Typography variant="h6" component="div" textAlign="center">
          채팅 종료 및 평가
        </Typography>
      </DialogTitle>

      <DialogContent>
        {/* Progress Stepper */}
        <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {renderStepContent()}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        {activeStep === 0 && (
          <>
            <Button onClick={onClose} color="inherit">
              취소
            </Button>
            <Button onClick={handleNext} variant="contained">
              채팅 종료
            </Button>
          </>
        )}

        {activeStep === 1 && (
          <>
            <Button onClick={handleBack} color="inherit">
              이전
            </Button>
            <Button
              onClick={handleNext}
              variant="contained"
              disabled={!rating || loading}
              startIcon={loading ? null : <SendIcon />}
            >
              {loading ? '제출 중...' : '평가 제출'}
            </Button>
          </>
        )}

        {activeStep === 2 && (
          <Button onClick={handleClose} variant="contained" fullWidth>
            완료
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};