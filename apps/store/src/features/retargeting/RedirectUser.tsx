import { RedirectUserParams } from './retargeting.types'
import { useRedirectUser } from './useRedirectUser'

type Props = RedirectUserParams

export const RedirectUser = (props: Props) => {
  useRedirectUser(props)
  return null
}
