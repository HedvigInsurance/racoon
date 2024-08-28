import * as React from 'react'
import { AvailablePortals } from 'auth/components/AvailablePortals'
import { FadeIn, Flex, MainHeadline } from '@hedvig-ui'
import { useAuthenticationQuery } from 'types/generated/graphql'
import { useNavigate } from 'react-router-dom'

export const PortalsPage: React.FC = () => {
  const navigate = useNavigate()
  const { data } = useAuthenticationQuery()

  const portals = data?.me.availablePortals ?? []
  const currentPortal = data?.me.portal ?? ''

  if (data?.me && portals.length <= 1) {
    navigate('/')
    return null
  }

  return (
    <>
      <FadeIn
        style={{
          marginTop: 'calc(35vh - 2rem)',
          marginBottom: '2rem',
          textAlign: 'center',
        }}
      >
        <MainHeadline>Portals</MainHeadline>
      </FadeIn>
      <Flex justify="center" fullWidth>
        <AvailablePortals
          portals={portals}
          currentPortal={currentPortal}
          maxWidth="80vh"
        />
      </Flex>
    </>
  )
}
