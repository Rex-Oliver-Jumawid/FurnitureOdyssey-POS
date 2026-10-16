import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import React from "react";
import { Font, G, Image, Path, StyleSheet, Svg, Text, View } from "@react-pdf/renderer";
import type { OperationalPdfKind } from "@/lib/pdf/types";

export const dreamHomeBrand = {
  companyName: "DREAM HOME MNL",
  tagline: "D H M  F U R N I T U R E S  O N L I N E  S T O R E",
  address: "4774 SAMPAGUITA ST. PARAÑAQUE CITY",
  contact: "CONTACT NUMBER: 09603123335",
  email: "EMAIL ADDRESS: FURNITUREODYSSEY@GMAIL.COM",
  preparedBy: "Arriane Escobia",
  preparedBySubtitle: "DHM Online store"
};

export const dreamHomeColors = {
  background: "#fefbf8",
  brandGold: "#956c41",
  accent: "#d09172",
  dark: "#222222",
  muted: "#6f6258",
  border: "#d8d0c6",
  softFill: "#fbf7f1"
};

const fontFiles = {
  aleoRegular: firstExistingPath("Aleo-Regular.ttf"),
  aleoBold: firstExistingPath("Aleo-Bold.ttf"),
  balginRegular: firstExistingPath("Balgin-Regular.ttf", "Balgin-Regular.otf"),
  openSansRegular: firstExistingPath("OpenSans-Regular.ttf"),
  openSansSemiBold: firstExistingPath("OpenSans-SemiBold.ttf"),
  openSansBold: firstExistingPath("OpenSans-Bold.ttf")
};

export const dreamHomeFonts = registerDreamHomeFonts();

export const dreamHomeLogoSource = imageSource(path.join(process.cwd(), "public", "logo", "dream-home-mnl-logo.png"));
export const dreamHomeSignatureSource = imageSource(
  firstExistingAssetPath(
    path.join(process.cwd(), "public", "sign.png"),
    path.join(process.cwd(), "public", "logo", "sign.png")
  )
);

export type DreamHomePolicy =
  | {
      label: string;
      lines: string[];
    }
  | {
      label: string;
      text: string;
    };

export const dreamHomePolicies: DreamHomePolicy[] = [
  {
    label: "1. Payment Policy and Delivery Options",
    lines: [
      "a. Customers can choose to make full payment at the time of ordering to secure their products, with delivery scheduled for a later date.",
      "b. Cash on delivery applies to orders scheduled for immediate delivery, subject to serviceable areas.",
      "c. Down payments are accepted depending on delivery schedule and agreement.",
      "d. Payment-first policy applies to transactions outside Metro Manila or nearby provinces.",
      "e. Check payments require clearing before delivery."
    ]
  },
  {
    label: "2. Shipping Fees:",
    text: "Shipping fees are not included, and applicable toll fees will be covered by the client."
  },
  {
    label: "3. Delivery Terms:",
    text: "Items will be delivered unassembled, and assembly fees will apply when requested."
  },
  {
    label: "4. Warranty:",
    text: "Warranty covers factory defects only; change of mind is not accepted."
  },
  {
    label: "5. Payment Method:",
    text: "Payments are to be made via bank transfer unless otherwise agreed."
  },
  {
    label: "6. Delivery Instructions:",
    text: "Clients should provide delivery instructions, including if a helper is needed for unloading. Additional charges may apply."
  },
  {
    label: "7. Assembly Policy:",
    text: "Assembled items are considered sold and are not eligible for return or exchange."
  }
];

export const dreamHomeSharedStyles = StyleSheet.create({
  header: {
    alignItems: "center",
    textAlign: "center",
    marginBottom: 0
  },
  logo: {
    width: 220,
    height: 220,
    objectFit: "contain",
    marginBottom: -30,
    marginTop: -20
  },
  companyName: {
    fontFamily: dreamHomeFonts.aleo,
    fontSize: 20,
    fontWeight: 700,
    letterSpacing: 1,
    color: dreamHomeColors.brandGold
  },
  tagline: {
    marginTop: 10,
    fontFamily: dreamHomeFonts.balgin,
    fontSize: 8.2,
    letterSpacing: 1.45,
    color: dreamHomeColors.brandGold
  },
  brandLine: {
    marginTop: 1.6,
    fontFamily: dreamHomeFonts.body,
    fontSize: 6.8,
    letterSpacing: 0.35,
    color: dreamHomeColors.brandGold
  },
  documentTitle: {
    marginTop: 10,
    marginBottom: 24,
    paddingTop: 5,
    paddingBottom: 5,
    paddingHorizontal: 18,
    alignSelf: "center",
    fontFamily: dreamHomeFonts.body,
    fontSize: 18,
    fontWeight: 700,
    letterSpacing: 1,
    color: dreamHomeColors.brandGold,
    textAlign: "center"
  },
  preparedBy: {
    marginTop: 18,
    width: 140,
    textAlign: "center",
    fontFamily: dreamHomeFonts.body,
    fontWeight: 400
  },
  compactPreparedBy: {
    marginTop: 8,
    width: 120
  },
  preparedLabel: {
    marginBottom: 0,
    fontSize: 8,
    fontWeight: 700,
    textAlign: "left",
    color: dreamHomeColors.dark
  },
  signatureArea: {
    position: "relative",
    height: 87,
    alignItems: "center",
    textAlign: "center"
  },
  compactSignatureArea: {
    height: 68
  },
  signature: {
    position: "absolute",
    top: 0,
    width: 140,
    height: 87,
    objectFit: "contain",
    marginBottom: 0
  },
  compactSignature: {
    width: 110,
    height: 68
  },
  preparedName: {
    marginTop: 45,
    fontWeight: 700,
    color: dreamHomeColors.dark
  },
  compactPreparedName: {
    marginTop: 35
  },
  preparedSubtitle: {
    fontSize: 8,
    color: dreamHomeColors.muted
  },
  policies: {
    marginTop: 18,
    fontFamily: dreamHomeFonts.body,
    fontWeight: 400,
    fontSize: 7.8,
    lineHeight: 1.32
  },
  compactPolicies: {
    marginTop: 10
  },
  policyBlock: {
    marginBottom: 4
  },
  policyTitle: {
    fontWeight: 700
  },
  policyLine: {
    marginTop: 1.5
  }
});

export function DreamHomeHeader({
  title,
  fixed = false
}: {
  title: string;
  fixed?: boolean;
}) {
  return (
    <View style={dreamHomeSharedStyles.header} fixed={fixed}>
      {dreamHomeLogoSource ? (
        // React-PDF Image does not expose an alt prop in its TypeScript API.
        // eslint-disable-next-line jsx-a11y/alt-text
        <Image src={dreamHomeLogoSource} style={dreamHomeSharedStyles.logo} />
      ) : null}
      <Text style={dreamHomeSharedStyles.brandLine}>{dreamHomeBrand.address}</Text>
      <Text style={dreamHomeSharedStyles.brandLine}>{dreamHomeBrand.contact}</Text>
      <Text style={dreamHomeSharedStyles.brandLine}>{dreamHomeBrand.email}</Text>
      <Text style={dreamHomeSharedStyles.documentTitle}>{title.toUpperCase()}</Text>
    </View>
  );
}

export function DreamHomePreparedBy({
  compact = false,
  demo = false
}: {
  compact?: boolean;
  demo?: boolean;
}) {
  return (
    <View style={compact ? [dreamHomeSharedStyles.preparedBy, dreamHomeSharedStyles.compactPreparedBy] : dreamHomeSharedStyles.preparedBy} wrap={false}>
      <Text style={dreamHomeSharedStyles.preparedLabel}>PREPARED BY:</Text>
      <View style={compact ? [dreamHomeSharedStyles.signatureArea, dreamHomeSharedStyles.compactSignatureArea] : dreamHomeSharedStyles.signatureArea} wrap={false}>
        {demo ? (
          <DemoSignature compact={compact} />
        ) : dreamHomeSignatureSource ? (
          // React-PDF Image does not expose an alt prop in its TypeScript API.
          // eslint-disable-next-line jsx-a11y/alt-text
          <Image src={dreamHomeSignatureSource} style={compact ? [dreamHomeSharedStyles.signature, dreamHomeSharedStyles.compactSignature] : dreamHomeSharedStyles.signature} />
        ) : null}
        <Text style={compact ? [dreamHomeSharedStyles.preparedName, dreamHomeSharedStyles.compactPreparedName] : dreamHomeSharedStyles.preparedName}>
          {demo ? "Sample Representative" : dreamHomeBrand.preparedBy}
        </Text>
        <Text style={dreamHomeSharedStyles.preparedSubtitle}>{demo ? "Demo Furniture Store" : dreamHomeBrand.preparedBySubtitle}</Text>
      </View>
    </View>
  );
}

// This fictional, hand-drawn vector signature is used only on demo/draft quotations.
// Keep the real store signature reserved for non-demo PDF documents.
function DemoSignature({ compact }: { compact: boolean }) {
  return (
    <Svg
      width={compact ? 110 : 140}
      height={compact ? 68 : 87}
      viewBox="0 6 140 87"
      style={compact ? [dreamHomeSharedStyles.signature, dreamHomeSharedStyles.compactSignature] : dreamHomeSharedStyles.signature}
    >
      <G fill="none" stroke="#25344b" strokeLinecap="round" strokeLinejoin="round">
        <Path d="M36 16 C30 10 18 13 18 21 C18 28 34 25 35 31 C37 41 18 43 12 37" strokeWidth={2.3} />
        <Path d="M45 27 C37 30 37 37 43 37 C48 37 51 28 47 27 C44 26 42 33 45 36 C48 38 53 33 56 28" strokeWidth={1.9} />
        <Path d="M59 28 C56 36 58 37 62 32 C69 23 68 37 70 35 C75 29 78 25 80 28 C82 31 77 37 84 34" strokeWidth={1.9} />
        <Path d="M96 16 C94 23 91 35 91 38 M90 20 C95 14 103 13 108 18 C112 24 104 29 96 28 C103 27 108 36 115 37" strokeWidth={2.2} />
        <Path d="M120 36 l1 -1" strokeWidth={2} />
        <Path d="M25 46 C47 41 70 44 93 42 C107 41 124 40 130 37" strokeWidth={1.05} />
      </G>
    </Svg>
  );
}

export function DreamHomePolicies({ compact = false }: { compact?: boolean }) {
  return (
    <View style={compact ? [dreamHomeSharedStyles.policies, dreamHomeSharedStyles.compactPolicies] : dreamHomeSharedStyles.policies} wrap={false}>
      {dreamHomePolicies.map((policy) => (
        <View key={policy.label} style={dreamHomeSharedStyles.policyBlock}>
          {"lines" in policy ? (
            <>
              <Text style={dreamHomeSharedStyles.policyTitle}>{policy.label}</Text>
              {policy.lines.map((line) => (
                <Text key={line} style={dreamHomeSharedStyles.policyLine}>
                  {line}
                </Text>
              ))}
            </>
          ) : (
            <Text>
              <Text style={dreamHomeSharedStyles.policyTitle}>{policy.label} </Text>
              {policy.text}
            </Text>
          )}
        </View>
      ))}
    </View>
  );
}

export function documentTitleForKind(kind: OperationalPdfKind) {
  switch (kind) {
    case "quotation":
      return "Product Quotation";
    case "invoice":
      return "Sales Invoice";
    case "payment-receipt":
      return "Payment Receipt";
    case "delivery-receipt":
      return "Delivery Receipt";
    case "final-order-summary":
      return "Final Order Summary";
  }
}

function registerDreamHomeFonts() {
  const openSansSources = [
    fontSource(fontFiles.openSansRegular, 400),
    fontSource(fontFiles.openSansSemiBold, 600),
    fontSource(fontFiles.openSansBold, 700)
  ].filter((source): source is { src: string; fontWeight: number } => Boolean(source));

  if (openSansSources.length) {
    Font.register({ family: "Open Sans", fonts: openSansSources });
  }

  const aleoSources = [
    fontSource(fontFiles.aleoRegular, 400),
    fontSource(fontFiles.aleoBold, 700)
  ].filter((source): source is { src: string; fontWeight: number } => Boolean(source));

  if (aleoSources.length) {
    Font.register({ family: "Aleo", fonts: aleoSources });
  }

  if (fontFiles.balginRegular && existsSync(fontFiles.balginRegular)) {
    Font.register({ family: "Balgin", src: fontFiles.balginRegular });
  }

  return {
    body: openSansSources.length ? "Open Sans" : "Helvetica",
    aleo: aleoSources.length ? "Aleo" : "Helvetica",
    balgin: fontFiles.balginRegular && existsSync(fontFiles.balginRegular) ? "Balgin" : "Helvetica"
  };
}

function fontSource(src: string | null, fontWeight: number) {
  return src && existsSync(src) ? { src, fontWeight } : null;
}

function firstExistingPath(...filenames: string[]) {
  const roots = [
    path.join(process.cwd(), "public", "fonts"),
    path.join(process.cwd(), "public", "logo", "fonts")
  ];

  for (const root of roots) {
    for (const filename of filenames) {
      const candidate = path.join(root, filename);

      if (existsSync(candidate)) {
        return candidate;
      }
    }
  }

  return path.join(roots[0], filenames[0]);
}

function imageSource(src: string) {
  if (!existsSync(src)) {
    return null;
  }

  return `data:image/png;base64,${readFileSync(src).toString("base64")}`;
}

function firstExistingAssetPath(...candidates: string[]) {
  return candidates.find((candidate) => existsSync(candidate)) ?? candidates[0];
}
