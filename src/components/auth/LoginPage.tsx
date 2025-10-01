"use client";

import React from "react";
import { Box, Container, Typography, Grid, Stack, Fade } from "@mui/material";
import { useTranslation } from "@/hooks/useTranslation";
import { VideoBackground } from "@/components/common/VideoBackground";
import { LanguageSelector } from "@/components/common/LanguageSelector";
import { OAuthButtons } from "./OAuthButtons";
import { OAuthProvider } from "@/types";

interface LoginPageProps {
  onOAuthLogin: (provider: OAuthProvider) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onOAuthLogin }) => {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <VideoBackground videoSrc="/background.mp4" overlayOpacity={0.6} />

      <Box
        sx={{
          position: "absolute",
          top: 20,
          right: 20,
          zIndex: 10,
        }}
      >
        <LanguageSelector variant="glassmorphism" />
      </Box>

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Fade in timeout={800}>
          <Grid
            container
            spacing={0}
            sx={{
              backdropFilter: "blur(10px)",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              borderRadius: 4,
              overflow: "hidden",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
            }}
          >
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                p: { xs: 4, md: 6 },
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                borderRight: {
                  xs: "none",
                  md: "1px solid rgba(255, 255, 255, 0.2)",
                },
              }}
            >
              <Stack spacing={3}>
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: "1.8rem", md: "2.3rem", lg: "2.8rem" },
                    fontWeight: 700,
                    color: "white",
                    textShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
                    lineHeight: 1.2,
                  }}
                >
                  🗺️ {t("service.name")}
                </Typography>

                <Typography
                  variant="h2"
                  sx={{
                    fontSize: { xs: "1.25rem", md: "1.5rem" },
                    fontWeight: 600,
                    color: "rgba(255, 255, 255, 0.95)",
                    textShadow: "0 2px 8px rgba(0, 0, 0, 0.4)",
                  }}
                >
                  {t("service.slogan")}
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    fontSize: { xs: "0.95rem", md: "1rem" },
                    color: "rgba(255, 255, 255, 0.85)",
                    lineHeight: 1.6,
                    textShadow: "0 1px 4px rgba(0, 0, 0, 0.3)",
                  }}
                >
                  {t("service.description")}
                </Typography>
              </Stack>
            </Grid>

            <Grid
              item
              xs={12}
              md={6}
              sx={{
                p: { xs: 4, md: 6 },
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Stack
                spacing={3}
                sx={{
                  width: "100%",
                  maxWidth: 350,
                }}
              >
                <Typography
                  variant="h3"
                  sx={{
                    fontSize: { xs: "1.1rem", md: "1.3rem" },
                    fontWeight: 600,
                    color: "white",
                    textAlign: "center",
                    textShadow: "0 2px 8px rgba(0, 0, 0, 0.4)",
                    mb: 1,
                  }}
                >
                  {t("auth.loginGuide")}
                </Typography>

                <OAuthButtons onOAuthLogin={onOAuthLogin} />
              </Stack>
            </Grid>
          </Grid>
        </Fade>
      </Container>
    </Box>
  );
};
