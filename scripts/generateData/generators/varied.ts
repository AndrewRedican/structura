import { faker } from '@faker-js/faker';

export function varied() {
  return {
    id: faker.string.uuid(),
    person: {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      contact: {
        email: faker.internet.email(),
        phone: faker.phone.number(),
        address: {
          street: faker.location.streetAddress(),
          city: faker.location.city(),
          country: faker.location.country(),
          postalCode: faker.location.zipCode(),
        },
      },
    },
    preferences: {
      receiveEmails: faker.datatype.boolean(),
      interests: Array.from({ length: 5 }, () => faker.person.bio()),
      favoriteElement: Array.from({ length: 3 }, () => faker.science.chemicalElement()),
    },
    metadata: {
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
      tags: Array.from({ length: 10 }, () => faker.commerce.productAdjective()),
    },
    company: {
      name: faker.company.name(),
      employees: faker.number.int({ min: 50, max: 5000 }),
      address: {
        street: faker.location.streetAddress(),
        city: faker.location.city(),
        postalCode: faker.location.zipCode(),
      },
    },
  }
};
