import { registerIndyCredx } from 'indy-credx-shared'

import { NodeJSIndyCredx } from '../../src/NodeJSIndyCredx'

export const setup = () => {
  registerIndyCredx({ credx: new NodeJSIndyCredx() })
}
