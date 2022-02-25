import { Heading, Space } from 'ui'

import Image from 'next/image'
import styled from '@emotion/styled'

const Wrapper = styled(Space)({
  width: '100%',
  padding: '1.25rem 1rem',
})

const InfoRow = styled(Space)({
  display: 'flex',
  alignItems: 'flex-start',
})

const InfoLabel = styled.p(({ theme }) => ({
  color: theme.colors.gray900,
  fontSize: '1rem',
  lineHeight: 1.4,
  margin: 0,
}))

const InfoDescription = styled.p(({ theme }) => ({
  fontSize: '0.875rem',
  color: theme.colors.gray700,
  margin: 0,
  lineHeight: 1.4,
}))

const IconWrapper = styled.div({
  flexShrink: 0,
  paddingTop: '2px',
})

export const Benefits = () => {
  return (
    <Wrapper y={1}>
      <Heading headingLevel="h3" variant="xs" colorVariant="dark">
        Why choose Hedvig?
      </Heading>

      <Space y={1}>
        <InfoRow x={1}>
          <IconWrapper>
            <Image
              src="https://promise.hedvig.com/media/appliance_damage_2a23c61a09.svg"
              alt=""
              width="32"
              height="32"
              layout="fixed"
            />
          </IconWrapper>
          <InfoLabel>
            Smooth claims
            <InfoDescription>
              Make your claim at any time or anywhere in the Hedvig app. Get support within minutes.
            </InfoDescription>
          </InfoLabel>
        </InfoRow>

        <InfoRow x={1}>
          <IconWrapper>
            <Image
              src="https://promise.hedvig.com/media/sick_on_holiday_17b3f1899c.svg"
              alt=""
              width="32"
              height="32"
              layout="fixed"
            />
          </IconWrapper>
          <InfoLabel>
            Instant help
            <InfoDescription>
              Your personal five-star rated service team is on stand-by and ready to help.
            </InfoDescription>
          </InfoLabel>
        </InfoRow>

        <InfoRow x={1}>
          <IconWrapper>
            <Image
              src="https://promise.hedvig.com/media/theft_701fa78317.svg"
              alt=""
              width="32"
              height="32"
              layout="fixed"
            />
          </IconWrapper>
          <InfoLabel>
            Cancel anytime
            <InfoDescription>
              No strings attached. Cancel at any time and come back to open arms later.
            </InfoDescription>
          </InfoLabel>
        </InfoRow>
      </Space>
    </Wrapper>
  )
}
