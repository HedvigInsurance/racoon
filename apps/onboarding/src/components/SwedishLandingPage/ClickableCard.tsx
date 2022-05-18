import styled from '@emotion/styled'
import Image from 'next/image'
import { Space, mq, ArrowForwardIcon } from 'ui'
import { BodyText } from '@/components/BodyText'
import {
  BaseCardProps,
  ClickableCardWrapperProps,
  Section,
  ClickableCardWrapper,
} from '../LandingPage/BaseCard'

const ImageFrame = styled.div({
  position: 'relative',
})

const MainWrapper = styled(ClickableCardWrapper)({
  display: 'grid',
  gridTemplateColumns: '1fr 2fr',
  minHeight: '8rem',

  [mq.sm]: {
    borderRadius: '16px',
    gridTemplateColumns: '1fr',
    gridTemplateRows: '1.5fr 1fr',
  },
})

const Row = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
})

export const ClickableCard = ({
  cardImg,
  title,
  description,
  imgAlt,
  href,
}: BaseCardProps & ClickableCardWrapperProps) => {
  return (
    <a href={href}>
      <MainWrapper>
        <ImageFrame>
          <Image src={cardImg} alt={imgAlt} layout="fill" objectFit="cover" priority={true} />
        </ImageFrame>
        <Section>
          <Space y={0.25}>
            <Row>
              <BodyText variant={0} colorVariant="dark" displayBlock>
                {title}
              </BodyText>
              <ArrowForwardIcon />
            </Row>
            <BodyText variant={2} colorVariant="medium" displayBlock>
              {description}
            </BodyText>
          </Space>
        </Section>
      </MainWrapper>
    </a>
  )
}
