"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { initials } from "@/lib/format";
import { cn } from "@/lib/utils";

/** Gradient-initials avatar with an optional "online" dot. */
export function UserAvatar({ profile, className, dot = false, dotRingClassName = "ring-background" }) {
  const name = profile?.full_name || profile?.email || "";
  return (
    <span className={cn("relative inline-flex shrink-0", className)}>
      <Avatar className="h-full w-full">
        {profile?.avatar_url && <AvatarImage src={profile.avatar_url} alt="" />}
        <AvatarFallback>{initials(name)}</AvatarFallback>
      </Avatar>
      {dot && (
        <span
          aria-hidden
          className={cn("absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-success ring-2", dotRingClassName)}
        />
      )}
    </span>
  );
}
