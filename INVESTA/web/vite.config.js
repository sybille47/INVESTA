import { defineConfig } from "vite";
import tailwindcss from '@tailwindcss/vite'
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    include: [
      "@mui/material",
      "@mui/styled-engine",
      "@emotion/react",
      "@emotion/styled",
      "@mui/x-charts",
    ],
    build: {
      outDir: "dist"
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.js",
  },
});




// import { defineConfig } from "vite";
// import tailwindcss from '@tailwindcss/vite'
// import react from "@vitejs/plugin-react";
// import { createRequire } from "module";
// const require = createRequire(import.meta.url);
// import path from "path";

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react(), tailwindcss()],
//   optimizeDeps: {
//     include: [
//       "@mui/material",
//       "@mui/styled-engine",
//       "@emotion/react",
//       "@emotion/styled",
//       "@mui/x-charts",
//     ],
//   },
//   ssr: {
//     noExternal: [
//       "@mui/material",
//       "@mui/x-charts",
//       "@emotion/react",
//       "@emotion/styled",
//     ],
//   },
//   resolve: {
//     alias: {
//       // help Vite resolve emotion packages to the installed versions
//       "@emotion/react": require.resolve("@emotion/react"),
//       "@emotion/styled": require.resolve("@emotion/styled"),
//       // ensure MUI styled engine picks up emotion
//       "@mui/styled-engine": require.resolve("@mui/styled-engine"),
//       "@": path.resolve(__dirname, "src"),
//     },
//   },
//   test: {
//     globals: true,
//     environment: "jsdom",
//     setupFiles: "./src/setupTests.js",
//   },
// });
