import type { BuildConfig } from "bun";
import dts from "bun-plugin-dts";

const external = ["svelte"];

const defaultBuildConfig: BuildConfig = {
  entrypoints: ["./src/index.ts"],
  outdir: "dist",
  external,
};

const copyAction: BuildConfig = {
  entrypoints: ["./src/copy-action.ts"],
  outdir: "dist",
  external,
};

await Promise.all([
  Bun.build({
    ...defaultBuildConfig,
    plugins: [dts()],
    format: "esm",
    naming: "[dir]/[name].js",
  }),
  Bun.build({
    ...defaultBuildConfig,
    format: "cjs",
    naming: "[dir]/[name].cjs",
  }),
  Bun.build({
    ...copyAction,
    plugins: [dts()],
    format: "esm",
    naming: "[dir]/[name].js",
  }),
  Bun.build({
    ...copyAction,
    format: "cjs",
    naming: "[dir]/[name].cjs",
  }),
]);
