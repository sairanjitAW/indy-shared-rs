// Each platform, Nodejs and React Native, should implement this interface
// This will make sure that when wrapping both methods to shared functionality

import type { ObjectHandle } from './ObjectHandle'

export type CredentialEntry = {
  credential: ObjectHandle
  timestamp: number
  revocationState: ObjectHandle
}

export type CredentialProve = {
  entryIndex: number
  referent: string
  isPredicate: boolean
  reveal: boolean
}

export type RevocationEntry = {
  revocationRegistryDefinitionEntryIndex: number
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
    attributeNames: string[]
    sequenceNumber?: number
  }): ObjectHandle

  createCredentialDefinition(options: {
    originDid: string
    schema: ObjectHandle
    tag: string
    signatureType: string
    supportRevocation: boolean
  }): [ObjectHandle, ObjectHandle, ObjectHandle]

  createCredential(options: {
    credentialDefinition: ObjectHandle
    credentialDefinitionPrivate: ObjectHandle
    credentialOffer: ObjectHandle
    credentialRequest: ObjectHandle
    attributeRawValues: Record<string, string>
    attributeEncodedValues?: Record<string, string>
    revocationConfiguration?: Record<string, string>
  }): [ObjectHandle, ObjectHandle, ObjectHandle]

  encodeCredentialAttributes(attributeRawValues: Record<string, string>): Record<string, string>

  processCredential(options: {
    credential: ObjectHandle
    credentialRequestMetadata: ObjectHandle
    masterSecret: ObjectHandle
    credentialDefinition: ObjectHandle
    revocationRegistryDefinition?: ObjectHandle
  }): ObjectHandle

  revokeCredential(options: {
    revocationRegistryDefinition: ObjectHandle
    revocationRegistry: ObjectHandle
    credentialRevocationIndex: number
    tailsPath: string
  }): [ObjectHandle, ObjectHandle, ObjectHandle]

  createCredentialOffer(options: {
    schemaId: string
    credentialDefinition: ObjectHandle
    keyProof: ObjectHandle
  }): ObjectHandle

  createCredentialRequest(options: {
    proverDid: string
    credentialDefinition: ObjectHandle
    masterSecret: ObjectHandle
    masterSecretId: string
    credentialOffer: ObjectHandle
  }): [ObjectHandle, ObjectHandle]

  createMasterSecret(): ObjectHandle

  createPresentation(options: {
    presentationRequest: ObjectHandle
    credentials: CredentialEntry[]
    credentialsProve: CredentialProve[]
    selfAttest: Record<string, string>[]
    masterSecret: ObjectHandle
    schemas: ObjectHandle[]
    credentialDefinitions: ObjectHandle[]
  }): ObjectHandle

  verifyPresentation(options: {
    presentation: ObjectHandle
    presentationRequest: ObjectHandle
    schemas: ObjectHandle[]
    credentialDefinitions: ObjectHandle[]
    revocationRegistryDefinitions: ObjectHandle[]
    revocationRegistries: RevocationEntry[]
  }): boolean

  createRevocationRegistry(options: {
    originDid: string
    credentialDefinition: ObjectHandle
    tag: string
    revocationRegistryType: string
    issuanceType?: string
    maximumCredentialNumber: number
    tailsDirectoryPath?: string
  }): [ObjectHandle, ObjectHandle, ObjectHandle, ObjectHandle]

  updateRevocationRegistry(options: {
    revocationRegistryDefinition: ObjectHandle
    revocationRegistry: ObjectHandle
    issued: number[]
    revoked: number[]
    tailsDirectoryPath: string
  }): [ObjectHandle, ObjectHandle]

  mergeRevocationRegistryDeltas(options: {
    revocationRegistryDelta1: ObjectHandle
    revocationRegistryDelta2: ObjectHandle
  }): ObjectHandle

  createOrUpdateRevocationState(options: {
    revocationRegistryDefinition: ObjectHandle
    revocationRegistryDelta: ObjectHandle
    revocationRegistryIndex: number
    timestamp: number
    tailsPath: string
    previousRevocationState?: ObjectHandle
  }): ObjectHandle
}
