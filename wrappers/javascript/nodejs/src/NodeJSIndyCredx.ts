import type {
  CredentialEntry,
  CredentialProve,
  IndyCredx,
  RevocationEntry,
  CredentialRevocationConfig,
} from 'indy-credx-shared'

import { ObjectHandle } from 'indy-credx-shared'
import { TextDecoder, TextEncoder } from 'util'

import { ByteBuffer } from '../../shared/src/types'

import { handleError } from './error'
import {
  byteBufferToBuffer,
  allocateStringBuffer,
  allocatePointer,
  serializeArguments,
  StringListStruct,
  CredentialEntryStruct,
  CredentialProveStruct,
  CredentialEntryListStruct,
  CredentialProveListStruct,
  RevocationEntryListStruct,
  RevocationEntryStruct,
  allocateInt8Buffer,
  I64ListStruct,
  Int64Array,
  CredRevInfoStruct,
  allocateByteBuffer,
} from './ffi'
import { nativeIndyCredx } from './library'

export class NodeJSIndyCredx implements IndyCredx {
  public generateNonce(): string {
    const ret = allocateStringBuffer()
    nativeIndyCredx.credx_generate_nonce(ret)
    handleError()

    return ret.deref() as string
  }

  public createSchema(options: {
    originDid: string
    name: string
    version: string
    attributeNames: string[]
    sequenceNumber?: number | undefined
  }): ObjectHandle {
    const { originDid, name, version, attributeNames, sequenceNumber } = serializeArguments(options)

    const ret = allocatePointer()

    // @ts-ignore
    nativeIndyCredx.credx_create_schema(originDid, name, version, attributeNames, sequenceNumber, ret)
    handleError()

    return new ObjectHandle(ret.deref() as number)
  }

  public schemaGetAttribute(options: { schema: ObjectHandle; name: string }) {
    const { schema, name } = serializeArguments(options)

    const ret = allocateStringBuffer()
    nativeIndyCredx.credx_schema_get_attribute(schema, name, ret)
    handleError()

    return ret.deref() as string
  }

  public revocationRegistryDefinitionGetAttribute(options: { object: ObjectHandle; name: string }) {
    const { object, name } = serializeArguments(options)

    const ret = allocateStringBuffer()
    nativeIndyCredx.credx_revocation_registry_definition_get_attribute(object, name, ret)
    handleError()

    return ret.deref() as string
  }

  public credentialGetAttribute(options: { object: ObjectHandle; name: string }) {
    const { object, name } = serializeArguments(options)

    const ret = allocateStringBuffer()
    nativeIndyCredx.credx_credential_get_attribute(object, name, ret)
    handleError()

    return ret.deref() as string
  }

  public createCredentialDefinition(options: {
    originDid: string
    schema: ObjectHandle
    tag: string
    signatureType: string
    supportRevocation: boolean
  }): [ObjectHandle, ObjectHandle, ObjectHandle] {
    const { originDid, schema, tag, signatureType, supportRevocation } = serializeArguments(options)

    const ret1 = allocatePointer()
    const ret2 = allocatePointer()
    const ret3 = allocatePointer()

    nativeIndyCredx.credx_create_credential_definition(
      originDid,
      schema,
      tag,
      signatureType,
      supportRevocation,
      ret1,
      ret2,
      ret3
    )
    handleError()

    return [
      new ObjectHandle(ret1.deref() as number),
      new ObjectHandle(ret2.deref() as number),
      new ObjectHandle(ret3.deref() as number),
    ]
  }

  public createCredential(options: {
    credentialDefinition: ObjectHandle
    credentialDefinitionPrivate: ObjectHandle
    credentialOffer: ObjectHandle
    credentialRequest: ObjectHandle
    attributeRawValues: Record<string, string>
    attributeEncodedValues?: Record<string, string> | undefined
    revocationConfiguration?: CredentialRevocationConfig | undefined
  }): [ObjectHandle, ObjectHandle, ObjectHandle] {
    const { credentialDefinition, credentialDefinitionPrivate, credentialOffer, credentialRequest } =
      serializeArguments(options)

    const attributeNames = StringListStruct({
      count: Object.keys(options.attributeRawValues).length,
      // @ts-ignore
      data: Object.keys(options.attributeRawValues),
    })

    const attributeRawValues = StringListStruct({
      count: Object.keys(options.attributeRawValues).length,
      // @ts-ignore
      data: Object.values(options.attributeRawValues),
    })

    const attributeEncodedValues = options.attributeEncodedValues
      ? StringListStruct({
          count: Object.keys(options.attributeEncodedValues).length,
          // @ts-ignore
          data: Object.values(options.attributeEncodedValues),
        })
      : undefined

    let revocationConfiguration = CredRevInfoStruct()
    if (options.revocationConfiguration) {
      const { registry, registryDefinition, registryDefinitionPrivate, registryIndex, tailsPath } = serializeArguments(
        options.revocationConfiguration
      )

      let registryUsed

      if (options.revocationConfiguration.registryUsed) {
        registryUsed = I64ListStruct({
          count: options.revocationConfiguration.registryUsed.length,
          // @ts-ignore
          data: Int64Array(options.revocationConfiguration.registryUsed),
        })
      }

      revocationConfiguration = CredRevInfoStruct({
        reg_def: registryDefinition,
        reg_def_private: registryDefinitionPrivate,
        registry: registry,
        reg_idx: registryIndex,
        reg_used: registryUsed,
        // @ts-ignore
        tails_path: tailsPath,
      })
    }
    const ret1 = allocatePointer()
    const ret2 = allocatePointer()
    const ret3 = allocatePointer()

    nativeIndyCredx.credx_create_credential(
      credentialDefinition,
      credentialDefinitionPrivate,
      credentialOffer,
      credentialRequest,
      // @ts-ignore
      attributeNames,
      attributeRawValues,
      attributeEncodedValues,
      revocationConfiguration.ref(),
      ret1,
      ret2,
      ret3
    )
    handleError()

    return [
      new ObjectHandle(ret1.deref() as number),
      new ObjectHandle(ret1.deref() as number),
      new ObjectHandle(ret1.deref() as number),
    ]
  }
  public encodeCredentialAttributes(attributeRawValues: Record<string, string>): Record<string, string> {
    const rawValues = StringListStruct({
      count: Object.keys(attributeRawValues).length,
      // @ts-ignore
      data: Object.values(attributeRawValues),
    })

    const ret = allocateStringBuffer()

    // @ts-ignore
    nativeIndyCredx.credx_encode_credential_attributes(rawValues, ret)
    handleError()

    const result = ret.deref() as string

    const keys = Object.keys(attributeRawValues)
    const values = result.split(',')

    const output: Record<string, string> = {}
    keys.forEach((key, i) => (output[key] = values[i]))
    return output
  }

  public processCredential(options: {
    credential: ObjectHandle
    credentialRequestMetadata: ObjectHandle
    masterSecret: ObjectHandle
    credentialDefinition: ObjectHandle
    revocationRegistryDefinition?: ObjectHandle | undefined
  }): ObjectHandle {
    const { credential, credentialRequestMetadata, masterSecret, credentialDefinition, revocationRegistryDefinition } =
      serializeArguments(options)

    const ret = allocatePointer()

    nativeIndyCredx.credx_process_credential(
      credential,
      credentialRequestMetadata,
      masterSecret,
      credentialDefinition,
      // @ts-ignore
      revocationRegistryDefinition,
      ret
    )
    handleError()

    return new ObjectHandle(ret.deref() as number)
  }
  public revokeCredential(options: {
    revocationRegistryDefinition: ObjectHandle
    revocationRegistry: ObjectHandle
    credentialRevocationIndex: number
    tailsPath: string
  }): [ObjectHandle, ObjectHandle] {
    const { revocationRegistryDefinition, revocationRegistry, credentialRevocationIndex, tailsPath } =
      serializeArguments(options)

    const ret1 = allocatePointer()
    const ret2 = allocatePointer()

    nativeIndyCredx.credx_revoke_credential(
      revocationRegistryDefinition,
      revocationRegistry,
      credentialRevocationIndex,
      tailsPath,
      ret1,
      ret2
    )
    handleError()

    return [new ObjectHandle(ret1.deref() as number), new ObjectHandle(ret2.deref() as number)]
  }

  public createCredentialOffer(options: {
    schemaId: string
    credentialDefinition: ObjectHandle
    keyProof: ObjectHandle
  }): ObjectHandle {
    const { schemaId, credentialDefinition, keyProof } = serializeArguments(options)

    const ret = allocatePointer()
    nativeIndyCredx.credx_create_credential_offer(schemaId, credentialDefinition, keyProof, ret)
    handleError()

    return new ObjectHandle(ret.deref() as number)
  }

  public createCredentialRequest(options: {
    proverDid: string
    credentialDefinition: ObjectHandle
    masterSecret: ObjectHandle
    masterSecretId: string
    credentialOffer: ObjectHandle
  }): [ObjectHandle, ObjectHandle] {
    const { proverDid, credentialDefinition, masterSecret, masterSecretId, credentialOffer } =
      serializeArguments(options)

    const ret1 = allocatePointer()
    const ret2 = allocatePointer()

    nativeIndyCredx.credx_create_credential_request(
      proverDid,
      credentialDefinition,
      masterSecret,
      masterSecretId,
      credentialOffer,
      ret1,
      ret2
    )
    handleError()

    return [new ObjectHandle(ret1.deref() as number), new ObjectHandle(ret2.deref() as number)]
  }

  public createMasterSecret(): ObjectHandle {
    const ret = allocatePointer()

    nativeIndyCredx.credx_create_master_secret(ret)
    handleError()

    return new ObjectHandle(ret.deref() as number)
  }

  public createPresentation(options: {
    presentationRequest: ObjectHandle
    credentials: CredentialEntry[]
    credentialsProve: CredentialProve[]
    selfAttest: Record<string, string>
    masterSecret: ObjectHandle
    schemas: ObjectHandle[]
    credentialDefinitions: ObjectHandle[]
  }): ObjectHandle {
    const { presentationRequest, masterSecret, schemas, credentialDefinitions } = serializeArguments(options)

    const credentialEntries = options.credentials.map((value) => {
      const { credential, timestamp, revocationState: rev_state } = serializeArguments(value)
      return CredentialEntryStruct({ credential, timestamp, rev_state })
    })

    const credentialEntryList = CredentialEntryListStruct({
      count: credentialEntries.length,
      // @ts-ignore
      data: credentialEntries,
    })

    const credentialProves = options.credentialsProve.map((value) => {
      const { entryIndex: entry_idx, isPredicate: is_predictable, reveal, referent } = serializeArguments(value)

      // @ts-ignore
      return CredentialProveStruct({ entry_idx, referent, is_predictable, reveal })
    })

    const credentialProveList = CredentialProveListStruct({
      count: credentialProves.length,
      // @ts-ignore
      data: credentialProves,
    })

    const selfAttestKeys = StringListStruct({
      count: Object.keys(options.selfAttest).length,
      // @ts-ignore
      data: Object.keys(options.selfAttest),
    })

    const selfAttestValues = StringListStruct({
      count: Object.values(options.selfAttest).length,
      // @ts-ignore
      data: Object.values(options.selfAttest),
    })

    const ret = allocatePointer()

    nativeIndyCredx.credx_create_presentation(
      presentationRequest,
      // @ts-ignore
      credentialEntryList,
      credentialProveList,
      selfAttestKeys,
      selfAttestValues,
      masterSecret,
      schemas,
      credentialDefinitions,
      ret
    )
    handleError()

    return new ObjectHandle(ret.deref() as number)
  }
  public verifyPresentation(options: {
    presentation: ObjectHandle
    presentationRequest: ObjectHandle
    schemas: ObjectHandle[]
    credentialDefinitions: ObjectHandle[]
    revocationRegistryDefinitions: ObjectHandle[]
    revocationEntries: RevocationEntry[]
  }): boolean {
    const { presentation, presentationRequest, schemas, credentialDefinitions, revocationRegistryDefinitions } =
      serializeArguments(options)

    const revocationRegistries =
      options.revocationEntries.length > 0
        ? RevocationEntryListStruct({
            count: options.revocationEntries.length,
            // @ts-ignore
            data: options.revocationEntries.map((item) =>
              RevocationEntryStruct({
                def_entry_idx: item.revocationRegistryDefinitionEntryIndex,
                entry: item.entry.handle,
                timestamp: item.timestamp,
              })
            ),
          })
        : undefined

    const ret = allocateInt8Buffer()

    nativeIndyCredx.credx_verify_presentation(
      presentation,
      presentationRequest,
      // @ts-ignore
      schemas,
      credentialDefinitions,
      revocationRegistryDefinitions,
      revocationRegistries,
      ret
    )
    handleError()

    return Boolean(ret.deref() as number)
  }

  public createRevocationRegistry(options: {
    originDid: string
    credentialDefinition: ObjectHandle
    tag: string
    revocationRegistryType: string
    issuanceType?: string | undefined
    maximumCredentialNumber: number
    tailsDirectoryPath?: string | undefined
  }): [ObjectHandle, ObjectHandle, ObjectHandle, ObjectHandle] {
    const {
      originDid,
      credentialDefinition,
      tag,
      revocationRegistryType,
      issuanceType,
      maximumCredentialNumber,
      tailsDirectoryPath,
    } = serializeArguments(options)

    const ret1 = allocatePointer()
    const ret2 = allocatePointer()
    const ret3 = allocatePointer()
    const ret4 = allocatePointer()

    nativeIndyCredx.credx_create_revocation_registry(
      originDid,
      credentialDefinition,
      tag,
      revocationRegistryType,
      issuanceType,
      maximumCredentialNumber,
      tailsDirectoryPath,
      ret1,
      ret2,
      ret3,
      ret4
    )
    handleError()

    return [
      new ObjectHandle(ret1.deref() as number),
      new ObjectHandle(ret2.deref() as number),
      new ObjectHandle(ret3.deref() as number),
      new ObjectHandle(ret4.deref() as number),
    ]
  }
  public updateRevocationRegistry(options: {
    revocationRegistryDefinition: ObjectHandle
    revocationRegistry: ObjectHandle
    issued: number[]
    revoked: number[]
    tailsDirectoryPath: string
  }): [ObjectHandle, ObjectHandle] {
    const { revocationRegistryDefinition, revocationRegistry, tailsDirectoryPath, issued, revoked } =
      serializeArguments(options)

    const ret1 = allocatePointer()
    const ret2 = allocatePointer()

    nativeIndyCredx.credx_update_revocation_registry(
      revocationRegistryDefinition,
      revocationRegistry,
      // @ts-ignore
      issued,
      revoked,
      tailsDirectoryPath,
      ret1,
      ret2
    )
    handleError()

    return [new ObjectHandle(ret1.deref() as number), new ObjectHandle(ret2.deref() as number)]
  }
  public mergeRevocationRegistryDeltas(options: {
    revocationRegistryDelta1: ObjectHandle
    revocationRegistryDelta2: ObjectHandle
  }): ObjectHandle {
    const { revocationRegistryDelta1, revocationRegistryDelta2 } = serializeArguments(options)

    const ret = allocatePointer()

    nativeIndyCredx.credx_merge_revocation_registry_deltas(revocationRegistryDelta1, revocationRegistryDelta2, ret)
    handleError()

    return new ObjectHandle(ret.deref() as number)
  }

  public createOrUpdateRevocationState(options: {
    revocationRegistryDefinition: ObjectHandle
    revocationRegistryDelta: ObjectHandle
    revocationRegistryIndex: number
    timestamp: number
    tailsPath: string
    previousRevocationState?: ObjectHandle | undefined
  }): ObjectHandle {
    const { revocationRegistryDefinition, revocationRegistryDelta, revocationRegistryIndex, timestamp, tailsPath } =
      serializeArguments(options)

    const previousRevocationState = options.previousRevocationState ?? new ObjectHandle(0)
    const ret = allocatePointer()

    nativeIndyCredx.credx_create_or_update_revocation_state(
      revocationRegistryDefinition,
      revocationRegistryDelta,
      revocationRegistryIndex,
      timestamp,
      tailsPath,
      // @ts-ignore
      previousRevocationState.handle,
      ret
    )
    handleError()

    return new ObjectHandle(ret.deref() as number)
  }
  public version(): string {
    return nativeIndyCredx.credx_version()
  }

  // This should be called when a function returns a non-zero code
  public getCurrentError(): string {
    const ret = allocateStringBuffer()
    nativeIndyCredx.credx_get_current_error(ret)
    handleError()

    return ret.deref() as string
  }

  public presentationRequestFromJson(options: { json: string }) {
    const ret = allocatePointer()

    const byteBuffer = ByteBuffer.fromUint8Array(new TextEncoder().encode(options.json))
    handleError()

    // @ts-ignore
    nativeIndyCredx.credx_presentation_request_from_json(byteBuffer, ret)

    return new ObjectHandle(ret.deref() as number)
  }

  public getJson(options: { object: ObjectHandle }) {
    const ret = allocateByteBuffer()

    const { object } = serializeArguments(options)
    nativeIndyCredx.credx_object_get_json(object, ret)
    handleError()

    const output = new Uint8Array(byteBufferToBuffer(ret.deref()))

    return new TextDecoder().decode(output)
  }

  public getTypeName(options: { object: ObjectHandle }) {
    const { object } = serializeArguments(options)

    const ret = allocateStringBuffer()

    nativeIndyCredx.credx_object_get_type_name(object, ret)
    handleError()

    return ret.deref() as string
  }

  public objectFree(options: { object: ObjectHandle }) {
    nativeIndyCredx.credx_object_free(options.object.handle)
    handleError()
  }
}
