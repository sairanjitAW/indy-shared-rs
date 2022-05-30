import { IndyCredxError } from './error'

export class ObjectHandle {
  private _handle: number

  public constructor(handle: number) {
    this._handle = handle
  }

  public get handle() {
    return this._handle
  }

  // TODO: this should call: credx_object_get_type_name
  public typeName() {
    throw new IndyCredxError({ code: 100, message: 'method typeName not implemented' })
  }

  // TODO: do we need this?
  // TODO: this should call: credx_object_free
  public clear() {
    throw new IndyCredxError({ code: 100, message: 'method clear not implemented' })
  }
}
