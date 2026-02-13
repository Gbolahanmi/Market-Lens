"use client";

import React from "react";
import { NAV_ITEMS } from "@/lib/constants";
import { usePathname } from "next/navigation";
import Link from "next/link";
import SearchCommand from "./SearchCommand";

export const NavItems: React.FC<{
  initialStocks: StockWithWatchlistStatus[];
}> = ({ initialStocks }) => {
  const pathname = usePathname();
  const activeItem =
    pathname === "/" ? "/" : `/${pathname.split("/")[1] || ""}` || "/";
  return (
    <ul className="flex flex-col sm:flex-row gap-3 sm:gap-10 font-medium">
      {NAV_ITEMS.map((item) => {
        if (item.label === "Search")
          return (
            <li key={"search-trigger"}>
              <SearchCommand
                renderAs="text"
                label="Search"
                initialStocks={initialStocks}
              />
            </li>
          );
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`hover:text-yellow-500 transition-colors  ${activeItem === item.href ? "text-gray-100" : ""}`}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

{
  /* <button
  onClick={() => {
    <SearchCommand />;
  }}
  key={"search-trigger"}
>
  🔍
</button>; */
}

export default NavItems;
