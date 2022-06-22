import type { IndyCredx } from 'indy-credx-shared'

import { allocateStringBuffer } from './ffi'
import { nativeIndyCredx } from './library'

export class NodeJSIndyCredx implements IndyCredx {
  public version(): string {
    return nativeIndyCredx.credx_version()
  }

  // This should be called when a function returns a non-zero code
  public getCurrentError(): string {
    const ret = allocateStringBuffer()
    nativeIndyCredx.credx_get_current_error(ret)
    return ret.deref() as string
  }
}
