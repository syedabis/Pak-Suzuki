import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { LoginScreen } from "@/screens/LoginScreen";
import { RegisterScreen } from "@/screens/RegisterScreen";
import { MainAppScreen } from "@/screens/MainAppScreen";

export default function IndexPage() {
  const { isAuthenticated } = useApp();
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  if (!isAuthenticated) {
    if (authMode === "register") {
      return <RegisterScreen onNavigateLogin={() => setAuthMode("login")} />;
    }
    return <LoginScreen onNavigateRegister={() => setAuthMode("register")} />;
  }

  return <MainAppScreen />;
}
