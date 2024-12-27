import { createJiti } from "../../../../../node_modules/.pnpm/jiti@2.4.2/node_modules/jiti/lib/jiti.mjs";

const jiti = createJiti(import.meta.url, {
  "interopDefault": true,
  "alias": {
    "@vben-core/shared": "/Users/branchcn/Project/web/jjsdadmin/packages/@core/base/shared"
  },
  "transformOptions": {
    "babel": {
      "plugins": []
    }
  }
})

/** @type {import("/Users/branchcn/Project/web/jjsdadmin/packages/@core/base/shared/src/global-state.js")} */
const _module = await jiti.import("/Users/branchcn/Project/web/jjsdadmin/packages/@core/base/shared/src/global-state.ts");

export const globalShareState = _module.globalShareState;