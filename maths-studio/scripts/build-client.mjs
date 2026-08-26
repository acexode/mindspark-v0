import { build } from "vite";

await build({
  configFile: false,
  build: { outDir: "dist/client" },
});
