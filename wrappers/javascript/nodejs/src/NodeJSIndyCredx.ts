import { IndyCredx } from 'indy-credx-shared'
import { nativeIndyCredx } from './lib'
import { allocateString } from './utils/alloc'

export class NodeJSIndyCredx implements IndyCredx {
  version(): string {
    return nativeIndyCredx.credx_version()
  }

  // This should be called when a function returns a non-zero code
  getCurrentError(): string {
    const ret = allocateString()
    nativeIndyCredx.credx_get_current_error(ret)
    return ret.deref() as string
  }
}
