import styled from '@emotion/styled'
import { css, keyframes } from '@emotion/react'
import { colors } from '../palette'

type FillBarProps = {
  parts: { title?: string; value: number }[]
  max: number
  color?: string
}

const getColorFromAmountFilled = (amountFilled: number) => {
  if (amountFilled < 1 / 3) {
    return colors.signalGreenElement
  }
  if (amountFilled < 2 / 3) {
    return colors.signalAmberElement
  }
  return colors.signalRedElement
}

const getBarWidth = (value: number, max: number) => {
  if (max === 0) {
    if (value === 0) {
      return 0
    }
    return 1
  }
  return (value / max) * 100
}

export const FillBar = (props: FillBarProps) => {
  const { parts, max } = props
  const sum = parts.reduce((acc, { value }) => acc + value, 0)
  const filled = max !== 0 ? sum / max : 1
  const color = props.color ?? getColorFromAmountFilled(filled)
  const maxValue = Math.max(sum, max)

  if (!max) {
    return (
      <StyledBar>
        <StyledPart width={100} color={color} />
      </StyledBar>
    )
  }

  return (
    <StyledBar>
      {parts.map(({ title, value }, index) => (
        <StyledPart
          key={index}
          width={getBarWidth(value, maxValue)}
          color={color}
          data-title={title}
        />
      ))}
    </StyledBar>
  )
}

const StyledBar = styled.div(
  () => css`
    width: 100%;
    display: flex;
    gap: 2px;
    height: 8px;
    border-radius: 100vw;
    background-color: ${colors.opaque1};
    position: relative;
  `,
)

const toTop = keyframes`
  0% {
    opacity: 0;
    translate: -50% 0;
  }
  75% {
    opacity: 1;
    translate: -50% -11px ;
  }
  100% {
    translate: -50% -10px ;
  }
`

const StyledPart = styled.div<{ width: number; color: string }>(
  ({ width, color }) => css`
    position: relative;
    width: ${width}%;
    background-color: ${color};

    &:first-of-type {
      border-top-left-radius: 100vw;
      border-bottom-left-radius: 100vw;
    }
    &:last-of-type {
      border-top-right-radius: 100vw;
      border-bottom-right-radius: 100vw;
    }

    &::after,
    &::before {
      position: absolute;
      left: 50%;
      translate: -50% 0;
      bottom: 100%;

      opacity: 0;

      pointer-events: none;
      visibility: hidden;
    }
    &[data-title] {
      &::after,
      &::before {
        visibility: visible;
      }
    }

    &:hover {
      &::after,
      &::before {
        opacity: 1;
        animation: ${toTop} 0.2s cubic-bezier(0.075, 0.82, 0.165, 1) forwards;
      }
    }

    &::after {
      content: attr(data-title);
      z-index: 2;

      width: max-content;
      padding: 8px 12px;
      border-radius: 10px;
      bottom: calc(100% + 5px);

      background-color: ${colors.gray900};
      color: ${colors.textNegative};
    }

    &::before {
      content: '';
      z-index: 1;

      width: 0;
      height: 0;

      border-left: 8px solid transparent;
      border-right: 8px solid transparent;
      border-top: 8px solid ${colors.gray900};
    }
  `,
)
