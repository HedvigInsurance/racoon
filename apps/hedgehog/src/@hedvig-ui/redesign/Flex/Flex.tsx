'use client'

import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { Div, SPACING, SpacingSize } from '@hedvig-ui/redesign'

type FlexProps = {
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse'
  justify?: string
  align?: string
  fullWidth?: boolean
  flex?: string
  gap?: SpacingSize
  wrap?: 'wrap' | 'nowrap' | 'revert' | 'wrap-reverse'
}

export const Flex = styled(Div)<FlexProps>(
  ({ direction, justify, align, fullWidth, gap, wrap }) => css`
    display: flex;
    flex-direction: ${direction ?? 'initial'};
    justify-content: ${justify ?? 'initial'};
    align-items: ${align ?? 'initial'};
    width: ${fullWidth ? '100%' : 'initial'};
    gap: ${gap ? SPACING[gap] : 'initial'};
    flex-wrap: ${wrap ?? 'initial'};
  `,
)
