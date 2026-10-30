import type { Metadata } from "next";

import { Users } from "./_components/users";

export const metadata: Metadata = {
  title: "Supervisors & User Management | Pak Suzuki OpsPulse",
  description: "Manage supervisors, territory assignments, and mobile login credentials for Pak Suzuki Caravan 2026.",
  alternates: {
    canonical: "/dashboard/users",
  },
};

export default function Page() {
  return <Users />;
}
