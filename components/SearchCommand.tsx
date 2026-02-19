"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Loader2, Star, TrendingUp } from "lucide-react";
import { searchStocks } from "@/lib/actions/finnhub.actions";
import { useDebounce } from "@/hooks/useDebounce";
import WatchlistButton from "./WatchlistButton";

export default function SearchCommand({
  renderAs = "button",
  label = "Search Stocks",
  initialStocks = [],
}: SearchCommandProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [stocks, setStocks] = useState<StockWithWatchlistStatus[]>(
    initialStocks || [],
  );

  const isSearchMode = !!searchTerm.trim();
  const displayStocks = isSearchMode
    ? stocks
    : stocks && stocks.length > 0
      ? stocks.slice(0, 10)
      : initialStocks?.slice(0, 10) || [];

  const handleSearch = useCallback(async () => {
    if (!isSearchMode) return setStocks(initialStocks);

    setLoading(true);
    try {
      console.log("🔍 Searching for:", searchTerm);
      const results = await searchStocks(searchTerm.trim());
      console.log("✅ Search results count:", results.length);
      setStocks(results);
    } catch (error) {
      console.error("❌ Search error:", error);
      setStocks([]);
    } finally {
      setLoading(false);
    }
  }, [isSearchMode, searchTerm, initialStocks]);

  const debouncedSearch = useDebounce(handleSearch, 300);

  useEffect(() => {
    if (open) {
      debouncedSearch();
    }
  }, [searchTerm, open]);

  const handleSelectStock = (symbol: string) => {
    console.log(`Selected stock: ${symbol}`);
    setOpen(false);
    setSearchTerm("");
    setStocks(initialStocks);
    router.push(`/stocks/${symbol}`);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      {renderAs === "button" ? (
        <button onClick={() => setOpen(true)} className="search-btn">
          {label}
        </button>
      ) : (
        <span onClick={() => setOpen(true)} className="search-text">
          {label}
        </span>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="search-dialog overflow-hidden p-0">
          <DialogTitle className="sr-only">Search Stocks</DialogTitle>
          <Command className="[&_[cmdk-input-wrapper]_svg]:hidden [&_[cmdk-input]]:border-0 [&_[cmdk-input]]:text-lg [&_[cmdk-input]]:focus-visible:ring-0">
            <CommandInput
              placeholder="Search stocks..."
              value={searchTerm}
              onValueChange={setSearchTerm}
              className=""
            />
            {loading && <Loader2 className="search-loader" />}
            <CommandList>
              {loading ? (
                <CommandEmpty className="search-list-empty">
                  Loading stocks...
                </CommandEmpty>
              ) : displayStocks?.length === 0 ? (
                <div className="search-list-indicator">
                  {isSearchMode ? "No results found" : "No stocks available"}
                </div>
              ) : (
                <CommandGroup
                  heading={`${isSearchMode ? "Search results" : "Popular stocks"} (${displayStocks?.length || 0})`}
                >
                  {displayStocks?.map((stock) => (
                    <CommandItem
                      key={stock.symbol}
                      value={stock.symbol}
                      onSelect={() => handleSelectStock(stock.symbol)}
                      className="cursor-pointer search-item"
                    >
                      <TrendingUp className="h-4 w-4 text-gray-500" />
                      <div className="flex-1">
                      <div className="search-item-name">{stock.name}</div>
                      <div className="text-sm text-gray-500">
                        {stock.symbol} | {stock.exchange} | {stock.type}
                      </div>
                      </div>
                      <WatchlistButton
                      symbol={stock.symbol}
                      company={stock.name}
                      isInWatchlist={stock.isInWatchlist ?? false}
                      type="icon"
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
          <div className="border-t border-gray-200 px-4 py-2 text-xs text-gray-500">
            <span className="rounded bg-gray-100 px-1 py-.5">Ctrl K</span> to
            toggle
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
