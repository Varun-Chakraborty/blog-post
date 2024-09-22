import { Profile } from "@/types";

export function UserProfile({ profile }: Readonly<{ profile: Profile }>) {
  return JSON.stringify(profile);
}
