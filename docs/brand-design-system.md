# Furniture Odyssey dashboard design system

The operations dashboard shares the warm minimalist editorial identity of the Furniture Odyssey marketing website.
This branch changes presentation only and does not change business workflows, permissions, validation, or PDF document branding.

## Canonical palette

The CSS variables in `app/globals.css` are the single source of truth for the brand.
Tailwind semantic colors in `tailwind.config.ts` reference those variables so opacity modifiers continue to work.

| Token | Color | Role |
| --- | --- | --- |
| `--ink` | `#25201F` | Headlines and interface text |
| `--muted` | `#776D67` | Supporting text |
| `--ivory` | `#FFF4EA` | Light text on dark editorial surfaces |
| `--paper` | `#FBF9F6` | Application background |
| `--beige` | `#F5F0EB` | Soft surfaces and selected states |
| `--red` | `#BD3434` | Primary actions and brand accents |
| `--burgundy` | `#642B2D` | Secondary editorial accent |
| `--line` | `#E5DDD7` | Borders and separators |
| `--white` | `#FFFFFF` | Cards and work surfaces |
| `--pricing-surface` | `#F8F4F0` | Marketing pricing surfaces |
| `--feature-surface` | `#F7F3EF` | Table headings and marketing feature surfaces |
| `--red-hover` | `#9B252B` | Primary action hover |

Operational success, warning, and danger tokens remain separate from Prometheus red to retain status meaning.
Georgia is reserved for major editorial headings, while Arial remains the interface font.
The combined Prometheus and Furniture Odyssey mark is used for app navigation, sign-in, and browser branding.
The existing product/catalogue images and PDF-specific client logos are intentionally unchanged.
