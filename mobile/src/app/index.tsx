import React from "react";
import { useApp } from "@/context/AppContext";
import { LoginScreen } from "@/screens/LoginScreen";
import { MainAppScreen } from "@/screens/MainAppScreen";

export default function IndexPage() {
  const { isAuthenticated } = useApp();

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return <MainAppScreen />;
}
