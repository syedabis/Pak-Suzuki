import Image from "next/image";

import type { Metadata } from "next";

import { LoginForm } from "../../_components/login-form";

export const metadata: Metadata = {
  title: "Meezan Oil - Staff & Field Agent Login",
  description: "Sign in to Meezan Oil Field Sales & Operations Dashboard",
  alternates: {
    canonical: "/auth/v1/login",
  },
};

export default function LoginV1() {
  return (
    <div className="flex h-dvh">
      <div className="hidden bg-primary lg:block lg:w-1/3">
        <div className="flex h-full flex-col items-center justify-center p-12 text-center">
          <div className="space-y-6">
            <div className="relative mx-auto h-16 w-36">
              <Image src="/meezan_logo.png" alt="Meezan Oil" fill className="object-contain" priority />
            </div>
            <div className="space-y-2">
              <h1 className="font-light text-5xl text-primary-foreground">Meezan Oil</h1>
              <p className="text-primary-foreground/80 text-xl">Field Sales Portal</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex w-full items-center justify-center bg-background p-8 lg:w-2/3">
        <div className="w-full max-w-md space-y-8 py-24 lg:py-32">
          <div className="space-y-2 text-center">
            <h2 className="font-semibold text-2xl tracking-tight">Staff & Agent Sign In</h2>
            <p className="mx-auto max-w-xl text-muted-foreground text-sm">
              Enter your authorized email and password to access the field sales operations system.
            </p>
          </div>
          <div>
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
