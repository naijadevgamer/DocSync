"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, Loader2, User } from "lucide-react";

interface HomeDesktopNavProps {
  user: User | null;
  onLogout: () => void;
  isLogoutLoading: boolean;
}

export default function HomeDesktopNav({
  user,
  onLogout,
  isLogoutLoading,
}: HomeDesktopNavProps) {
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleMouseMove = (e: React.MouseEvent, index: number) => {
    const button = buttonRefs.current[index];
    if (!button) return;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    button.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
  };

  const handleMouseLeave = (index: number) => {
    const button = buttonRefs.current[index];
    if (button) {
      button.style.transform = "translate(0px, 0px)";
    }
  };

  return (
    <div className="hidden items-center gap-4 md:flex">
      {user ? (
        <>
          <Link
            href={`/patients/${user.$id}/dashboard`}
            className="text-dark-600 hover:bg-dark-500/70 rounded-full px-6 py-2 text-sm transition-colors hover:text-white"
          >
            Dashboard
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative size-9 rounded-full">
                <Avatar className="bg-dark-500/70 size-9 border-2 border-white/40 transition-colors hover:border-green-500 hover:text-green-500">
                  <AvatarImage
                    src={"/placeholder-avatar.png"}
                    alt={user?.name || "User"}
                  />
                  <AvatarFallback>
                    <User />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56 border-white/10 bg-[#1A1D20] text-white"
              align="end"
              forceMount
            >
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm leading-none font-medium">
                    {user?.name || "User"}
                  </p>
                  <p className="text-xs leading-none text-gray-400">
                    {user?.email || "user@example.com"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />

              <DropdownMenuItem
                onClick={onLogout}
                className={`${isLogoutLoading ? "animate-pulse" : ""} cursor-pointer text-red-400 hover:bg-white/5 hover:text-red-300`}
                disabled={isLogoutLoading}
              >
                {isLogoutLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <LogOut className="mr-2 h-4 w-4" />
                )}
                {isLogoutLoading ? "Logging out..." : "Log out"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      ) : (
        <>
          <Button
            asChild
            variant="ghost"
            className="text-14-medium text-white/60 hover:text-white"
          >
            <Link href="/login">Sign In</Link>
          </Button>
          <Button
            asChild
            ref={(el) => {
              buttonRefs.current[0] = el;
            }}
            onMouseMove={(e) => handleMouseMove(e, 0)}
            onMouseLeave={() => handleMouseLeave(0)}
            className="text-14-medium relative overflow-hidden rounded-full bg-emerald-500 px-6! py-2! font-medium text-black transition-all hover:bg-emerald-400"
            style={{ transition: "transform 0.2s ease" }}
          >
            <Link href="/register">Get Started</Link>
          </Button>
        </>
      )}
    </div>
  );
}
