import { default as array } from 'ref-array-di'
import * as ref from 'ref-napi'
import { default as struct } from 'ref-struct-di'

import { FFI_INT64, FFI_INT8, FFI_ISIZE, FFI_ISIZE_PTR, FFI_UINT8 } from './primitives'

const CStruct = struct(ref)
const CArray = array(ref)

const FFI_UINT8_ARRAY = CArray(FFI_UINT8)
const FFI_INT64_ARRAY = CArray(FFI_INT64)
const FFI_INT64_ARRAY_PTR = ref.refType(FFI_INT64_ARRAY)
const FFI_UINT8_ARRAY_PTR = ref.refType(FFI_UINT8_ARRAY)

export const ByteBufferStruct = CStruct({
  len: FFI_INT64,
  data: FFI_UINT8_ARRAY_PTR,
})

export const ByteBufferStructPtr = ref.refType(ByteBufferStruct)

export const StringListStruct = CStruct({
  count: FFI_ISIZE,
  data: FFI_UINT8_ARRAY_PTR,
})

export const I64ListStruct = CStruct({
  count: FFI_ISIZE,
  data: FFI_INT64_ARRAY_PTR,
})

export const CredRevInfoStruct = CStruct({
  reg_def: FFI_ISIZE,
  reg_def_private: FFI_ISIZE,
  registry: FFI_ISIZE,
  reg_idx: FFI_INT64,
  reg_used: I64ListStruct,
  tails_path: FFI_UINT8_ARRAY,
})

export const CredentialEntryStruct = CStruct({
  credential: FFI_ISIZE,
  timestamp: FFI_INT64,
  rev_state: FFI_ISIZE,
})

export const CredentialEntryListStruct = CStruct({
  count: FFI_ISIZE,
  data: ref.refType(CredentialEntryStruct),
})

export const CredentialProveStruct = CStruct({
  entry_idx: FFI_INT64,
  referent: FFI_UINT8_ARRAY,
  is_predictable: FFI_INT8,
  reveal: FFI_INT8,
})

export const CredentialListProveStruct = CStruct({
  count: FFI_ISIZE,
  data: ref.refType(CredentialProveStruct),
})

export const ObjectHandleListStruct = CStruct({
  count: FFI_ISIZE,
  data: FFI_ISIZE_PTR,
})

export const RevocationEntryStruct = CStruct({
  def_entry_idx: FFI_INT64,
  entry: FFI_ISIZE,
  timestamp: FFI_INT64,
})

export const RevocationEntryListStruct = CStruct({
  count: FFI_ISIZE,
  data: ref.refType(RevocationEntryStruct),
})
