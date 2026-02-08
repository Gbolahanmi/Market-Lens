import Image from "next/image";
import Link from "next/link";
import React from "react";
import NavItems from "./NavItems";
import { UserDropdown } from "./UserDropdown";

export const Header: React.FC<{
  user: { id: string; email: string; name: string };
}> = ({ user }) => {
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
          <NavItems />
        </nav>
        {/* userDropdown */}
        <UserDropdown user={user} />
      </div>
    </header>
  );
};

export default Header;
