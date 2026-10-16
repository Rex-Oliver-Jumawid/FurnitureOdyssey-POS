// Quotation item images are saved as Cloudinary URLs, but React-PDF cannot
// reliably decode every Cloudinary format or fetch remote images during rendering.
// Resolve them to a small PNG data URI before passing them to the PDF document.

type ImageCandidate = {
  secureUrl: string;
  isPrimary: boolean;
  sortOrder: number;
  colorVariantId?: string | null;
};

function firstImage(images: ImageCandidate[]) {
  return [...images]
    .filter((image) => image.secureUrl.trim())
    .sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary) || a.sortOrder - b.sortOrder)[0];
}

export function quotationItemImageUrl(
  snapshotImages: ImageCandidate[],
  catalogImages: ImageCandidate[],
  selectedVariantId?: string | null
): string | null {
  // A saved snapshot must always win over the mutable live product catalog.
  const snapshot = firstImage(snapshotImages);
  if (snapshot) {
    return snapshot.secureUrl;
  }

  // Legacy quotations can have a product ID without a saved item image.
  // Use the selected variant when possible, then the general product image.
  const variantImage = selectedVariantId
    ? firstImage(catalogImages.filter((image) => image.colorVariantId === selectedVariantId))
    : null;
  const generalImage = firstImage(catalogImages.filter((image) => !image.colorVariantId));

  return (variantImage ?? generalImage)?.secureUrl ?? null;
}

export function cloudinaryPdfImageUrl(secureUrl: string): string | null {
  try {
    const url = new URL(secureUrl);
    if (url.protocol !== "https:" || url.hostname !== "res.cloudinary.com") {
      return null;
    }

    const uploadPath = "/image/upload/";
    if (!url.pathname.includes(uploadPath)) {
      return null;
    }

    // Request a format React-PDF supports, without changing the saved original.
    url.pathname = url.pathname.replace(uploadPath, `${uploadPath}f_png,c_limit,w_320,h_320/`);
    url.search = "";
    url.hash = "";
    return url.toString();
  } catch {
    return null;
  }
}

const maxPdfImageBytes = 4 * 1024 * 1024;

export async function inlinePdfItemImage(
  secureUrl: string | null | undefined,
  fetchImage: typeof fetch = fetch
): Promise<string | null> {
  if (!secureUrl) {
    return null;
  }

  if (/^data:image\/(png|jpeg);base64,[A-Za-z0-9+/=]+$/i.test(secureUrl)) {
    return secureUrl;
  }

  const imageUrl = cloudinaryPdfImageUrl(secureUrl);
  if (!imageUrl) {
    return null;
  }

  try {
    const response = await fetchImage(imageUrl, {
      cache: "force-cache",
      redirect: "error",
      signal: AbortSignal.timeout(6000)
    });

    if (!response.ok) {
      return null;
    }

    const mime = response.headers.get("content-type")?.split(";")[0]?.trim().toLowerCase();
    if (mime !== "image/png" && mime !== "image/jpeg") {
      return null;
    }

    const length = Number(response.headers.get("content-length"));
    if (Number.isFinite(length) && length > maxPdfImageBytes) {
      return null;
    }

    const bytes = await response.arrayBuffer();
    if (!bytes.byteLength || bytes.byteLength > maxPdfImageBytes) {
      return null;
    }

    return `data:${mime};base64,${Buffer.from(bytes).toString("base64")}`;
  } catch {
    // Missing or inaccessible images must not make quotations undownloadable.
    return null;
  }
}

export async function quotationPdfItemImages(urls: Array<string | null>): Promise<Array<string | null>> {
  const cache = new Map<string, Promise<string | null>>();
  return Promise.all(
    urls.map((url) => {
      if (!url) {
        return Promise.resolve(null);
      }

      if (!cache.has(url)) {
        cache.set(url, inlinePdfItemImage(url));
      }

      return cache.get(url)!;
    })
  );
}
