import { defineConfig } from 'astro/config';

// The catalog site (src/pages) is for visual verification only; the package ships src/components + src/styles.
export default defineConfig({
  site: 'https://uneri.dev',
  trailingSlash: 'always',
});
