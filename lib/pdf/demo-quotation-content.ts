import type { PdfPaymentTermsBlock } from "@/lib/pdf/types";

// Keep placeholder payment details confined to generated PDFs for seeded demo quotations.
export const demoQuotationPaymentTerms: PdfPaymentTermsBlock = {
  policyTitle: "Payment Policy and Delivery Options",
  policyBullets: [
    "Sample policy: A 50% deposit may be required to reserve an order.",
    "Sample lead time: 10-15 business days, subject to product availability."
  ],
  highlightNote: "DEMO ONLY - The policies and payment details below are examples, not valid transaction instructions.",
  bankDetailsTitle: "BANK DETAILS (SAMPLE ONLY)",
  bankDetailsLines: [
    "Example Bank - Demo Branch",
    "Account Name: SAMPLE FURNITURE STORE",
    "Account No.: 0000 0000 0000 (not a valid account)"
  ]
};

export function isDemoQuotationFilename(filename: string) {
  return /(?:^|[-_])DEMO(?:[-_.]|$)/i.test(filename);
}
