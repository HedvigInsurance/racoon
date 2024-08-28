import { colors } from '@hedvig-ui/redesign'
import styled from '@emotion/styled'
import { css } from '@emotion/react'

type Props = {
  status?: 'success' | 'warning' | 'danger' | 'info' | 'neutral'
}

const STATUS_COLOR = {
  success: colors.signalGreenElement,
  warning: colors.signalAmberElement,
  danger: colors.signalRedElement,
  info: colors.signalBlueElement,
  neutral: colors.gray400,
} as const satisfies Record<NonNullable<Props['status']>, string>

export const TableRowStatus = styled.span<Props>(
  ({ status }) => css`
    position: absolute;
    left: 0;
    top: 0;
    width: 8px;
    height: 100%;

    ${status &&
    css`
      background-color: ${STATUS_COLOR[status]};
    `}
  `,
)
