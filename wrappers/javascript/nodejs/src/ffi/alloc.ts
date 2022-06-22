import { alloc } from 'ref-napi'

import { FFI_STRING } from '../ffi/primitives'

// TODO: more allocations here

export const allocateStringBuffer = (): Buffer => alloc(FFI_STRING)
