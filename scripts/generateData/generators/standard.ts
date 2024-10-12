import { faker } from '@faker-js/faker';

export function standard() {
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    company: faker.company.name(),
    jobTitle: faker.person.jobTitle(),
    website: faker.internet.url(),
    birthDate: faker.date.birthdate(),
    bio: faker.lorem.paragraph(),
    age: faker.number.int({ min: 18, max: 90 }),
    address: {
      street: faker.location.streetAddress(),
      city: faker.location.city(),
      country: faker.location.country(),
    },
  }
};