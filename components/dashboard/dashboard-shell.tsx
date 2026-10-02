import Image from "next/image";
import { LogOut } from "lucide-react";
import type { PermissionModule } from "@prisma/client";
import { signOut } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { PortfolioReturnLink } from "@/components/dashboard/portfolio-return-link";
import { dashboardNavItems } from "@/lib/auth/navigation";
import { canAccessUsersPage } from "@/lib/auth/calendar-access";
import { canViewModule, type UserWithPermissions } from "@/lib/auth/permissions";
import { isPortfolioDemoMode } from "@/lib/demo-mode";

type DashboardShellProps = {
  user: UserWithPermissions;
  children: React.ReactNode;
};

export function DashboardShell({ user, children }: DashboardShellProps) {
  const portfolioDemoMode = isPortfolioDemoMode();
  const visibleItems = dashboardNavItems.filter((item) => {
    if (item.href === "/users") {
      return canAccessUsersPage(user);
    }

    if (item.href === "/dashboard") {
      return true;
    }

    return canViewModule(user, item.module as PermissionModule);
  });

  return (
    <div className="min-h-dvh bg-background text-foreground lg:grid lg:grid-cols-[236px_minmax(0,1fr)] xl:grid-cols-[256px_minmax(0,1fr)] 2xl:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="border-b border-border bg-panel lg:sticky lg:top-0 lg:h-dvh lg:overflow-y-auto lg:border-b-0 lg:border-r">
        <div className="flex min-h-16 items-center gap-3 border-b border-border px-4 xl:min-h-20 xl:px-5">
          <Image
            src="/fo-logo.png"
            alt="Furniture Odyssey logo"
            width={44}
            height={44}
            className="h-10 w-10 rounded-xl border border-border object-cover xl:h-11 xl:w-11"
          />
          <div>
            <p className="text-base font-semibold leading-5">Furniture Odyssey</p>
            <p className="studio-kicker mt-1">Sales Studio</p>
          </div>
        </div>
        <DashboardNav allowedHrefs={visibleItems.map((item) => item.href)} />
      </aside>
      <div className="min-w-0">
        <header className="sticky top-0 z-30 flex min-h-14 items-center justify-between border-b border-border bg-panel px-4 sm:px-5 lg:px-6 xl:min-h-16 xl:px-8">
          <div>
            <p className="text-sm font-medium">{user.displayName}</p>
            <p className="text-xs text-muted-foreground">
              {portfolioDemoMode ? "Read-only portfolio access" : user.role}
            </p>
          </div>
          {portfolioDemoMode ? (
            <div className="flex items-center gap-2">
              <PortfolioReturnLink />
              <span className="rounded-full border border-border bg-muted/55 px-3 py-1 text-xs font-medium text-muted-foreground">
                Demo mode
              </span>
            </div>
          ) : (
            <form action={signOut}>
              <Button type="submit" variant="secondary">
                <LogOut className="h-4 w-4" />
                Sign out
              </Button>
            </form>
          )}
        </header>
        <main className="min-w-0 px-4 py-5 sm:px-5 lg:px-6 lg:py-6 xl:px-8">{children}</main>
      </div>
    </div>
  );
}
