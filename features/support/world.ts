import {
  After,
  Before,
  setDefaultTimeout,
  setWorldConstructor,
  Status,
  World,
} from '@cucumber/cucumber';
import type { IWorldOptions } from '@cucumber/cucumber';
import { chromium, request } from '@playwright/test';
import type {
  APIRequestContext,
  APIResponse,
  Browser,
  BrowserContext,
  Page,
} from '@playwright/test';
import type { TestUser } from '../../tests/support/test-data';

setDefaultTimeout(30_000);

export class TestWorld extends World {
  browser?: Browser;
  context?: BrowserContext;
  page?: Page;
  apiContext?: APIRequestContext;
  user?: TestUser;
  response?: APIResponse;

  constructor(options: IWorldOptions) {
    super(options);
  }
}

setWorldConstructor(TestWorld);

Before(async function (this: TestWorld, scenario) {
  const baseURL = process.env.BASE_URL ?? 'http://127.0.0.1:3000';

  if (scenario.pickle.tags.some(({ name }) => name === '@ui')) {
    this.browser = await chromium.launch();
    this.context = await this.browser.newContext({ baseURL });
    this.page = await this.context.newPage();
  }

  if (scenario.pickle.tags.some(({ name }) => name === '@api')) {
    this.apiContext = await request.newContext({ baseURL });
  }
});

After(async function (this: TestWorld, scenario) {
  if (scenario.result?.status === Status.FAILED && this.page) {
    await this.attach(await this.page.screenshot({ fullPage: true }), 'image/png');
  }
  await this.apiContext?.dispose();
  await this.context?.close();
  await this.browser?.close();
});
