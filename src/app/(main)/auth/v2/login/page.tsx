import { Globe } from "lucide-react";
import type { Metadata } from "next";

import { APP_CONFIG } from "@/config/app-config";

import { LoginForm } from "../../_components/login-form";

export const metadata: Metadata = {
  title: "Meezan Oil - Portal Login",
  description: "Sign in to Meezan Oil Field Sales & Operations Dashboard",
  alternates: {
    canonical: "/auth/v2/login",
  },
};

export default function LoginV2() {
  return (
    <>
      <div className="mx-auto flex w-full flex-col justify-center space-y-8 sm:w-[350px]">
        <div className="space-y-2 text-center">
          <h1 className="font-semibold text-2xl">Staff & Agent Login</h1>
          <p className="text-muted-foreground text-sm">Please enter your credentials to proceed.</p>
        </div>
        <div>
          <LoginForm />
        </div>
      </div>

      <div className="absolute bottom-5 flex w-full justify-between px-10">
        <div className="text-sm">{APP_CONFIG.copyright}</div>
        <div className="flex items-center gap-1 text-sm">
          <Globe className="size-4 text-muted-foreground" />
          ENG
        </div>
      </div>
    </>
  );
}
