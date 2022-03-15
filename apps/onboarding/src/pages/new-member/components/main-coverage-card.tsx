import { Space, mq } from 'ui'

import Image from 'next/image'
import styled from '@emotion/styled'

const Wrapper = styled.div`
  display: flex;
  width: min(48rem, 80%);
  height: 8.125rem;
  border: 1px solid ${({ theme }) => theme.colors.gray700};
  border-radius: 8px;
  overflow: hidden;

  ${mq.sm} {
    height: 22.5rem;
    flex-flow: column;
    border-radius: 16px;
  }
`

const ImageFrame = styled.div`
  position: relative;
  flex: 1 0 33%;
  overflow: hidden;

  ${mq.sm} {
    flex: 1 1 100%;
    max-height: 80%;
  }
`

const Section = styled.div`
  padding: 1em 0.5em;
  flex-grow: 1;
  display: flex;
  flex-flow: column;
  justify-content: center;

  ${mq.sm} {
    padding: 1.5em;
  }
`

const Title = styled.h1`
  margin: 0;
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 1.125rem;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.gray900};

  ${mq.sm} {
    font-size: 1.5rem;
  }
`

const Description = styled.p`
  margin: 0;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 0.875rem;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.gray700};

  ${mq.sm} {
    font-size: 1.125rem;
  }
`

export type MainCoverageCardProps = {
  imgSrc: string | StaticImageData
  title: string
  description: string
}

export const MainCoverageCard = ({ imgSrc, title, description }: MainCoverageCardProps) => {
  return (
    <Wrapper>
      <ImageFrame>
        <Image
          src={imgSrc}
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
      </Section>
    </Wrapper>
  )
}
