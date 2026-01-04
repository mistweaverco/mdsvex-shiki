# mdsvex-shiki

A highlighter for mdsvex using Shiki with
support for most [common transformers][shiki-transformers] out of the box.

Why? Because mdsvex's built-in Prism highlighter is
limited in features and customization options.

We needed a better solution for our SvelteKit projects,
so we created this package to fill the gap.

<img width="794" height="558" alt="Screenshot" src="https://github.com/user-attachments/assets/38250632-432a-4f2a-8722-0ef1e4108f38" />


## Installation

Using your package manager of choice, run:

```bash
# npm
npm install @mistweaverco/mdsvex-shiki@v1.3.0

# yarn
yarn add @mistweaverco/mdsvex-shiki@v1.3.0

# bun
bun add @mistweaverco/mdsvex-shiki@v1.3.0

# pnpm
pnpm add @mistweaverco/mdsvex-shiki@v1.3.0

# deno
deno add npm:@mistweaverco/mdsvex-shiki@v1.3.0
```

## Configuration

Available options are as follows:

- `displayPath`: Whether to show the file path in the title bar when
  a path is provided. (default: `false`)
  (e.g., `sh path=/path/to/file.sh`).
  Paths are displayed with directory and file icons.
  Long paths are collapsed
  with a tooltip showing the full path.
- `displayLang`: Whether to show the language label in
  the title bar. (default: `false`)
- `disableCopyButton`: Whether to disable the copy button.
  (default: `false`)
- `shikiOptions`: Options passed directly to Shiki's `codeToHtml` function.
  - `theme`: Shiki theme to use. (default: `"tokyo-night"`)
  - `transformers`: Array of [Shiki transformers][shiki-transformers] to apply.
    By default, the following transformers are included:
    - `transformerMetaHighlight()`
    - `transformerMetaWordHighlight()`
    - `transformerNotationDiff()`
    - `transformerNotationHighlight()`
    - `transformerNotationWordHighlight()`
    - `transformerNotationErrorLevel()`

```js
const options = {
  displayPath: true,
  displayLang: true,
  shikiOptions: {
    theme: 'nord',
  }
}
```

### Import styles

If you just want to basic Shiki styling without the bar,
you don't need to import this CSS file.

If you want to display the path, language and/or copy button,
you **must** import the CSS file.

Probably in the root layout or HTML file that wraps your markdown content.

(e.g., `src/routes/blog/+layout.svelte` or `src/app.html`)

```js
import '@mistweaverco/mdsvex-shiki/styles.css';
```

Now, you can use the bar features in your code blocks.

### Enable Copy Button Functionality

To make the copy button work,
you need to apply the `copyAction` Svelte action to
a container element that wraps your markdown content.

In your layout file (e.g., `src/routes/blog/+layout.svelte`):

```svelte
<script>
  import { copyAction } from '@mistweaverco/mdsvex-shiki/copyAction';
</script>

<div use:copyAction>
  <slot />
</div>
```

Or if you're rendering markdown content directly:

```svelte
<script>
  import { copyAction } from '@mistweaverco/mdsvex-shiki';
</script>

<div use:copyAction>
  {@html content}
</div>
```

The copy button will automatically copy the code content to
the clipboard when clicked and show a "Copied!" feedback message.

In `svelte.config.js`:
```js
import mdsvexShiki from 'mdsvex-shiki'

const config = {
  // ...
  preprocess: [
    // ...
    mdsvex({
      // ...
      highlight: {
        highlighter: await mdsvexShiki({
          displayPath: true,
          displayLang: true,
          shikiOptions: {
            // Shiki options
            // every option supported by Shiki's `codeToHtml` function
            // with defaults for `theme` and `formatters`
            theme: 'nord',
            wrap: true,
          },
        })
      }
    }),
  ],
}
```



[shiki-transformers]: https://shiki.style/packages/transformers
