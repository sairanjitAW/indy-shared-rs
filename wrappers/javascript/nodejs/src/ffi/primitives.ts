import { default as ref, refType } from 'ref-napi'

export const FFI_ISIZE = ref.types.size_t
export const FFI_ISIZE_PTR = refType(FFI_ISIZE)
export const FFI_INT8 = ref.types.int8
export const FFI_INT64 = ref.types.int64
export const FFI_UINT = ref.types.uint
export const FFI_UINT8 = ref.types.uint8
export const FFI_INT8_PTR = refType(FFI_INT8)

export const FFI_ERRORCODE = FFI_UINT
export const FFI_OBJECT_HANDLE = FFI_ISIZE
export const FFI_OBJECT_HANDLE_PTR = refType(FFI_OBJECT_HANDLE)
export const FFI_VOID = ref.types.void
export const FFI_STRING = 'string'
export const FFI_STRING_PTR = refType(FFI_STRING)
