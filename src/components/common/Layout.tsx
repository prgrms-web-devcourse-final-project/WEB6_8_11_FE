"use client";

import React from "react";
import { Box, Container, AppBar, Toolbar } from "@mui/material";
import { LanguageSelector } from "./LanguageSelector";

interface LayoutProps {
  children: React.ReactNode;
  showLanguageSelector?: boolean;
  showNavigation?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  showLanguageSelector = false,
  showNavigation = false,
}) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {(showLanguageSelector || showNavigation) && (
        <AppBar position="static" color="transparent" elevation={0}>
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <Box />
            {showLanguageSelector && <LanguageSelector variant="default" />}
          </Toolbar>
        </AppBar>
      )}

      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {children}
      </Box>
    </Box>
  );
};
