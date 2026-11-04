import { test, expect } from './fixtures';
import { LoginPage } from './pages/login.page';
import { RegistrationPage } from './pages/registration.page';
import { uniqueUser } from './support/test-data';

test.describe('Customer authentication through UI', () => {
  test('registers a customer and allows login', async ({ page }) => {
    const user = uniqueUser('ui-register');
    const registration = new RegistrationPage(page);
    await registration.goto();
    await registration.register(user);
    await expect(page).toHaveURL(/#\/login$/);

    const login = new LoginPage(page);
    await login.login(user.email, user.password);
    await expect(page).toHaveURL(/#\/search$/);

  });

  test('rejects invalid credentials with a clear message', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login('missing.user@example.test', 'Wrong!Password123');

    await expect(page.getByText('Invalid email or password.')).toBeVisible();
    await expect(page).toHaveURL(/#\/login$/);
  });

  test('prevents registration when password confirmation differs', async ({ page }) => {
    const registration = new RegistrationPage(page);
    const user = uniqueUser('ui-mismatch');
    await registration.goto();
    await page.locator('#emailControl').fill(user.email);
    await page.locator('#passwordControl').fill(user.password);
    await page.locator('#repeatPasswordControl').fill('Different!Password123');
    await page.locator('#repeatPasswordControl').press('Tab');

    await expect(page.getByText('Passwords do not match')).toBeVisible();
    await expect(page.locator('#registerButton')).toBeDisabled();
  });
});
