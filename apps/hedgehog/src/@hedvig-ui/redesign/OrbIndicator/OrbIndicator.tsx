import styled from '@emotion/styled'
import { css } from '@emotion/react'
import { colors } from '@hedvig-ui/redesign/palette'

type Props = {
  status: 'success' | 'warning' | 'danger' | 'neutral'
}

const STATUS_COLOR = {
  success: colors.signalGreenElement,
  warning: colors.signalAmberElement,
  danger: colors.signalRedElement,
  neutral: colors.textSecondary,
} as const

export const OrbIndicator = styled.span<Props>(
  ({ status }) => css`
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: ${STATUS_COLOR[status]};
  `,
)
