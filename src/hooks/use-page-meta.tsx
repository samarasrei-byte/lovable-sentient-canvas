import { useEffect } from "react";

interface PageMeta {
  title: string;
  description?: string;
}

/**
 * Lightweight per-page SEO: updates <title> and meta description on mount.
 * Restores previous values on unmount so navigation between routes stays clean.
 */
export const usePageMeta = ({ title, description }: PageMeta) => {
  useEffect(() => {
    const prevTitle = document.title;
    const descEl = document.querySelector('meta[name="description"]');
    const prevDesc = descEl?.getAttribute("content") ?? null;

    document.title = title;
    if (description && descEl) {
      descEl.setAttribute("content", description);
    }

    return () => {
      document.title = prevTitle;
      if (prevDesc !== null && descEl) {
        descEl.setAttribute("content", prevDesc);
      }
    };
  }, [title, description]);
};
