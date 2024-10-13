import type {DataGenerators} from '../model.ts'
import {none} from './none.ts'
import {small} from './small.ts'
import {standard} from './standard.ts'
import {varied} from './varied.ts'
import {complex} from './complex.ts'

export function generate(): DataGenerators {
  return Object.freeze({
    none,
    small,
    standard,
    complex,
    varied
  })
}