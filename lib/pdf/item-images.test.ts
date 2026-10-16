import assert from "node:assert/strict";
import { test } from "node:test";
import {
  cloudinaryPdfImageUrl,
  inlinePdfItemImage,
  quotationItemImageUrl
} from "@/lib/pdf/item-images";

const cloudinaryUrl = "https://res.cloudinary.com/sample-cloud/image/upload/v123/furniture/tolix-chair.webp";

test("PDF quotation images use saved item snapshots before any catalog changes", () => {
  const saved = [{ secureUrl: "https://res.cloudinary.com/example/image/upload/v1/saved.png", isPrimary: true, sortOrder: 0 }];
  const current = [{ secureUrl: cloudinaryUrl, colorVariantId: null, isPrimary: true, sortOrder: 0 }];
  assert.equal(quotationItemImageUrl(saved, current, null), saved[0].secureUrl);
});

test("PDF quotation images fall back to matching variant then general product images", () => {
  const catalog = [
    { secureUrl: "https://res.cloudinary.com/example/image/upload/v1/red.png", colorVariantId: "red", isPrimary: true, sortOrder: 0 },
    { secureUrl: "https://res.cloudinary.com/example/image/upload/v1/blue.png", colorVariantId: "blue", isPrimary: false, sortOrder: 1 },
    { secureUrl: cloudinaryUrl, colorVariantId: null, isPrimary: true, sortOrder: 2 }
  ];
  assert.equal(quotationItemImageUrl([], catalog, "blue"), catalog[1].secureUrl);
  assert.equal(quotationItemImageUrl([], catalog, "missing"), cloudinaryUrl);
  assert.equal(quotationItemImageUrl([], [], null), null);
});

test("PDF image URL uses Cloudinary PNG delivery and disallows untrusted hosts", () => {
  assert.equal(
    cloudinaryPdfImageUrl(cloudinaryUrl),
    "https://res.cloudinary.com/sample-cloud/image/upload/f_png,c_limit,w_320,h_320/v123/furniture/tolix-chair.webp"
  );
  assert.equal(cloudinaryPdfImageUrl("https://example.com/product.png"), null);
  assert.equal(cloudinaryPdfImageUrl("http://res.cloudinary.com/other/image/upload/test.png"), null);
  assert.equal(cloudinaryPdfImageUrl("https://res.cloudinary.com.evil.test/image/upload/test.png"), null);
});

test("PDF product images are inlined as renderable PNG data URIs", async () => {
  const tinyPng = "iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAIAAAAmkwkpAAAAEklEQVR4nGNkaGCAAyYGBmI4ABoEAIhjNExLAAAAAElFTkSuQmCC";
  let fetchedUrl = "";
  const mockFetch = (async (input: RequestInfo | URL) => {
    fetchedUrl = String(input);
    return new Response(Buffer.from(tinyPng, "base64"), {
      headers: { "content-type": "image/png" }
    });
  }) as typeof fetch;

  const inline = await inlinePdfItemImage(cloudinaryUrl, mockFetch);
  assert.match(fetchedUrl, /\/image\/upload\/f_png,/);
  assert.equal(inline, `data:image/png;base64,${tinyPng}`);
  assert.equal(await inlinePdfItemImage("https://example.com/image.png", mockFetch), null);
  assert.equal(await inlinePdfItemImage(`data:image/png;base64,${tinyPng}`, mockFetch), `data:image/png;base64,${tinyPng}`);
});
