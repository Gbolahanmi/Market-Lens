"use client";

import { Button } from "@/components/ui/button";
import { CircleUser, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useRouter } from "next/navigation";
import Avatar from "./ui/Avatar";
import NavItems from "./NavItems";

export function UserDropdown() {
  const router = useRouter();
  const handleLogout = () => {
    // Implement your logout logic here
    // For example, clear user session, tokens, etc.
    // After logout, redirect to the homepage or login page
    router.push("/sign-in");
  };
  const user = { name: "John Doe", email: "john.doe@example.com" }; // Replace with actual user data
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full gap-3 text-gray-400 hover:text-yellow-400"
        >
          <Avatar name={user.name} size="sm" />{" "}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="text-gray-400" align="center">
        <DropdownMenuLabel>
          {" "}
          <Avatar name={user.name} size="md" />{" "}
          <span className="text-base text-gray-400">{user.name}</span>
          <span className="text-sm text-gray-500 block">{user.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-600" />
        <DropdownMenuItem
          onClick={handleLogout}
          className="text-gray-100 text-md"
        >
          <LogOut className="h-4 w-4 mr-2 sm:block" /> Logout
        </DropdownMenuItem>
        <DropdownMenuSeparator className="hidden sm:block  bg-gray-600" />
        <nav className="sm:hidden">
          <NavItems />
        </nav>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
