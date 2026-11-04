import { APIRequestContext, expect } from '@playwright/test';
import type { TestUser } from './test-data';

type CreatedUser = { id: number; email: string };

export class JuiceShopApi {
  constructor(private readonly request: APIRequestContext) {}

  async createUser(user: TestUser): Promise<CreatedUser> {
    const response = await this.request.post('/api/Users', {
      data: {
        email: user.email,
        password: user.password,
        passwordRepeat: user.password,
        securityQuestion: { id: 1, question: 'Your eldest siblings middle name?' },
        securityAnswer: user.securityAnswer,
      },
    });
    expect(response.status()).toBe(201);
    const body = await response.json();
    return { id: body.data.id, email: body.data.email };
  }

}
