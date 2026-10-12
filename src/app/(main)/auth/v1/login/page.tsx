import Image from "next/image";
import Link from "next/link";

import type { Metadata } from "next";

import { LoginForm } from "../../_components/login-form";
import { GoogleButton } from "../../_components/social-auth/google-button";

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
        <div className="w-full max-w-md space-y-10 py-24 lg:py-32">
          <div className="space-y-4 text-center">
            <div className="font-medium tracking-tight">Login</div>
            <div className="mx-auto max-w-xl text-muted-foreground">
              Welcome back. Enter your email and password, let&apos;s hope you remember them this time.
            </div>
          </div>
          <div className="space-y-4">
            <LoginForm />
            <GoogleButton className="w-full" variant="outline" />
            <p className="text-center text-muted-foreground text-xs">
              Don&apos;t have an account?{" "}
              <Link prefetch={false} href="register" className="text-primary">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
