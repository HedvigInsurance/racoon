import styled from '@emotion/styled'
import Image from 'next/image'
import { Space, mq } from 'ui'
import { Checkbox } from 'ui'
import { BaseCardProps, CheckboxContainer, Description, Title, WrapperProps } from './base'


const ImageFrame = styled.div({
  position: 'relative',
  flex: '1 0 50%',
  overflow: 'hidden',

  [mq.sm]: {
    flex: '1 1 37%',
  },
})

const Wrapper = styled.div<WrapperProps>(
  {
    display: 'flex',
    width: 'max(13.6rem, 40%)',
    height: '10rem',
    borderRadius: '8px',
    overflow: 'hidden',
    position: 'relative',
    flexDirection: 'column',

    [mq.md]: {
      height: '8.125rem',
      borderRadius: '16px',
      flexDirection: 'row',
    },
  },
  ({ theme, ...props }) => ({
    border: props.selected
      ? `1px solid ${theme.colors.black}`
      : `1px solid ${theme.colors.gray300}`,
    ':hover': (props.enableHover && { border: `1px solid ${theme.colors.gray700}` }) || {},
  }),
)

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
    <Wrapper {...wrapperProps} onClick={onCheck}>
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
    </Wrapper>
  )
}
