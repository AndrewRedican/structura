import * as path from 'path';
import { fileURLToPath } from 'url';
import * as fs from 'fs';
import { faker } from '@faker-js/faker';

const DATA_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'data');
const ENTRIES_ARG = parseInt(process.argv[4], 10);
const DATE_TYPE = process.argv[3] as DataGeneratorName;

main(ENTRIES_ARG, DATE_TYPE);


/**********************
 * Program Definition *
 **********************/

function main(numEntries: number, dataType: DataGeneratorName) {
  const generators = generate()
  if (typeof numEntries !== 'number' || isNaN(numEntries) || numEntries <= 0) {
    console.error(`Unknown number of entries: ${numEntries}. Must be greater than zero.`);
    return;
  }
  if (!dataType || !Object.keys(generators).includes(dataType)) {
    console.error(`Unknown data type: ${dataType}. Valid types are: small, standard, complex, varied.`);
  }
  const dataGenerator = generators[dataType];
  const fileName = `${dataType}.json`;
  const finalFilePath = path.join(DATA_DIR, fileName);
  console.log(`Generating ${numEntries} fake entries of ${dataType} type data...`);
  console.log(`Output file path: ${finalFilePath}`);
  const data = generateDataArray(numEntries, dataGenerator);
  writeDataToFile(finalFilePath, data);
  console.log(`Generated and stored ${numEntries} fake entries successfully.`);
};

function generateDataArray(numEntries: number, generator: DataGenerator): any[] {
  const data: any[] = [];
  for (let i = 0; i < numEntries; i++) {
    data.push(generator());
  }
  return data;
};

function ensureDirectoryExists(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

function writeDataToFile(filePath: string, data: any[]) {
  let existingData: any[] = [];
  ensureDirectoryExists(path.dirname(filePath));
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    try {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      existingData = JSON.parse(fileContent);
    } catch (error) {
      console.warn(`Warning: Failed to read existing data from ${filePath}. Starting with a new array.`);
    }
  }
  existingData.push(...data);
  fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2));
};

/**********************
 * Program Definition *
 **********************/

function small() {
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    address: faker.location.streetAddress(),
    age: faker.number.int({ min: 18, max: 90 }),
  }
};

function standard() {
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

function complex() {
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

function varied() {
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

interface DataGenerators {
  readonly small: typeof small
  readonly standard: typeof standard
  readonly complex: typeof complex
  readonly varied: typeof varied
}

type DataGeneratorName = keyof DataGenerators

type DataGenerator =DataGenerators[DataGeneratorName]

function generate(): DataGenerators {
  return Object.freeze({
    small,
    standard,
    complex,
    varied
  })
}