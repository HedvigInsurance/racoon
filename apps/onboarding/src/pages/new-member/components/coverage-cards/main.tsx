import { BaseCardProps, Section, Wrapper } from './base'
import { Space, mq } from 'ui'

import { BodyText } from '@/components/body-text'
import { Checkbox } from 'ui'
import Image from 'next/image'
import styled from '@emotion/styled'

const ImageFrame = styled.div({
  position: 'relative',
  flex: '1 0 33%',
  overflow: 'hidden',

  [mq.sm]: {
    flex: '1 1 100%',
    maxHeight: '80%',
  },
})

const MainWrapper = styled(Wrapper)({
  height: '8.125rem',
  [mq.sm]: {
    height: '22.5rem',
    borderRadius: '16px',
    flexDirection: 'column',
  },
})

const CheckboxContainer = styled.div({
  marginLeft: 'auto',
})

export const MainCoverageCard = ({
  cardImg,
  title,
  description,
  onCheck,
  checked,
  imgAlt,
  ...wrapperProps
}: BaseCardProps) => {
  const isCheckable = onCheck !== undefined
  return (
    <MainWrapper {...wrapperProps} isCheckable={isCheckable} onClick={onCheck}>
      <ImageFrame>
        <Image
          src={cardImg.src}
          blurDataURL={cardImg.blurDataURL}
          alt={imgAlt}
          placeholder="blur"
          layout="fill"
          objectFit="cover"
        />
      </ImageFrame>
      <Section isCheckable={isCheckable}>
        <Space y={0.5}>
          <BodyText variant={0} colorVariant="dark" displayBlock>
            {title}
          </BodyText>
          <BodyText variant={2} colorVariant="medium" displayBlock>
            {description}
          </BodyText>
        </Space>
        {isCheckable && (
          <CheckboxContainer>
            <Checkbox onChange={onCheck} checked={checked} />
          </CheckboxContainer>
        )}
      </Section>
    </MainWrapper>
  )
}
