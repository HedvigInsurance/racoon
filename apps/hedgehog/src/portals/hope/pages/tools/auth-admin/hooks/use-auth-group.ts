import { useState, useMemo, useEffect } from 'react'
import toast from 'react-hot-toast'
import { extractErrorMessage } from '@hedvig-ui'
import { staticPermissions } from 'auth'
import {
  useCreateAuthGroupMutation,
  useSetAuthGroupPermissionsMutation,
  ListAuthGroupsDocument,
  AuthPermissionInput,
  useListAuthGroupsQuery,
  AuthGroup,
} from 'types/generated/graphql'

export const useAuthGroup = () => {
  const [createAuthGroupMutation] = useCreateAuthGroupMutation()
  const [setAuthGroupPermissionsMutation] = useSetAuthGroupPermissionsMutation()

  const createAuthGroup = (groupName: string) =>
    toast.promise(
      createAuthGroupMutation({
        variables: { groupName },
        refetchQueries: [
          {
            query: ListAuthGroupsDocument,
          },
        ],
      }),
      {
        success: 'Group created',
        loading: 'Creating group...',
        error: ({ message }) => extractErrorMessage(message),
      },
    )

  const setPermissions = (
    groupId: string,
    permissions: AuthPermissionInput[],
  ) =>
    toast.promise(
      setAuthGroupPermissionsMutation({
        variables: { groupId, permissions },
        refetchQueries: [
          {
            query: ListAuthGroupsDocument,
          },
        ],
      }),
      {
        success: 'Permissions set',
        loading: 'Setting permissions...',
        error: ({ message }) => extractErrorMessage(message),
      },
    )

  const { data } = useListAuthGroupsQuery()
  const authGroups = useMemo(() => data?.auth_groups ?? [], [data?.auth_groups])

  const authPermissions =
    data?.auth_groups?.reduce(
      (acc, { permissions }) => {
        permissions.forEach(({ domain, permission }) => {
          acc[domain] = acc[domain]
            ? [...new Set([...acc[domain], permission])]
            : [permission]
        })
        return acc
      },
      {} as Record<string, string[]>,
    ) ?? {}

  const allPermissions = [
    ...Object.keys(staticPermissions),
    ...Object.keys(authPermissions),
  ].reduce(
    (acc, domain) => {
      acc[domain] = [
        ...new Set([
          ...(staticPermissions[domain] ?? []),
          ...(authPermissions[domain] ?? []),
        ]),
      ]
      return acc
    },
    {} as Record<string, string[]>,
  )

  const [selectedGroupId, setSelectedGroupId] = useState<string | undefined>()

  const selectGroup = (group: AuthGroup) => {
    setSelectedGroupId(group.id)
  }

  const selectedGroup = useMemo(() => {
    return authGroups.find(({ id }) => id === selectedGroupId)
  }, [selectedGroupId, authGroups])

  const selectedGroupPermissions = useMemo(
    () =>
      selectedGroup?.permissions?.reduce(
        (acc, { domain, permission }) => {
          acc[domain] = acc[domain]
            ? [...new Set([...acc[domain], permission])]
            : [permission]
          return acc
        },
        {} as Record<string, string[]>,
      ),
    [selectedGroup],
  )

  const [updatedPermissions, setUpdatedPermissions] = useState(
    selectedGroupPermissions,
  )

  useEffect(() => {
    setUpdatedPermissions(selectedGroupPermissions)
  }, [selectedGroupPermissions])

  const hasPermissionChanges = useMemo(() => {
    if (!selectedGroupPermissions || !updatedPermissions) return false
    return (
      Object.entries(updatedPermissions).filter(
        ([domain, permissions]) =>
          [...(selectedGroupPermissions[domain] ?? [])].sort().join(',') !==
          [...permissions.sort()].join(','),
      ).length > 0
    )
  }, [selectedGroupPermissions, updatedPermissions])

  const addedPermissions = useMemo(() => {
    if (!selectedGroupPermissions || !updatedPermissions) return []

    return Object.entries(updatedPermissions).reduce(
      (acc, [domain, permissions]) => {
        permissions.forEach((permission) => {
          if (!selectedGroupPermissions[domain]?.includes(permission)) {
            acc.push({ domain, permission })
          }
        })
        return acc
      },
      [] as { domain: string; permission: string }[],
    )
  }, [selectedGroupPermissions, updatedPermissions])

  const removedPermissions = useMemo(() => {
    if (!selectedGroupPermissions || !updatedPermissions) return []

    return Object.entries(selectedGroupPermissions).reduce(
      (acc, [domain, permissions]) => {
        permissions.forEach((permission) => {
          if (!updatedPermissions[domain]?.includes(permission)) {
            acc.push({ domain, permission })
          }
        })
        return acc
      },
      [] as { domain: string; permission: string }[],
    )
  }, [selectedGroupPermissions, updatedPermissions])

  return {
    createAuthGroup,
    setPermissions,
    authGroups,
    authPermissions,
    allPermissions,
    selectedGroup,
    selectGroup,
    selectedGroupPermissions,
    updatedPermissions,
    setUpdatedPermissions,
    hasPermissionChanges,
    addedPermissions,
    removedPermissions,
  }
}
