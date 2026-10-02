import type { PermissionAction, PermissionModule } from "@prisma/client";
import type { UserWithPermissions } from "@/lib/auth/permissions";

const viewableModules: PermissionModule[] = [
  "CUSTOMERS",
  "INQUIRIES",
  "PRODUCTS",
  "QUOTATIONS",
  "ORDERS",
  "PAYMENTS",
  "DELIVERIES",
  "DOCUMENTS",
  "SALES_HISTORY",
  "CATALOGUE"
];

const extraPermissions: Array<{
  module: PermissionModule;
  action: PermissionAction;
}> = [
  { module: "QUOTATIONS", action: "EXPORT" },
  { module: "DOCUMENTS", action: "EXPORT" }
];

export function getPortfolioDemoUser(): UserWithPermissions {
  const timestamp = new Date(0);

  return {
    id: "00000000-0000-4000-8000-000000000001",
    authUserId: "00000000-0000-4000-8000-000000000002",
    email: "portfolio-demo@furniture-odyssey.local",
    displayName: "Portfolio Demo",
    role: "STAFF",
    status: "ACTIVE",
    canLinkGoogleCalendar: false,
    phone: null,
    invitedById: null,
    invitedAt: null,
    createdAt: timestamp,
    updatedAt: timestamp,
    permissions: [
      ...viewableModules.map((module) => ({
        module,
        action: "VIEW" as PermissionAction,
        allowed: true
      })),
      ...extraPermissions.map(({ module, action }) => ({
        module,
        action,
        allowed: true
      }))
    ]
  };
}
