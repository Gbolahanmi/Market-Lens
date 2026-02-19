"use server";

/**
 * COMPREHENSIVE FINNHUB API DATA FETCHER
 *
 * This demonstrates ALL possible data you can get from Finnhub API
 * Free tier supports up to 60 API calls/minute
 */

const FINNHUB_BASE_URL = "https://finnhub.io/api/v1";
const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY ?? "";

async function fetchJSON<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, { cache: "force-cache" });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch (error) {
    console.error("❌ Fetch error:", error);
    return null;
  }
}

// ============================================================================
// 1. QUOTE DATA - Current price & basic market info
// ============================================================================
export async function getQuote(symbol: string) {
  const url = `${FINNHUB_BASE_URL}/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`;
  return fetchJSON<{
    c?: number; // Current price
    d?: number; // Change
    dp?: number; // Percent change
    h?: number; // High price of the day
    l?: number; // Low price of the day
    o?: number; // Open price of the day
    pc?: number; // Previous close price
    t?: number; // Unix timestamp
  }>(url);
}

// ============================================================================
// 2. COMPANY PROFILE - Basic company information
// ============================================================================
export async function getCompanyProfile(symbol: string) {
  const url = `${FINNHUB_BASE_URL}/stock/profile2?symbol=${symbol}&token=${FINNHUB_API_KEY}`;
  return fetchJSON<{
    country?: string;
    currency?: string;
    estimate?: number;
    exchange?: string;
    finnhubIndustry?: string;
    ipo?: string; // IPO date
    logo?: string; // Company logo URL
    marketCapitalization?: number; // Market cap in millions
    name?: string;
    phone?: string;
    shareOutstanding?: number;
    ticker?: string;
    weburl?: string;
  }>(url);
}

// ============================================================================
// 3. COMPANY METRICS - Financial ratios & metrics
// ============================================================================
export async function getCompanyMetrics(symbol: string) {
  const url = `${FINNHUB_BASE_URL}/stock/metric?symbol=${symbol}&metric=all&token=${FINNHUB_API_KEY}`;
  return fetchJSON<{
    metric?: {
      "10DayAverageTradingVolume"?: number;
      "52WeekHigh"?: number;
      "52WeekHighDate"?: string;
      "52WeekLow"?: number;
      "52WeekLowDate"?: string;
      "52WeekPriceReturnDaily"?: number;
      beta?: number;
      bookValue?: number;
      cik?: string;
      currentRatio?: number;
      dividendYield?: number; // Annual dividend yield
      dividendYieldTTM?: number; // Trailing twelve months
      earningsPerShare?: number; // EPS
      eps?: number; // Basic EPS
      epsTrailingTwelveMonths?: number;
      grossMargin?: number; // Gross profit margin
      lastDividendValue?: number;
      marketCapitalization?: number;
      morningstarOverallRating?: number;
      morningstarRiskRating?: number;
      netMargin?: number; // Net profit margin
      operatingMargin?: number;
      peRatio?: number; // Price-to-Earnings ratio
      payoutRatio?: number;
      pbRatio?: number; // Price-to-Book ratio
      pcfRatio?: number; // Price-to-Cash Flow ratio
      priceTarget?: number; // Analyst price target
      psRatio?: number; // Price-to-Sales ratio
      quickRatio?: number;
      roaa?: number; // Return on average assets
      roe?: number; // Return on equity
      roic?: number; // Return on invested capital
      salesPerShare?: number;
      tangibleBookValue?: number;
      totalDebt?: number;
      totalDebtToEquity?: number;
      volumeAverage?: number;
      yearHigh?: number;
      yearLow?: number;
      yearTargetPrice?: number;
    };
    series?: {
      annual?: Record<string, any>;
      quarterly?: Record<string, any>;
    };
  }>(url);
}

// ============================================================================
// 4. COMPANY NEWS - Latest news articles
// ============================================================================
export async function getCompanyNews(symbol: string, limit: number = 10) {
  const url = `${FINNHUB_BASE_URL}/company-news?symbol=${symbol}&limit=${limit}&token=${FINNHUB_API_KEY}`;
  return fetchJSON<
    Array<{
      category?: string;
      datetime?: number; // Unix timestamp
      headline?: string;
      id?: number;
      image?: string; // Image URL
      related?: string; // Related symbols
      source?: string; // News source (CNN, Reuters, etc)
      summary?: string;
      url?: string; // Full article URL
    }>
  >(url);
}

// ============================================================================
// 5. EARNINGS DATA - Revenue, profit, etc.
// ============================================================================
export async function getEarnings(symbol: string) {
  const url = `${FINNHUB_BASE_URL}/stock/earnings?symbol=${symbol}&token=${FINNHUB_API_KEY}`;
  return fetchJSON<
    Array<{
      date?: string; // Earnings announcement date
      epsEstimate?: number; // Estimated EPS
      epsActual?: number; // Actual EPS
      quarter?: number;
      revenueEstimate?: number; // Estimated revenue (millions)
      revenueActual?: number; // Actual revenue (millions)
      surprise?: number; // Earnings surprise (%)
      surprisePercent?: number;
      symbol?: string;
      year?: number;
    }>
  >(url);
}

// ============================================================================
// 6. SEC FILINGS - 10-K, 10-Q, 8-K documents
// ============================================================================
export async function getSecFilings(symbol: string) {
  const url = `${FINNHUB_BASE_URL}/stock/filings?symbol=${symbol}&token=${FINNHUB_API_KEY}`;
  return fetchJSON<
    Array<{
      acceptedDate?: string;
      cik?: string;
      filedDate?: string;
      form?: string; // 10-K, 10-Q, 8-K, etc.
      id?: string;
      link?: string; // Link to SEC filing
      symbol?: string;
      title?: string;
    }>
  >(url);
}

// ============================================================================
// 7. INSIDER TRADING - Company executives buying/selling stock
// ============================================================================
export async function getInsiderTrades(symbol: string) {
  const url = `${FINNHUB_BASE_URL}/stock/insider-trades?symbol=${symbol}&token=${FINNHUB_API_KEY}`;
  return fetchJSON<
    Array<{
      change?: number; // Change in shares
      filingDate?: string;
      name?: string; // Person's name
      share?: number; // Number of shares
      symbol?: string;
      transactionDate?: string;
      transactionPrice?: number;
      url?: string;
    }>
  >(url);
}

// ============================================================================
// 8. FUND OWNERSHIP - Which funds/institutions own the stock
// ============================================================================
export async function getFundOwnership(symbol: string) {
  const url = `${FINNHUB_BASE_URL}/stock/fund-ownership?symbol=${symbol}&token=${FINNHUB_API_KEY}`;
  return fetchJSON<
    Array<{
      equity?: number;
      fundLogoUrl?: string;
      fundName?: string;
      hashSymbol?: string;
      ownershipPercent?: number; // % of fund's holdings
      portfolioDate?: string;
      shares?: number;
      symbol?: string;
      url?: string;
    }>
  >(url);
}

// ============================================================================
// 9. INSTITUTIONAL OWNERSHIP - Institutions owning stock
// ============================================================================
export async function getInstitutionalOwnership(symbol: string) {
  const url = `${FINNHUB_BASE_URL}/stock/institutional-ownership?symbol=${symbol}&token=${FINNHUB_API_KEY}`;
  return fetchJSON<
    Array<{
      equity?: number;
      institutionName?: string;
      ownershipPercent?: number;
      portfolioDate?: string;
      shares?: number;
      symbol?: string;
      url?: string;
    }>
  >(url);
}

// ============================================================================
// 10. IPO CALENDAR - Upcoming and past IPOs
// ============================================================================
export async function getIPOCalendar(fromDate?: string, toDate?: string) {
  const params = new URLSearchParams({
    token: FINNHUB_API_KEY,
    ...(fromDate && { from: fromDate }),
    ...(toDate && { to: toDate }),
  });
  const url = `${FINNHUB_BASE_URL}/calendar/ipo?${params}`;
  return fetchJSON<{
    data?: Array<{
      date?: string;
      exchange?: string;
      name?: string;
      numberOfShares?: number;
      price?: number;
      symbol?: string;
      totalSharesValue?: number;
    }>;
    ipoCalendar?: Array<any>;
  }>(url);
}

// ============================================================================
// 11. ECONOMIC CALENDAR - Economic events
// ============================================================================
export async function getEconomicCalendar() {
  const url = `${FINNHUB_BASE_URL}/economic-calendar?token=${FINNHUB_API_KEY}`;
  return fetchJSON<{
    data?: Array<{
      actual?: number;
      country?: string;
      estimate?: number;
      event?: string;
      impact?: string; // High, Medium, Low
      previous?: number;
      time?: string;
    }>;
  }>(url);
}

// ============================================================================
// 12. K10 FILING - Company's 10-K form (detailed annual report)
// ============================================================================
export async function getK10Filing(symbol: string, accessNumber: string) {
  const url = `${FINNHUB_BASE_URL}/stock/form-10-k?symbol=${symbol}&accessNumber=${accessNumber}&token=${FINNHUB_API_KEY}`;
  return fetchJSON<{
    addressOfPrincipalExecutiveOffices?: string;
    businessAddress?: string;
    businessPhone?: string;
    cik?: string;
    companyName?: string;
    exchangeListing?: string;
    filedAsOfDate?: string;
    fiscalYearEnded?: string;
    formType?: string;
    investorRelationsUrl?: string;
    irsNumber?: string;
    items?: Record<string, any>; // Various sections of the 10-K
    nativeUrl?: string; // Link to full filing
    symbol?: string;
  }>(url);
}

// ============================================================================
// 13. TECHNICAL INDICATORS (Pattern Recognition)
// ============================================================================
export async function getPatternRecognition(symbol: string) {
  const url = `${FINNHUB_BASE_URL}/scan/technical-pattern?symbol=${symbol}&token=${FINNHUB_API_KEY}`;
  return fetchJSON<{
    points?: Array<{
      pattern?: string; // candlestick pattern (hammer, harami, etc)
      timeframe?: string; // d, w, m (daily, weekly, monthly)
    }>;
  }>(url);
}

// ============================================================================
// 14. RECOMMENDATION TRENDS - Analyst buy/sell/hold ratings
// ============================================================================
export async function getRecommendationTrends(symbol: string) {
  const url = `${FINNHUB_BASE_URL}/stock/recommendation?symbol=${symbol}&token=${FINNHUB_API_KEY}`;
  return fetchJSON<
    Array<{
      buy?: number;
      hold?: number;
      period?: string;
      sell?: number;
      strongBuy?: number;
      strongSell?: number;
      symbol?: string;
    }>
  >(url);
}

// ============================================================================
// 15. UPGRADES/DOWNGRADES - Analyst rating changes
// ============================================================================
export async function getUpgradesDowngrades(symbol: string) {
  const url = `${FINNHUB_BASE_URL}/stock/upgrade-downgrade?symbol=${symbol}&token=${FINNHUB_API_KEY}`;
  return fetchJSON<
    Array<{
      action?: string; // upgrade, downgrade, reiterate, init
      date?: string;
      gradeToCurrent?: string; // New rating (buy, hold, sell, etc)
      gradeFromPrior?: string; // Previous rating
      newTarget?: number; // New price target
      priorTarget?: number; // Previous price target
      symbol?: string;
      targetPrice?: number;
      targetPriceChanged?: boolean;
    }>
  >(url);
}

// ============================================================================
// 16. PRICE TARGET - Analyst price targets
// ============================================================================
export async function getAnalystPriceTarget(symbol: string) {
  const url = `${FINNHUB_BASE_URL}/stock/price-target?symbol=${symbol}&token=${FINNHUB_API_KEY}`;
  return fetchJSON<{
    lastPrice?: number; // Current price
    lastUpdated?: string;
    high?: number; // Highest target price
    low?: number; // Lowest target price
    mean?: number; // Average target price
    median?: number;
    numberOfAnalysts?: number;
    symbol?: string;
    targetPrice?: number;
  }>(url);
}

// ============================================================================
// 17. COMPANY EXECUTIVE - Leadership team
// ============================================================================
export async function getCompanyExecutive(symbol: string) {
  const url = `${FINNHUB_BASE_URL}/stock/executive?symbol=${symbol}&token=${FINNHUB_API_KEY}`;
  return fetchJSON<{
    executive?: Array<{
      compensation?: number;
      currency?: string;
      description?: string;
      directOwnership?: number;
      name?: string;
      pay?: number;
      title?: string;
    }>;
    symbol?: string;
  }>(url);
}

// ============================================================================
// 18. PEERS - Similar companies
// ============================================================================
export async function getCompanyPeers(symbol: string) {
  const url = `${FINNHUB_BASE_URL}/stock/peers?symbol=${symbol}&token=${FINNHUB_API_KEY}`;
  return fetchJSON<string[]>(url); // Returns array of ticker symbols
}

// ============================================================================
// 19. SEARCH - Stock symbol search
// ============================================================================
export async function searchStock(query: string) {
  const url = `${FINNHUB_BASE_URL}/search?q=${query}&token=${FINNHUB_API_KEY}`;
  return fetchJSON<{
    count?: number;
    result?: Array<{
      description?: string;
      displaySymbol?: string;
      symbol?: string;
      type?: string;
    }>;
  }>(url);
}

// ============================================================================
// MASTER FUNCTION - Get ALL available data for a stock
// ============================================================================
export async function getAllStockData(symbol: string) {
  const normalizedSymbol = symbol.toUpperCase();

  console.log(`📊 Fetching all data for ${normalizedSymbol}...`);

  const results = await Promise.allSettled([
    getQuote(normalizedSymbol),
    getCompanyProfile(normalizedSymbol),
    getCompanyMetrics(normalizedSymbol),
    getCompanyNews(normalizedSymbol, 5),
    getEarnings(normalizedSymbol),
    getSecFilings(normalizedSymbol),
    getInsiderTrades(normalizedSymbol),
    getFundOwnership(normalizedSymbol),
    getInstitutionalOwnership(normalizedSymbol),
    getRecommendationTrends(normalizedSymbol),
    getUpgradesDowngrades(normalizedSymbol),
    getAnalystPriceTarget(normalizedSymbol),
    getCompanyExecutive(normalizedSymbol),
    getCompanyPeers(normalizedSymbol),
  ]);

  return {
    quote: results[0].status === "fulfilled" ? results[0].value : null,
    profile: results[1].status === "fulfilled" ? results[1].value : null,
    metrics: results[2].status === "fulfilled" ? results[2].value : null,
    news: results[3].status === "fulfilled" ? results[3].value : null,
    earnings: results[4].status === "fulfilled" ? results[4].value : null,
    filings: results[5].status === "fulfilled" ? results[5].value : null,
    insiderTrades: results[6].status === "fulfilled" ? results[6].value : null,
    fundOwnership: results[7].status === "fulfilled" ? results[7].value : null,
    institutionalOwnership:
      results[8].status === "fulfilled" ? results[8].value : null,
    recommendations:
      results[9].status === "fulfilled" ? results[9].value : null,
    upgradesDowngrades:
      results[10].status === "fulfilled" ? results[10].value : null,
    priceTarget: results[11].status === "fulfilled" ? results[11].value : null,
    executives: results[12].status === "fulfilled" ? results[12].value : null,
    peers: results[13].status === "fulfilled" ? results[13].value : null,
  };
}
