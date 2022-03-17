import { Space, mq } from 'ui'

import Image from 'next/image'
import styled from '@emotion/styled'

const Wrapper = styled.div(({ theme }) => ({
  display: 'flex',
  width: 'min(48rem, 80%)',
  height: '8.125rem',
  border: `1px solid ${theme.colors.gray700}`,
  borderRadius: '8px',
  overflow: 'hidden',

  [mq.sm]: {
    height: '22.5rem',
    flexDirection: 'column',
    borderRadius: '16px',
  },
}))

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
  flexDirection: 'column',
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

export type MainCoverageCardProps = {
  title: string
  description: string
  imgSrc: string | StaticImageData
  imgAlt?: string
}

export const MainCoverageCard = ({ imgSrc, imgAlt, title, description }: MainCoverageCardProps) => {
  return (
    <Wrapper>
      <ImageFrame>
        <Image src={imgSrc} alt={imgAlt} placeholder="blur" layout="fill" objectFit="cover" />
      </ImageFrame>
      <Section>
        <Space y={0.5}>
          <Title>{title}</Title>
          <Description>{description}</Description>
        </Space>
      </Section>
    </Wrapper>
  )
}
