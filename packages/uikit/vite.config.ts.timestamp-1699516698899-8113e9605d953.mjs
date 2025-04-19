// vite.config.ts
import { defineConfig } from "file:///F:/Working/flack/frontend/node_modules/.pnpm/vite@4.3.9_@types+node@18.16.2/node_modules/vite/dist/node/index.js";
import { vanillaExtractPlugin } from "file:///F:/Working/flack/frontend/node_modules/.pnpm/@vanilla-extract+vite-plugin@3.8.0_@types+node@18.16.2_vite@4.3.9/node_modules/@vanilla-extract/vite-plugin/dist/vanilla-extract-vite-plugin.cjs.js";
import dts from "file:///F:/Working/flack/frontend/node_modules/.pnpm/vite-plugin-dts@3.5.3_@types+node@18.16.2_rollup@2.78.0_typescript@5.1.3_vite@4.3.9/node_modules/vite-plugin-dts/dist/index.mjs";

// package.json
var package_default = {
  name: "@pancakeswap/uikit",
  version: "0.64.2",
  description: "Set of UI components for pancake projects",
  type: "module",
  main: "dist/index.cjs",
  module: "dist/index.js",
  types: "dist/index.d.ts",
  sideEffects: [
    "*.css.ts",
    "src/css/**/*",
    "src/theme/**/*"
  ],
  exports: {
    "./package.json": "./package.json",
    ".": {
      import: "./dist/index.js",
      require: "./dist/index.cjs"
    },
    "./styles": {
      import: "./dist/style.css",
      require: "./dist/style.css"
    },
    "./css/atoms": {
      import: "./src/css/atoms.ts",
      types: "./dist/css/atoms.d.ts"
    },
    "./css/vars.css": {
      import: "./src/css/vars.css.ts",
      types: "./dist/css/vars.css.d.ts"
    },
    "./css/responsiveStyle": {
      import: "./src/css/responsiveStyle.ts",
      types: "./dist/css/responsiveStyle.d.ts"
    }
  },
  repository: "https://github.com/pancakeswap/pancake-frontend/tree/develop/packages/uikit",
  license: "MIT",
  private: true,
  scripts: {
    "build:uikit": "vite build",
    dev: "vite build --watch --mode development",
    start: "pnpm storybook",
    lint: "eslint 'src/**/*.{js,jsx,ts,tsx}'",
    "format:check": "prettier --check --loglevel error 'src/**/*.{js,jsx,ts,tsx}'",
    "format:write": "prettier --write 'src/**/*.{js,jsx,ts,tsx}'",
    storybook: "storybook dev -p 6006",
    "build:storybook": "storybook build",
    test: "vitest --run",
    "update:snapshot": "vitest -u",
    prepublishOnly: "pnpm run build:uikit",
    clean: "rm -rf .turbo && rm -rf node_modules && rm -rf dist"
  },
  devDependencies: {
    "@babel/core": "^7.20.12",
    "@babel/preset-env": "^7.20.2",
    "@babel/preset-react": "^7.18.6",
    "@pancakeswap/hooks": "workspace:*",
    "@pancakeswap/utils": "workspace:*",
    "@pancakeswap/chains": "workspace:*",
    "@rollup/plugin-json": "^4.1.0",
    "@rollup/plugin-typescript": "^8.2.1",
    "@rollup/plugin-url": "^6.0.0",
    "@storybook/addon-a11y": "^7.0.7",
    "@storybook/addon-actions": "^7.0.7",
    "@storybook/addon-essentials": "^7.0.7",
    "@storybook/addon-links": "^7.0.7",
    "@storybook/builder-vite": "^7.0.7",
    "@storybook/react": "^7.0.7",
    "@storybook/react-vite": "^7.0.7",
    "@testing-library/jest-dom": "^5.11.6",
    "@testing-library/react": "^12.1.3",
    "@types/d3": "^7.4.0",
    "@types/js-cookie": "^3.0.2",
    "@types/lodash": "^4.14.168",
    "@types/react": "^18.2.21",
    "@types/react-dom": "^18.0.6",
    "@types/react-router-dom": "^5.1.7",
    "@types/react-transition-group": "^4.4.1",
    "@types/styled-system__should-forward-prop": "^5.1.2",
    "@vanilla-extract/vite-plugin": "^3.8.0",
    "@vitejs/plugin-react": "4.0.0",
    "babel-jest": "^29.3.1",
    "babel-loader": "^9.1.2",
    "babel-plugin-styled-components": "^1.12.0",
    d3: "^7.8.2",
    jest: "29.3.1",
    "jest-environment-jsdom": "^29.3.1",
    "jest-styled-components": "^7.0.8",
    "js-cookie": "*",
    next: "*",
    "next-seo": "*",
    "next-themes": "^0.2.1",
    polished: "^4.2.2",
    react: "^18.2.0",
    "react-countup": "^6.4.0",
    "react-device-detect": "*",
    "react-dom": "^18.2.0",
    "react-is": "^17.0.2",
    "react-markdown": "^6.0.2",
    "react-redux": "^8.0.5",
    "react-router-dom": "^5.2.0",
    "react-transition-group": "*",
    "remark-gfm": "*",
    rollup: "^2.70.1",
    "rollup-plugin-node-builtins": "^2.1.2",
    storybook: "^7.0.7",
    "styled-components": "^6.0.7",
    "themeprovider-storybook": "^1.7.2",
    "ts-jest": "^27.1.3",
    vite: "4.3.9",
    "vite-plugin-dts": "^3.5.3",
    "vite-tsconfig-paths": "^4.0.3",
    vitest: "^0.27.2",
    wagmi: "^1.4.3"
  },
  peerDependencies: {
    "js-cookie": "*",
    next: "*",
    "next-seo": "*",
    "next-themes": "^0.2.1",
    react: "^18.2.0",
    "react-device-detect": "*",
    "react-dom": "^18.2.0",
    "react-redux": "^8.0.5",
    "react-transition-group": "*",
    "remark-gfm": "*",
    "styled-components": "^6.0.7"
  },
  dependencies: {
    "@pancakeswap/hooks": "workspace:*",
    "@pancakeswap/localization": "workspace:*",
    "@popperjs/core": "^2.9.2",
    "@radix-ui/react-dismissable-layer": "^1.0.3",
    "@radix-ui/react-slot": "^1.0.0",
    "@styled-system/should-forward-prop": "^5.1.5",
    "@types/styled-system": "^5.1.17",
    "@vanilla-extract/css": "^1.13.0",
    "@vanilla-extract/css-utils": "^0.1.3",
    "@vanilla-extract/recipes": "^0.5.0",
    "@vanilla-extract/sprinkles": "^1.6.1",
    "bignumber.js": "^9.0.0",
    clsx: "^1.2.1",
    csstype: "^3.1.2",
    dayjs: "^1.11.10",
    deepmerge: "^4.0.0",
    "framer-motion": "10.16.4",
    "lightweight-charts": "^4.0.1",
    lodash: "^4.17.20",
    "react-popper": "^2.3.0",
    "styled-system": "^5.1.5",
    tslib: "^2.2.0"
  },
  publishConfig: {
    access: "public"
  }
};

// vite.config.ts
var vite_config_default = defineConfig({
  build: {
    lib: {
      entry: "src/index.ts",
      fileName: "index",
      formats: ["cjs", "es"]
    },
    rollupOptions: {
      external: [...Object.keys(package_default.peerDependencies), ...Object.keys(package_default.dependencies), "crypto"]
    }
  },
  plugins: [
    vanillaExtractPlugin({
      identifiers: "short"
    }),
    dts()
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAicGFja2FnZS5qc29uIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRjpcXFxcV29ya2luZ1xcXFxmbGFja1xcXFxmcm9udGVuZFxcXFxwYWNrYWdlc1xcXFx1aWtpdFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRjpcXFxcV29ya2luZ1xcXFxmbGFja1xcXFxmcm9udGVuZFxcXFxwYWNrYWdlc1xcXFx1aWtpdFxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRjovV29ya2luZy9mbGFjay9mcm9udGVuZC9wYWNrYWdlcy91aWtpdC92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gXCJ2aXRlXCI7XG5pbXBvcnQgeyB2YW5pbGxhRXh0cmFjdFBsdWdpbiB9IGZyb20gXCJAdmFuaWxsYS1leHRyYWN0L3ZpdGUtcGx1Z2luXCI7XG5pbXBvcnQgZHRzIGZyb20gXCJ2aXRlLXBsdWdpbi1kdHNcIjtcblxuaW1wb3J0IHBrZyBmcm9tIFwiLi9wYWNrYWdlLmpzb25cIjtcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgYnVpbGQ6IHtcbiAgICBsaWI6IHtcbiAgICAgIGVudHJ5OiBcInNyYy9pbmRleC50c1wiLFxuICAgICAgZmlsZU5hbWU6IFwiaW5kZXhcIixcbiAgICAgIGZvcm1hdHM6IFtcImNqc1wiLCBcImVzXCJdLFxuICAgIH0sXG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgZXh0ZXJuYWw6IFsuLi5PYmplY3Qua2V5cyhwa2cucGVlckRlcGVuZGVuY2llcyksIC4uLk9iamVjdC5rZXlzKHBrZy5kZXBlbmRlbmNpZXMpLCBcImNyeXB0b1wiXSxcbiAgICB9LFxuICB9LFxuICBwbHVnaW5zOiBbXG4gICAgdmFuaWxsYUV4dHJhY3RQbHVnaW4oe1xuICAgICAgaWRlbnRpZmllcnM6IFwic2hvcnRcIixcbiAgICB9KSxcbiAgICBkdHMoKSxcbiAgXSxcbn0pO1xuIiwgIntcbiAgXCJuYW1lXCI6IFwiQHBhbmNha2Vzd2FwL3Vpa2l0XCIsXG4gIFwidmVyc2lvblwiOiBcIjAuNjQuMlwiLFxuICBcImRlc2NyaXB0aW9uXCI6IFwiU2V0IG9mIFVJIGNvbXBvbmVudHMgZm9yIHBhbmNha2UgcHJvamVjdHNcIixcbiAgXCJ0eXBlXCI6IFwibW9kdWxlXCIsXG4gIFwibWFpblwiOiBcImRpc3QvaW5kZXguY2pzXCIsXG4gIFwibW9kdWxlXCI6IFwiZGlzdC9pbmRleC5qc1wiLFxuICBcInR5cGVzXCI6IFwiZGlzdC9pbmRleC5kLnRzXCIsXG4gIFwic2lkZUVmZmVjdHNcIjogW1xuICAgIFwiKi5jc3MudHNcIixcbiAgICBcInNyYy9jc3MvKiovKlwiLFxuICAgIFwic3JjL3RoZW1lLyoqLypcIlxuICBdLFxuICBcImV4cG9ydHNcIjoge1xuICAgIFwiLi9wYWNrYWdlLmpzb25cIjogXCIuL3BhY2thZ2UuanNvblwiLFxuICAgIFwiLlwiOiB7XG4gICAgICBcImltcG9ydFwiOiBcIi4vZGlzdC9pbmRleC5qc1wiLFxuICAgICAgXCJyZXF1aXJlXCI6IFwiLi9kaXN0L2luZGV4LmNqc1wiXG4gICAgfSxcbiAgICBcIi4vc3R5bGVzXCI6IHtcbiAgICAgIFwiaW1wb3J0XCI6IFwiLi9kaXN0L3N0eWxlLmNzc1wiLFxuICAgICAgXCJyZXF1aXJlXCI6IFwiLi9kaXN0L3N0eWxlLmNzc1wiXG4gICAgfSxcbiAgICBcIi4vY3NzL2F0b21zXCI6IHtcbiAgICAgIFwiaW1wb3J0XCI6IFwiLi9zcmMvY3NzL2F0b21zLnRzXCIsXG4gICAgICBcInR5cGVzXCI6IFwiLi9kaXN0L2Nzcy9hdG9tcy5kLnRzXCJcbiAgICB9LFxuICAgIFwiLi9jc3MvdmFycy5jc3NcIjoge1xuICAgICAgXCJpbXBvcnRcIjogXCIuL3NyYy9jc3MvdmFycy5jc3MudHNcIixcbiAgICAgIFwidHlwZXNcIjogXCIuL2Rpc3QvY3NzL3ZhcnMuY3NzLmQudHNcIlxuICAgIH0sXG4gICAgXCIuL2Nzcy9yZXNwb25zaXZlU3R5bGVcIjoge1xuICAgICAgXCJpbXBvcnRcIjogXCIuL3NyYy9jc3MvcmVzcG9uc2l2ZVN0eWxlLnRzXCIsXG4gICAgICBcInR5cGVzXCI6IFwiLi9kaXN0L2Nzcy9yZXNwb25zaXZlU3R5bGUuZC50c1wiXG4gICAgfVxuICB9LFxuICBcInJlcG9zaXRvcnlcIjogXCJodHRwczovL2dpdGh1Yi5jb20vcGFuY2FrZXN3YXAvcGFuY2FrZS1mcm9udGVuZC90cmVlL2RldmVsb3AvcGFja2FnZXMvdWlraXRcIixcbiAgXCJsaWNlbnNlXCI6IFwiTUlUXCIsXG4gIFwicHJpdmF0ZVwiOiB0cnVlLFxuICBcInNjcmlwdHNcIjoge1xuICAgIFwiYnVpbGQ6dWlraXRcIjogXCJ2aXRlIGJ1aWxkXCIsXG4gICAgXCJkZXZcIjogXCJ2aXRlIGJ1aWxkIC0td2F0Y2ggLS1tb2RlIGRldmVsb3BtZW50XCIsXG4gICAgXCJzdGFydFwiOiBcInBucG0gc3Rvcnlib29rXCIsXG4gICAgXCJsaW50XCI6IFwiZXNsaW50ICdzcmMvKiovKi57anMsanN4LHRzLHRzeH0nXCIsXG4gICAgXCJmb3JtYXQ6Y2hlY2tcIjogXCJwcmV0dGllciAtLWNoZWNrIC0tbG9nbGV2ZWwgZXJyb3IgJ3NyYy8qKi8qLntqcyxqc3gsdHMsdHN4fSdcIixcbiAgICBcImZvcm1hdDp3cml0ZVwiOiBcInByZXR0aWVyIC0td3JpdGUgJ3NyYy8qKi8qLntqcyxqc3gsdHMsdHN4fSdcIixcbiAgICBcInN0b3J5Ym9va1wiOiBcInN0b3J5Ym9vayBkZXYgLXAgNjAwNlwiLFxuICAgIFwiYnVpbGQ6c3Rvcnlib29rXCI6IFwic3Rvcnlib29rIGJ1aWxkXCIsXG4gICAgXCJ0ZXN0XCI6IFwidml0ZXN0IC0tcnVuXCIsXG4gICAgXCJ1cGRhdGU6c25hcHNob3RcIjogXCJ2aXRlc3QgLXVcIixcbiAgICBcInByZXB1Ymxpc2hPbmx5XCI6IFwicG5wbSBydW4gYnVpbGQ6dWlraXRcIixcbiAgICBcImNsZWFuXCI6IFwicm0gLXJmIC50dXJibyAmJiBybSAtcmYgbm9kZV9tb2R1bGVzICYmIHJtIC1yZiBkaXN0XCJcbiAgfSxcbiAgXCJkZXZEZXBlbmRlbmNpZXNcIjoge1xuICAgIFwiQGJhYmVsL2NvcmVcIjogXCJeNy4yMC4xMlwiLFxuICAgIFwiQGJhYmVsL3ByZXNldC1lbnZcIjogXCJeNy4yMC4yXCIsXG4gICAgXCJAYmFiZWwvcHJlc2V0LXJlYWN0XCI6IFwiXjcuMTguNlwiLFxuICAgIFwiQHBhbmNha2Vzd2FwL2hvb2tzXCI6IFwid29ya3NwYWNlOipcIixcbiAgICBcIkBwYW5jYWtlc3dhcC91dGlsc1wiOiBcIndvcmtzcGFjZToqXCIsXG4gICAgXCJAcGFuY2FrZXN3YXAvY2hhaW5zXCI6IFwid29ya3NwYWNlOipcIixcbiAgICBcIkByb2xsdXAvcGx1Z2luLWpzb25cIjogXCJeNC4xLjBcIixcbiAgICBcIkByb2xsdXAvcGx1Z2luLXR5cGVzY3JpcHRcIjogXCJeOC4yLjFcIixcbiAgICBcIkByb2xsdXAvcGx1Z2luLXVybFwiOiBcIl42LjAuMFwiLFxuICAgIFwiQHN0b3J5Ym9vay9hZGRvbi1hMTF5XCI6IFwiXjcuMC43XCIsXG4gICAgXCJAc3Rvcnlib29rL2FkZG9uLWFjdGlvbnNcIjogXCJeNy4wLjdcIixcbiAgICBcIkBzdG9yeWJvb2svYWRkb24tZXNzZW50aWFsc1wiOiBcIl43LjAuN1wiLFxuICAgIFwiQHN0b3J5Ym9vay9hZGRvbi1saW5rc1wiOiBcIl43LjAuN1wiLFxuICAgIFwiQHN0b3J5Ym9vay9idWlsZGVyLXZpdGVcIjogXCJeNy4wLjdcIixcbiAgICBcIkBzdG9yeWJvb2svcmVhY3RcIjogXCJeNy4wLjdcIixcbiAgICBcIkBzdG9yeWJvb2svcmVhY3Qtdml0ZVwiOiBcIl43LjAuN1wiLFxuICAgIFwiQHRlc3RpbmctbGlicmFyeS9qZXN0LWRvbVwiOiBcIl41LjExLjZcIixcbiAgICBcIkB0ZXN0aW5nLWxpYnJhcnkvcmVhY3RcIjogXCJeMTIuMS4zXCIsXG4gICAgXCJAdHlwZXMvZDNcIjogXCJeNy40LjBcIixcbiAgICBcIkB0eXBlcy9qcy1jb29raWVcIjogXCJeMy4wLjJcIixcbiAgICBcIkB0eXBlcy9sb2Rhc2hcIjogXCJeNC4xNC4xNjhcIixcbiAgICBcIkB0eXBlcy9yZWFjdFwiOiBcIl4xOC4yLjIxXCIsXG4gICAgXCJAdHlwZXMvcmVhY3QtZG9tXCI6IFwiXjE4LjAuNlwiLFxuICAgIFwiQHR5cGVzL3JlYWN0LXJvdXRlci1kb21cIjogXCJeNS4xLjdcIixcbiAgICBcIkB0eXBlcy9yZWFjdC10cmFuc2l0aW9uLWdyb3VwXCI6IFwiXjQuNC4xXCIsXG4gICAgXCJAdHlwZXMvc3R5bGVkLXN5c3RlbV9fc2hvdWxkLWZvcndhcmQtcHJvcFwiOiBcIl41LjEuMlwiLFxuICAgIFwiQHZhbmlsbGEtZXh0cmFjdC92aXRlLXBsdWdpblwiOiBcIl4zLjguMFwiLFxuICAgIFwiQHZpdGVqcy9wbHVnaW4tcmVhY3RcIjogXCI0LjAuMFwiLFxuICAgIFwiYmFiZWwtamVzdFwiOiBcIl4yOS4zLjFcIixcbiAgICBcImJhYmVsLWxvYWRlclwiOiBcIl45LjEuMlwiLFxuICAgIFwiYmFiZWwtcGx1Z2luLXN0eWxlZC1jb21wb25lbnRzXCI6IFwiXjEuMTIuMFwiLFxuICAgIFwiZDNcIjogXCJeNy44LjJcIixcbiAgICBcImplc3RcIjogXCIyOS4zLjFcIixcbiAgICBcImplc3QtZW52aXJvbm1lbnQtanNkb21cIjogXCJeMjkuMy4xXCIsXG4gICAgXCJqZXN0LXN0eWxlZC1jb21wb25lbnRzXCI6IFwiXjcuMC44XCIsXG4gICAgXCJqcy1jb29raWVcIjogXCIqXCIsXG4gICAgXCJuZXh0XCI6IFwiKlwiLFxuICAgIFwibmV4dC1zZW9cIjogXCIqXCIsXG4gICAgXCJuZXh0LXRoZW1lc1wiOiBcIl4wLjIuMVwiLFxuICAgIFwicG9saXNoZWRcIjogXCJeNC4yLjJcIixcbiAgICBcInJlYWN0XCI6IFwiXjE4LjIuMFwiLFxuICAgIFwicmVhY3QtY291bnR1cFwiOiBcIl42LjQuMFwiLFxuICAgIFwicmVhY3QtZGV2aWNlLWRldGVjdFwiOiBcIipcIixcbiAgICBcInJlYWN0LWRvbVwiOiBcIl4xOC4yLjBcIixcbiAgICBcInJlYWN0LWlzXCI6IFwiXjE3LjAuMlwiLFxuICAgIFwicmVhY3QtbWFya2Rvd25cIjogXCJeNi4wLjJcIixcbiAgICBcInJlYWN0LXJlZHV4XCI6IFwiXjguMC41XCIsXG4gICAgXCJyZWFjdC1yb3V0ZXItZG9tXCI6IFwiXjUuMi4wXCIsXG4gICAgXCJyZWFjdC10cmFuc2l0aW9uLWdyb3VwXCI6IFwiKlwiLFxuICAgIFwicmVtYXJrLWdmbVwiOiBcIipcIixcbiAgICBcInJvbGx1cFwiOiBcIl4yLjcwLjFcIixcbiAgICBcInJvbGx1cC1wbHVnaW4tbm9kZS1idWlsdGluc1wiOiBcIl4yLjEuMlwiLFxuICAgIFwic3Rvcnlib29rXCI6IFwiXjcuMC43XCIsXG4gICAgXCJzdHlsZWQtY29tcG9uZW50c1wiOiBcIl42LjAuN1wiLFxuICAgIFwidGhlbWVwcm92aWRlci1zdG9yeWJvb2tcIjogXCJeMS43LjJcIixcbiAgICBcInRzLWplc3RcIjogXCJeMjcuMS4zXCIsXG4gICAgXCJ2aXRlXCI6IFwiNC4zLjlcIixcbiAgICBcInZpdGUtcGx1Z2luLWR0c1wiOiBcIl4zLjUuM1wiLFxuICAgIFwidml0ZS10c2NvbmZpZy1wYXRoc1wiOiBcIl40LjAuM1wiLFxuICAgIFwidml0ZXN0XCI6IFwiXjAuMjcuMlwiLFxuICAgIFwid2FnbWlcIjogXCJeMS40LjNcIlxuICB9LFxuICBcInBlZXJEZXBlbmRlbmNpZXNcIjoge1xuICAgIFwianMtY29va2llXCI6IFwiKlwiLFxuICAgIFwibmV4dFwiOiBcIipcIixcbiAgICBcIm5leHQtc2VvXCI6IFwiKlwiLFxuICAgIFwibmV4dC10aGVtZXNcIjogXCJeMC4yLjFcIixcbiAgICBcInJlYWN0XCI6IFwiXjE4LjIuMFwiLFxuICAgIFwicmVhY3QtZGV2aWNlLWRldGVjdFwiOiBcIipcIixcbiAgICBcInJlYWN0LWRvbVwiOiBcIl4xOC4yLjBcIixcbiAgICBcInJlYWN0LXJlZHV4XCI6IFwiXjguMC41XCIsXG4gICAgXCJyZWFjdC10cmFuc2l0aW9uLWdyb3VwXCI6IFwiKlwiLFxuICAgIFwicmVtYXJrLWdmbVwiOiBcIipcIixcbiAgICBcInN0eWxlZC1jb21wb25lbnRzXCI6IFwiXjYuMC43XCJcbiAgfSxcbiAgXCJkZXBlbmRlbmNpZXNcIjoge1xuICAgIFwiQHBhbmNha2Vzd2FwL2hvb2tzXCI6IFwid29ya3NwYWNlOipcIixcbiAgICBcIkBwYW5jYWtlc3dhcC9sb2NhbGl6YXRpb25cIjogXCJ3b3Jrc3BhY2U6KlwiLFxuICAgIFwiQHBvcHBlcmpzL2NvcmVcIjogXCJeMi45LjJcIixcbiAgICBcIkByYWRpeC11aS9yZWFjdC1kaXNtaXNzYWJsZS1sYXllclwiOiBcIl4xLjAuM1wiLFxuICAgIFwiQHJhZGl4LXVpL3JlYWN0LXNsb3RcIjogXCJeMS4wLjBcIixcbiAgICBcIkBzdHlsZWQtc3lzdGVtL3Nob3VsZC1mb3J3YXJkLXByb3BcIjogXCJeNS4xLjVcIixcbiAgICBcIkB0eXBlcy9zdHlsZWQtc3lzdGVtXCI6IFwiXjUuMS4xN1wiLFxuICAgIFwiQHZhbmlsbGEtZXh0cmFjdC9jc3NcIjogXCJeMS4xMy4wXCIsXG4gICAgXCJAdmFuaWxsYS1leHRyYWN0L2Nzcy11dGlsc1wiOiBcIl4wLjEuM1wiLFxuICAgIFwiQHZhbmlsbGEtZXh0cmFjdC9yZWNpcGVzXCI6IFwiXjAuNS4wXCIsXG4gICAgXCJAdmFuaWxsYS1leHRyYWN0L3Nwcmlua2xlc1wiOiBcIl4xLjYuMVwiLFxuICAgIFwiYmlnbnVtYmVyLmpzXCI6IFwiXjkuMC4wXCIsXG4gICAgXCJjbHN4XCI6IFwiXjEuMi4xXCIsXG4gICAgXCJjc3N0eXBlXCI6IFwiXjMuMS4yXCIsXG4gICAgXCJkYXlqc1wiOiBcIl4xLjExLjEwXCIsXG4gICAgXCJkZWVwbWVyZ2VcIjogXCJeNC4wLjBcIixcbiAgICBcImZyYW1lci1tb3Rpb25cIjogXCIxMC4xNi40XCIsXG4gICAgXCJsaWdodHdlaWdodC1jaGFydHNcIjogXCJeNC4wLjFcIixcbiAgICBcImxvZGFzaFwiOiBcIl40LjE3LjIwXCIsXG4gICAgXCJyZWFjdC1wb3BwZXJcIjogXCJeMi4zLjBcIixcbiAgICBcInN0eWxlZC1zeXN0ZW1cIjogXCJeNS4xLjVcIixcbiAgICBcInRzbGliXCI6IFwiXjIuMi4wXCJcbiAgfSxcbiAgXCJwdWJsaXNoQ29uZmlnXCI6IHtcbiAgICBcImFjY2Vzc1wiOiBcInB1YmxpY1wiXG4gIH1cbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBc1QsU0FBUyxvQkFBb0I7QUFDblYsU0FBUyw0QkFBNEI7QUFDckMsT0FBTyxTQUFTOzs7QUNGaEI7QUFBQSxFQUNFLE1BQVE7QUFBQSxFQUNSLFNBQVc7QUFBQSxFQUNYLGFBQWU7QUFBQSxFQUNmLE1BQVE7QUFBQSxFQUNSLE1BQVE7QUFBQSxFQUNSLFFBQVU7QUFBQSxFQUNWLE9BQVM7QUFBQSxFQUNULGFBQWU7QUFBQSxJQUNiO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxFQUNGO0FBQUEsRUFDQSxTQUFXO0FBQUEsSUFDVCxrQkFBa0I7QUFBQSxJQUNsQixLQUFLO0FBQUEsTUFDSCxRQUFVO0FBQUEsTUFDVixTQUFXO0FBQUEsSUFDYjtBQUFBLElBQ0EsWUFBWTtBQUFBLE1BQ1YsUUFBVTtBQUFBLE1BQ1YsU0FBVztBQUFBLElBQ2I7QUFBQSxJQUNBLGVBQWU7QUFBQSxNQUNiLFFBQVU7QUFBQSxNQUNWLE9BQVM7QUFBQSxJQUNYO0FBQUEsSUFDQSxrQkFBa0I7QUFBQSxNQUNoQixRQUFVO0FBQUEsTUFDVixPQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0EseUJBQXlCO0FBQUEsTUFDdkIsUUFBVTtBQUFBLE1BQ1YsT0FBUztBQUFBLElBQ1g7QUFBQSxF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
