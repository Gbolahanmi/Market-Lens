"use server";

/**
 * Alternative P/E Ratio Fetchers
 * Use these if the main metrics endpoint isn't returning P/E data
 */

const FINNHUB_BASE_URL = "https://finnhub.io/api/v1";
const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY ?? "";

async function fetchJSON<T>(url: string): Promise<T | null> {
  try {
    console.log(`📡 Fetching: ${url.split("token=")[0]}token=***`);
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      console.error(`❌ API Error ${res.status}: ${res.statusText}`);
      return null;
    }
    const data = (await res.json()) as T;
    console.log(`✅ Response:`, JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error("❌ Fetch error:", error);
    return null;
  }
}

// ============================================================================
// METHOD 1: Get P/E from metrics endpoint
// ============================================================================
export async function getPERatioFromMetrics(
  symbol: string,
): Promise<number | null> {
  try {
    const url = `${FINNHUB_BASE_URL}/stock/metric?symbol=${symbol}&metric=all&token=${FINNHUB_API_KEY}`;
    const data = await fetchJSON<{
      metric?: {
        peRatio?: number;
        [key: string]: any;
      };
    }>(url);

    if (data?.metric) {
      console.log(`📊 All metrics for ${symbol}:`, Object.keys(data.metric));

      if (data.metric.peRatio) {
        console.log(`✅ P/E Ratio (metrics): ${data.metric.peRatio}`);
        return data.metric.peRatio;
      }
    }
  } catch (err) {
    console.error("❌ Error in getPERatioFromMetrics:", err);
  }
  return null;
}

// ============================================================================
// METHOD 2: Calculate P/E from Price and EPS (Earnings Per Share)
// ============================================================================
export async function calculatePERatioFromEarnings(
  symbol: string,
  currentPrice: number,
): Promise<number | null> {
  try {
    const url = `${FINNHUB_BASE_URL}/stock/earnings?symbol=${symbol}&token=${FINNHUB_API_KEY}`;
    const earnings = await fetchJSON<
      Array<{
        epsActual?: number;
        epsEstimate?: number;
        date?: string;
      }>
    >(url);

    if (earnings && earnings.length > 0) {
      // Get most recent actual EPS
      const latestEPS = earnings[0]?.epsActual || earnings[0]?.epsEstimate;

      if (latestEPS && latestEPS > 0) {
        const peRatio = currentPrice / latestEPS;
        console.log(
          `✅ P/E Ratio (calculated from EPS): ${peRatio.toFixed(2)}`,
        );
        console.log(
          `  Current Price: $${currentPrice}, Latest EPS: $${latestEPS}`,
        );
        return peRatio;
      } else {
        console.warn(`⚠️ No valid EPS data for P/E calculation`);
      }
    }
  } catch (err) {
    console.error("❌ Error in calculatePERatioFromEarnings:", err);
  }
  return null;
}

// ============================================================================
// METHOD 3: Get P/E from recommendations/analyst data
// ============================================================================
export async function getPERatioFromRecommendations(
  symbol: string,
): Promise<number | null> {
  try {
    const url = `${FINNHUB_BASE_URL}/stock/price-target?symbol=${symbol}&token=${FINNHUB_API_KEY}`;
    const data = await fetchJSON<{
      lastPrice?: number;
      targetPrice?: number;
      [key: string]: any;
    }>(url);

    if (data?.lastPrice && data?.targetPrice) {
      // This isn't a direct P/E, but shows analyst expectations
      console.log(
        `📊 Analyst Data: Current $${data.lastPrice}, Target $${data.targetPrice}`,
      );
    }
  } catch (err) {
    console.error("❌ Error in getPERatioFromRecommendations:", err);
  }
  return null;
}

// ============================================================================
// METHOD 4: Master function - Try all methods in order
// ============================================================================
export async function getPERatioComprehensive(
  symbol: string,
  currentPrice: number,
): Promise<number | null> {
  console.log(`\n🔍 Fetching P/E Ratio for ${symbol}...`);

  // Try Method 1: Direct metrics
  const peFromMetrics = await getPERatioFromMetrics(symbol);
  if (peFromMetrics && peFromMetrics > 0) {
    return peFromMetrics;
  }

  console.log(`⚠️ Method 1 (Metrics) failed, trying Method 2...`);

  // Try Method 2: Calculate from EPS
  const peFromEarnings = await calculatePERatioFromEarnings(
    symbol,
    currentPrice,
  );
  if (peFromEarnings && peFromEarnings > 0) {
    return peFromEarnings;
  }

  console.log(`⚠️ All methods failed to fetch P/E Ratio for ${symbol}`);
  return null;
}

// ============================================================================
// DEBUG: Log all metrics available for a symbol
// ============================================================================
export async function debugAllMetrics(symbol: string) {
  console.log(`\n📋 Debugging all available metrics for ${symbol}...\n`);

  const url = `${FINNHUB_BASE_URL}/stock/metric?symbol=${symbol}&metric=all&token=${FINNHUB_API_KEY}`;
  const data = await fetchJSON<Record<string, any>>(url);

  if (data) {
    console.log(`✅ Raw API Response:`, JSON.stringify(data, null, 2));

    if (data.metric) {
      console.log(
        `\n📊 Available Metrics (${Object.keys(data.metric).length} total):`,
      );
      Object.entries(data.metric).forEach(([key, value]) => {
        console.log(`  - ${key}: ${value}`);
      });
    }
  }
}
