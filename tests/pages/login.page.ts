import { expect, type Page } from '@playwright/test';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  constructor(page: Page) { super(page); }

  async goto(): Promise<void> {
    await this.page.goto('/#/login');
    await this.dismissOverlays();
    await expect(this.page.locator('#loginButton')).toBeVisible();
  }

  async login(email: string, password: string): Promise<void> {
    await this.page.locator('#email').fill(email);
    await this.page.locator('#password').fill(password);
    await this.page.locator('#loginButton').click();
  }
}
