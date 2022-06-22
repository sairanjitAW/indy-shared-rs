import type { ByteBufferStruct } from './structures'

import { NULL } from 'ref-napi'

type Argument = Record<string, unknown> | Array<unknown> | Date | Uint8Array | SerializedArgument | boolean

type SerializedArgument = string | number | ArrayBuffer | Buffer

type SerializedArguments = Record<string, SerializedArgument>

export type SerializedOptions<Type> = Required<{
  [Property in keyof Type]: Type[Property] extends string
    ? string
    : Type[Property] extends number
    ? number
    : Type[Property] extends boolean
    ? number
    : Type[Property] extends boolean | undefined
    ? number
    : Type[Property] extends Record<string, unknown>
    ? string
    : Type[Property] extends Array<unknown>
    ? string
    : Type[Property] extends Array<unknown> | undefined
    ? string
    : Type[Property] extends Record<string, unknown> | undefined
    ? string
    : Type[Property] extends Date
    ? number
    : Type[Property] extends Date | undefined
    ? number
    : Type[Property] extends string | undefined
    ? string
    : Type[Property] extends number | undefined
    ? number
    : Type[Property] extends Buffer
    ? Buffer
    : Type[Property] extends Uint8Array
    ? typeof ByteBufferStruct
    : Type[Property] extends Uint8Array | undefined
    ? typeof ByteBufferStruct
    : unknown
}>

// TODO: this method needs to be reworked.
// It is very messy
// cannot handle complex data structures well
const serialize = (arg: Argument): SerializedArgument => {
  switch (typeof arg) {
    case 'undefined':
      return NULL
    case 'boolean':
      return +arg
    case 'string':
      return arg
    case 'number':
      return arg
    case 'function':
      return arg
    case 'object':
      // TODO: add more serialization here for classes and uint8arrays
      return JSON.stringify(arg)
    default:
      throw new Error('could not serialize value')
  }
}

const serializeArguments = <T extends Record<string, Argument> = Record<string, Argument>>(
  args: T
): SerializedOptions<T> => {
  const retVal: SerializedArguments = {}
  Object.entries(args).forEach(([key, val]) => (retVal[key] = serialize(val)))
  return retVal as SerializedOptions<T>
}

export { serializeArguments }
