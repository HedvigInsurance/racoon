import { FetchResult } from '@apollo/client'
import gql from 'graphql-tag'
import { Market } from '@hope/features/config/constants'
import { createContext, PropsWithChildren, useContext, useState } from 'react'
import * as React from 'react'
import {
  AllTasksDocument,
  GetMeDocument,
  MeFragment,
  TaskResourceArea,
  TaskResourceType,
  UpdateUserSettingInput,
  UserFragment,
  UserSettings,
  useUpdateUserCompatibilitiesMutation,
  useUpdateUserSettingsMutation,
} from 'types/generated/graphql'
import { toast } from 'react-hot-toast'
import { extractErrorMessage } from '@hedvig-ui'

gql`
  mutation UpdateUserCompatibilities($input: UpdateUserInput!) {
    updateUser(input: $input) {
      id
      markets
      resources
      areas
    }
  }
`

interface PartialMe {
  userId: string
  checkedIn: boolean
  adminId: string
  userCheckoutPausedMinutes: number | null
  taskDistributionPausedUntil: Date | null
  taskDistributionPausedMinutes: number | null
  email: string
  fullName: string
  markets: ReadonlyArray<Market>
  resources: ReadonlyArray<TaskResourceType>
  areas: ReadonlyArray<TaskResourceArea | null>
  portal: string
  availablePortals: string[]
  user: UserFragment
}

interface MeContextProps {
  me: PartialMe
  settings: UserSettings
  markets: string[]
  resources: TaskResourceType[]
  areas: (TaskResourceArea | null)[]
  updateSetting: (
    key: keyof UpdateUserSettingInput,
    value?: unknown,
  ) => Promise<FetchResult>
  update: (
    market: Market | null,
    resource: TaskResourceType | null,
    area: (TaskResourceArea | null)[] | null,
  ) => void
  resetUserUpdates: () => void
  saveUserUpdates: () => Promise<FetchResult>
}

interface MeProviderProps {
  me: MeFragment | null
}

const MeContext = createContext<MeContextProps | null>(null)

export const useMe = () => {
  const context = useContext(MeContext)

  if (!context) {
    throw Error('useMe must be used inside MeProvider')
  }

  return context
}

export const MeProvider: React.FC<PropsWithChildren & MeProviderProps> = ({
  me,
  children,
}) => {
  const [updateUserSettings] = useUpdateUserSettingsMutation()

  const [updateUser] = useUpdateUserCompatibilitiesMutation()

  const [markets, setMarkets] = useState(me?.user.markets ?? [])
  const [resources, setResources] = useState(me?.user.resources ?? [])
  const [areas, setAreas] = useState(me?.user.areas ?? [])

  if (!me) {
    return null
  }

  const settings = me.settings

  const partialMe = {
    userId: me.user.id,
    checkedIn: me.user.checkedIn,
    adminId: me.adminId,
    userCheckoutPausedMinutes: me.user.checkoutPausedMinutes ?? null,
    taskDistributionPausedUntil: me.user.distributionPausedUntil
      ? new Date(me.user.distributionPausedUntil)
      : null,
    taskDistributionPausedMinutes: me.user.distributionPausedMinutes ?? null,
    email: me.user.email,
    fullName: me.user.fullName,
    markets: me.user.markets as ReadonlyArray<Market>,
    resources: me.user.resources as ReadonlyArray<TaskResourceType>,
    areas: me.user.areas as ReadonlyArray<TaskResourceArea>,
    portal: me.portal,
    availablePortals: me.availablePortals,
    user: me.user,
  }

  const update = (
    market: Market | null,
    resource: TaskResourceType | null,
    area: (TaskResourceArea | null)[] | null,
  ) => {
    setMarkets((prev) =>
      market === null
        ? prev
        : prev.includes(market)
          ? prev.filter((currentMarket) => currentMarket !== market)
          : [...prev, market],
    )

    setResources((prev) =>
      resource === null
        ? prev
        : prev.includes(resource)
          ? prev.filter((currentResource) => currentResource !== resource)
          : [...prev, resource],
    )

    setAreas((prev) => (area === null ? prev : area))
  }

  const resetUserUpdates = () => {
    setMarkets(me.user.markets)
    setResources(me.user.resources)
    setAreas(me.user.areas)
  }

  const saveUserUpdates = async () => {
    return await toast.promise(
      updateUser({
        variables: {
          input: {
            fullName: null,
            phoneNumber: null,
            markets,
            resources,
            areas,
          },
        },
        refetchQueries: [{ query: AllTasksDocument }],
        optimisticResponse: {
          updateUser: {
            __typename: 'User',
            id: me.user.id,
            markets,
            resources,
            areas,
          },
        },
      }),
      {
        loading: 'Updating preference...',
        success: 'Preference updated',
        error: ({ message }) => extractErrorMessage(message),
      },
    )
  }

  const updateSetting = (
    key: keyof UpdateUserSettingInput,
    value?: unknown,
  ): Promise<FetchResult> => {
    return updateUserSettings({
      variables: { settings: { [key]: { value } } },
      optimisticResponse: {
        updateUserSettings: {
          ...me.settings,
          [key]: value,
        },
      },
      refetchQueries: [{ query: AllTasksDocument }, { query: GetMeDocument }],
    })
  }

  return (
    <MeContext.Provider
      value={{
        me: partialMe,
        settings,
        markets,
        resources,
        areas,
        updateSetting,
        update,
        resetUserUpdates,
        saveUserUpdates,
      }}
    >
      {children}
    </MeContext.Provider>
  )
}
