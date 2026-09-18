"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import { useState, useTransition } from "react";

interface BrowseFiltersProps {
  initialQuery: string;
  initialSort: string;
  initialFilter: string;
}

export default function BrowseFilters({
  initialQuery,
  initialSort,
  initialFilter,
}: BrowseFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [query, setQuery] = useState(initialQuery);

  function updateParams(newParams: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    updateParams({ q: query || null });
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4 card-shadow space-y-4 md:space-y-0 md:flex md:items-center md:justify-between md:gap-4">
      {/* Search Input */}
      <form onSubmit={handleSearchSubmit} className="flex-1 relative">
        <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title, author, description..."
          className="w-full pl-9 pr-4 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground"
        />
      </form>

      {/* Filters & Sort */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Format Filter */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Format:</span>
        </div>

        <select
          value={initialFilter}
          onChange={(e) => updateParams({ filter: e.target.value === "all" ? null : e.target.value })}
          className="px-3 py-1.5 text-xs bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
        >
          <option value="all">All Books</option>
          <option value="readable">Readable Online (PDF)</option>
          <option value="purchasable">Available to Buy</option>
        </select>

        {/* Sort */}
        <span className="text-xs text-muted-foreground hidden sm:inline">Sort:</span>
        <select
          value={initialSort}
          onChange={(e) => updateParams({ sort: e.target.value })}
          className="px-3 py-1.5 text-xs bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
        >
          <option value="newest">Newest First</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="title-asc">Title: A–Z</option>
        </select>
      </div>
    </div>
  );
}
