const { test, expect } = require('@playwright/test');
const sizes = [{ width: 390, height: 844 }, { width: 768, height: 1024 }, { width: 1440, height: 900 }];
for (const viewport of sizes) {
  test('hero and next section do not overlap at ' + viewport.width, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('/');
    await page.locator('.banner-hero').waitFor();
    await page.evaluate(() => document.fonts.ready);
    const hero = await page.locator('.banner-hero').boundingBox();
    expect(hero, 'hero must be visible').not.toBeNull();
    const next = await page.locator('.banner-hero + *').boundingBox();
    expect(next, 'following section must exist').not.toBeNull();
    expect(next.y, 'next section must not intrude into hero').toBeGreaterThanOrEqual(hero.y + hero.height - 2);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    expect(overflow, 'horizontal page overflow').toBeLessThanOrEqual(2);
    await expect(page).toHaveScreenshot('home-' + viewport.width + '.png', { animations: 'disabled', fullPage: true, maxDiffPixelRatio: 0.02 });
  });
}
