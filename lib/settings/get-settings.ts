import type { Prisma } from "@prisma/client";
import { revalidateTag, unstable_cache } from "next/cache";
import { companyProfile } from "@/lib/config/company-profile";
import { prisma } from "@/lib/prisma";
import { CACHE_TAGS } from "@/lib/cache-tags";
import {
  appSettingsSchema,
  companyProfileSettingsSchema,
  documentSettingsSchema,
  paymentSettingsSchema,
  type AppSettingsInput,
  type CompanyProfileSettingsInput,
  type DocumentSettingsInput,
  type PaymentSettingsInput
} from "@/lib/validation/settings";

export const APP_SETTINGS_KEY = "app.settings";

export const defaultCompanyProfileSettings: CompanyProfileSettingsInput =
  companyProfileSettingsSchema.parse({
    companyName: companyProfile.name,
    registeredName: companyProfile.registeredName,
    address: companyProfile.address,
    contactNumber: companyProfile.contactNumber,
    email: companyProfile.email,
    facebookPage: companyProfile.facebookPage,
    websiteUrl: companyProfile.websiteUrl,
    logoUrl: companyProfile.logoUrl,
    logoAltText: companyProfile.logoAltText
  });

export const defaultPaymentSettings: PaymentSettingsInput = paymentSettingsSchema.parse({
  defaultPaymentInstructions: companyProfile.defaultPaymentInstructions,
  bankDetails: companyProfile.bankDetails,
  eWalletDetails: companyProfile.eWalletDetails,
  otherPaymentNotes: companyProfile.otherPaymentNotes,
  mopScript: companyProfile.mopScript,
  pdfPaymentPolicyTitle: companyProfile.pdfPaymentPolicyTitle,
  pdfPaymentPolicyBullets: companyProfile.pdfPaymentPolicyBullets,
  pdfPaymentHighlightNote: companyProfile.pdfPaymentHighlightNote,
  pdfBankDetailsTitle: companyProfile.pdfBankDetailsTitle,
  pdfBankDetails: companyProfile.pdfBankDetails,
  pdfPaymentReceiptTermsTitle: companyProfile.pdfPaymentReceiptTermsTitle,
  pdfPaymentReceiptTerms: companyProfile.pdfPaymentReceiptTerms,
  pdfDeliveryReceiptTermsTitle: companyProfile.pdfDeliveryReceiptTermsTitle,
  pdfDeliveryReceiptTerms: companyProfile.pdfDeliveryReceiptTerms
});

export const defaultDocumentSettings: DocumentSettingsInput = documentSettingsSchema.parse({
  quotationFooter: companyProfile.quotationFooter,
  invoiceFooter: companyProfile.invoiceFooter,
  paymentReceiptFooter: companyProfile.paymentReceiptFooter,
  deliveryReceiptFooter: companyProfile.deliveryReceiptFooter,
  finalSummaryFooter: companyProfile.finalSummaryFooter,
  quotationPrefix: companyProfile.quotationPrefix,
  orderPrefix: companyProfile.orderPrefix,
  invoicePrefix: companyProfile.invoicePrefix,
  paymentReceiptPrefix: companyProfile.paymentReceiptPrefix,
  deliveryReceiptPrefix: companyProfile.deliveryReceiptPrefix,
  finalSummaryPrefix: companyProfile.finalSummaryPrefix
});

export const defaultAppSettings: AppSettingsInput = {
  companyProfile: defaultCompanyProfileSettings,
  payment: defaultPaymentSettings,
  documents: defaultDocumentSettings
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function normalizeAppSettings(value: unknown): AppSettingsInput {
  const record = isRecord(value) ? value : {};

  return appSettingsSchema.parse({
    companyProfile: {
      ...defaultAppSettings.companyProfile,
      ...(isRecord(record.companyProfile) ? record.companyProfile : {})
    },
    payment: {
      ...defaultAppSettings.payment,
      ...(isRecord(record.payment) ? record.payment : {})
    },
    documents: {
      ...defaultAppSettings.documents,
      ...(isRecord(record.documents) ? record.documents : {})
    }
  });
}

const getCachedAppSettings = unstable_cache(
  async () => {
    const setting = await prisma.appSetting.findUnique({
      where: {
        key: APP_SETTINGS_KEY
      }
    });

    return normalizeAppSettings(setting?.value);
  },
  ["app-settings-v1"],
  {
    revalidate: 300,
    tags: [CACHE_TAGS.appSettings]
  }
);

export async function getAppSettings() {
  return getCachedAppSettings();
}

export async function saveAppSettings(settings: AppSettingsInput, updatedById: string) {
  const saved = await prisma.appSetting.upsert({
    where: {
      key: APP_SETTINGS_KEY
    },
    create: {
      key: APP_SETTINGS_KEY,
      value: settings as unknown as Prisma.InputJsonValue,
      updatedById
    },
    update: {
      value: settings as unknown as Prisma.InputJsonValue,
      updatedById
    }
  });

  revalidateTag(CACHE_TAGS.appSettings);
  return saved;
}

export function documentPrefixForKind(
  settings: Pick<AppSettingsInput, "documents">,
  kind: "quotation" | "invoice" | "payment-receipt" | "delivery-receipt" | "final-order-summary" | "order"
) {
  switch (kind) {
    case "quotation":
      return settings.documents.quotationPrefix;
    case "invoice":
      return settings.documents.invoicePrefix;
    case "payment-receipt":
      return settings.documents.paymentReceiptPrefix;
    case "delivery-receipt":
      return settings.documents.deliveryReceiptPrefix;
    case "final-order-summary":
      return settings.documents.finalSummaryPrefix;
    case "order":
      return settings.documents.orderPrefix;
  }
}

export function footerForKind(
  settings: Pick<AppSettingsInput, "documents">,
  kind: "quotation" | "invoice" | "payment-receipt" | "delivery-receipt" | "final-order-summary"
) {
  switch (kind) {
    case "quotation":
      return settings.documents.quotationFooter;
    case "invoice":
      return settings.documents.invoiceFooter;
    case "payment-receipt":
      return settings.documents.paymentReceiptFooter;
    case "delivery-receipt":
      return settings.documents.deliveryReceiptFooter;
    case "final-order-summary":
      return settings.documents.finalSummaryFooter;
  }
}
