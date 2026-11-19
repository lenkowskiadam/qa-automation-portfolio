import { Given, Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { BasePage } from '../../tests/pages/base.page';
import type { TestWorld } from '../support/world';

Given('I open the product catalogue', async function (this: TestWorld) {
  await this.page!.goto('/#/');
  await new BasePage(this.page!).dismissOverlays();
});

Then('I see {string} priced at {string}', async function (this: TestWorld, name: string, price: string) {
  const product = this.page!.getByText(name, { exact: true });
  await expect(product).toBeVisible();
  await expect(product.locator('xpath=ancestor::mat-card')).toContainText(price);
});

When('I search the catalogue for {string}', async function (this: TestWorld, term: string) {
  await this.page!.locator('#searchQuery').click();
  const search = this.page!.getByRole('textbox').first();
  await search.fill(term);
  await search.press('Enter');
});

Then('I see exactly {int} product', async function (this: TestWorld, count: number) {
  await expect(this.page!.getByRole('article')).toHaveCount(count);
});

Then('every visible product contains {string}', async function (this: TestWorld, text: string) {
  const cards = this.page!.getByRole('article');
  for (let index = 0; index < await cards.count(); index += 1) {
    await expect(cards.nth(index)).toContainText(new RegExp(text, 'i'));
  }
});
