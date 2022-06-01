// Each platform, Nodejs and React Native, should implement this interface
// This will make sure that when wrapping both methods to shared functionality

import type { ObjectHandle } from './ObjectHandle'

export type CredentialEntry = {
  credential: ObjectHandle
  timestamp: number
  revState: ObjectHandle
}

export type CredentialProve = {
  entryIdx: number
  referent: string
  isPredicate: boolean
  reveal: boolean
}

export type RevocationEntry = {
  defEntryIdx: number
  entry: ObjectHandle
  timestamp: number
}

export interface IndyCredx {
  version(): string

  getCurrentError(): string

  generateNonce(): string

  createSchema(options: {
    originDid: string
    name: string
    version: string
    attrNames: string[]
    seqNo: number | null
  }): ObjectHandle

  createCredentialDefinition(options: {
    originDid: string
    schema: ObjectHandle
    tag: string
    signatureType: string
    supportRevocation: boolean
  }): [ObjectHandle, ObjectHandle, ObjectHandle]

  createCredential(options: {
    credDef: ObjectHandle
    credDefPrivate: ObjectHandle
    credOffer: ObjectHandle
    credRequest: ObjectHandle
    attrRawValues: Record<string, string>
    attrEncValues: Record<string, string> | null
    revocationConfig: Record<string, string> | null
  }): [ObjectHandle, ObjectHandle, ObjectHandle]

  encodeCredentialAttributes(attrRawValues: Record<string, string>): Record<string, string>

  processCredential(options: {
    cred: ObjectHandle
    credReqMetadata: ObjectHandle
    masterSecret: ObjectHandle
    credDef: ObjectHandle
    revRegDef: ObjectHandle | null
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

  createPresentation(options: {
    presReq: ObjectHandle
    credentials: CredentialEntry[]
    credentialsProve: CredentialProve[]
    selfAttest: Record<string, string>[]
    masterSecret: ObjectHandle
    schemas: ObjectHandle[]
    credDefs: ObjectHandle[]
  }): ObjectHandle

  verifyPresentation(options: {
    presentation: ObjectHandle
    presReq: ObjectHandle
    schemas: ObjectHandle[]
    credDefs: ObjectHandle[]
    revRegDefs: ObjectHandle[]
    revRegs: RevocationEntry[]
  }): boolean

  createRevocationRegistry(options: {
    originDid: string
    credDef: ObjectHandle
    tag: string
    revRegType: string
    issuanceType: string | null
    maxCredNum: number
    tailsDirPath: string | null
  }): [ObjectHandle, ObjectHandle, ObjectHandle, ObjectHandle]

  updateRevocationRegistry(options: {
    revRegDef: ObjectHandle
    revReg: ObjectHandle
    issued: number[]
    revoked: number[]
    tailsPath: string
  }): [ObjectHandle, ObjectHandle]

  mergeRevocationRegistryDeltas(options: { revRegDelta1: ObjectHandle; revRegDelta2: ObjectHandle }): ObjectHandle

  createOrUpdateRevocationState(options: {
    revRegDef: ObjectHandle
    revRegDelta: ObjectHandle
    revRegIndex: number
    timestamp: number
    tailsPath: string
    prevRevState: ObjectHandle | null
  }): ObjectHandle
}
