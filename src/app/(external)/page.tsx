import { redirect } from "next/navigation";

import { getCurrentUser } from "@/server/auth-actions";

export default async function Home() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  redirect("/dashboard/campaign-overview");
}
