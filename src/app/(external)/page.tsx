import { redirect } from "next/navigation";

import { getCurrentUser } from "@/server/auth-actions";

export default async function Home() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth/v1/login");
  }
  redirect("/dashboard/campaign-overview");
}
