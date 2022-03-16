import { Space, mq } from 'ui'

import Image from 'next/image'
import styled from '@emotion/styled'

type WrapperProps = {
  selected?: boolean
  enableHover?: boolean
  direction?: 'row' | 'column'
}

const Wrapper = styled.div<WrapperProps>(
  {
    display: 'flex',
    width: 'min(48rem, 80%)',
    height: '8.125rem',
    borderRadius: '8px',
    overflow: 'hidden',

    [mq.sm]: {
      height: '22.5rem',
      flexFlow: 'column',
      borderRadius: '16px',
    },
  },
  ({ theme, ...props }) => ({
    border: props.selected
      ? `1px solid ${theme.colors.gray700}`
      : `1px solid ${theme.colors.gray300}`,
    ':hover': (props.enableHover && { border: `1px solid ${theme.colors.gray700}` }) || {},
    [mq.sm]: {
      flexFlow: props.direction || 'column',
    },
  }),
)

const ImageFrame = styled.div({
  position: 'relative',
  flex: '1 0 33%',
  overflow: 'hidden',

  [mq.sm]: {
    flex: '1 1 100%',
    maxHeight: '80%',
  },
})

const Section = styled.div({
  padding: '1em 0.5em',
  flexGrow: 1,
  display: 'flex',
  flexFlow: 'column',
  justifyContent: 'center',

  [mq.sm]: {
    padding: '1.5em',
  },
})

const Title = styled.h1(({ theme }) => ({
  margin: 0,
  fontFamily: theme.fonts.heading,
  fontSize: '1.125rem',
  fontWeight: 400,
  color: theme.colors.gray900,

  [mq.sm]: {
    fontSize: '1.5rem',
  },
}))

const Description = styled.p(({ theme }) => ({
  margin: 0,
  fontFamily: theme.fonts.body,
  fontSize: '0.875rem',
  lineHeight: 1.5,
  color: theme.colors.gray700,

  [mq.sm]: {
    fontSize: '1.125rem',
  },
}))

export type BaseCardProps = {
  cardImg: StaticImageData
  title: string
  description: string
  checked?: boolean
  onCheck?: () => void
} & WrapperProps

const BaseCard = ({
  cardImg,
  title,
  description,
  onCheck,
  checked,
  ...wrapperProps
}: BaseCardProps) => {
  return (
    <Wrapper {...wrapperProps}>
      <ImageFrame>
        <Image
          src={cardImg.src}
          blurDataURL={cardImg.blurDataURL}
          alt={`Main Coverage - ${title}`}
          placeholder="blur"
          layout="fill"
          objectFit="cover"
        />
      </ImageFrame>
      <Section>
        <Space y={0.5}>
          <Title>{title}</Title>
          <Description>{description}</Description>
        </Space>
        {onCheck !== undefined && <input type="checkbox" />}
      </Section>
    </Wrapper>
  )
}

export default BaseCard
