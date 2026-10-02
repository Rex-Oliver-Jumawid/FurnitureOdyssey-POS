"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Route } from "next";
import { dashboardNavItems } from "@/lib/auth/navigation";
import { cn } from "@/lib/utils";

type DashboardNavProps = {
  allowedHrefs: Route[];
};

export function DashboardNav({ allowedHrefs }: DashboardNavProps) {
  const pathname = usePathname();
  const visibleItems = dashboardNavItems.filter((item) => allowedHrefs.includes(item.href));

  return (
    <nav className="flex gap-1 overflow-x-auto px-3 py-3 lg:block lg:space-y-1 lg:overflow-visible lg:px-2 lg:py-2 xl:space-y-1.5 xl:px-3 xl:py-3">
      {visibleItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "inline-flex min-h-10 shrink-0 items-center gap-3 rounded-lg px-3 text-sm font-medium transition lg:flex lg:min-h-9 lg:gap-2.5 lg:px-2.5 xl:min-h-10 xl:gap-3 xl:px-3",
              isActive
                ? "bg-soft-accent text-foreground ring-1 ring-border"
                : "text-muted-foreground hover:bg-muted/55 hover:text-foreground"
            )}
          >
            <Icon className={cn("h-4 w-4", isActive ? "text-accent" : undefined)} />
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}
