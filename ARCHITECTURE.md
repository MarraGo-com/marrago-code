# Project Architecture & Structure

## 1. Directory Structure

```
marrago-project/
├── src/                          # Main source code directory
│   ├── app/                      # Next.js App Router pages and API routes
│   │   ├── [locale]/             # Internationalized routes (en, es, fr)
│   │   │   ├── about/            # About page components
│   │   │   ├── admin/            # Admin dashboard pages
│   │   │   ├── blog/             # Blog listing and detail pages
│   │   │   ├── booking-cancelled/ # Booking cancellation confirmation page
│   │   │   ├── booking-success/  # Booking success confirmation page
│   │   │   ├── contact/          # Contact form page
│   │   │   ├── experiences/      # Experience listing and detail pages
│   │   │   ├── faq/              # Frequently asked questions page
│   │   │   ├── privacy-policy/   # Privacy policy page
│   │   │   ├── reviews/          # Customer reviews page
│   │   │   ├── terms-of-use/     # Terms of service page
│   │   │   ├── layout.tsx        # Root layout component
│   │   │   ├── loading.tsx       # Loading UI component
│   │   │   └── page.tsx          # Home page component
│   │   ├── api/                  # API route handlers
│   │   │   ├── admin/            # Admin API endpoints
│   │   │   ├── blog/             # Blog API endpoints
│   │   │   ├── bookings/         # Booking management API
│   │   │   ├── checkout/         # Payment checkout API
│   │   │   ├── contact/          # Contact form submission API
│   │   │   ├── experiences/      # Experience data API
│   │   │   ├── newsletter/       # Newsletter subscription API
│   │   │   ├── reviews/          # Reviews API endpoints
│   │   │   └── webhook/          # Webhook handlers (Stripe, etc.)
│   │   ├── globals.css           # Global stylesheet
│   │   ├── manifest.ts           # PWA manifest configuration
│   │   ├── robots.ts             # SEO robots.txt generator
│   │   └── sitemap.ts            # SEO sitemap generator
│   ├── components/               # React component library
│   │   ├── admin/                # Admin dashboard components
│   │   ├── analytics/             # Analytics tracking components
│   │   ├── auth/                 # Authentication components
│   │   ├── blog/                 # Blog-related components
│   │   ├── booking/              # Booking form and calendar components
│   │   ├── custom/               # Custom reusable components
│   │   ├── debug/                # Development debug components
│   │   ├── experience/           # Experience display components
│   │   ├── icons/                # Icon components
│   │   ├── layout/               # Layout components (header, footer)
│   │   ├── legal/                # Legal page components
│   │   ├── reviews/              # Review display components
│   │   └── ui/                   # Base UI component library
│   ├── config/                   # Configuration files
│   ├── contexts/                 # React context providers
│   ├── hooks/                    # Custom React hooks
│   ├── i18n/                     # Internationalization setup
│   ├── interfaces/               # TypeScript interface definitions
│   ├── lib/                      # Utility libraries and helpers
│   │   ├── data.ts               # Static data definitions
│   │   ├── firebase-admin.ts     # Firebase Admin SDK setup
│   │   ├── firebase.ts           # Firebase client SDK setup
│   │   ├── firestore-serialize.ts # Firestore serialization utilities
│   │   ├── metadata.ts           # SEO metadata helpers
│   │   ├── theme-component-loader.ts # Theme component loading
│   │   └── utils.ts              # General utility functions
│   ├── providers/                # React context providers
│   ├── themes/                   # Theme configuration files
│   ├── types/                    # TypeScript type definitions
│   └── middleware.ts             # Next.js middleware
│
├── public/                       # Static assets directory
│   ├── fonts/                    # Custom font files (Cinzel, Oranienbaum, Pinyon)
│   ├── images/                   # Image assets
│   │   ├── hero/                 # Hero section images
│   │   ├── icons/                # Icon images
│   │   ├── logos/                # Brand logo files
│   │   ├── marrago/              # Marrago-specific images
│   │   ├── mock/                 # Mock/placeholder images
│   │   ├── og/                   # Open Graph social media images
│   │   ├── slides/               # Image slideshow assets
│   │   └── team/                 # Team member photos
│   ├── videos/                   # Video assets
│   ├── file.svg                  # SVG icon file
│   ├── globe.svg                 # Globe icon SVG
│   ├── sw.js                     # Service worker for PWA
│   ├── upmerce.webp              # Upmerce image asset
│   ├── window.svg                # Window icon SVG
│   └── workbox-1bb06f5e.js       # Workbox PWA library
│
├── messages/                     # Internationalization translation files
│   ├── en.json                   # English translations
│   ├── es.json                   # Spanish translations
│   └── fr.json                   # French translations
│
├── utils/                        # Utility scripts and tools
│   ├── tools/                    # Development and deployment tools
│   │   ├── luxury-firebase.config # Firebase configuration
│   │   ├── marketing.txt         # Marketing notes
│   │   ├── payment-astuces.txt   # Payment tips/notes
│   │   ├── todos.txt             # Todo list
│   │   └── work-tools.txt        # Work tools documentation
│   └── set-admin-claim.ts        # Firebase admin claim utility
│
├── eslint.config.mjs             # ESLint configuration
├── next.config.ts                # Next.js configuration
├── next-env.d.ts                 # Next.js TypeScript definitions
├── package.json                  # Node.js dependencies and scripts
├── postcss.config.mjs            # PostCSS configuration
├── README.md                     # Project documentation
├── serviceAccountKey.json        # Firebase service account credentials
├── tsconfig.json                 # TypeScript configuration
├── tsconfig.tsbuildinfo          # TypeScript build cache
└── yarn.lock                     # Yarn dependency lock file
```

## 2. Architectural Analysis

## 1. The Stack & Key Libraries

### Core Framework
✅ **Next.js 15.5.7** with **App Router** (React 19.2.1)
- Uses Turbopack for development (`next dev --turbopack`)
- App Router architecture with Server Components by default
- TypeScript with strict mode enabled
- Path aliases configured (`@/*` → `./src/*`)

### Backend/Database Strategy
✅ **Firebase/Firestore** (Dual SDK Approach)
- **Client SDK** (`src/lib/firebase.ts`): 
  - Firestore for client-side reads
  - Firebase Auth for authentication
  - Firebase Storage for media
  - Firebase Analytics
- **Admin SDK** (`src/lib/firebase-admin.ts`):
  - Server-side writes to Firestore
  - Admin authentication capabilities
  - Used in API routes for secure operations

**Payment Processing:**
- **Stripe** (v18.3.0) for payment processing
- Webhook integration for payment confirmation

**Email Service:**
- **Nodemailer** for transactional emails (booking notifications)

### Styling Solution
✅ **Tailwind CSS v4** with **PostCSS**
- Modern Tailwind CSS 4.x with PostCSS plugin
- **Material-UI (MUI) v7** for component library
  - Emotion for CSS-in-JS
  - MUI Date Pickers for calendar components
  - Theme customization via `ThemeRegistry`
- **Framer Motion** for animations
- Custom fonts (Cinzel, Oranienbaum, Pinyon) in `/public/fonts`

### Internationalization Tools
✅ **next-intl v4.3.1**
- Supports 3 locales: `en`, `fr`, `es`
- Default locale: `en`
- Translation files in `/messages/` directory (JSON format)
- Middleware-based locale detection and routing
- Server-side and client-side i18n support

### Additional Key Libraries
- **@tanstack/react-query v5**: Server state management and caching
- **react-firebase-hooks**: Firebase data fetching hooks
- **react-leaflet**: Map integration (Leaflet wrapper)
- **react-markdown**: Markdown rendering for blog content
- **Swiper**: Touch slider/carousel component
- **date-fns / dayjs**: Date manipulation utilities

---

## 2. The Architecture Pattern

### Internationalized Routing with `[locale]`

The `[locale]` folder structure implements **Next.js App Router with dynamic locale segments**:

```
src/app/[locale]/
├── page.tsx              → /en, /fr, /es (homepage)
├── about/                → /en/about, /fr/about, /es/about
├── experiences/          → /en/experiences, /fr/experiences, etc.
└── ...
```

**How it works:**
1. **Middleware** (`src/middleware.ts`) intercepts all requests (except `/api`, `/_next`, etc.)
2. Uses `next-intl/middleware` to detect locale from:
   - URL path (e.g., `/fr/about`)
   - Accept-Language header
   - Cookie preferences
3. Routes are automatically prefixed with locale
4. `layout.tsx` receives `params.locale` and loads appropriate translations via `getMessages()`

**Benefits:**
- SEO-friendly URLs per locale
- Server-side rendering with locale-specific content
- Automatic locale detection and fallback

### Separation: `app/api` (Backend) vs `lib/firebase` (Data Access)

**Clear Separation of Concerns:**

```
┌─────────────────────────────────────────┐
│  Client Components                      │
│  (React Components, Hooks)              │
└──────────────┬──────────────────────────┘
               │
               ├─→ Uses: lib/firebase.ts (Client SDK)
               │   - Read operations
               │   - Real-time listeners
               │   - Client-side auth
               │
               └─→ Calls: app/api/* (API Routes)
                   │
                   └─→ Uses: lib/firebase-admin.ts (Admin SDK)
                       - Write operations
                       - Secure server-side operations
                       - Email notifications
```

**Why this pattern?**
1. **Security**: Admin SDK has elevated permissions, only used server-side
2. **Performance**: Client SDK optimized for real-time reads
3. **Separation**: API routes handle business logic, lib handles data access
4. **Type Safety**: Both SDKs properly typed with TypeScript

**Example Flow:**
- **Client** → Reads experience data via `firestore` (client SDK)
- **Client** → Submits booking via `POST /api/bookings` (API route)
- **API Route** → Writes to Firestore via `adminDb` (admin SDK)
- **API Route** → Sends email via Nodemailer

---

## 3. Data Flow Analysis: Booking an Experience

### Complete Request Flow

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. USER INTERACTION (Client-Side)                                │
│    User fills BookingForm component                              │
│    - Selects experience, date, guests, customer info              │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│ 2. CLIENT-SIDE VALIDATION & SUBMISSION                          │
│    BookingForm.tsx → POST /api/bookings                         │
│    Payload: {                                                    │
│      experienceId, experienceTitle, date,                       │
│      adults, children, totalGuests,                              │
│      customer: { name, email, phone },                          │
│      notes, status: 'pending'                                    │
│    }                                                             │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│ 3. API ROUTE: /api/bookings (Server-Side)                      │
│    src/app/api/bookings/route.ts                                 │
│    - Validates request body                                      │
│    - Creates booking document in Firestore via adminDb           │
│    - Returns bookingId to client                                 │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ├─→ Firestore: bookings/{bookingId}
                            │   Status: 'pending'
                            │
                            └─→ Email Notification (Nodemailer)
                                Sent to admin email
┌─────────────────────────────────────────────────────────────────┐
│ 4. PAYMENT INITIATION (Client-Side)                             │
│    Client receives bookingId → Calls POST /api/checkout         │
│    Payload: {                                                    │
│      experienceTitle, price, customerEmail,                     │
│      experienceId, bookingId                                    │
│    }                                                             │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│ 5. API ROUTE: /api/checkout (Server-Side)                       │
│    src/app/api/checkout/route.ts                                 │
│    - Creates Stripe Checkout Session                             │
│    - Embeds bookingId in session.metadata                       │
│    - Returns sessionId to client                                 │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│ 6. STRIPE CHECKOUT (External)                                   │
│    User redirected to Stripe payment page                        │
│    User completes payment                                        │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│ 7. STRIPE WEBHOOK (Server-Side)                                 │
│    Stripe → POST /api/webhook/stripe                            │
│    Event: checkout.session.completed                             │
│    - Verifies webhook signature                                  │
│    - Extracts bookingId from session.metadata                    │
│    - Updates Firestore: bookings/{bookingId}                     │
│      status: 'pending' → 'confirmed'                            │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│ 8. USER REDIRECT (Client-Side)                                  │
│    User redirected to /booking-success?session_id={id}          │
│    Page displays confirmation                                    │
└─────────────────────────────────────────────────────────────────┘
```

### Key Data Transformations

1. **Booking Creation** (`/api/bookings`):
   ```typescript
   Client Payload → Firestore Document
   {
     experienceId: string,
     date: string → Date object,
     guests: { adults, children, total },
     customer: { name, email, phone },
     status: 'pending',
     createdAt: serverTimestamp()
   }
   ```

2. **Payment Session** (`/api/checkout`):
   ```typescript
   Booking Data → Stripe Session
   {
     line_items: [{
       price_data: { currency, unit_amount },
       product_data: { name: experienceTitle }
     }],
     metadata: { bookingId }
   }
   ```

3. **Webhook Update** (`/api/webhook/stripe`):
   ```typescript
   Stripe Event → Firestore Update
   {
     status: 'confirmed',
     updatedAt: serverTimestamp()
   }
   ```

---

## 4. Critical Entry Points

### Global State & Layout Control

#### 1. **Root Layout** (`src/app/[locale]/layout.tsx`)
**Purpose**: Wraps entire application, sets up global providers

**Key Responsibilities:**
- ✅ Locale detection and i18n setup (`NextIntlClientProvider`)
- ✅ Global theme providers (MUI + custom theme)
- ✅ React Query setup for server state
- ✅ Cookie consent management
- ✅ SEO metadata (JSON-LD structured data)
- ✅ Global styles and fonts
- ✅ Analytics scripts (conditional based on consent)
- ✅ Layout structure (Header, Main, Footer)

**Provider Hierarchy:**
```tsx
<NextIntlClientProvider>
  <CookieConsentProvider>
    <QueryProvider>
      <ThemeContextProvider>
        <ThemeRegistry>
          <ConditionalHeader />
          <main>{children}</main>
          <Footer />
        </ThemeRegistry>
      </ThemeContextProvider>
    </QueryProvider>
    <AnalyticsScripts />
    <NewsletterPopup />
    <FloatingWhatsApp />
  </CookieConsentProvider>
</NextIntlClientProvider>
```

#### 2. **Middleware** (`src/middleware.ts`)
**Purpose**: Intercepts all requests, handles locale routing

**Key Responsibilities:**
- ✅ Locale detection and routing
- ✅ Redirects to appropriate locale URL
- ✅ Excludes API routes, static files, Next.js internals

**Matcher Pattern:**
```typescript
/((?!api|trpc|manifest|_next|_vercel|.*\\..*).*)
```

#### 3. **Context Providers**

**a) ThemeContext** (`src/contexts/ThemeContext.tsx`)
- Manages: Primary color, secondary color, font choice, card style
- Persists theme preferences (likely localStorage)
- Used by `ThemeRegistry` to generate MUI theme

**b) CookieConsentContext** (`src/contexts/CookieConsentContext.tsx`)
- Manages: Analytics consent, marketing consent
- Persists to localStorage
- Controls visibility of `CookieBanner` and `CookieModal`
- Gates analytics script loading

#### 4. **Providers**

**a) QueryProvider** (`src/providers/QueryProvider.tsx`)
- Wraps app with `@tanstack/react-query`
- Manages server state, caching, refetching
- Single QueryClient instance (singleton pattern)

**b) ThemeRegistry** (`src/providers/ThemeRegistry.tsx`)
- MUI theme provider with SSR support
- Dynamic theme generation based on:
  - System dark mode preference
  - ThemeContext values (colors, fonts)
- Applies `CssBaseline` for consistent styling

#### 5. **Configuration Files**

**a) `next.config.ts`**
- Security headers (CSP, X-Frame-Options, etc.)
- Image optimization (Firebase Storage, external domains)
- next-intl plugin integration

**b) `src/i18n/routing.ts`**
- Defines supported locales
- Sets default locale
- Used by middleware and layout

### Data Access Entry Points

**Client-Side:**
- `src/lib/firebase.ts` - Firebase client SDK initialization
- Used by components for real-time data reads

**Server-Side:**
- `src/lib/firebase-admin.ts` - Firebase Admin SDK initialization
- Used by API routes for secure writes

### API Route Entry Points

**Critical Routes:**
- `/api/bookings` - Booking creation
- `/api/checkout` - Payment session creation
- `/api/webhook/stripe` - Payment confirmation
- `/api/experiences` - Experience data fetching
- `/api/admin/*` - Admin operations

---

## Architecture Strengths

✅ **Clear separation of concerns** (client SDK vs admin SDK)
✅ **Type-safe** with TypeScript throughout
✅ **SEO-optimized** with i18n routing and metadata
✅ **Security-focused** (CSP headers, webhook verification)
✅ **Scalable** (App Router, React Query caching)
✅ **Modern stack** (Next.js 15, React 19, Tailwind 4)

## Potential Improvements

⚠️ **Consider:**
- Error boundaries for better error handling
- Rate limiting on API routes
- Input validation library (Zod/Yup)
- Monitoring/observability (Sentry, LogRocket)
- Database indexing strategy documentation
- API route authentication/authorization

---

**Generated by:** Senior Software Architect Analysis
**Date:** 2025
**Project:** MarraGo - Tourism Booking Platform

## 3. Project-Specific Conventions (Discovered)
* **Theme-Based Components:** Section components (like Hero, Testimonials) are located in `src/themes/[theme-name]/sections/` rather than the generic components folder.
* **Homepage Content:** The homepage text is driven by `src/config/client-data.ts` (via `siteConfig.textContent`), NOT solely by `messages/*.json`.

