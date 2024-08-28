import { useEffect, useRef, useState } from 'react'
import * as React from 'react'
import { FadeIn, Input, Label, Spacing } from '@hedvig-ui'
import styled from '@emotion/styled'
import { Logo, LogoIcon } from '@hope/features/navigation/sidebar/elements'
import { colorsV3 } from '@hedviginsurance/brand'
import { MemberCard } from 'portals/sos/features/member-search/components/MemberCard'
import { InsuranceCard } from 'portals/sos/features/member-search/components/InsuranceCard'
import chroma from 'chroma-js'
import { useSimpleMemberLookupLazyQuery } from 'types/generated/graphql'

const Wrapper = styled.form`
  width: 25rem;
`

const HopeLogo = styled(Logo)`
  width: 10rem;
  fill: ${colorsV3.gray800};
`

const HopeLogoIcon = styled(LogoIcon)`
  width: 1.4rem;
  fill: ${colorsV3.gray800};
  margin-bottom: 2rem;
`

const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;

  margin-bottom: 2rem;
  margin-right: -0.7rem;
`

const FormContainer = styled.div`
  display: flex;
  justify-content: center;
`

const Container = styled.div<{ pushTop: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;

  transition: padding-top 300ms ease-in-out;
  padding-top: ${({ pushTop }) => (pushTop ? '5vh' : '30vh')};
`

const ErrorInformation = styled.div`
  text-align: center;
  margin-top: 0.35rem;
  color: ${({ theme }) => theme.danger};
  font-size: 0.85rem;
`

const ResultWrapper = styled.div<{ show: boolean }>`
  transition: opacity 300ms ease-in-out;
  opacity: ${({ show }) => (show ? 1 : 0)};
`

const NoInsuranceMessage = styled.div`
  margin-top: 2rem;
  text-align: center;
  color: ${({ theme }) => chroma(theme.foreground).alpha(0.4).hex()};
`

export const MemberSearchForm: React.FC = () => {
  const [ssn, setSsn] = useState('')
  const [memberLookup, { data }] = useSimpleMemberLookupLazyQuery({
    fetchPolicy: 'network-only',
    variables: {
      ssn,
    },
  })
  const [showResult, setShowResult] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setError('')
    if (ssn === '') {
      setShowResult(false)
    }
  }, [ssn])

  const valid = () => {
    if (ssn === '') {
      setError('SSN cannot be empty')
      return false
    }

    if (!/^[0-9]*$/.test(ssn)) {
      setError('SSN can only be numbers')
      return false
    }

    return true
  }

  const handleSubmit = () => {
    if (!valid()) {
      return
    }

    setError('')
    setLoading(true)

    memberLookup()
      .then((response) => {
        if (response.error || !response?.data) {
          setError('No member found for SSN')
          setShowResult(false)
          setLoading(false)
          return
        }

        setShowResult(true)
        inputRef?.current?.blur()
        setLoading(false)
      })
      .catch(() => {
        setError('No member found for SSN')
        setShowResult(false)
        setLoading(false)
        return
      })
  }

  const member = data?.simpleMemberLookup
  const contracts = data?.simpleMemberLookup?.contracts ?? []

  return (
    <Container pushTop={showResult}>
      <LogoContainer>
        <HopeLogo />
        <HopeLogoIcon />
      </LogoContainer>
      <FormContainer>
        <Wrapper
          onSubmit={(e) => {
            e.preventDefault()
            handleSubmit()
          }}
        >
          {ssn ? (
            <FadeIn duration={200}>
              <Label>Social Security Number</Label>
            </FadeIn>
          ) : (
            <Label>{'\xa0'}</Label>
          )}
          <Input
            ref={inputRef}
            autoFocus
            placeholder="Social Security Number"
            size="large"
            disabled={loading}
            value={ssn}
            onFocus={() => {
              if (showResult) {
                setShowResult(false)
              }
            }}
            onChange={(e) => setSsn(e.currentTarget.value)}
          />
          {error && (
            <FadeIn duration={200}>
              <ErrorInformation>{error}</ErrorInformation>
            </FadeIn>
          )}
        </Wrapper>
      </FormContainer>
      <Spacing top="medium" />
      <ResultWrapper show={showResult}>
        {member && <MemberCard member={member} />}
        {contracts.map((contract) => (
          <React.Fragment key={contract.contractId}>
            <Spacing top="small" />
            <InsuranceCard contract={contract} />
          </React.Fragment>
        ))}
        {!contracts.length && !loading && !!member?.memberId && (
          <NoInsuranceMessage>No active insurances</NoInsuranceMessage>
        )}
      </ResultWrapper>
    </Container>
  )
}
