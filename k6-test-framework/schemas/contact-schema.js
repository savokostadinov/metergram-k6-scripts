export const contactSchema = {
  type: 'object',
  required: [
      'firstName', 'lastName', 'birthdate', 'email', 'phone',
      'street1', 'street2', 'city', 'stateProvince', 'postalCode', 'country'
  ],
  properties: {
      firstName: {
          title: 'First Name',
          type: 'string',
          example: 'Savo'
      },
      lastName: {
          title: 'Last Name',
          type: 'string',
          example: 'Kostadinov'
      },
      birthdate: {
          title: 'Birthdate',
          type: 'string',
          format: 'date',
          example: '2001-11-15'
      },
      email: {
          title: 'Email',
          type: 'string',
          format: 'email',
          example: 'savekostadinov6@gmail.com'
      },
      phone: {
          title: 'Phone',
          type: 'string',
          example: '077952936'
      },
      street1: {
          title: 'Street 1',
          type: 'string',
          example: 'Shishka 44'
      },
      street2: {
          title: 'Street 2',
          type: 'string',
          example: 'Shiska 42'
      },
      city: {
          title: 'City',
          type: 'string',
          example: 'Kavadarci'
      },
      stateProvince: {
          title: 'State/Province',
          type: 'string',
          example: 'Macedonia'
      },
      postalCode: {
          title: 'Postal Code',
          type: 'string',
          example: '1430'
      },
      country: {
          title: 'Country',
          type: 'string',
          example: 'Macedonia'
      }
  }
};
