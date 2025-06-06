import { createJiti } from "../../../node_modules/.pnpm/jiti@2.4.2/node_modules/jiti/lib/jiti.mjs";

const jiti = createJiti(import.meta.url, {
  "interopDefault": true,
  "alias": {
    "@vben/tailwind-config": "/Users/branchcn/Project/web/jjsdadmin/internal/tailwind-config"
  },
  "transformOptions": {
    "babel": {
      "plugins": []
    }
  }
})

/** @type {import("/Users/branchcn/Project/web/jjsdadmin/internal/tailwind-config/src/postcss.config.js")} */
const _module = await jiti.import("/Users/branchcn/Project/web/jjsdadmin/internal/tailwind-config/src/postcss.config.ts");

export default _module?.default ?? _module;