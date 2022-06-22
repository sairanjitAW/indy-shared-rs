import * as ref from 'ref-napi'
import { default as array } from 'ref-array-di'
import { default as struct } from 'ref-struct-di'

export const FFI_STRING = 'string'
export const FFI_STRING_PTR = ref.refType(FFI_STRING)
export const FFI_ERRORCODE = 'uint'
export const FFI_OBJECT_HANDLE = 'usize'
export const FFI_OBJECT_HANDLE_PTR = ref.refType(FFI_OBJECT_HANDLE)

export const FFI_INT8 = 'int8'
export const FFI_INT64 = 'int64'
export const FFI_UINT = 'uint'
export const FFI_UINT8 = 'uint8'
export const FFI_INT8_PTR = ref.refType(FFI_INT8)

const CStruct = struct(ref)
const CArray = array(ref)

export const ByteBufferStruct = CStruct({
  len: ref.types.uint64,
  data: ref.refType(CArray(ref.types.uint8)),
})

export const ByteBufferStructPtr = ref.refType(ByteBufferStruct)

export const StringListStruct = CStruct({
  count: ref.types.size_t,
  data: ref.refType(CArray(ref.types.uint8))
})

export const I64ListStruct = CStruct({
  count: ref.types.size_t,
  data: ref.refType(CArray(ref.types.int64))
})

export const CredRevInfoStruct = CStruct({
  reg_def: ref.types.size_t,
  reg_def_private: ref.types.size_t,
  registry: ref.types.size_t,
  reg_idx: ref.types.int64,
  reg_used: I64ListStruct,
  tails_path: CArray(ref.types.uint8)
})

export const CredentialEntryStruct = CStruct({
  credential: ref.types.size_t,
  timestamp: ref.types.int64,
  rev_state: ref.types.size_t
})

export const CredentialEntryListStruct = CStruct({
  count: ref.types.size_t,
  data: ref.refType(CredentialEntryStruct)
})

export const CredentialProveStruct = CStruct({
  entry_idx: ref.types.int64,
  referent: CArray(ref.types.uint8),
  is_predictable: ref.types.int8,
  reveal: ref.types.int8 
})

export const CredentialListProveStruct = CStruct({
  count: ref.types.size_t,
  data: ref.refType(CredentialProveStruct)
})

export const ObjectHandleListStruct = CStruct({
  count: ref.types.size_t,
  data: ref.refType(ref.types.size_t)
})

export const RevocationEntryStruct = CStruct({
  def_entry_idx: ref.types.int64,
  entry: ref.types.size_t,
  timestamp: ref.types.int64
})

export const RevocationEntryListStruct = CStruct({
  count: ref.types.size_t,
  data: ref.refType(RevocationEntryStruct)
})

export const nativeBindings = {
  // first element is method return type, second element is list of method argument types
  credx_buffer_free: [, [ByteBufferStruct]], 
  credx_create_credential: [FFI_ERRORCODE, [
    FFI_OBJECT_HANDLE, 
    FFI_OBJECT_HANDLE, 
    FFI_OBJECT_HANDLE, 
    FFI_OBJECT_HANDLE, 
    StringListStruct, 
    StringListStruct, 
    StringListStruct,
    ref.refType(CredRevInfoStruct),
    FFI_OBJECT_HANDLE_PTR,
    FFI_OBJECT_HANDLE_PTR,
    FFI_OBJECT_HANDLE_PTR
  ]],
  credx_create_credential_definition: [FFI_ERRORCODE, [
    FFI_OBJECT_HANDLE,
    FFI_STRING,
    FFI_STRING,
    FFI_INT8,
    FFI_OBJECT_HANDLE,
    FFI_OBJECT_HANDLE
  ]],
  credx_create_credential_offer: [FFI_ERRORCODE, [
    FFI_STRING,
    FFI_OBJECT_HANDLE,
    FFI_OBJECT_HANDLE,
    FFI_OBJECT_HANDLE_PTR
  ]],
  credx_create_credential_request: [FFI_ERRORCODE, [
    FFI_STRING,
    FFI_OBJECT_HANDLE,
    FFI_OBJECT_HANDLE,
    FFI_STRING,
    FFI_OBJECT_HANDLE,
    FFI_OBJECT_HANDLE_PTR,
    FFI_OBJECT_HANDLE_PTR
  ]],
  credx_create_master_secret: [FFI_ERRORCODE, [FFI_OBJECT_HANDLE_PTR]],
  credx_create_or_update_revocation_state: [FFI_ERRORCODE, [
    FFI_OBJECT_HANDLE,
    FFI_OBJECT_HANDLE,
    FFI_INT64,
    FFI_INT64,
    FFI_STRING,
    FFI_OBJECT_HANDLE,
    FFI_OBJECT_HANDLE_PTR
  ]],
  credx_create_presentation: [FFI_ERRORCODE, [
    CredentialEntryListStruct,
    CredentialListProveStruct,
    StringListStruct,
    StringListStruct,
    FFI_OBJECT_HANDLE,
    ObjectHandleListStruct,
    ObjectHandleListStruct,
    FFI_OBJECT_HANDLE_PTR
  ]],
  credx_create_revocation_registry: [FFI_ERRORCODE, [
    FFI_STRING,
    FFI_OBJECT_HANDLE,
    FFI_STRING,
    FFI_STRING,
    FFI_STRING,
    FFI_INT64,
    FFI_STRING,
    FFI_OBJECT_HANDLE_PTR,
    FFI_OBJECT_HANDLE_PTR,
    FFI_OBJECT_HANDLE_PTR,
    FFI_OBJECT_HANDLE_PTR
  ]],
  credx_create_schema: [FFI_ERRORCODE, [
    FFI_STRING,
    FFI_STRING,
    FFI_STRING,
    StringListStruct,
    FFI_INT64,
    FFI_OBJECT_HANDLE_PTR
  ]],
  credx_credential_definition_get_attribute: [FFI_ERRORCODE, [
    FFI_OBJECT_HANDLE,
    FFI_STRING,
    FFI_STRING_PTR
  ]],
  credx_encode_credential_attributes: [FFI_ERRORCODE, [
    StringListStruct,
    FFI_STRING_PTR
  ]],
  credx_generate_nonce: [FFI_ERRORCODE, [FFI_STRING_PTR]],
  credx_get_current_error: [FFI_ERRORCODE, [FFI_STRING_PTR]],
  credx_merge_revocation_registry_deltas: [FFI_ERRORCODE, [
    FFI_OBJECT_HANDLE,
    FFI_OBJECT_HANDLE,
    FFI_OBJECT_HANDLE_PTR
  ]],
  credx_object_free: [, [FFI_OBJECT_HANDLE]],
  credx_object_get_json: [FFI_ERRORCODE, ByteBufferStructPtr],
  credx_object_get_type_name: [FFI_ERRORCODE, [FFI_STRING_PTR]],
  credx_process_credential: [FFI_ERRORCODE, [
    FFI_OBJECT_HANDLE,
    FFI_OBJECT_HANDLE,
    FFI_OBJECT_HANDLE,
    FFI_OBJECT_HANDLE,
    FFI_OBJECT_HANDLE,
    FFI_OBJECT_HANDLE_PTR
  ]],
  credx_revocation_registry_definition_get_attribute: [FFI_ERRORCODE, [
    FFI_OBJECT_HANDLE,
    FFI_STRING,
    FFI_STRING_PTR,
  ]],
  credx_revoke_credential: [FFI_ERRORCODE, [
    FFI_OBJECT_HANDLE,
    FFI_OBJECT_HANDLE,
    FFI_INT64,
    FFI_STRING,
    FFI_OBJECT_HANDLE_PTR,
    FFI_OBJECT_HANDLE_PTR
  ]],
  credx_schema_get_attribute: [FFI_ERRORCODE, [
    FFI_OBJECT_HANDLE,
    FFI_STRING, 
    FFI_STRING_PTR
  ]],
  credx_set_default_logger: [FFI_ERRORCODE,[]],
  credx_update_revocation_registry: [FFI_ERRORCODE, [
    FFI_OBJECT_HANDLE,
    FFI_OBJECT_HANDLE,
    I64ListStruct,
    I64ListStruct,
    FFI_OBJECT_HANDLE_PTR,
    FFI_OBJECT_HANDLE_PTR
  ]],
  credx_verify_presentation: [FFI_ERRORCODE, [
    FFI_OBJECT_HANDLE,
    FFI_OBJECT_HANDLE,
    ObjectHandleListStruct,
    ObjectHandleListStruct,
    ObjectHandleListStruct,
    RevocationEntryListStruct,
    FFI_INT8_PTR
  ]],
  credx_version: [FFI_STRING, []],

} as const
