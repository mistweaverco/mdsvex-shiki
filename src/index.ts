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
  type BundledTheme,
  type CodeToHastOptions,
  codeToHtml,
} from "shiki";
import { escapeHTML } from "./utils";
export { copyAction } from "./copy-action";

type HighlighterOptions = {
  displayTitle?: boolean;
  displayLanguage?: boolean;
  disableCopyButton?: boolean;
  shikiOptions?: Partial<CodeToHastOptions<BundledLanguage, BundledTheme>>;
};

export const defaultShikiOptions: Partial<
  CodeToHastOptions<BundledLanguage, BundledTheme>
> = {
  themes: {
    dark: "catppuccin-mocha",
    light: "catppuccin-mocha",
  },
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

export default async (config: HighlighterOptions) => {
  const shikiOptions = {
    ...defaultShikiOptions,
    ...config.shikiOptions,
  } as CodeToHastOptions<BundledLanguage, BundledTheme>;

  return async (code: string, lang: string) => {
    lang = lang ?? "text";
    shikiOptions.lang = lang;
    shikiOptions.transformers = [
      ...defaultShikiOptions.transformers!,
      ...shikiOptions.transformers!,
    ];
    if (
      shikiOptions.transformers.find(
        (t) => t.name === "transformerMdsvexWrapItUp",
      ) === undefined
    ) {
      shikiOptions.transformers.push(
        mdsvexWrapItUpTransformer(lang, code, config.disableCopyButton),
      );
    }

    return escapeHTML(await codeToHtml(code, shikiOptions));
  };
};
