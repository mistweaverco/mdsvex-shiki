import type { ElementContent, RootContent } from "hast";

export const escapeHTML = (html: string): string => {
  return html
    .replace(/{/g, "&lbrace;")
    .replace(/}/g, "&rbrace;")
    .replace(/`/g, "&#96;");
};

// Helper function to extract text content from HAST nodes
export function extractText(node: RootContent | ElementContent): string {
  if (node.type === "text") {
    return node.value;
  }
  if (node.type === "element" && node.children) {
    return node.children.map((child) => extractText(child)).join("");
  }
  return "";
}

interface WrapItUpOptions {
  lang?: string;
  title?: string;
  displayLanguage?: boolean;
  displayTitle?: boolean;
  disableCopyButton: boolean;
}

export function wrapItUp(html: string, opts: WrapItUpOptions): string {
  const langSpan =
    opts.lang && opts.displayLanguage
      ? `<span class="lang">${opts.lang}</span>`
      : "";
  const titleSpan =
    opts.title && opts.displayTitle
      ? `<span class="title">${opts.title}</span>`
      : "";

  let result = `<div class="mdsvex-shiki">`;

  result += `<div class="header">${langSpan}${titleSpan}`;
  if (!opts.disableCopyButton) {
    result += `<button class="copy-button" on:click={(evt) => { navigator.clipboard.writeText(evt.target.parentNode.nextSibling.querySelector('code').innerText) } }>Copy</button>`;
  }
  result += `</div>`;
  result += html;
  result += `</div>`;

  return result;
}
