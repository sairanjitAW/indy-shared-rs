import { indyCredx } from './register'

export class ObjectHandle {
  private _handle: number

  public constructor(handle: number) {
    this._handle = handle
  }

  public get handle() {
    return this._handle
  }

  public typeName() {
    return indyCredx.getTypeName({ object: this })
  }

  // TODO: do we need this?
  public clear() {
    indyCredx.objectFree({ object: this })
  }
}
