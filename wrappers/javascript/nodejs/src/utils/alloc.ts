import { alloc, allocCString } from 'ref-napi'
import { FFI_STRING } from '../ffi'

export const allocateString = () => alloc(FFI_STRING)
