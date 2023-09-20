import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { type PropsWithChildren } from 'react'
import { InfoIcon, WarningTriangleIcon, Text, theme } from 'ui'

type Props = PropsWithChildren<unknown>

const Wrapper = styled.div({
  paddingInline: theme.space.md,
  paddingBlock: theme.space.sm,
  borderRadius: theme.radius.md,
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: theme.colors.borderTranslucent1,
  display: 'flex',
  columnGap: theme.space.xs,
})

const RigidIconStyled = css({
  flexShrink: 0,
  // Optical alignment with text
  marginTop: 1,
})

export const InfoCard = (props: Props) => {
  return (
    <InfoWrapper>
      <RigidInfoIcon color={theme.colors.signalBlueElement} />
      <Text as="p" color="signalBlueText" size="xs">
        {props.children}
      </Text>
    </InfoWrapper>
  )
}

const InfoWrapper = styled(Wrapper)({
  backgroundColor: theme.colors.signalBlueFill,
})
const RigidInfoIcon = styled(InfoIcon)(RigidIconStyled)

export const AttentionCard = (props: Props) => {
  return (
    <AttentionWrapper>
      <RigidWarningTriangleIcon size="1rem" color={theme.colors.signalAmberElement} />
      <Text as="p" color="signalAmberText" size="xs">
        {props.children}
      </Text>
    </AttentionWrapper>
  )
}

const AttentionWrapper = styled(Wrapper)({
  backgroundColor: theme.colors.signalAmberFill,
})

const RigidWarningTriangleIcon = styled(WarningTriangleIcon)(RigidIconStyled)

export const ErrorCard = (props: Props) => {
  return (
    <ErrorWrapper>
      <RigidWarningTriangleIcon size="1rem" color={theme.colors.signalRedElement} />
      <Text as="p" color="signalRedText" size="xs">
        {props.children}
      </Text>
    </ErrorWrapper>
  )
}

const ErrorWrapper = styled(Wrapper)({
  backgroundColor: theme.colors.signalRedFill,
})
