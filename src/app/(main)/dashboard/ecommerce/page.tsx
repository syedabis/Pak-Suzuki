import { permanentRedirect } from "next/navigation";

export default function EcommerceRedirectPage() {
  permanentRedirect("/dashboard/campaign-overview");
}
