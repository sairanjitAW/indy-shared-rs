import { ObjectHandle } from './ObjectHandle'
import { IndyCredxError } from './error'

export class IndyObject {
  private handle: ObjectHandle

  public constructor(handle: number) {
    this.handle = new ObjectHandle(handle)
  }

  // TODO: do we need this?
  public copy() {
    return new IndyObject(this.handle.handle)
  }

  // TODO: do we need this?
  public toBytes() {
    throw new IndyCredxError({ code: 100, message: 'Method toBytes not implemented' })
  }

  // TODO: this should call: credx_object_get_json
  public toJson() {
    throw new IndyCredxError({ code: 100, message: 'Method toJson not implemented' })
  }

  // TODO: do we need this?
  public toJsonBuffer() {
    throw new IndyCredxError({ code: 100, message: 'Method toJsonBuffer not implemented' })
  }
}
