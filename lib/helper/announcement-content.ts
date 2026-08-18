import sanitizeHtml from "sanitize-html";

export function sanitizeAnnouncementContent(content: string) {
  return sanitizeHtml(content, {
    allowedTags: [
      "p", "br", "strong", "b", "em", "i", "u", "s", "blockquote",
      "ul", "ol", "li", "a", "h2", "h3", "h4", "img", "video", "source",
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
}
