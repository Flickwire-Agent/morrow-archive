import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  workers: 1,
  use: {
    browserName: "chromium",
    baseURL: "http://127.0.0.1:4178",
    trace: "retain-on-failure",
  },
  projects: [1440, 390].flatMap((width) =>
    [true, false].map((javaScriptEnabled) => ({
      name: `${width}px-${javaScriptEnabled ? "scripts" : "no-scripts"}`,
      use: { viewport: { width, height: 900 }, javaScriptEnabled },
    })),
  ),
  webServer: {
    command: "pnpm build && pnpm exec vite preview --host 127.0.0.1 --port 4178 --strictPort",
    url: "http://127.0.0.1:4178",
    reuseExistingServer: false,
  },
});
