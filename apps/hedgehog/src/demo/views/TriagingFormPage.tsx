import * as React from 'react'
import styled from '@emotion/styled'
import { motion } from 'framer-motion'
import chroma from 'chroma-js'
import { useAuthenticationQuery } from 'types/generated/graphql'

const HeroText = styled.div`
  width: 100%;
  text-align: center;
  margin-top: 20vh;
  font-size: 2.25rem;
  line-height: 2.75rem;
`

const PayoutButton = styled(motion.button)`
  width: 100%;
  margin-top: 4vh;
  font-size: 1rem;

  padding: 1rem;
  border-radius: 0.35rem;
  border: none;

  background-color: ${({ theme }) =>
    chroma(theme.semiStrongForeground).brighten(3).hex()};
  color: ${({ theme }) => chroma(theme.semiStrongForeground).brighten().hex()};

  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  user-select: none;
`

const SubText = styled.div`
  margin-top: 0.25rem;
  font-size: 0.8rem;
  text-align: center;
  width: 100%;
  color: ${({ theme }) => chroma(theme.semiStrongForeground).brighten().hex()};
`

export const TriagingFormPage: React.FC<{ entrypoint: string }> = ({
  entrypoint,
}) => {
  const { data } = useAuthenticationQuery({ fetchPolicy: 'cache-first' })
  const firstName = (data?.me?.user?.fullName ?? '').split(' ')[0]

  return (
    <div style={{ padding: '0 1.25rem' }}>
      <HeroText>{entrypoint}</HeroText>
      <PayoutButton>Payout</PayoutButton>
      <SubText>Sorry {firstName}, no money for you</SubText>
    </div>
  )
}
