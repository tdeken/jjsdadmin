const { createJiti } = require("../../../node_modules/.pnpm/jiti@2.4.2/node_modules/jiti/lib/jiti.cjs")

const jiti = createJiti(__filename, {
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

/** @type {import("/Users/branchcn/Project/web/jjsdadmin/internal/tailwind-config/src/index.js")} */
module.exports = jiti("/Users/branchcn/Project/web/jjsdadmin/internal/tailwind-config/src/index.ts")