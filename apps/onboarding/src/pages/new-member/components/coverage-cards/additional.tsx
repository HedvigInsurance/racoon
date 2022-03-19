import { BaseCardProps, CheckboxContainer, Description, Title, Wrapper } from './base'
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
  [mq.sm]: {
    height: 'unset',
    borderRadius: '16px',
    flexDirection: 'row',
  },
})

const Section = styled.div<{ isCheckable?: boolean }>(
  {
    padding: '0.5em',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    [mq.sm]: {
      padding: '1.5em',
      paddingLeft: '1em',
    },
  },
  ({ theme, ...props }) => ({
    [mq.sm]: {
      paddingRight: (props.isCheckable && '0.5em') || 'initial',
    },
    [mq.md]: { paddingRight: '1.5em' },
  }),
)

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
      <Section isCheckable={isCheckable}>
        <Space y={0.5}>
          <Title>{title}</Title>
          <AdditionalDescription style={{ marginTop: 0 }}>{description}</AdditionalDescription>
        </Space>
        {isCheckable && (
          <CheckboxContainer>
            <Checkbox onChange={onCheck} checked={checked} />
          </CheckboxContainer>
        )}
      </Section>
    </AdditionalWrapper>
  )
}
