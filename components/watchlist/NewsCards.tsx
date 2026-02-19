"use client";

import { ExternalLink, TrendingUp } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useNews } from "@/context/NewsContext";

interface NewsArticle {
  id?: string | number;
  headline: string;
  source: string;
  url: string;
  image?: string;
  related?: string;
  datetime?: number;
}

interface NewsCardsProps {
  news: NewsArticle[];
}

export default function NewsCards({ news }: NewsCardsProps) {
  const router = useRouter();
  const { setArticles } = useNews();

  const handleArticleClick = (article: NewsArticle) => {
    if (article.id) {
      router.push(`/news/${article.id}`);
    }
  };

  if (!news || news.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-8 text-center">
        <TrendingUp className="mx-auto mb-3 text-gray-500" size={32} />
        <p className="text-gray-400">No news available at this time</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {news.slice(0, 6).map((article, idx) => (
        <div
          key={idx}
          onClick={() => handleArticleClick(article)}
          className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden hover:border-gray-600 hover:shadow-lg transition group cursor-pointer"
        >
          {/* Thumbnail */}
          {article.image && (
            <div className="w-full h-40 bg-gray-700 overflow-hidden relative">
              <Image
                src={article.image}
                alt={article.headline}
                fill
                className="object-cover group-hover:scale-105 transition"
              />
            </div>
          )}

          {/* Content */}
          <div className="p-4">
            {/* Symbol Badge */}
            {article.related && (
              <div className="mb-2 flex flex-wrap gap-2">
                {article.related
                  .split(",")
                  .slice(0, 2)
                  .map((symbol: string) => (
                    <span
                      key={symbol.trim()}
                      className="text-xs bg-gray-700 text-gray-200 px-2 py-1 rounded"
                    >
                      {symbol.trim()}
                    </span>
                  ))}
              </div>
            )}

            {/* Headline */}
            <h3 className="font-semibold text-gray-100 text-sm mb-2 line-clamp-2 group-hover:text-blue-400 transition">
              {article.headline}
            </h3>

            {/* Source & Date */}
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>{article.source}</span>
              <ExternalLink size={14} />
            </div>

            {/* Timestamp */}
            {article.datetime && (
              <p className="text-xs text-gray-500 mt-2">
                {new Date(article.datetime * 1000).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
