// Each platform, Nodejs and React Native, should implement this interface
// This will make sure that when wrapping both methods to shared functionality

import type { ObjectHandle } from './ObjectHandle'

// inside `indy-credx-shared` we do not need to create two mappings there
export interface IndyCredx {
  version(): string

  getCurrentError(): string

  createCredentialDefinition(options: {
    originDid: string
    schema: ObjectHandle
    tag: string
    signatureType: string
    supportRevocation: boolean
  }): [ObjectHandle, ObjectHandle, ObjectHandle]

  createCredential(options: {
    cred_def: ObjectHandle
    cred_def_private: ObjectHandle
    cred_offer: ObjectHandle
    cred_request: ObjectHandle
    attr_raw_values: { [key: string]: string }
    attr_enc_values?: { [key: string]: string }
    revocation_config?: { [key: string]: string }
  }): [ObjectHandle, ObjectHandle, ObjectHandle]

  encodeCredentialAttributes(attrRawValues: { [key: string]: string }): { [key: string]: string }

  processCredential(options: {
    cred: ObjectHandle
    credReqMetadata: ObjectHandle
    masterSecret: ObjectHandle
    credDef: ObjectHandle
    revRegDef?: ObjectHandle
  }): ObjectHandle

  revokeCredential(options: {
    revRegDef: ObjectHandle
    revReg: ObjectHandle
    credRevIdx: number
    tailsPath: string
  }): [ObjectHandle, ObjectHandle, ObjectHandle]

  createCredentialOffer(options: { schemaId: string; credDef: ObjectHandle; keyProof: ObjectHandle }): ObjectHandle

  createCredentialRequest(options: {
    proverDid: string
    credDef: ObjectHandle
    masterSecret: ObjectHandle
    masterSecretId: string
    credOffer: ObjectHandle
  }): [ObjectHandle, ObjectHandle]

  createMasterSecret(): ObjectHandle
}
