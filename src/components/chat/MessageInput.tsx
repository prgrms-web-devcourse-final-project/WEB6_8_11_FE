'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Paper,
  InputAdornment,
} from '@mui/material';
import {
  Send as SendIcon,
} from '@mui/icons-material';
import { useTranslation } from '@/hooks/useTranslation';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  disabled = false,
  placeholder,
}) => {
  const { t } = useTranslation();
  const [message, setMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const defaultPlaceholder = placeholder || t('chat.typeMessage');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSendClick = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        borderRadius: 2,
        backgroundColor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          ref={inputRef}
          fullWidth
          multiline
          maxRows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={defaultPlaceholder}
          disabled={disabled}
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root': {
              paddingRight: '8px',
            },
            '& .MuiInputBase-input': {
              paddingRight: 0,
            },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleSendClick}
                  disabled={!message.trim() || disabled}
                  color="primary"
                  sx={{
                    padding: '8px',
                    backgroundColor: message.trim() && !disabled ? 'primary.main' : 'transparent',
                    color: message.trim() && !disabled ? 'primary.contrastText' : 'text.disabled',
                    '&:hover': {
                      backgroundColor: message.trim() && !disabled ? 'primary.dark' : 'transparent',
                    },
                    '&.Mui-disabled': {
                      backgroundColor: 'transparent',
                    },
                  }}
                >
                  <SendIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>
    </Paper>
  );
};