import { test as base } from '@playwright/test';
import { JuiceShopApi } from './support/api-client';

type Fixtures = { api: JuiceShopApi };

export const test = base.extend<Fixtures>({
  api: async ({ request }, use) => {
    await use(new JuiceShopApi(request));
  },
});

export { expect } from '@playwright/test';
