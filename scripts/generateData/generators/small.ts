import { faker } from '@faker-js/faker';

export function small() {
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    address: faker.location.streetAddress(),
    age: faker.number.int({ min: 18, max: 90 }),
  }
};