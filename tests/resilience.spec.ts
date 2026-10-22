import { expect, test, type Locator } from "@playwright/test";

async function expectReadable(instrument: Locator) {
  await expect(instrument).toBeVisible();
  await expect(instrument).toHaveCSS("opacity", "1");
  await expect(instrument).toHaveCSS("transform", "none");
}

test.beforeEach(async ({ page }) => {
  await page.route("https://fonts.googleapis.com/**", (route) => route.abort());
  await page.route("https://fonts.gstatic.com/**", (route) => route.abort());
});

test("a failed script request leaves styled instruments and native notes readable", async ({
  page,
}) => {
  await page.route("**/*", (route) =>
    route.request().resourceType() === "script" ? route.abort() : route.fallback(),
  );
  await page.goto("/");
  const instruments = page.locator(".machine");
  await expect(instruments).toHaveCount(6);
  for (const instrument of await instruments.all()) {
    await instrument.scrollIntoViewIfNeeded();
    await expectReadable(instrument);
    // Prove the independent stylesheet loaded, rather than testing unstyled HTML.
    await expect(instrument).toHaveCSS("display", "grid");
    await instrument.locator("summary").click();
    await expect(instrument.locator(".notes")).toBeVisible();
  }
  await expect(page.locator(".machine.is-visible")).toHaveCount(0);
});

test("reduced motion keeps instruments opaque and decorative motion finite", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveCSS("scroll-behavior", "auto");
  const instruments = page.locator(".machine");
  await expect(instruments).toHaveCount(6);
  for (const instrument of await instruments.all()) {
    await instrument.scrollIntoViewIfNeeded();
    await expectReadable(instrument);
    await expect(instrument).toHaveCSS("animation-name", "none");
  }
  // Include SVG decorations and pseudo-elements; no ongoing animation may survive.
  const ongoingMotion = await page.locator("body *").evaluateAll((nodes) =>
    nodes.flatMap((node) =>
      [null, "::before", "::after"].flatMap((pseudo) => {
        const style = getComputedStyle(node, pseudo);
        const durations = style.animationDuration.split(",").map(parseFloat);
        const iterations = style.animationIterationCount.split(",").map(Number);
        const active = style.animationName.split(",").some((name, index) => {
          if (name.trim() === "none") return false;
          const count = iterations[index % iterations.length];
          return !Number.isFinite(count) || durations[index % durations.length] * count > 0.001;
        });
        return active ? [`${node.tagName}.${node.getAttribute("class") ?? ""}${pseudo ?? ""}`] : [];
      }),
    ),
  );
  expect(ongoingMotion).toEqual([]);
});

test("direct instrument links bypass entrance fades", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const ids = await page.locator(".machine").evaluateAll((nodes) => nodes.map((node) => node.id));
  expect(ids).toHaveLength(6);
  for (const id of ids) {
    // A fresh document exercises arrival from an external link, not just hash navigation.
    await page.goto(`/?arrival=${id}#${id}`);
    const instrument = page.locator(`#${id}`);
    await expectReadable(instrument);
    await expect(instrument).toBeInViewport();
    await expect(instrument).toHaveCSS("animation-name", "none");
  }
});
