import {
  transformerMetaHighlight,
  transformerMetaWordHighlight,
  transformerNotationDiff,
  transformerNotationErrorLevel,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from "@shikijs/transformers";
import { mdsvexWrapItUpTransformer } from "./transformers";
import {
  type BundledLanguage,
  bundledLanguages,
  type BundledTheme,
  type CodeToHastOptions,
  createHighlighter,
  type Highlighter,
} from "shiki";
import { escapeHTML } from "./utils";

type HighlighterOptions = {
  displayPath?: boolean;
  displayLanguage?: boolean;
  disableCopyButton?: boolean;
  shikiOptions?: Partial<CodeToHastOptions<BundledLanguage, BundledTheme>> & {
    themes?:
      | BundledTheme[]
      | { light: BundledTheme; dark: BundledTheme }
      | BundledTheme;
    langs?: BundledLanguage[] | "all";
  };
};

export const defaultShikiOptions: Partial<
  CodeToHastOptions<BundledLanguage, BundledTheme>
> = {
  cssVariablePrefix: "--shiki-",
  transformers: [
    transformerMetaHighlight(),
    transformerMetaWordHighlight(),
    transformerNotationDiff(),
    transformerNotationHighlight(),
    transformerNotationWordHighlight(),
    transformerNotationErrorLevel(),
  ],
};

const defaultThemes = {
  dark: "catppuccin-mocha",
  light: "catppuccin-mocha",
} as const;

let highlighterInstance: Highlighter | null = null;
let highlighterPromise: Promise<Highlighter> | null = null;

const getHighlighterInstance = async (
  themes:
    | BundledTheme[]
    | { light: BundledTheme; dark: BundledTheme }
    | BundledTheme,
  langs: BundledLanguage[] | "all" = "all",
): Promise<Highlighter> => {
  if (highlighterInstance) {
    return highlighterInstance;
  }

  if (highlighterPromise) {
    return highlighterPromise;
  }

  const langsArray: BundledLanguage[] =
    langs === "all"
      ? (Object.keys(bundledLanguages) as BundledLanguage[])
      : langs;

  let themesArray: BundledTheme[];
  if (Array.isArray(themes)) {
    themesArray = themes;
  } else if (
    typeof themes === "object" &&
    "light" in themes &&
    "dark" in themes
  ) {
    themesArray = [themes.light, themes.dark];
  } else {
    themesArray = [themes];
  }

  const highlighterOptions: Parameters<typeof createHighlighter>[0] = {
    themes: themesArray,
    langs: langsArray,
  };

  highlighterPromise = createHighlighter(highlighterOptions);

  highlighterInstance = await highlighterPromise;
  return highlighterInstance;
};

export const mdsvexShiki = async (config: HighlighterOptions) => {
  const themes = config.shikiOptions?.themes || defaultThemes;
  const langs = config.shikiOptions?.langs || "all";

  const shikiOptions: Partial<
    CodeToHastOptions<BundledLanguage, BundledTheme>
  > = {
    ...defaultShikiOptions,
    ...config.shikiOptions,
  };

  delete (shikiOptions as any).themes;
  delete (shikiOptions as any).langs;

  await getHighlighterInstance(themes, langs);

  return async (code: string, lang: string, meta?: string): Promise<string> => {
    lang = lang ?? "text";

    const highlighter = await getHighlighterInstance(themes, langs);

    const transformers = [
      ...(defaultShikiOptions.transformers || []),
      ...(shikiOptions.transformers || []),
    ];

    if (!transformers.find((t) => t.name === "transformerMdsvexWrapItUp")) {
      transformers.push(mdsvexWrapItUpTransformer(lang, code, meta, config));
    }

    const html = highlighter.codeToHtml(code, {
      ...shikiOptions,
      lang,
      transformers,
      themes:
        typeof themes === "object" && !Array.isArray(themes)
          ? themes
          : undefined,
    } as CodeToHastOptions<BundledLanguage, BundledTheme>);

    return escapeHTML(html);
  };
};

export default mdsvexShiki;
