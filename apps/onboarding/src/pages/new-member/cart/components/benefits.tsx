import { Heading, Space } from 'ui'

import Image from 'next/image'
import styled from '@emotion/styled'

const Wrapper = styled(Space)({
  width: '100%',
  padding: '0.75rem 1rem',
})

const InfoRow = styled(Space)({
  display: 'flex',
  alignItems: 'center',
})

const InfoLabel = styled.p(({ theme }) => ({
  color: theme.colors.gray900,
  fontSize: '1rem',
  lineHeight: 1.33,
  margin: 0,
}))

const InfoDescription = styled.p(({ theme }) => ({
  fontSize: '0.875rem',
  color: theme.colors.gray700,
  margin: 0,
  lineHeight: 1.25,
}))

export const Benefits = () => {
  return (
    <Wrapper y={1.5}>
      <Heading headingLevel="h3" variant="s" colorVariant="dark">
        Why choose Hedvig?
      </Heading>

      <Space y={1.5}>
        <InfoRow x={1}>
          <Image
            src="https://promise.hedvig.com/media/appliance_damage_2a23c61a09.svg"
            alt=""
            width="32"
            height="32"
          />
          <InfoLabel>
            Smooth claims
            <InfoDescription>
              Make your claim at any time or anywhere in the Hedvig app. Get support within minutes.
            </InfoDescription>
          </InfoLabel>
        </InfoRow>

        <InfoRow x={1}>
          <Image
            src="https://promise.hedvig.com/media/sick_on_holiday_17b3f1899c.svg"
            alt=""
            width="32"
            height="32"
          />
          <InfoLabel>
            Instant help
            <InfoDescription>
              Your personal five-star rated service team is on stand-by and ready to help.
            </InfoDescription>
          </InfoLabel>
        </InfoRow>

        <InfoRow x={1}>
          <Image
            src="https://promise.hedvig.com/media/theft_701fa78317.svg"
            alt=""
            width="32"
            height="32"
          />
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
