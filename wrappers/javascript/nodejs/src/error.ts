import { IndyCredxError } from 'indy-credx-shared'

export const handleError = () => {
  throw new IndyCredxError({ code: 100, message: 'TODO' })
}
