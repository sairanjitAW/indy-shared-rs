import { indyCredx } from 'indy-credx-shared'
import { text } from 'stream/consumers'

import { setup } from './utils'

describe('bindings', () => {
  beforeAll(() => setup())
  test('version', () => {
    const version = indyCredx.version()

    expect(version).toEqual('0.3.1')
  })

  test('current error', () => {
    const error = indyCredx.getCurrentError()

    expect(JSON.parse(error)).toEqual({ code: 0, message: null })
  })

  test('generate nonce', () => {
    const nonce = indyCredx.generateNonce()
    expect(nonce).toMatch(/^\d*$/)
  })

  test('create schema', () => {
    const schemaObj = indyCredx.createSchema({
      name: 'schema-1',
      originDid: '55GkHamhTU1ZbTbV2ab9DE',
      version: '1',
      sequenceNumber: 1,
      attributeNames: ['attr-1'],
    })

    const schemaId = indyCredx.schemaGetAttribute({
      schema: schemaObj,
      name: 'id',
    })

    expect(schemaId).toEqual('55GkHamhTU1ZbTbV2ab9DE:2:schema-1:1')

    const json = indyCredx.getJson({ object: schemaObj })
    expect(JSON.parse(json)).toEqual({
      id: '55GkHamhTU1ZbTbV2ab9DE:2:schema-1:1',
      name: 'schema-1',
      ver: '1.0',
      seqNo: 1,
      version: '1',
      attrNames: ['attr-1'],
    })
  })

  test('create credential definition', () => {
    const schemaObj = indyCredx.createSchema({
      name: 'schema-1',
      originDid: '55GkHamhTU1ZbTbV2ab9DE',
      version: '1',
      sequenceNumber: 1,
      attributeNames: ['attr-1'],
    })

    const [credDefObj, credDefPvt, keyProof] = indyCredx.createCredentialDefinition({
      originDid: '55GkHamhTU1ZbTbV2ab9DE',
      schema: schemaObj,
      signatureType: 'CL',
      supportRevocation: true,
      tag: 'TAG',
    })

    const credDefJson = indyCredx.getJson({ object: credDefObj })
    expect(JSON.parse(credDefJson)).toEqual(
      expect.objectContaining({
        id: '55GkHamhTU1ZbTbV2ab9DE:3:CL:1:TAG',
        tag: 'TAG',
        type: 'CL',
        schemaId: '1',
        ver: '1.0',
      })
    )

    const credDefPvtJson = indyCredx.getJson({ object: credDefPvt })
    expect(JSON.parse(credDefPvtJson)).toHaveProperty('value')

    const keyProofJson = indyCredx.getJson({ object: keyProof })
    expect(JSON.parse(keyProofJson)).toHaveProperty('c')
    expect(JSON.parse(keyProofJson)).toHaveProperty('xr_cap')
  })

  test('encode credential attributes', () => {
    const encoded = indyCredx.encodeCredentialAttributes({ key1: 'value2', key2: 'value1' })

    expect(encoded).toEqual({
      key1: '2360207505573967335061705667247358223962382058438765247085581582985596391831',
      key2: '27404702143883897701950953229849815393032792099783647152371385368148256400014',
    })
  }),
    test('create revocation registry', () => {
      const schemaObj = indyCredx.createSchema({
        name: 'schema-1',
        originDid: '55GkHamhTU1ZbTbV2ab9DE',
        version: '1',
        sequenceNumber: 1,
        attributeNames: ['attr-1'],
      })

      const [credDefObj, credDefPvt, keyProof] = indyCredx.createCredentialDefinition({
        originDid: '55GkHamhTU1ZbTbV2ab9DE',
        schema: schemaObj,
        signatureType: 'CL',
        supportRevocation: true,
        tag: 'TAG',
      })
      const [revRegDef, revRegDefPrivate, revReg, revRegInitDelta] = indyCredx.createRevocationRegistry({
        originDid: '55GkHamhTU1ZbTbV2ab9DE',
        credentialDefinition: credDefObj,
        tag: 'default',
        revocationRegistryType: 'CL_ACCUM',
        maximumCredentialNumber: 100,
      })

      const maximumCredentialNumber = indyCredx.revocationRegistryDefinitionGetAttribute({
        object: revRegDef,
        name: 'max_cred_num',
      })

      expect(maximumCredentialNumber).toEqual('100')
      const json = indyCredx.getJson({ object: revRegDef })
      expect(JSON.parse(json)).toEqual(
        expect.objectContaining({
          credDefId: '55GkHamhTU1ZbTbV2ab9DE:3:CL:1:TAG',
          id: '55GkHamhTU1ZbTbV2ab9DE:4:55GkHamhTU1ZbTbV2ab9DE:3:CL:1:TAG:CL_ACCUM:default',
          revocDefType: 'CL_ACCUM',
          tag: 'default',
        })
      )
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(JSON.parse(json).value).toEqual(
        expect.objectContaining({
          issuanceType: 'ISSUANCE_BY_DEFAULT',
          maxCredNum: 100,
        })
      )
    })

  test('create master secret', () => {
    const masterSecret = indyCredx.createMasterSecret()
    const json = indyCredx.getJson({ object: masterSecret })
    expect(JSON.parse(json)).toHaveProperty('value')
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(JSON.parse(json).value).toHaveProperty('ms')
  })

  test('create credential offer', () => {
    const schemaObj = indyCredx.createSchema({
      name: 'schema-1',
      originDid: '55GkHamhTU1ZbTbV2ab9DE',
      version: '1',
      sequenceNumber: 1,
      attributeNames: ['attr-1'],
    })

    const [credDefObj, credDefPvt, keyProof] = indyCredx.createCredentialDefinition({
      originDid: '55GkHamhTU1ZbTbV2ab9DE',
      schema: schemaObj,
      signatureType: 'CL',
      supportRevocation: true,
      tag: 'TAG',
    })

    const credOfferObj = indyCredx.createCredentialOffer({
      schemaId: '55GkHamhTU1ZbTbV2ab9DE:2:schema-1:1',
      credentialDefinition: credDefObj,
      keyProof,
    })

    const json = indyCredx.getJson({ object: credOfferObj })
    expect(JSON.parse(json)).toEqual(
      expect.objectContaining({
        cred_def_id: '55GkHamhTU1ZbTbV2ab9DE:3:CL:1:TAG',
        schema_id: '55GkHamhTU1ZbTbV2ab9DE:2:schema-1:1',
      })
    )
    expect(JSON.parse(json)).toHaveProperty('nonce')
    expect(JSON.parse(json)).toHaveProperty('key_correctness_proof')
  })

  test('create credential request', () => {
    const schemaObj = indyCredx.createSchema({
      name: 'schema-1',
      originDid: '55GkHamhTU1ZbTbV2ab9DE',
      version: '1',
      sequenceNumber: 1,
      attributeNames: ['attr-1'],
    })

    const [credDefObj, credDefPvt, keyProof] = indyCredx.createCredentialDefinition({
      originDid: '55GkHamhTU1ZbTbV2ab9DE',
      schema: schemaObj,
      signatureType: 'CL',
      supportRevocation: true,
      tag: 'TAG',
    })

    const credOfferObj = indyCredx.createCredentialOffer({
      schemaId: '55GkHamhTU1ZbTbV2ab9DE:2:schema-1:1',
      credentialDefinition: credDefObj,
      keyProof,
    })

    const masterSecret = indyCredx.createMasterSecret()
    const masterSecretId = 'master secret id'

    const [credReq, credReqMetadata] = indyCredx.createCredentialRequest({
      proverDid: '55GkHamhTU1ZbTbV2ab9DE',
      credentialDefinition: credDefObj,
      masterSecret,
      masterSecretId,
      credentialOffer: credOfferObj,
    })

    const credReqJson = indyCredx.getJson({ object: credReq })
    expect(JSON.parse(credReqJson)).toEqual(
      expect.objectContaining({
        prover_did: '55GkHamhTU1ZbTbV2ab9DE',
      })
    )
    expect(JSON.parse(credReqJson)).toHaveProperty('blinded_ms')
    expect(JSON.parse(credReqJson)).toHaveProperty('nonce')

    const credReqMetadataJson = indyCredx.getJson({ object: credReqMetadata })
    expect(JSON.parse(credReqMetadataJson)).toEqual(
      expect.objectContaining({
        master_secret_name: masterSecretId,
      })
    )
    expect(JSON.parse(credReqMetadataJson)).toHaveProperty('master_secret_blinding_data')
    expect(JSON.parse(credReqMetadataJson)).toHaveProperty('nonce')
  })

  test('create and receive credential', () => {
    const schemaObj = indyCredx.createSchema({
      name: 'schema-1',
      originDid: '55GkHamhTU1ZbTbV2ab9DE',
      version: '1',
      sequenceNumber: 1,
      attributeNames: ['attr-1'],
    })

    const [credDefObj, credDefPvt, keyProof] = indyCredx.createCredentialDefinition({
      originDid: '55GkHamhTU1ZbTbV2ab9DE',
      schema: schemaObj,
      signatureType: 'CL',
      supportRevocation: true,
      tag: 'TAG',
    })

    const credOfferObj = indyCredx.createCredentialOffer({
      schemaId: '55GkHamhTU1ZbTbV2ab9DE:2:schema-1:1',
      credentialDefinition: credDefObj,
      keyProof,
    })

    const masterSecret = indyCredx.createMasterSecret()
    const masterSecretId = 'master secret id'

    const [credReq, credReqMetadata] = indyCredx.createCredentialRequest({
      proverDid: '55GkHamhTU1ZbTbV2ab9DE',
      credentialDefinition: credDefObj,
      masterSecret,
      masterSecretId,
      credentialOffer: credOfferObj,
    })

    const [revRegDef, revRegDefPrivate, revReg, revRegInitDelta] = indyCredx.createRevocationRegistry({
      originDid: '55GkHamhTU1ZbTbV2ab9DE',
      credentialDefinition: credDefObj,
      tag: 'default',
      revocationRegistryType: 'CL_ACCUM',
      maximumCredentialNumber: 100,
    })

    const tailsPath = indyCredx.revocationRegistryDefinitionGetAttribute({
      object: revRegDef,
      name: 'tails_location',
    })

    const [cred, revRegUpdated, revDelta] = indyCredx.createCredential({
      credentialDefinition: credDefObj,
      credentialDefinitionPrivate: credDefPvt,
      credentialOffer: credOfferObj,
      credentialRequest: credReq,
      attributeRawValues: { 'attr-1': 'test' },
      attributeEncodedValues: undefined,
      revocationConfiguration: {
        registryDefinition: revRegDef,
        registryDefinitionPrivate: revRegDefPrivate,
        registry: revReg,
        registryIndex: 1,
        tailsPath: tailsPath,
      },
    })

    const credReceived = indyCredx.processCredential({
      credential: cred,
      credentialDefinition: credDefObj,
      credentialRequestMetadata: credReqMetadata,
      masterSecret,
      revocationRegistryDefinition: revRegDef,
    })

    const credJson = indyCredx.getJson({ object: cred })
    expect(JSON.parse(credJson)).toEqual(
      expect.objectContaining({
        cred_def_id: '55GkHamhTU1ZbTbV2ab9DE:3:CL:1:TAG',
        rev_reg_id: '55GkHamhTU1ZbTbV2ab9DE:4:55GkHamhTU1ZbTbV2ab9DE:3:CL:1:TAG:CL_ACCUM:default',
        schema_id: '55GkHamhTU1ZbTbV2ab9DE:2:schema-1:1',
      })
    )

    const credReceivedJson = indyCredx.getJson({ object: credReceived })
    expect(JSON.parse(credReceivedJson)).toEqual(
      expect.objectContaining({
        cred_def_id: '55GkHamhTU1ZbTbV2ab9DE:3:CL:1:TAG',
        rev_reg_id: '55GkHamhTU1ZbTbV2ab9DE:4:55GkHamhTU1ZbTbV2ab9DE:3:CL:1:TAG:CL_ACCUM:default',
        schema_id: '55GkHamhTU1ZbTbV2ab9DE:2:schema-1:1',
      })
    )
    expect(JSON.parse(credReceivedJson)).toHaveProperty('signature')
    expect(JSON.parse(credReceivedJson)).toHaveProperty('witness')
  })

  test('create and verify presentation', () => {
    const timestamp = new Date().getUTCDate()

    const presRequestObj = indyCredx.presentationRequestFromJson({
      json: JSON.stringify({
        name: 'proof',
        version: '1.0',
        nonce: '1234',
        requested_attributes: {
          reft: {
            name: 'attr-1',
            non_revoked: { from: timestamp, to: timestamp },
          },
          name: {
            name: 'name',
            non_revoked: { from: timestamp, to: timestamp },
          },
        },
        requested_predicates: {},
        non_revoked: { from: timestamp, to: timestamp },
        ver: '1.0',
      }),
    })

    expect(indyCredx.getTypeName({ object: presRequestObj })).toEqual('PresentationRequest')

    const schemaObj = indyCredx.createSchema({
      name: 'schema-1',
      originDid: '55GkHamhTU1ZbTbV2ab9DE',
      version: '1',
      sequenceNumber: 1,
      attributeNames: ['attr-1'],
    })

    const [credDefObj, credDefPvt, keyProof] = indyCredx.createCredentialDefinition({
      originDid: '55GkHamhTU1ZbTbV2ab9DE',
      schema: schemaObj,
      signatureType: 'CL',
      supportRevocation: true,
      tag: 'TAG',
    })

    const credOfferObj = indyCredx.createCredentialOffer({
      schemaId: '55GkHamhTU1ZbTbV2ab9DE:2:schema-1:1',
      credentialDefinition: credDefObj,
      keyProof,
    })

    const masterSecret = indyCredx.createMasterSecret()
    const masterSecretId = 'master secret id'

    const [credReq, credReqMetadata] = indyCredx.createCredentialRequest({
      proverDid: '55GkHamhTU1ZbTbV2ab9DE',
      credentialDefinition: credDefObj,
      masterSecret,
      masterSecretId,
      credentialOffer: credOfferObj,
    })

    const [revRegDef, revRegDefPrivate, revReg, revRegInitDelta] = indyCredx.createRevocationRegistry({
      originDid: '55GkHamhTU1ZbTbV2ab9DE',
      credentialDefinition: credDefObj,
      tag: 'default',
      revocationRegistryType: 'CL_ACCUM',
      maximumCredentialNumber: 100,
    })

    const tailsPath = indyCredx.revocationRegistryDefinitionGetAttribute({
      object: revRegDef,
      name: 'tails_location',
    })

    const [cred, revRegUpdated, revDelta] = indyCredx.createCredential({
      credentialDefinition: credDefObj,
      credentialDefinitionPrivate: credDefPvt,
      credentialOffer: credOfferObj,
      credentialRequest: credReq,
      attributeRawValues: { 'attr-1': 'test' },
      attributeEncodedValues: undefined,
      revocationConfiguration: {
        registryDefinition: revRegDef,
        registryDefinitionPrivate: revRegDefPrivate,
        registry: revReg,
        registryIndex: 1,
        tailsPath: tailsPath,
      },
    })

    const revRegIndex = indyCredx.credentialGetAttribute({
      object: cred,
      name: 'rev_reg_index',
    })

    const revocationRegistryIndex = revRegIndex === null ? 0 : parseInt(revRegIndex)

    const revocationState = indyCredx.createOrUpdateRevocationState({
      revocationRegistryDefinition: revRegDef,
      revocationRegistryDelta: revRegInitDelta,
      revocationRegistryIndex,
      timestamp,
      tailsPath,
    })

    const presentationObj = indyCredx.createPresentation({
      presentationRequest: presRequestObj,
      credentials: [
        {
          credential: cred,
          revocationState,
          timestamp,
        },
      ],
      credentialDefinitions: [credDefObj],
      credentialsProve: [
        {
          entryIndex: 0,
          isPredicate: false,
          referent: 'reft',
          reveal: true,
        },
      ],
      masterSecret,
      schemas: [schemaObj],
      selfAttest: { name: 'value' },
    })

    const verify = indyCredx.verifyPresentation({
      presentation: presentationObj,
      presentationRequest: presRequestObj,
      credentialDefinitions: [credDefObj],
      revocationRegistryDefinitions: [revRegDef],
      revocationEntries: [
        {
          entry: revReg,
          revocationRegistryDefinitionEntryIndex: 0,
          timestamp,
        },
      ],
      schemas: [schemaObj],
    })

    expect(verify).toBeTruthy()
  })
})
