// test_data/schemas.js
export const contactSchema = {
    type: 'array',
    items: {
        type: 'object',
        properties: {
            id: { type: 'string' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            email: { type: 'string' },
            phone: { type: 'string' },
        },
        required: ['id', 'firstName', 'lastName', 'email', 'phone'],
    },
};
