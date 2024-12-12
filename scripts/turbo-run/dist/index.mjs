import { createJiti } from "../../../node_modules/.pnpm/jiti@2.4.0/node_modules/jiti/lib/jiti.mjs";

const jiti = createJiti(import.meta.url, {
  "interopDefault": true,
  "alias": {
    "@vben/turbo-run": "/Users/branchcn/Project/web/jjsdadmin/scripts/turbo-run"
  },
  "transformOptions": {
    "babel": {
      "plugins": []
    }
  }
})

/** @type {import("/Users/branchcn/Project/web/jjsdadmin/scripts/turbo-run/src/index.js")} */
const _module = await jiti.import("/Users/branchcn/Project/web/jjsdadmin/scripts/turbo-run/src/index.ts");

export default _module;