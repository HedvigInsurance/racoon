import styled from '@emotion/styled'
import Image from 'next/image'
import { Checkbox, Space, mq } from 'ui'
import { BodyText } from '@/components/BodyText'
import {
  BaseCardProps,
  Section,
  SelectableCardWrapperProps,
  SelectableCardWrapper,
} from './BaseCard'

const ImageFrame = styled.div({
  position: 'relative',
})

const AdditionalWrapper = styled(SelectableCardWrapper)({
  display: 'grid',
  gridTemplateRows: '1.5fr 1fr',

  [mq.sm]: {
    height: '100%',
    borderRadius: '16px',
    gridTemplateColumns: '1fr 2fr',
    gridTemplateRows: '1fr',
  },
})

const AdditionalSection = styled(Section)({
  padding: '0.5rem',

  [mq.sm]: {
    paddingLeft: '1rem',
    alignItems: 'center',
  },
})

const CheckboxContainer = styled.div({
  position: 'absolute',
  top: 0,
  right: 0,
  padding: '0.625rem',

  [mq.sm]: {
    padding: 0,
    position: 'static',
    marginLeft: 'auto',
  },
})

export const AdditionalCoverageCard = ({
  cardImg,
  title,
  description,
  onCheck,
  selected,
  disabled,
  ...wrapperProps
}: BaseCardProps & SelectableCardWrapperProps) => {
  const isCheckable = onCheck !== undefined
  return (
    <AdditionalWrapper
      {...wrapperProps}
      selected={selected}
      isCheckable={isCheckable}
      onClick={onCheck}
      disabled={disabled}
    >
      <ImageFrame>
        <Image
          {...cardImg}
          alt={cardImg.alt ?? ''}
          layout="fill"
          objectFit="cover"
          priority={true}
        />
      </ImageFrame>
      <AdditionalSection isCheckable={isCheckable}>
        <Space y={0.5}>
          <BodyText variant={1} colorVariant="dark" displayBlock fixedSize>
            {title}
          </BodyText>
          <BodyText variant={3} colorVariant="medium" displayBlock>
            {description}
          </BodyText>
        </Space>
        {isCheckable && (
          <CheckboxContainer>
            <Checkbox onChange={onCheck} checked={selected} disabled={disabled} />
          </CheckboxContainer>
        )}
      </AdditionalSection>
    </AdditionalWrapper>
  )
}
