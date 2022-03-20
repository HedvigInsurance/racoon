import { BaseCardProps, CheckboxContainer, Description, Section, Title, Wrapper } from './base'
import { Space, mq } from 'ui'

import { Checkbox } from 'ui'
import Image from 'next/image'
import styled from '@emotion/styled'

const ImageFrame = styled.div({
  position: 'relative',
  flex: '1 1 50%',
  overflow: 'hidden',

  [mq.sm]: {
    flex: '1 0 30%',
  },
})

const AdditionalWrapper = styled(Wrapper)({
  height: '10rem',
  flexDirection: 'column',
  [mq.sm]: {
    height: 'unset',
    borderRadius: '16px',
    flexDirection: 'row',
  },
})

const AdditionalSection = styled(Section)({
  padding: '0.5em',
  [mq.sm]: {
    paddingLeft: '1em',
  },
})

const AdditionalDescription = styled(Description)({
  fontSize: '0.75rem',
  [mq.sm]: {
    fontSize: '0.875rem',
  },
})

export const AdditionalCoverageCard = ({
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
    <AdditionalWrapper {...wrapperProps} isCheckable={isCheckable} onClick={onCheck}>
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
      <AdditionalSection isCheckable={isCheckable}>
        <Space y={0.5}>
          <Title>{title}</Title>
          <AdditionalDescription style={{ marginTop: 0 }}>{description}</AdditionalDescription>
        </Space>
        {isCheckable && (
          <CheckboxContainer>
            <Checkbox onChange={onCheck} checked={checked} />
          </CheckboxContainer>
        )}
      </AdditionalSection>
    </AdditionalWrapper>
  )
}
