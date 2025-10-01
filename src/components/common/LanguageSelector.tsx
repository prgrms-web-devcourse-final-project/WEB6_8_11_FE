"use client";

import React, { useState, useEffect } from "react";
import {
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
  Box,
  Typography,
} from "@mui/material";
import { Language } from "@/types";

const languages: { code: Language; name: string; flag: string }[] = [
  { code: "ko", name: "한국어", flag: "🇰🇷" },
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "zh-CN", name: "中文", flag: "🇨🇳" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
  { code: "es", name: "Español", flag: "🇪🇸" },
];

interface LanguageSelectorProps {
  variant?: "glassmorphism" | "default" | "compact";
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  variant = "default",
}) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>("ko");

  useEffect(() => {
    // Get browser language on mount
    const browserLang = navigator.language.split("-")[0];
    const supportedLang = languages.find((lang) =>
      lang.code.startsWith(browserLang)
    );

    // Check localStorage for saved language preference
    const savedLang = localStorage.getItem("language") as Language;

    if (savedLang) {
      setCurrentLanguage(savedLang);
    } else if (supportedLang) {
      setCurrentLanguage(supportedLang.code);
      localStorage.setItem("language", supportedLang.code);
    }
  }, []);

  const handleLanguageChange = (event: SelectChangeEvent<string>) => {
    const newLocale = event.target.value as Language;
    setCurrentLanguage(newLocale);
    localStorage.setItem("language", newLocale);

    // Trigger a custom event for language change
    window.dispatchEvent(
      new CustomEvent("languageChange", { detail: newLocale })
    );
  };

  // Glassmorphism style for login page
  const glassmorphismStyle = {
    backdropFilter: "blur(10px)",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    color: "white",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    borderRadius: 2,
    "& .MuiSelect-select": {
      display: "flex",
      alignItems: "center",
      gap: 1,
    },
    "& .MuiOutlinedInput-notchedOutline": {
      border: "none",
    },
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.2)",
    },
    "&.Mui-focused": {
      backgroundColor: "rgba(255, 255, 255, 0.2)",
    },
    "& .MuiSvgIcon-root": {
      color: "white",
    },
  };

  // Default style for other pages
  const defaultStyle = {
    backgroundColor: "background.paper",
    borderRadius: 2,
    "& .MuiSelect-select": {
      display: "flex",
      alignItems: "center",
      gap: 1,
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "divider",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "primary.main",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "primary.main",
    },
  };

  // Compact style for header usage
  const compactStyle = {
    backgroundColor: "transparent",
    borderRadius: 1,
    "& .MuiSelect-select": {
      display: "flex",
      alignItems: "center",
      gap: 0.5,
      padding: "4px 8px",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "transparent",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "divider",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "primary.main",
    },
  };

  const glassmorphismMenuProps = {
    PaperProps: {
      sx: {
        backdropFilter: "blur(10px)",
        backgroundColor: "rgba(255, 255, 255, 0.15)",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        borderRadius: 2,
        mt: 1,
        "& .MuiMenuItem-root": {
          color: "white",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.2)",
          },
          "&.Mui-selected": {
            backgroundColor: "rgba(255, 255, 255, 0.25)",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.3)",
            },
          },
        },
      },
    },
  };

  const defaultMenuProps = {
    PaperProps: {
      sx: {
        mt: 1,
        borderRadius: 2,
        boxShadow: 3,
        "& .MuiMenuItem-root": {
          "&:hover": {
            backgroundColor: "action.hover",
          },
          "&.Mui-selected": {
            backgroundColor: "action.selected",
            "&:hover": {
              backgroundColor: "action.selected",
            },
          },
        },
      },
    },
  };

  return (
    <FormControl
      size="small"
      sx={{
        minWidth: variant === "compact" ? 80 : 120,
      }}
    >
      <Select
        value={currentLanguage}
        onChange={handleLanguageChange}
        displayEmpty
        sx={
          variant === "glassmorphism"
            ? glassmorphismStyle
            : variant === "compact"
            ? compactStyle
            : defaultStyle
        }
        MenuProps={
          variant === "glassmorphism"
            ? glassmorphismMenuProps
            : defaultMenuProps
        }
      >
        {languages.map((language) => (
          <MenuItem key={language.code} value={language.code}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <span>{language.flag}</span>
              <Typography variant="body2">{language.name}</Typography>
            </Box>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
