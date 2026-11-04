export type TestUser = {
  email: string;
  password: string;
  securityAnswer: string;
};

export function uniqueUser(label: string): TestUser {
  const unique = `${Date.now()}-${process.pid}-${Math.random().toString(36).slice(2, 9)}`;
  return {
    email: `qa.${label}.${unique}@example.test`,
    password: 'Demo!Password123',
    securityAnswer: `answer-${unique}`,
  };
}
