
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // Ensure base path is correctly set for production
  base: '/',
  server: {
    host: "::",
    port: 8080,
  },
  build: {
    // Ensure we're generating proper sourcemaps for production debugging
    sourcemap: true,
    // Output more verbose information during build
    reportCompressedSize: true,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
