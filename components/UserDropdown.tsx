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
import { signOut } from "@/lib/actions/auth.actions";

export function UserDropdown({
  user,
  initialStocks,
}: {
  user: { id: string; email: string; name: string };
  initialStocks: StockWithWatchlistStatus[];
}) {
  const router = useRouter();
  const handleLogout = async () => {
    await signOut();
    router.push("/signin");
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full gap-3 text-gray-400 hover:text-yellow-400"
        >
          <Avatar name={user.name} size="md" />{" "}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="text-gray-400" align="center">
        <DropdownMenuLabel>
          <div className="flex relative items-center gap-3 py-2">
            <Avatar name={user.name} size="md" />{" "}
            <div className="flex flex-col leading-tight">
              <span className="text-base text-gray-400">{user.name}</span>
              <span className="text-sm text-gray-500 block">{user.email}</span>
            </div>
          </div>{" "}
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
          <NavItems initialStocks={initialStocks} />
        </nav>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
