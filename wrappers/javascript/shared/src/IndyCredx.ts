// Each platform, Nodejs and React Native, should implement this interface
// This will make sure that when wrapping both methods to shared functionality
// inside `indy-credx-shared` we do not need to create two mappings there
export interface IndyCredx {
  version(): string

  getCurrentError(): string
}
