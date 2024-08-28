import styled from '@emotion/styled'
import { InfoRow, InfoText, ThirdLevelHeadline } from '@hedvig-ui'
import * as React from 'react'
import { TermsAndConditions as TermsAndConditionsType } from 'types/generated/graphql'

const Headline = styled(ThirdLevelHeadline)`
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: space-between;

  & a {
    font-size: 1rem;
  }
`

interface TermsAndConditionsProps {
  termsAndConditions: TermsAndConditionsType
}

export const TermsAndConditions: React.FC<TermsAndConditionsProps> = ({
  termsAndConditions,
}) => {
  return (
    <>
      <Headline>
        <span>Terms and Conditions</span>
        <a
          href={termsAndConditions.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          Link
        </a>
      </Headline>
      <InfoRow>
        Name <InfoText>{termsAndConditions.displayName}</InfoText>
      </InfoRow>
      <InfoRow>
        Commencement Date
        <InfoText>{termsAndConditions.commencementDate}</InfoText>
      </InfoRow>
    </>
  )
}
