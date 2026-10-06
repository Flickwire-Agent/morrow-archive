import { expect, test, type Locator, type Page } from "@playwright/test";

const instruments = [
  "unfinished-compass",
  "memory-clock",
  "unease-barometer",
  "lost-word",
  "attention-lantern",
  "possibility-radio",
];

// Reach controls through sequential navigation, never click() or focus().
async function tabTo(page: Page, target: Locator) {
  for (let step = 0; step < 60; step++) {
    await page.keyboard.press("Tab");
    if (await target.evaluate((node) => node === document.activeElement)) return;
  }
  throw new Error(`Control was not keyboard-reachable: ${target}`);
}

async function expectVisibleFocus(control: Locator) {
  await expect(control).toBeFocused();
  await expect(control).toHaveCSS("outline-style", "solid");
  await expect(control).toHaveCSS("outline-width", "2px");
  await expect(control).toHaveJSProperty("tabIndex", 0);
  await expect
    .poll(() =>
      control.evaluate((node) => {
        const rect = node.getBoundingClientRect();
        // Native scrolling can round by a fraction of a CSS pixel.
        return (
          node.matches(":focus-visible") &&
          rect.top >= -1 &&
          rect.bottom <= innerHeight + 1 &&
          rect.left >= -1 &&
          rect.right <= innerWidth + 1
        );
      }),
    )
    .toBe(true);
}

test.beforeEach(async ({ page }) => {
  // Keep the checks local and exercise the site's fallback typography.
  await page.route("https://fonts.googleapis.com/**", (route) => route.abort());
  await page.route("https://fonts.gstatic.com/**", (route) => route.abort());
  await page.goto("/");
});

test("skip link continues into all six native operating notes", async ({ page }) => {
  await page.keyboard.press("Tab");
  await expectVisibleFocus(page.getByRole("link", { name: "Skip to the exhibit" }));
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#exhibit$/);

  for (const id of instruments) {
    const instrument = page.locator(`#${id}`);
    await page.keyboard.press("Tab");
    await expectVisibleFocus(instrument.locator("summary"));
    await expect(instrument.locator(".notes")).toBeHidden();
    await page.keyboard.press("Enter");
    await expect(instrument.locator("details")).toHaveAttribute("open", "");
    await expect(instrument.locator(".notes")).toBeVisible();
    await page.keyboard.press("Space");
    await expect(instrument.locator("details")).not.toHaveAttribute("open");
    await expect(instrument.locator(".notes")).toBeHidden();
  }

  for (const id of instruments.slice(0, -1).reverse()) {
    await page.keyboard.press("Shift+Tab");
    await expectVisibleFocus(page.locator(`#${id} summary`));
  }
});

test("every index link continues keyboard navigation at its instrument", async ({ page }) => {
  for (const id of instruments) {
    await page.goto("/");
    const link = page.locator(`.instrument-index a[href="#${id}"]`);
    await tabTo(page, link);
    await expectVisibleFocus(link);
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(new RegExp(`#${id}$`));
    await page.keyboard.press("Tab");
    await expectVisibleFocus(page.locator(`#${id} summary`));
  }
});
