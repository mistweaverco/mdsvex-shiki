import {
  transformerMetaHighlight,
  transformerMetaWordHighlight,
  transformerNotationDiff,
  transformerNotationErrorLevel,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from "@shikijs/transformers";
import type { ElementContent, Root, RootContent } from "hast";
import {
  type BundledLanguage,
  type BundledTheme,
  type CodeToHastOptions,
  codeToHtml,
  type ShikiTransformer,
} from "shiki";
import { escapeHTML } from "./utils.ts";
export { copyAction } from "./copy-action.ts";

type HighlighterOptions = {
  displayTitle?: boolean;
  displayLanguage?: boolean;
  disableCopyButton?: boolean;
  shikiOptions?: Partial<CodeToHastOptions<BundledLanguage, BundledTheme>>;
};

// Helper function to extract text content from HAST nodes
function extractText(node: RootContent | ElementContent): string {
  if (node.type === "text") {
    return node.value;
  }
  if (node.type === "element" && node.children) {
    return node.children.map((child) => extractText(child)).join("");
  }
  return "";
}

const transformer = (
  lang: string,
  codeText: string,
  disableCopyButton?: boolean,
): ShikiTransformer => {
  return {
    name: "transformerMdsvexWrapItUp",
    enforce: "post",
    root: function (root: Root) {
      const len = root.children.length;
      const children: RootContent[] =
        len > 0 ? (root.children as RootContent[]) : [];

      let textToCopy = codeText;
      if (!textToCopy) {
        children.forEach((child) => {
          if (child.type === "element" && child.tagName === "pre") {
            const codeElement = child.children.find(
              (c): c is ElementContent =>
                c.type === "element" && c.tagName === "code",
            );
            if (codeElement && codeElement.type === "element") {
              textToCopy = extractText(codeElement);
            }
          }
        });
      }

      const headerChildren: ElementContent[] = [
        {
          type: "element",
          tagName: "span",
          properties: { class: "language" },
          children: [
            {
              type: "text",
              value: lang,
            },
          ],
        },
      ];

      if (!disableCopyButton) {
        headerChildren.push({
          type: "element",
          tagName: "button",
          properties: {
            class: "copy",
            "data-code": textToCopy,
            type: "button",
          },
          children: [
            {
              type: "text",
              value: "",
            },
          ],
        });
      }

      const wrapper: Root = {
        type: "root",
        children: [
          {
            type: "element",
            tagName: "div",
            properties: {
              class: "mdsvex-shiki",
            },
            children: [
              {
                type: "element",
                tagName: "div",
                properties: { class: "header" },
                children: headerChildren,
              },
              ...(children as ElementContent[]),
            ],
          },
        ],
      };
      const wrapperElement = wrapper.children[0];
      if (wrapperElement && wrapperElement.type === "element") {
        children.forEach((child) => {
          if (
            child.type === "element" &&
            child.tagName === "pre" &&
            child.properties.class
          ) {
            const preClassNames = child.properties.class as string;
            if (preClassNames) {
              this.addClassToHast(wrapperElement, preClassNames);
            }
            const preStyle = child.properties.style;
            if (preStyle) {
              wrapperElement.properties.style = preStyle;
            }
          }
        });
      }

      return wrapper;
    },
  };
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
        transformer(lang, code, config.disableCopyButton),
      );
    }

    return escapeHTML(await codeToHtml(code, shikiOptions));
  };
};
