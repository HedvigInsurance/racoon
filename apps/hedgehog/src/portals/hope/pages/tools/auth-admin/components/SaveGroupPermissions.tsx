import { ButtonHTMLAttributes, useMemo } from 'react'
import { Button } from '@hedvig-ui'
import { useAuthAdmin } from '../hooks/use-auth-admin'
import { AuthPermissionInput } from 'types/generated/graphql'

export const SaveGroupPermissions = ({
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) => {
  const {
    selectedGroup,
    updatedPermissions,
    hasPermissionChanges,
    setPermissions,
  } = useAuthAdmin()

  const permissionsInput = useMemo(() => {
    if (!updatedPermissions) return undefined
    return Object.entries(updatedPermissions)?.reduce(
      (acc, [domain, permissions]) => {
        permissions.forEach((permission) => {
          if (
            !acc.find(
              (current) =>
                current.domain === domain && current.permission === permission,
            )
          ) {
            acc.push({ domain, permission })
          }
        })
        return acc
      },
      [] as AuthPermissionInput[],
    )
  }, [updatedPermissions])

  const disabled = !hasPermissionChanges || !permissionsInput || !selectedGroup

  return (
    <Button
      {...props}
      disabled={disabled}
      onClick={() => {
        if (disabled) {
          return
        }
        setPermissions(selectedGroup.id, permissionsInput)
      }}
    >
      Save changes
    </Button>
  )
}
