import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { socialApiPlugin } from "./server/vite-api-plugin";
export default defineConfig({
    plugins: [react(), socialApiPlugin()],
});
