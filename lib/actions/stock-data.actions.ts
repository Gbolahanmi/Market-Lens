"use server";

import { fetchJSON } from "./finnhub.actions";

const FINNHUB_BASE_URL = "https://finnhub.io/api/v1";
const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY ?? "";

// Rate limiting: queue requests with delays
const REQUEST_DELAY_MS = 300; // 300ms between requests
let lastRequestTime = 0;

async function throttledFetch<T>(
  url: string,
  revalidateSeconds?: number,
): Promise<T | null> {
  // Calculate delay since last request
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  const delayNeeded = Math.max(0, REQUEST_DELAY_MS - timeSinceLastRequest);

  // Wait if needed
  if (delayNeeded > 0) {
    await new Promise((resolve) => setTimeout(resolve, delayNeeded));
  }

  lastRequestTime = Date.now();

  try {
    return await fetchJSON<T>(url, revalidateSeconds);
  } catch (error: any) {
    // Handle rate limit (429) gracefully
    if (error.message?.includes("429")) {
      // console.warn("⚠️ API rate limit reached - returning null for graceful degradation",);
      return null;
    }
    throw error;
  }
}

interface StockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap?: number;
  peRatio?: number;
  forwardPe?: number;
  epsTTM?: number;
  revenueGrowth?: number;
  analyzeRating?: string;
  logoUrl?: string;
}

export async function getStockData(symbols: string[]): Promise<StockData[]> {
  try {
    if (!symbols || symbols.length === 0) {
      return [];
    }

    const token = FINNHUB_API_KEY;
    if (!token) {
      // console.warn("⚠️ FINNHUB_API_KEY not configured");
      return [];
    }

    const results: StockData[] = [];

    // Process symbols sequentially to avoid rate limiting
    for (const symbol of symbols) {
      try {
        const quoteUrl = `${FINNHUB_BASE_URL}/quote?symbol=${encodeURIComponent(
          symbol,
        )}&token=${token}`;
        const quoteData = await throttledFetch<{
          c?: number; // current price
          d?: number; // change
          dp?: number; // change percent
          pc?: number; // previous close
        }>(quoteUrl);

        if (!quoteData || !quoteData.c) {
          // console.warn(`⚠️ No quote data for ${symbol}`);
          continue;
        }

        // Fetch profile, metrics, and recommendations sequentially
        let peRatio: number | undefined;
        let forwardPe: number | undefined;
        let epsTTM: number | undefined;
        let revenueGrowth: number | undefined;
        let marketCap: number | undefined;
        let logoUrl: string | undefined;
        let analyzeRating: string | undefined;

        try {
          const profileData = await throttledFetch<{
            marketCapitalization?: number;
            logo?: string;
          }>(
            `${FINNHUB_BASE_URL}/stock/profile2?symbol=${encodeURIComponent(
              symbol,
            )}&token=${token}`,
            3600,
          );

          const metricsData = await throttledFetch<{
            metric?: {
              peRatio?: number;
              forwardPE?: number;
              [key: string]: any;
            };
          }>(
            `${FINNHUB_BASE_URL}/stock/metric?symbol=${encodeURIComponent(
              symbol,
            )}&metric=all&token=${token}`,
            3600,
          );

          const recommendationData = await throttledFetch<
            Array<{
              buy?: number;
              hold?: number;
              sell?: number;
              strongBuy?: number;
              strongSell?: number;
            }>
          >(
            `${FINNHUB_BASE_URL}/stock/recommendation?symbol=${encodeURIComponent(
              symbol,
            )}&token=${token}`,
            3600,
          );

          // Extract market cap and logo
          if (profileData?.marketCapitalization) {
            marketCap =
              Math.round(profileData.marketCapitalization / 1000 / 100) / 10;
          }
          if (profileData?.logo) {
            logoUrl = profileData.logo;
          }

          // Extract P/E ratios
          if (metricsData?.metric?.peRatio && metricsData.metric.peRatio > 0) {
            peRatio = metricsData.metric.peRatio;
          }
          if (
            metricsData?.metric?.forwardPE &&
            metricsData.metric.forwardPE > 0
          ) {
            forwardPe = metricsData.metric.forwardPE;
          }

          // Extract EPS TTM (Trailing Twelve Months)
          if (metricsData?.metric?.epsTTM && metricsData.metric.epsTTM > 0) {
            epsTTM = metricsData.metric.epsTTM;
          }

          // Calculate analyst consensus from recommendations
          if (recommendationData && Array.isArray(recommendationData)) {
            const latestRec = recommendationData[0]; // Most recent data is first
            if (latestRec) {
              const buy = latestRec.buy || 0;
              const hold = latestRec.hold || 0;
              const sell = latestRec.sell || 0;
              const strongBuy = latestRec.strongBuy || 0;
              const strongSell = latestRec.strongSell || 0;
              const total = buy + hold + sell + strongBuy + strongSell;

              if (total > 0) {
                // Calculate weighted score
                const score =
                  (strongBuy * 5 +
                    buy * 4 +
                    hold * 3 +
                    sell * 2 +
                    strongSell * 1) /
                  total;

                // Convert score to rating
                if (score >= 4.5) {
                  analyzeRating = "Strong Buy";
                } else if (score >= 3.5) {
                  analyzeRating = "Buy";
                } else if (score >= 2.5) {
                  analyzeRating = "Hold";
                } else if (score >= 1.5) {
                  analyzeRating = "Sell";
                } else {
                  analyzeRating = "Strong Sell";
                }

                // console.log(
                //   `📊 Analyst rating for ${symbol}: ${analyzeRating} (Score: ${score.toFixed(2)}, Buy:${strongBuy}/${buy}, Hold:${hold}, Sell:${sell}/${strongSell})`,
                // );
              }
            }
          }
        } catch (err) {
          // console.warn(
          //   `⚠️ Error fetching profile/metrics/recommendations for ${symbol}:`,
          //   err,
          // );
        }

        results.push({
          symbol,
          price: quoteData.c,
          change: quoteData.d || 0,
          changePercent: quoteData.dp || 0,
          marketCap,
          peRatio,
          forwardPe,
          epsTTM,
          revenueGrowth,
          analyzeRating,
          logoUrl,
        });

        // console.log(`✅ Stock data collected for ${symbol}:`, {
        //   price: quoteData.c,
        //   changePercent: quoteData.dp,
        //   marketCap,
        //   peRatio,
        // });
      } catch (error) {
        // console.error(`❌ Error fetching data for ${symbol}:`, error);
      }
    }

    return results;
  } catch (error) {
    // console.error("❌ Error fetching stock data:", error);
    return [];
  }
}
