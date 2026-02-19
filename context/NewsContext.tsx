"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface NewsArticle {
  id: string;
  headline: string;
  summary?: string;
  source: string;
  url: string;
  image?: string;
  related?: string;
  datetime?: number;
}

interface NewsContextType {
  articles: NewsArticle[];
  setArticles: (articles: NewsArticle[]) => void;
  getArticleById: (id: string) => NewsArticle | undefined;
}

const NewsContext = createContext<NewsContextType | undefined>(undefined);

export function NewsProvider({ children }: { children: ReactNode }) {
  const [articles, setArticles] = useState<NewsArticle[]>([]);

  const getArticleById = (id: string) => {
    return articles.find((article) => article.id === id);
  };

  return (
    <NewsContext.Provider value={{ articles, setArticles, getArticleById }}>
      {children}
    </NewsContext.Provider>
  );
}

export function useNews() {
  const context = useContext(NewsContext);
  if (!context) {
    throw new Error("useNews must be used within NewsProvider");
  }
  return context;
}
