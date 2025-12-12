export const escapeHTML = (html: string): string => {
  return html
    .replace(/{/g, "&lbrace;")
    .replace(/}/g, "&rbrace;")
    .replace(/`/g, "&#96;");
};

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
