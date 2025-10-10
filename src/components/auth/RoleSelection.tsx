"use client";

import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Grid,
  Stack,
  Fade,
  alpha,
} from "@mui/material";
import { Person as PersonIcon, Tour as TourIcon } from "@mui/icons-material";
import { useTranslation } from "@/hooks/useTranslation";

interface RoleOption {
  value: "USER" | "GUIDE";
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

interface RoleSelectionProps {
  onSelectRole: (role: "USER" | "GUIDE") => void;
  loading?: boolean;
}

export const RoleSelection: React.FC<RoleSelectionProps> = ({
  onSelectRole,
  loading = false,
}) => {
  const { t } = useTranslation();
  const [selectedRole, setSelectedRole] = useState<"USER" | "GUIDE" | null>(
    null
  );

  const roleOptions: RoleOption[] = [
    {
      value: "USER",
      title: t("auth.role.user.title") || "여행자",
      description:
        t("auth.role.user.description") || "가이드를 찾고 여행 정보를 얻습니다",
      icon: <PersonIcon sx={{ fontSize: 60 }} />,
      color: "rgba(33, 150, 243, 0.9)",
    },
    {
      value: "GUIDE",
      title: t("auth.role.guide.title") || "가이드",
      description:
        t("auth.role.guide.description") ||
        "여행자에게 가이드 서비스를 제공합니다",
      icon: <TourIcon sx={{ fontSize: 60 }} />,
      color: "rgba(245, 0, 87, 0.9)",
    },
  ];

  const handleRoleClick = (role: "USER" | "GUIDE") => {
    if (loading) return;
    setSelectedRole(role);
    onSelectRole(role);
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 900, mx: "auto" }}>
      <Stack spacing={5}>
        <Box textAlign="center">
          <Typography
            variant="h3"
            fontWeight={700}
            gutterBottom
            sx={{
              fontSize: { xs: "1.8rem", md: "2.5rem" },
              color: "white",
              textShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
              mb: 2,
            }}
          >
            {t("auth.role.select") || "역할을 선택해주세요"}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: "0.95rem", md: "1.1rem" },
              color: "rgba(255, 255, 255, 0.85)",
              textShadow: "0 1px 4px rgba(0, 0, 0, 0.3)",
            }}
          >
            {t("auth.role.selectDescription") ||
              "서비스를 이용하실 역할을 선택해주세요"}
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {roleOptions.map((option, index) => (
            <Grid item xs={12} sm={6} key={option.value}>
              <Fade in timeout={600 + index * 200}>
                <Card
                  sx={{
                    height: "100%",
                    position: "relative",
                    overflow: "hidden",
                    // transition: "all 0.2s ease-in-out !important",
                    transition:
                      "all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important",
                    backdropFilter: "blur(10px)",
                    backgroundColor:
                      selectedRole === option.value
                        ? "rgba(255, 255, 255, 0.2)"
                        : "rgba(255, 255, 255, 0.1)",
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor:
                      selectedRole === option.value
                        ? "rgba(255, 255, 255, 0.4)"
                        : "rgba(255, 255, 255, 0.2)",
                    boxShadow:
                      selectedRole === option.value
                        ? "0 12px 40px rgba(0, 0, 0, 0.4)"
                        : "0 8px 32px rgba(0, 0, 0, 0.3)",
                    "&:hover": {
                      transform: "translateY(-8px) scale(1.02)",
                      backgroundColor: "rgba(255, 255, 255, 0.15)",
                      borderColor: "rgba(255, 255, 255, 0.3)",
                      boxShadow: "0 16px 48px rgba(0, 0, 0, 0.5)",
                    },
                  }}
                >
                  <CardActionArea
                    onClick={() => handleRoleClick(option.value)}
                    disabled={loading}
                    sx={{
                      height: "100%",
                      p: { xs: 4, md: 5 },
                    }}
                  >
                    <CardContent sx={{ p: 0 }}>
                      <Stack spacing={3} alignItems="center">
                        <Box
                          sx={{
                            color: option.color,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 120,
                            height: 120,
                            borderRadius: "50%",
                            bgcolor: alpha(option.color, 0.15),
                            backdropFilter: "blur(5px)",
                            border: `2px solid ${alpha(option.color, 0.3)}`,
                            transition: "all 0.4s ease",
                            boxShadow: `0 4px 20px ${alpha(option.color, 0.2)}`,
                            ...(selectedRole === option.value && {
                              bgcolor: alpha(option.color, 0.25),
                              transform: "scale(1.1) rotate(5deg)",
                              borderColor: alpha(option.color, 0.5),
                              boxShadow: `0 8px 30px ${alpha(
                                option.color,
                                0.4
                              )}`,
                            }),
                          }}
                        >
                          {option.icon}
                        </Box>

                        <Typography
                          variant="h4"
                          fontWeight={700}
                          textAlign="center"
                          sx={{
                            fontSize: { xs: "1.5rem", md: "1.8rem" },
                            color: "white",
                            textShadow: "0 2px 8px rgba(0, 0, 0, 0.4)",
                            mb: 1,
                          }}
                        >
                          {option.title}
                        </Typography>

                        <Typography
                          variant="body1"
                          textAlign="center"
                          sx={{
                            fontSize: { xs: "0.9rem", md: "1rem" },
                            color: "rgba(255, 255, 255, 0.8)",
                            textShadow: "0 1px 4px rgba(0, 0, 0, 0.3)",
                            lineHeight: 1.6,
                          }}
                        >
                          {option.description}
                        </Typography>

                        {selectedRole === option.value && loading && (
                          <Typography
                            variant="caption"
                            sx={{
                              mt: 2,
                              color: "white",
                              fontWeight: 500,
                              textShadow: "0 1px 4px rgba(0, 0, 0, 0.4)",
                              animation: "pulse 1.5s ease-in-out infinite",
                              "@keyframes pulse": {
                                "0%, 100%": { opacity: 1 },
                                "50%": { opacity: 0.6 },
                              },
                            }}
                          >
                            {t("common.processing") || "처리 중..."}
                          </Typography>
                        )}
                      </Stack>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Fade>
            </Grid>
          ))}
        </Grid>
      </Stack>
    </Box>
  );
};
