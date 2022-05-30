import { nativeIndyCredx } from './lib'
import { registerIndyCredx } from 'indy-credx-shared'

const run = () => {
  // NOTE: this is only required when using the functionality from within shared
  // if you want to access the library like in the `console.log` below, you can
  // do that directly
  registerIndyCredx({ credx: nativeIndyCredx })
  console.log(nativeIndyCredx.credx_version())
}

run()
