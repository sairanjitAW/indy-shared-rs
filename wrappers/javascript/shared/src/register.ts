import type { IndyCredx } from './IndyCredx'

// TODO: types
export let indyCredx: IndyCredx

export const registerIndyCredx = ({ credx: askar }: { credx: IndyCredx }) => (indyCredx = askar)
