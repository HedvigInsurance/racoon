import styled from '@emotion/styled'
import Image from 'next/legacy/image'
import { Space, mq } from 'ui'
import { BodyText } from '@/components/BodyText'
import {
  BaseCardProps,
  Section,
  SelectableCardWrapperProps,
  SelectableCardWrapper,
} from './BaseCard'
import { Checkbox } from './Checkbox'

const ImageFrame = styled.div({
  position: 'relative',
})

const MainWrapper = styled(SelectableCardWrapper)({
  display: 'grid',
  gridTemplateColumns: '1fr 2fr',
  minHeight: '8rem',

  [mq.sm]: {
    borderRadius: '16px',
    gridTemplateColumns: '1fr',
    gridTemplateRows: '1.5fr 1fr',
  },
})

const CheckboxContainer = styled.div({
  padding: 0,
  position: 'static',
  margin: '0.4rem',

  [mq.sm]: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 30,
    padding: '0.625rem',
  },
})

export const MainCoverageCard = ({
  cardImg,
  title,
  description,
  onCheck,
  selected,
  required,
  errorMessage,
  ...wrapperProps
}: BaseCardProps & SelectableCardWrapperProps) => {
  const isCheckable = onCheck !== undefined

  return (
    <MainWrapper {...wrapperProps} selected={selected} isCheckable={isCheckable} onClick={onCheck}>
      <ImageFrame>
        <Image
          {...cardImg}
          alt={cardImg.alt ?? ''}
          layout="fill"
          objectFit="cover"
          placeholder="blur"
          priority={true}
        />
      </ImageFrame>
      <Section isCheckable={isCheckable}>
        <Space y={0.25}>
          <BodyText variant={0} colorVariant="dark" displayBlock>
            {title}
          </BodyText>
          <BodyText variant={2} colorVariant="medium" displayBlock>
            {description}
          </BodyText>
        </Space>
        {isCheckable && (
          <CheckboxContainer>
            <Checkbox
              tabIndex={-1}
              onChange={onCheck}
              checked={selected}
              required={required}
              errorMessage={errorMessage}
            />
          </CheckboxContainer>
        )}
      </Section>
    </MainWrapper>
  )
}
