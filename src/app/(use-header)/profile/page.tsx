"use client";

import React from "react";
import { Box } from "@mui/material";
import { useRouter } from "next/navigation";
import { ProfilePage } from "@/components/profile/ProfilePage";
import { Header } from "@/components/common/Header";
import { useAuth } from "@/hooks/useAuth";

export default function Profile() {
  const router = useRouter();
  const { user, logout, deleteAccount } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleDeleteAccount = async () => {
    await deleteAccount();
    router.push("/login");
  };

  const handleBack = () => {
    router.back();
  };

  if (!user) {
    return null;
  }

  return (
    <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <ProfilePage
        user={user}
        onLogout={handleLogout}
        onDeleteAccount={handleDeleteAccount}
        onBack={handleBack}
      />
    </Box>
  );
}
