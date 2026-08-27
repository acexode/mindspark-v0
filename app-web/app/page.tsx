import { redirect } from "next/navigation";
import { readProfile } from "@/lib/server/profile/store";

export default async function RootPage() {
  const profile = await readProfile();
  redirect(profile?.onboarded ? "/home" : "/onboarding");
}
