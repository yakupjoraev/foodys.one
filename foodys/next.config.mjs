/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");

import nextTranslate from "next-translate-plugin";

/** @type {import("next").NextConfig} */
const config = nextTranslate({
  reactStrictMode: true,
});

export default config;
