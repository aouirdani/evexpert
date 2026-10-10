import { defineConfig } from "vitest/config";
import base from "./vitest.config";

/** Vérifications sans connexion, recréation ni migration de base de données. */
export default defineConfig({
  ...base,
  test: {
    ...base.test,
    include: ["tests/unit/**/*.test.ts"],
    globalSetup: [],
  },
});
