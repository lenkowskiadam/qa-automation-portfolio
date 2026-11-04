import { test, expect } from './fixtures';
import { BasePage } from './pages/base.page';

test.describe('Product catalogue', () => {
  test('shows seeded products with business-relevant details', async ({ page }) => {
    await page.goto('/#/');
    await new BasePage(page).dismissOverlays();

    const appleJuice = page.getByText('Apple Juice (1000ml)', { exact: true });
    await expect(appleJuice).toBeVisible();
    await expect(appleJuice.locator('xpath=ancestor::mat-card')).toContainText('1.99¤');
  });

  test('filters the catalogue by a customer search term', async ({ page }) => {
    await page.goto('/#/');
    await new BasePage(page).dismissOverlays();
    await page.locator('#searchQuery').click();
    const search = page.getByRole('textbox').first();
    await search.fill('banana');
    await search.press('Enter');

    const cards = page.getByRole('article');
    await expect(cards).toHaveCount(1);
    await expect(cards.first()).toContainText(/banana/i);
  });
});
