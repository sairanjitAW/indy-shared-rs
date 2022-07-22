/* eslint-disable no-console */
import { registerIndyCredx } from 'indy-credx-shared'

import { NodeJSIndyCredx } from './NodeJSIndyCredx'

const run = () => {
  const credx = new NodeJSIndyCredx()
  // NOTE: this is only required when using the functionality from within shared
  // if you want to access the library like in the `console.log` below, you can
  // do that directly
  registerIndyCredx({ credx })
  console.log(credx.version())
  console.log(credx.getCurrentError())
}

run()
