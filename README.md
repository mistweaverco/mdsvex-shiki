# mdsvex-shiki

Supports most [common transformers][shiki-transformers] out of the box.

## Installation

Using bun:

```bash
bun add @mistweaverco/mdsvex-shiki#v1.0.12
```

## Configuration

Available options are as follows:

- `displayTitle`: Whether to show the title bar when a title is
  provided in the code block info string. (default: `false`)
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
  displayTitle: true,
  displayLang: true,
  shikiOptions: {
    theme: 'nord',
  }
}
```

### Import styles

If you just want to basic Shiki styling without the bar,
you don't need to import this CSS file.

If you to display the title, language and/or copy button,
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
  import { copyAction } from '@mistweaverco/mdsvex-shiki';
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
          displayTitle: true,
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
