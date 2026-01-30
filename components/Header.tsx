import Image from "next/image";
import Link from "next/link";
import React from "react";
import NavItems from "./NavItems";
import { UserDropdown } from "./UserDropdown";

export const Header: React.FC = () => {
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
            // className=" bg-red-800"
          />
        </Link>
        <nav className="hidden sm:block ">
          {/* NavItem */}
          <NavItems />
        </nav>
        {/* userDropdown */}
        <UserDropdown />
      </div>
    </header>
  );
};

export default Header;
