"use client";

import React from "react";
import { Box } from "@mui/material";
import { useRouter } from "next/navigation";
import { ChatPage } from "@/components/chat/ChatPage";
import { useAuth } from "@/hooks/useAuth";

export default function Chat() {
  const router = useRouter();
  const { user } = useAuth();

  const handleProfileClick = () => {
    router.push("/profile");
  };

  if (!user) {
    return null;
  }

  return (
    <Box sx={{ flex: 1, overflow: "hidden" }}>
      <ChatPage user={user} onProfileClick={handleProfileClick} />
    </Box>
  );
}
