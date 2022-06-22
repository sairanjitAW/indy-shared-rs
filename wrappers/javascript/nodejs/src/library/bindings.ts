import { refType } from 'ref-napi'

import {
  ByteBufferStruct,
  FFI_ERRORCODE,
  FFI_OBJECT_HANDLE,
  StringListStruct,
  CredRevInfoStruct,
  FFI_OBJECT_HANDLE_PTR,
  FFI_STRING,
  FFI_INT8,
  FFI_INT64,
  CredentialEntryListStruct,
  CredentialListProveStruct,
  ObjectHandleListStruct,
  FFI_STRING_PTR,
  ByteBufferStructPtr,
  I64ListStruct,
  RevocationEntryListStruct,
  FFI_INT8_PTR,
  FFI_VOID,
} from '../ffi'

export const nativeBindings = {
  // first element is method return type, second element is list of method argument types
  credx_buffer_free: [FFI_VOID, [ByteBufferStruct]],
  credx_create_credential: [
    FFI_ERRORCODE,
    [
      FFI_OBJECT_HANDLE,
      FFI_OBJECT_HANDLE,
      FFI_OBJECT_HANDLE,
      FFI_OBJECT_HANDLE,
      StringListStruct,
      StringListStruct,
      StringListStruct,
      refType(CredRevInfoStruct),
      FFI_OBJECT_HANDLE_PTR,
      FFI_OBJECT_HANDLE_PTR,
      FFI_OBJECT_HANDLE_PTR,
    ],
  ],
  credx_create_credential_definition: [
    FFI_ERRORCODE,
    [FFI_OBJECT_HANDLE, FFI_STRING, FFI_STRING, FFI_INT8, FFI_OBJECT_HANDLE, FFI_OBJECT_HANDLE],
  ],
  credx_create_credential_offer: [
    FFI_ERRORCODE,
    [FFI_STRING, FFI_OBJECT_HANDLE, FFI_OBJECT_HANDLE, FFI_OBJECT_HANDLE_PTR],
  ],
  credx_create_credential_request: [
    FFI_ERRORCODE,
    [
      FFI_STRING,
      FFI_OBJECT_HANDLE,
      FFI_OBJECT_HANDLE,
      FFI_STRING,
      FFI_OBJECT_HANDLE,
      FFI_OBJECT_HANDLE_PTR,
      FFI_OBJECT_HANDLE_PTR,
    ],
  ],
  credx_create_master_secret: [FFI_ERRORCODE, [FFI_OBJECT_HANDLE_PTR]],
  credx_create_or_update_revocation_state: [
    FFI_ERRORCODE,
    [FFI_OBJECT_HANDLE, FFI_OBJECT_HANDLE, FFI_INT64, FFI_INT64, FFI_STRING, FFI_OBJECT_HANDLE, FFI_OBJECT_HANDLE_PTR],
  ],
  credx_create_presentation: [
    FFI_ERRORCODE,
    [
      CredentialEntryListStruct,
      CredentialListProveStruct,
      StringListStruct,
      StringListStruct,
      FFI_OBJECT_HANDLE,
      ObjectHandleListStruct,
      ObjectHandleListStruct,
      FFI_OBJECT_HANDLE_PTR,
    ],
  ],
  credx_create_revocation_registry: [
    FFI_ERRORCODE,
    [
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
      FFI_OBJECT_HANDLE_PTR,
    ],
  ],
  credx_create_schema: [
    FFI_ERRORCODE,
    [FFI_STRING, FFI_STRING, FFI_STRING, StringListStruct, FFI_INT64, FFI_OBJECT_HANDLE_PTR],
  ],
  credx_credential_definition_get_attribute: [FFI_ERRORCODE, [FFI_OBJECT_HANDLE, FFI_STRING, FFI_STRING_PTR]],
  credx_encode_credential_attributes: [FFI_ERRORCODE, [StringListStruct, FFI_STRING_PTR]],
  credx_generate_nonce: [FFI_ERRORCODE, [FFI_STRING_PTR]],
  credx_get_current_error: [FFI_ERRORCODE, [FFI_STRING_PTR]],
  credx_merge_revocation_registry_deltas: [
    FFI_ERRORCODE,
    [FFI_OBJECT_HANDLE, FFI_OBJECT_HANDLE, FFI_OBJECT_HANDLE_PTR],
  ],
  credx_object_free: [FFI_VOID, [FFI_OBJECT_HANDLE]],
  credx_object_get_json: [FFI_ERRORCODE, [ByteBufferStructPtr]],
  credx_object_get_type_name: [FFI_ERRORCODE, [FFI_STRING_PTR]],
  credx_process_credential: [
    FFI_ERRORCODE,
    [
      FFI_OBJECT_HANDLE,
      FFI_OBJECT_HANDLE,
      FFI_OBJECT_HANDLE,
      FFI_OBJECT_HANDLE,
      FFI_OBJECT_HANDLE,
      FFI_OBJECT_HANDLE_PTR,
    ],
  ],
  credx_revocation_registry_definition_get_attribute: [FFI_ERRORCODE, [FFI_OBJECT_HANDLE, FFI_STRING, FFI_STRING_PTR]],
  credx_revoke_credential: [
    FFI_ERRORCODE,
    [FFI_OBJECT_HANDLE, FFI_OBJECT_HANDLE, FFI_INT64, FFI_STRING, FFI_OBJECT_HANDLE_PTR, FFI_OBJECT_HANDLE_PTR],
  ],
  credx_schema_get_attribute: [FFI_ERRORCODE, [FFI_OBJECT_HANDLE, FFI_STRING, FFI_STRING_PTR]],
  credx_set_default_logger: [FFI_ERRORCODE, []],
  credx_update_revocation_registry: [
    FFI_ERRORCODE,
    [FFI_OBJECT_HANDLE, FFI_OBJECT_HANDLE, I64ListStruct, I64ListStruct, FFI_OBJECT_HANDLE_PTR, FFI_OBJECT_HANDLE_PTR],
  ],
  credx_verify_presentation: [
    FFI_ERRORCODE,
    [
      FFI_OBJECT_HANDLE,
      FFI_OBJECT_HANDLE,
      ObjectHandleListStruct,
      ObjectHandleListStruct,
      ObjectHandleListStruct,
      RevocationEntryListStruct,
      FFI_INT8_PTR,
    ],
  ],
  credx_version: [FFI_STRING, []],
} as const
