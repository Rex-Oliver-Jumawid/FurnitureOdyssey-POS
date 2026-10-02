import { unstable_cache } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { prisma } from "@/lib/prisma";

const REFERENCE_REVALIDATE_SECONDS = 60;

export const getActiveStaffOptions = unstable_cache(
  async () =>
    prisma.userProfile.findMany({
      where: { status: "ACTIVE" },
      orderBy: { displayName: "asc" },
      select: { id: true, displayName: true }
    }),
  ["active-staff-options-v1"],
  { revalidate: REFERENCE_REVALIDATE_SECONDS, tags: [CACHE_TAGS.activeStaff] }
);

export const getDeliveryStaffOptions = unstable_cache(
  async () =>
    prisma.userProfile.findMany({
      where: {
        status: "ACTIVE",
        role: { in: ["ADMIN", "STAFF"] },
        OR: [
          { role: "ADMIN" },
          {
            permissions: {
              some: {
                module: "DELIVERIES",
                action: { in: ["VIEW", "CREATE", "UPDATE"] },
                allowed: true
              }
            }
          }
        ]
      },
      orderBy: { displayName: "asc" },
      select: { id: true, displayName: true }
    }),
  ["delivery-staff-options-v1"],
  { revalidate: REFERENCE_REVALIDATE_SECONDS, tags: [CACHE_TAGS.deliveryStaff] }
);

export const getActiveCustomerOptions = unstable_cache(
  async () =>
    prisma.customer.findMany({
      where: { archivedAt: null },
      orderBy: { displayName: "asc" },
      select: {
        id: true,
        displayName: true,
        companyName: true,
        contacts: {
          orderBy: [{ isPrimary: "desc" }, { createdAt: "asc" }],
          take: 1,
          select: { type: true, value: true }
        }
      }
    }),
  ["active-customer-options-v1"],
  { revalidate: REFERENCE_REVALIDATE_SECONDS, tags: [CACHE_TAGS.customerOptions] }
);

export const getActiveProductOptions = unstable_cache(
  async () => {
    const products = await prisma.product.findMany({
      where: { status: "ACTIVE" },
      orderBy: { name: "asc" },
      select: {
        id: true,
        code: true,
        name: true,
        category: true,
        description: true,
        specifications: true,
        referencePrice: true,
        referenceCost: true,
        images: {
          where: { colorVariantId: null },
          orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }],
          take: 1,
          select: {
            id: true,
            cloudinaryPublicId: true,
            secureUrl: true,
            resourceType: true,
            format: true,
            width: true,
            height: true,
            bytes: true,
            altText: true
          }
        },
        colorVariants: {
          where: { isActive: true },
          orderBy: { sortOrder: "asc" },
          select: {
            id: true,
            name: true,
            hex: true,
            images: {
              orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }],
              take: 1,
              select: {
                id: true,
                cloudinaryPublicId: true,
                secureUrl: true,
                resourceType: true,
                format: true,
                width: true,
                height: true,
                bytes: true,
                altText: true
              }
            }
          }
        }
      }
    });

    return products.map((product) => ({
      ...product,
      referencePrice: product.referencePrice !== null ? Number(product.referencePrice) : null,
      referenceCost: product.referenceCost !== null ? Number(product.referenceCost) : null
    }));
  },
  ["active-product-options-v1"],
  { revalidate: REFERENCE_REVALIDATE_SECONDS, tags: [CACHE_TAGS.productOptions] }
);

export const getProductTagOptions = unstable_cache(
  async () =>
    prisma.tag.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        _count: { select: { products: true } }
      }
    }),
  ["product-tag-options-v1"],
  { revalidate: REFERENCE_REVALIDATE_SECONDS, tags: [CACHE_TAGS.productTags] }
);
