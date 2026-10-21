import { useEffect } from "react";
import { useLocation } from "react-router-dom";
export default function usePageMeta(title, description) {
  const { pathname } = useLocation();
  useEffect(() => {
    document.title = `${title} | Charanga de Irará`;
    if (description)
      document
        .querySelector('meta[name="description"]')
        ?.setAttribute("content", description);
    document
      .querySelector('link[rel="canonical"]')
      ?.setAttribute("href", window.location.origin + pathname);
    document
      .querySelector('meta[property="og:title"]')
      ?.setAttribute("content", document.title);
    document
      .querySelector('meta[property="og:url"]')
      ?.setAttribute("content", window.location.origin + pathname);
    if (description)
      document
        .querySelector('meta[property="og:description"]')
        ?.setAttribute("content", description);
  }, [title, description, pathname]);
}
