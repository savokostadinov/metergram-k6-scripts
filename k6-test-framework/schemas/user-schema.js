
export const userSchema = {
  type: 'object',
  required: ['email', 'firstName', 'lastName'],
  properties: {
    email: { type: 'string', format: 'email' },
    firstName: { type: 'string' },
    lastName: { type: 'string' },
  }
};

