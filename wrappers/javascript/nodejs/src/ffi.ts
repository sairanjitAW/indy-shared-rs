import { refType } from 'ref-napi'

export const FFI_STRING = 'string'
export const FFI_STRING_PTR = refType(FFI_STRING)
export const FFI_ERRORCODE = 'uint'

export const nativeBindings = {
  // first element is method return type, second element is list of method argument types
  credx_version: [FFI_STRING, []],
  credx_get_current_error: [FFI_ERRORCODE, [FFI_STRING_PTR]],
} as const
