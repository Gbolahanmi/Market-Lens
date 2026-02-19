"use client";

import { useParams, useRouter } from "next/navigation";
import { useNews } from "@/context/NewsContext";
import { ArrowLeft, ExternalLink, MapPin, Calendar } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function NewsDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { getArticleById } = useNews();

  const newsId = params?.id as string;
  const article = getArticleById(newsId);

  if (!article) {
    return (
      <div className="w-full min-h-screen bg-gray-900 py-8">
        <div className="container">
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="mb-6 border-gray-600 text-gray-200 hover:bg-gray-700"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back
          </Button>

          <div className="bg-gray-800 rounded-lg border border-gray-700 p-12 text-center">
            <h2 className="text-2xl font-bold text-gray-100 mb-2">
              Article Not Found
            </h2>
            <p className="text-gray-400 mb-6">
              The news article you're looking for isn't available. Please go
              back and try again.
            </p>
            <Button
              onClick={() => router.back()}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Return to Watchlist
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const formattedDate = article.datetime
    ? new Date(article.datetime * 1000).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  const relatedSymbols = article.related
    ? article.related.split(",").map((s) => s.trim())
    : [];

  return (
    <div className="w-full min-h-screen bg-gray-900 py-8">
      <div className="container max-w-3xl">
        {/* Back Button */}
        <Button
          onClick={() => router.back()}
          variant="outline"
          className="mb-8 border-gray-600 text-gray-200 hover:bg-gray-700"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Watchlist
        </Button>

        {/* Article Container */}
        <article className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          {/* Featured Image */}
          {article.image && (
            <div className="w-full h-96 bg-gray-700 relative overflow-hidden">
              <Image
                src={article.image}
                alt={article.headline}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Content */}
          <div className="p-8">
            {/* Headline */}
            <h1 className="text-4xl font-bold text-gray-100 mb-6 leading-tight">
              {article.headline}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap gap-6 mb-8 pb-8 border-b border-gray-700">
              {/* Source */}
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-blue-400" />
                <span className="text-gray-300">{article.source}</span>
              </div>

              {/* Date */}
              {formattedDate && (
                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-blue-400" />
                  <span className="text-gray-300">{formattedDate}</span>
                </div>
              )}
            </div>

            {/* Article Summary/Content */}
            {article.summary && (
              <div className="mb-8 text-gray-300 leading-relaxed text-lg whitespace-pre-wrap">
                {article.summary}
              </div>
            )}

            {/* Related Stocks */}
            {relatedSymbols.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">
                  Related Symbols
                </h3>
                <div className="flex flex-wrap gap-2">
                  {relatedSymbols.map((symbol) => (
                    <span
                      key={symbol}
                      className="bg-blue-900/30 border border-blue-600/50 text-blue-300 px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-900/50 transition cursor-pointer"
                    >
                      {symbol}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Original Article Link */}
            <div className="mt-8 p-4 bg-gray-700/50 rounded-lg border border-gray-600">
              <p className="text-sm text-gray-400 mb-3">
                Read the full article on the source website:
              </p>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition font-semibold"
              >
                Visit Original Article
                <ExternalLink size={16} />
              </a>
            </div>
          </div>
        </article>

        {/* Related Articles Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-100 mb-6">
            Explore More
          </h2>
          <p className="text-gray-400">
            Return to your watchlist to discover more news and market updates.
          </p>
          <Button
            onClick={() => router.back()}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
          >
            Back to Watchlist
          </Button>
        </div>
      </div>
    </div>
  );
}
