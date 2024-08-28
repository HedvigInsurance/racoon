import * as React from 'react'
import styled from '@emotion/styled'
import { motion } from 'framer-motion'
import { Flex } from '@hedvig-ui'
import { useAuthenticationQuery } from 'types/generated/graphql'

const HeroText = styled.div`
  margin-top: 10vh;
  font-size: 2.25rem;
  line-height: 2.75rem;
`

const StartClaimButton = styled(motion.button)`
  width: 100%;
  margin-top: 3rem;
  font-size: 1rem;

  padding: 1rem;
  border-radius: 0.35rem;
  border: none;

  background-color: ${({ theme }) => theme.highlight};
  color: ${({ theme }) => theme.foreground};

  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  user-select: none;
`

export const TriagingStartPage: React.FC<{ onStartClaim: () => void }> = ({
  onStartClaim,
}) => {
  const { data } = useAuthenticationQuery({ fetchPolicy: 'cache-first' })
  const firstName = (data?.me?.user?.fullName ?? '').split(' ')[0]

  if (!firstName) {
    return null
  }

  return (
    <Flex direction="column" style={{ padding: '0 1.25rem' }}>
      <HeroText>Hi {firstName}, how can we help you?</HeroText>
      <StartClaimButton onClick={onStartClaim} whileTap={{ scale: 0.97 }}>
        Start a claim
      </StartClaimButton>
    </Flex>
  )
}
