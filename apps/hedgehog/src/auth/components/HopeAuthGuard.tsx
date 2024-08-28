import { ReactNode } from 'react'
import { AuthPermission, getAuthPermissions } from '../permissions'
import { Label, StandaloneMessage } from '@hedvig-ui'

type HopeAuthGuardProps = {
  requires?: AuthPermission | AuthPermission[]
  noAccessContent?: ReactNode | null
  children: ReactNode
  label?: string
}
export const HopeAuthGuard = ({
  requires,
  noAccessContent,
  children,
  label,
}: HopeAuthGuardProps) => {
  const permissions = getAuthPermissions()

  if (!permissions) {
    if (noAccessContent !== undefined) {
      return noAccessContent
    }
    return <NotAllowed />
  }

  if (!requires) {
    return children
  }

  const hasRequiredPermissions = Array.isArray(requires)
    ? requires.every(
        ({ domain, permission }) =>
          !!permissions[domain] && permissions[domain].includes(permission),
      )
    : !!permissions[requires.domain] &&
      permissions[requires.domain].includes(requires.permission)

  if (!hasRequiredPermissions) {
    if (noAccessContent !== undefined) {
      return noAccessContent
    }
    return <NotAllowed />
  }

  return (
    <>
      {children}
      {!!label && <Label style={{ color: 'red' }}>{label}</Label>}
    </>
  )
}

const NotAllowed = () => (
  <StandaloneMessage>
    You are not allowed to view this content
  </StandaloneMessage>
)
