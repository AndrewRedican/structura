export type DataGenerator = (...input: any[]) => any

export interface DataGenerators {
  readonly small: DataGenerator
  readonly standard: DataGenerator
  readonly complex: DataGenerator
  readonly varied: DataGenerator
}

export type DataGeneratorName = keyof DataGenerators
