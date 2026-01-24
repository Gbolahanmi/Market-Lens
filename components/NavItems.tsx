"use client";

import React from "react";
import { NAV_ITEMS } from "@/lib/constants";
import { usePathname } from "next/navigation";
import Link from "next/link";

export const NavItems: React.FC = () => {
  const pathname = usePathname();
  const activeItem =
        pathname === "/" ? "/" : `/${pathname.split("/")[1] || ""}` || "/";
  return (

    <ul className="flex flex-col sm:flex-row gap-3 sm:gap-10 font-medium">
      {NAV_ITEMS.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            className={`hover:text-yellow-500 transition-colors  ${activeItem === item.href ? "text-gray-100" : ""}`}
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default NavItems;
