import styled from '@emotion/styled'
import Image from 'next/image'
import { Space, mq, ArrowForwardIcon, HeadingOLD } from 'ui'
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
  height: '100%',

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

  [mq.sm]: {
    paddingRight: '1.5rem',
  },

  [mq.md]: {
    paddingRight: 0,
  },
})

const BodyTextWrapper = styled.div({
  paddingRight: '1.5rem',

  [mq.sm]: {
    paddingRight: '2.5rem',
  },

  [mq.md]: {
    paddingRight: '2rem',
  },
})

export const ClickableCard = ({
  cardImg,
  title,
  description,
  onClick,
  href,
}: BaseCardProps & ClickableCardWrapperProps) => {
  return (
    <a href={href}>
      <MainWrapper as="div" onClick={onClick}>
        <ImageFrame>
          <Image
            {...cardImg}
            alt={cardImg.alt ?? ''}
            layout="fill"
            objectFit="cover"
            priority={true}
          />
        </ImageFrame>
        <Section>
          <Space y={0.25}>
            <Row>
              <HeadingOLD variant="xs" headingLevel="h2" colorVariant="dark">
                {title}
              </HeadingOLD>
              <ArrowForwardIcon size="1.25rem" />
            </Row>
            <BodyTextWrapper>
              <BodyText variant={2} colorVariant="medium" displayBlock>
                {description}
              </BodyText>
            </BodyTextWrapper>
          </Space>
        </Section>
      </MainWrapper>
    </a>
  )
}
