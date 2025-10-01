"use client";

import { AuthGuard } from "@/components/auth/AuthGuard";
import { Header } from "@/components/common/Header";
import { useAuth } from "@/hooks/useAuth";
import { Box } from "@mui/material";
import { useRouter } from "next/navigation";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user } = useAuth();

  const handleProfileClick = () => {
    router.push("/profile");
  };

  return (
    <AuthGuard>
      <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
        <Header
          user={user}
          onProfileClick={handleProfileClick}
          variant="chat"
        />
        {children}
      </Box>
    </AuthGuard>
  );
}
