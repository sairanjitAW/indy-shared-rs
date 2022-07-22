import { ObjectHandle } from './ObjectHandle'
import { IndyCredxError } from './error'
import { indyCredx } from './register'

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

  public toJson() {
    return indyCredx.getJson({ object: this.handle })
  }

  // TODO: do we need this?
  public toJsonBuffer() {
    throw new IndyCredxError({ code: 100, message: 'Method toJsonBuffer not implemented' })
  }
}
