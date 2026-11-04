import { expect, type Page } from '@playwright/test';
import { BasePage } from './base.page';
import type { TestUser } from '../support/test-data';

export class RegistrationPage extends BasePage {
  constructor(page: Page) { super(page); }

  async goto(): Promise<void> {
    await this.page.goto('/#/register');
    await this.dismissOverlays();
    await expect(this.page.locator('#registerButton')).toBeVisible();
  }

  async register(user: TestUser): Promise<void> {
    await this.page.locator('#emailControl').fill(user.email);
    await this.page.locator('#passwordControl').fill(user.password);
    await this.page.locator('#repeatPasswordControl').fill(user.password);
    const securityQuestion = this.page.getByRole('combobox', { name: 'Selection list for the security question' });
    await securityQuestion.click();
    await this.page.getByRole('option', { name: 'Your eldest siblings middle name?' }).click();
    await this.page.locator('#securityAnswerControl').fill(user.securityAnswer);
    await this.page.locator('#registerButton').click();
  }
}
