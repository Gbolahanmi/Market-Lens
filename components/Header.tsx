import Image from "next/image";
import Link from "next/link";
import React from "react";
import NavItems from "./NavItems";
import { UserDropdown } from "./UserDropdown";
import SearchCommand from "./SearchCommand";
import { searchStocks } from "@/lib/actions/finnhub.actions";

export async function Header({
  user,
}: {
  user: { id: string; email: string; name: string };
}) {
  const initialStocks = await searchStocks();
  return (
    <header className="sticky top-0 header">
      <div className="container header-wrapper">
        <Link href="/">
          <Image
            className="dark:invert"
            src="/logo.webp"
            alt="MarketLens Logo"
            width={32}
            height={32}
          />
        </Link>
        <nav className="hidden sm:block ">
          {/* NavItem */}
          <NavItems initialStocks={initialStocks} />
        </nav>
        {/* userDropdown */}
        <UserDropdown user={user} initialStocks={initialStocks} />
      </div>
    </header>
  );
}

export default Header;
