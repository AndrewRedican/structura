import { faker } from '@faker-js/faker';

export function complex() {
  return {
    id: faker.string.uuid(),
    person: {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      job: {
        title: faker.person.jobTitle(),
        company: faker.company.name(),
        location: {
          address: faker.location.streetAddress(),
          city: faker.location.city(),
          postalCode: faker.location.zipCode(),
        },
      },
    },
    projects: Array.from({ length: 3 }, () => ({
      name: faker.commerce.productName(),
      description: faker.lorem.sentences(),
      startDate: faker.date.past(),
      endDate: faker.date.future(),
      budget: faker.number.float({ min: 1000, max: 100000 }),
    })),
    socialMedia: {
      twitter: faker.internet.userName(),
      linkedIn: faker.internet.userName(),
    },
    preferences: {
      newsletters: faker.datatype.boolean(),
      favoriteState: Array.from({ length: 2 }, () => faker.location.state()),
    }
  }
};
