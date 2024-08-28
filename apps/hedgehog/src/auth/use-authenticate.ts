import { MeFragment, useAuthenticationQuery } from 'types/generated/graphql'
import { useEffect, useState } from 'react'
import { ApolloError } from '@apollo/client'
import gql from 'graphql-tag'

interface UseAuthenticateResult {
  me?: MeFragment
  loading: boolean
  error: ApolloError | null
}

gql`
  query Authentication {
    me {
      ...Me
    }
  }

  fragment Me on Me {
    email
    scopes
    role
    adminId
    user {
      ...User
    }
    settings {
      ...UserSettings
    }
    portal
    availablePortals
  }

  fragment User on User {
    id
    checkedIn
    distributionPausedMinutes
    distributionPausedUntil
    checkoutPausedMinutes
    email
    fullName
    signature
    phoneNumber
    role
    markets
    resources
    areas
  }

  fragment UserSettings on UserSettings {
    darkMode
    featureFlags
    claimComplexityFilterClaims
    claimStatesFilterClaims
    claimStatesFilterQuestions
    marketFilterClaims
    marketFilterQuestions
    numberOfClaimsFilter
    outcomeFilterClaims
    focusMarkets
    languages
  }
`

export const useAuthenticate = (): UseAuthenticateResult => {
  const maxRefetchAttempts = 5

  const [refetchAttempt, setRefetchAttempt] = useState(0)

  const { data, loading, error } = useAuthenticationQuery({
    pollInterval: 10_000,
  })

  const me = data?.me

  useEffect(() => {
    if (loading) {
      return
    }

    setRefetchAttempt((prev) => {
      if (me || prev >= maxRefetchAttempts) {
        return 0
      }

      return prev + 1
    })
  }, [me, loading])

  if (loading) {
    return {
      me,
      loading: true,
      error: null,
    }
  }

  if (data?.me) {
    return {
      me,
      loading: false,
      error: null,
    }
  }

  return {
    me,
    loading: false,
    error: refetchAttempt > 5 && error ? error : null,
  }
}
