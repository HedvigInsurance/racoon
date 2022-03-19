import { BaseCardProps, Description, Title, WrapperProps } from './base'
import { Space, mq } from 'ui'

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

const Section = styled.div<{ isCheckable?: boolean }>(
  {
    padding: '1em 0.5em',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    [mq.sm]: {
      padding: '1.5em',
    },
  },
  ({ theme, ...props }) => ({
    [mq.sm]: {
      paddingRight: (props.isCheckable && '0.5em') || 'initial',
    },
    [mq.md]: { paddingRight: '1.5em' },
  }),
)

const MainWrapper = styled.div<WrapperProps>(
  {
    display: 'flex',
    height: '8.125rem',
    borderRadius: '8px',
    overflow: 'hidden',
    position: 'relative',
    transition: 'all 150ms',
    [mq.sm]: {
      height: '22.5rem',
      borderRadius: '16px',
      flexDirection: 'column',
    },
  },
  ({ theme, ...props }) => ({
    cursor: props.isCheckable ? 'pointer' : 'initial',
    border: props.selected
      ? `1px solid ${theme.colors.black}`
      : `1px solid ${theme.colors.gray300}`,
    ':hover': (props.enableHover && { border: `1px solid ${theme.colors.gray700}` }) || {},
    ...props.wrapperStyles,
  }),
)

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
          <Title>{title}</Title>
          <Description>{description}</Description>
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
