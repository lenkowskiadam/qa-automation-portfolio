import type { Page } from '@playwright/test';

export class BasePage {
  constructor(protected readonly page: Page) {}

  async dismissOverlays(): Promise<void> {
    const welcome = this.page.locator('button[aria-label="Close Welcome Banner"]');
    const appeared = await welcome.waitFor({ state: 'visible', timeout: 3_000 })
      .then(() => true)
      .catch(() => false);
    if (appeared) {
      await welcome.click();
      await this.page.locator('mat-dialog-container').waitFor({ state: 'hidden' });
    }

    const cookies = this.page.locator('.cc-dismiss');
    if (await cookies.isVisible().catch(() => false)) await cookies.click();
  }
}
