
const FFI_STRING = 'string'

export const nativeBindings = {
  // first element is method return type, second element is list of method argument types
  credx_version: [FFI_STRING, []],
} as const

