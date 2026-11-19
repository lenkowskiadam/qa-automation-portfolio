import { Given, Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { LoginPage } from '../../tests/pages/login.page';
import { RegistrationPage } from '../../tests/pages/registration.page';
import { JuiceShopApi } from '../../tests/support/api-client';
import { uniqueUser } from '../../tests/support/test-data';
import type { TestWorld } from '../support/world';

Given('I am a newly registered customer', async function (this: TestWorld) {
  this.user = uniqueUser('bdd-ui-register');
  const registration = new RegistrationPage(this.page!);
  await registration.goto();
  await registration.register(this.user);
  await expect(this.page!).toHaveURL(/#\/login$/);
});

When('I log in with my registered credentials', async function (this: TestWorld) {
  await new LoginPage(this.page!).login(this.user!.email, this.user!.password);
});

Then('I am taken to the product catalogue', async function (this: TestWorld) {
  await expect(this.page!).toHaveURL(/#\/search$/);
});

Given('I open the login page', async function (this: TestWorld) {
  await new LoginPage(this.page!).goto();
});

When(
  'I log in with email {string} and password {string}',
  async function (this: TestWorld, email: string, password: string) {
    await new LoginPage(this.page!).login(email, password);
  },
);

Then('I see the invalid credentials message', async function (this: TestWorld) {
  await expect(this.page!.getByText('Invalid email or password.')).toBeVisible();
});

Then('I remain on the login page', async function (this: TestWorld) {
  await expect(this.page!).toHaveURL(/#\/login$/);
});

Given('I open the registration page', async function (this: TestWorld) {
  await new RegistrationPage(this.page!).goto();
});

When('I enter different passwords in the password fields', async function (this: TestWorld) {
  const user = uniqueUser('bdd-ui-mismatch');
  await this.page!.locator('#emailControl').fill(user.email);
  await this.page!.locator('#passwordControl').fill(user.password);
  await this.page!.locator('#repeatPasswordControl').fill('Different!Password123');
  await this.page!.locator('#repeatPasswordControl').press('Tab');
});

Then('I see the passwords do not match message', async function (this: TestWorld) {
  await expect(this.page!.getByText('Passwords do not match')).toBeVisible();
});

Then('the registration button is disabled', async function (this: TestWorld) {
  await expect(this.page!.locator('#registerButton')).toBeDisabled();
});

Given('I create a unique customer through the API', async function (this: TestWorld) {
  this.user = uniqueUser('bdd-api');
  await new JuiceShopApi(this.apiContext!).createUser(this.user);
});

When("I log in through the API with that customer's credentials", async function (this: TestWorld) {
  this.response = await this.apiContext!.post('/rest/user/login', {
    data: { email: this.user!.email, password: this.user!.password },
  });
});

Then('the API returns a valid authentication token', async function (this: TestWorld) {
  expect(this.response!.status()).toBe(200);
  expect((await this.response!.json()).authentication).toEqual(expect.objectContaining({
    bid: expect.any(Number),
    token: expect.any(String),
    umail: this.user!.email,
  }));
});

When('I try to create the same customer again through the API', async function (this: TestWorld) {
  this.response = await this.apiContext!.post('/api/Users', {
    data: {
      email: this.user!.email,
      password: this.user!.password,
      passwordRepeat: this.user!.password,
      securityQuestion: { id: 1, question: 'Your eldest siblings middle name?' },
      securityAnswer: this.user!.securityAnswer,
    },
  });
});

Then('the API reports that the email must be unique', async function (this: TestWorld) {
  expect(this.response!.status()).toBe(400);
  expect((await this.response!.json()).errors).toContainEqual(expect.objectContaining({
    field: 'email',
    message: expect.stringMatching(/email must be unique/i),
  }));
});

When('I log in through the API as a non-existent customer', async function (this: TestWorld) {
  this.response = await this.apiContext!.post('/rest/user/login', {
    data: { email: uniqueUser('bdd-missing').email, password: 'Wrong!Password123' },
  });
});

Then('the API rejects the login without leaking technical details', async function (this: TestWorld) {
  expect(this.response!.status()).toBe(401);
  expect(await this.response!.text()).not.toMatch(/sql|sequelize|stack/i);
});
