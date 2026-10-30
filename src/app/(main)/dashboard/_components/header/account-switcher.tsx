"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { cn } from "cn";
import { BadgeCheck, Bell, Check, LogOut } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { UserSession } from "@/lib/auth/session";
import { getInitials } from "@/lib/utils";
import { logoutAction, switchAccountAction } from "@/server/auth-actions";

export function AccountSwitcher({
  users,
  currentUser,
}: {
  readonly users: ReadonlyArray<UserSession>;
  readonly currentUser?: UserSession;
}) {
  const router = useRouter();
  const [activeUser, setActiveUser] = useState<UserSession>(currentUser ?? users[0]);

  useEffect(() => {
    if (currentUser) {
      setActiveUser(currentUser);
    }
  }, [currentUser]);

  if (!activeUser) {
    return null;
  }

  const handleSwitchAccount = async (targetUser: UserSession) => {
    if (targetUser.id === activeUser.id) {
      return;
    }

    try {
      setActiveUser(targetUser);
      const res = await switchAccountAction(targetUser.email);
      if (res.success) {
        toast.success(`Switched account to ${targetUser.name}`);
        router.refresh();
      } else {
        toast.error(res.error ?? "Failed to switch account.");
      }
    } catch {
      toast.error("Failed to switch account.");
    }
  };

  const handleLogout = async () => {
    try {
      await logoutAction();
      toast.success("Logged out successfully");
      router.push("/login");
      router.refresh();
    } catch {
      toast.error("Failed to log out. Please try again.");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="size-8 cursor-pointer rounded-lg">
          <AvatarImage src={activeUser.avatar || undefined} alt={activeUser.name} />
          <AvatarFallback>{getInitials(activeUser.name)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-56 space-y-1 rounded-lg" side="bottom" align="end" sideOffset={4}>
        {users.map((user) => (
          <DropdownMenuItem
            key={user.email}
            className={cn("cursor-pointer p-0", user.id === activeUser.id && "bg-accent/50")}
            aria-current={user.id === activeUser.id ? "true" : undefined}
            onClick={() => handleSwitchAccount(user)}
          >
            <div className="flex w-full items-center gap-2 px-1 py-1.5">
              <Avatar className="size-9 rounded-lg">
                <AvatarImage src={user.avatar || undefined} alt={user.name} />
                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
              </Avatar>
              <div className="grid min-w-0 flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-muted-foreground text-xs capitalize">{user.role}</span>
              </div>
              <span
                className={cn(
                  "mr-1 flex size-5 items-center justify-center rounded-full text-primary opacity-0",
                  user.id === activeUser.id && "opacity-100",
                )}
              >
                <Check aria-hidden="true" />
              </span>
            </div>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/dashboard/profile")}>
            <BadgeCheck />
            Account Profile
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <Bell />
            Notifications
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive" onClick={handleLogout}>
          <LogOut />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
