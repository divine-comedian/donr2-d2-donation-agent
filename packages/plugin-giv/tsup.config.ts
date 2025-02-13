import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/index.ts"],
    outDir: "dist",
    clean: true,
    sourcemap: true,
    format: "esm",
    external: ["zod", "fs", "dotenv", "path"],
});
