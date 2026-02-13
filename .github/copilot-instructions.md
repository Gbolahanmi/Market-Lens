# MarketLens - AI Coding Agent Instructions

## Project Overview

**MarketLens** is a stock market analytics webapp built with Next.js 16.1.4 (Turbopack), featuring real-time stock data, email notifications, and advanced charting via TradingView widgets.

**Tech Stack:**

- Framework: Next.js 16.1.4 with TypeScript, App Router
- Auth: Better Auth 1.4.18 (with MongoDB adapter, email verification required)
- Database: MongoDB (via Mongoose with connection pooling + caching)
- Email: Nodemailer (Gmail SMTP) + Inngest for async/scheduled jobs
- Stock Data: Finnhub API with fallback to mock data
- UI: ShadCn components (Command, Dialog, Button, Input, Toast)
- Charts: TradingView embedded widgets

## Architecture Patterns

### 1. **Server Actions & Data Flow**

- All API calls are **server actions** (`"use server"`) in `lib/actions/`
  - `auth.actions.ts` - Authentication (signup/signin/signout)
  - `finnhub.actions.ts` - Stock search with React.cache() memoization
- Client components trigger server actions with error handling + fallbacks
- Example: `SearchCommand.tsx` calls `searchStocks()` with try/catch, falls back to mock stocks if API fails

### 2. **Authentication Flow**

- Better Auth with `requireEmailVerification: true` in `lib/better-auth/Auth.ts`
- Middleware in `midlleware/index.ts` checks session cookies, redirects to home if missing
- Sign-up triggers Inngest event `"app/user.created"` for welcome email (see `lib/inngest/functions.ts`)
- Key pattern: Check `response.user.emailVerified` after signup to conditionally redirect users

### 3. **Email System (Inngest + Nodemailer)**

- **Email templates** in `lib/nodemailer/templates.ts` - base HTML templates with placeholders
- **Nodemailer setup** in `lib/nodemailer/index.ts` - creates transporter, `sendWelcomeEmail()`, `sendSummaryEmail()`
- **Inngest functions** in `lib/inngest/functions.ts` - defines event handlers:
  - `sendSignUpEmail` triggered on `"app/user.created"` event
  - `sendDailyNewsSummary` cron job (0 18 \* \* \*)
- **Critical pattern**: Use `Promise.allSettled()` for batch operations (prevents one failure blocking all)
- Gemini API integration for personalized email content generation

### 4. **React Hooks & Dependencies**

- `useDebounce()` hook in `hooks/useDebounce.ts` - returns memoized callback to prevent infinite re-renders
- **Critical**: Wrap callbacks with `useCallback()` before passing to `useDebounce()`, only include `[searchTerm, open]` in dependencies (NOT the debounced function itself)
- Toast context in `context/ToastContext.tsx` - global state for notifications
- Custom hooks use `useRef` + `useEffect` for side effects (e.g., TradingView widget initialization)

### 5. **Widget Integration (TradingView)**

- `components/tradingViewWidget.tsx` - Generic widget wrapper with `useTradingViewWidget` hook
- Hook loads external TradingView script, injects config as JSON
- Widget configs are symbol-specific functions in `lib/constants.ts`:
  - `SYMBOL_INFO_WIDGET_CONFIG(symbol)`
  - `CANDLE_CHART_WIDGET_CONFIG(symbol)`
  - `SYMBOL_OVERVIEW_WIDGET_CONFIG(symbol)` - Area chart with advanced styling
  - `TECHNICAL_ANALYSIS_WIDGET_CONFIG(symbol)`
  - `COMPANY_PROFILE_WIDGET_CONFIG(symbol)`
  - `COMPANY_FINANCIALS_WIDGET_CONFIG(symbol)`

## Critical Conventions

### TypeScript Types (`types/global.d.ts`)

- Use global type declarations for prop types: `SearchCommandProps`, `StockWithWatchlistStatus`, etc.
- **Stock data types**: `Stock` (basic) → `StockWithWatchlistStatus` (includes watchlist flag)
- All API responses typed: `FinnhubSearchResponse`, `FinnhubSearchResult`

### Directory Structure

- `app/(root)/` - Protected routes (require middleware auth)
- `app/(auth)/` - Public auth routes (signup, signin)
- `app/api/` - API endpoints (including Inngest webhook)
- `lib/actions/` - Server actions (database, API calls)
- `lib/better-auth/` - Authentication configuration
- `lib/inngest/` - Async job definitions
- `lib/nodemailer/` - Email sending + templates
- `database/` - MongoDB connection + models
- `components/` - React UI components (use ShadCn when possible)
- `hooks/` - Custom React hooks
- `context/` - Context providers

### Error Handling Patterns

1. **Server Actions**: Wrap in try/catch, log detailed context (e.g., "🔍 Search term was:", ❌ error emoji)
2. **Components**: Use error boundaries or fallback state (e.g., SearchCommand shows mock stocks on API error)
3. **MongoDB**: `database/mongoose.ts` implements global caching + retry logic with timeout settings
4. **Finnhub API**: `lib/actions/finnhub.actions.ts` falls back to MOCK_STOCKS array on ECONNRESET or timeout

### Logging Convention

- Use emoji prefixes for readability:
  - ✅ Success (MongoDB connected, API response received)
  - ❌ Error (API failed, connection timeout)
  - 🔍 Info (Search term, API key check)
  - 📧 Email operations
  - 📡 Network operations

### Component Patterns

- **"use client"** for interactivity (state, event handlers, hooks)
- **Async components** for server-side data fetching (`export default async function Page()`)
- **ShadCn UI**: Always add `DialogTitle` with `sr-only` class for a11y compliance
- **Responsive grids**: Use Tailwind `grid-cols-1 lg:grid-cols-X` for mobile-first responsive design

## Common Workflows

### Adding a New Page with Stock Data

1. Create `app/(root)/[route]/page.tsx` as async component
2. Import widget configs from `lib/constants.ts`
3. Define `TRADINGVIEW_WIDGET_URLS` object
4. Use 2-column grid: `grid grid-cols-1 lg:grid-cols-3 gap-6`
5. Import and render `TradingViewWidget` components with symbol-specific configs
6. Add symbol quick-jump buttons with `POPULAR_STOCK_SYMBOLS` from constants

### Adding a New Email Template

1. Create template string in `lib/nodemailer/templates.ts` with `{{placeholder}}` syntax
2. Add `sendEmail()` function in `lib/nodemailer/index.ts` with template.replace() calls
3. Create Inngest function in `lib/inngest/functions.ts` as event handler
4. Trigger via `inngest.send({ name: "event.name", data: {...} })`

### Debugging Stock Search Issues

1. Check `lib/actions/finnhub.actions.ts` - searchStocks() logs search term + API key existence
2. Verify env vars: `process.env.FINNHUB_API_KEY` (server) vs `process.env.NEXT_PUBLIC_FINNHUB_API_KEY` (client)
3. Backend returns mock stocks on error; check SearchCommand.tsx for fallback logic
4. Enable browser console logs: "🔍 Searching for:", "✅ Search results count:"

## Environment Variables Required

```
MONGODB_URI=mongodb+srv://...
FINNHUB_API_KEY=your_api_key
NEXT_PUBLIC_FINNHUB_API_KEY=your_public_key
NODEMAILER_EMAIL=gmail@example.com
NODEMAILER_PASSWORD=gmail_app_password
GEMINI_API_KEY=gemini_key
INNGEST_EVENT_KEY=inngest_event_key
```

## Important Notes

- **Next.js Turbopack**: Live reload may be slower than webpack; use `npm run dev` for development
- **Email verification**: Users can't access protected routes until email is verified
- **TradingView widgets**: Require external script loading; check browser console for CORS/CSP issues
- **Inngest local testing**: Use Inngest CLI for local dev (`inngest dev`); webhook at `/api/inngest`
