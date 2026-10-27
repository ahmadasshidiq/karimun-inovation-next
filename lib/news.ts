import type { NewsCategory, NewsStatus, NewsType } from "@prisma/client";
import sanitizeHtml from "sanitize-html";


export const NEWS_PERMISSION = { model: "news", action: "manage" } as const;

export const NEWS_CATEGORIES = [
  { value: "SOSIALISASI", label: "Sosialisasi" },
  { value: "BIMBINGAN_TEKNIS", label: "Bimbingan Teknis" },
  { value: "DISEMINASI", label: "Diseminasi" },
] as const;

export const createSlug = (value: string) =>
  value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 240);

export const sanitizeNewsContent = (content: string) =>
  sanitizeHtml(content, {
    allowedTags: [
      "p", "br", "strong", "b", "em", "i", "u", "s", "blockquote",
      "ul", "ol", "li", "a", "h2", "h3", "h4", "img", "video", "source",
      "figure", "figcaption",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt"],
      video: ["src", "controls", "poster"],
      source: ["src", "type"],
    },
    allowedSchemes: ["http", "https", "data"],
    allowedSchemesByTag: {
      img: ["http", "https", "data"],
      video: ["http", "https"],
      source: ["http", "https"],
    },
    transformTags: {
      div: "p",
      a: sanitizeHtml.simpleTransform("a", { target: "_blank", rel: "noopener noreferrer" }),
      video: sanitizeHtml.simpleTransform("video", { controls: "controls" }),
    },
  }).trim();

export const calculateReadingTime = (content: string) => {
  const words = sanitizeNewsContent(content)
    .replace(/<[^>]*>/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  return Math.max(1, Math.ceil(words / 200));
};

export const isNewsCategory = (value: unknown): value is NewsCategory =>
  value === "SOSIALISASI" || value === "BIMBINGAN_TEKNIS" || value === "DISEMINASI";

export const isNewsType = (value: unknown): value is NewsType =>
  value === "BERITA" || value === "AGENDA";

export const isNewsStatus = (value: unknown): value is NewsStatus =>
  value === "DRAFT" || value === "PUBLISHED" || value === "ARCHIVED";
