import { test, expect } from './fixtures';
import { uniqueUser } from './support/test-data';

test.describe('Customer authentication API', () => {
  test('creates a customer and returns a usable login token', async ({ request, api }) => {
    const user = uniqueUser('api-login');
    const created = await api.createUser(user);

    const response = await request.post('/rest/user/login', {
      data: { email: user.email, password: user.password },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.authentication).toEqual(expect.objectContaining({
      bid: expect.any(Number),
      token: expect.any(String),
      umail: user.email,
    }));

    expect(created).toEqual({ id: expect.any(Number), email: user.email });
  });

  test('rejects duplicate customer email', async ({ request, api }) => {
    const user = uniqueUser('api-duplicate');
    const created = await api.createUser(user);

    const response = await request.post('/api/Users', {
      data: {
        email: user.email,
        password: user.password,
        passwordRepeat: user.password,
        securityQuestion: { id: 1, question: 'Your eldest siblings middle name?' },
        securityAnswer: user.securityAnswer,
      },
    });
    expect(response.status()).toBe(400);
    expect((await response.json()).errors).toContainEqual(expect.objectContaining({
      field: 'email',
      message: expect.stringMatching(/email must be unique/i),
    }));
    expect(created.email).toBe(user.email);
  });

  test('rejects login for a non-existent customer without leaking details', async ({ request }) => {
    const response = await request.post('/rest/user/login', {
      data: { email: uniqueUser('missing').email, password: 'Wrong!Password123' },
    });
    expect(response.status()).toBe(401);
    expect(await response.text()).not.toMatch(/sql|sequelize|stack/i);
  });
});
