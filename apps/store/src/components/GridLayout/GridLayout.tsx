import isPropValid from '@emotion/is-prop-valid'
import styled, { CSSObject } from '@emotion/styled'
import { mq, theme } from 'ui'

export const TEXT_CONTENT_MAX_WIDTH = '37.5rem' // 600px

const Root = styled.div({
  display: 'grid',
  gridTemplateColumns: 'repeat(12, 1fr)',
  columnGap: theme.space.md,
  paddingInline: theme.space.md,

  maxWidth: 1920,
  marginInline: 'auto',

  [mq.lg]: {
    paddingInline: theme.space.lg,
  },
})

type ContentWidth = '1' | '2/3' | '1/2' | '1/3'
type ContentAlignment = 'left' | 'center' | 'right'

type ContentProps = {
  width: ContentWidth
  align?: ContentAlignment
}

const elementConfig = {
  shouldForwardProp: (prop: string) => isPropValid(prop) && prop !== 'width',
}

const Content = styled(
  'div',
  elementConfig,
)<ContentProps>(({ width, align }) => ({
  gridColumn: '1 / span 12',
  ...STYLES[width][align ?? 'left'],
}))

export const GridLayout = {
  Root,
  Content,
}

const twoThirdsCenterStyles: CSSObject = {
  [mq.lg]: { gridColumn: '4 / span 6' },
}

const halfCenterStyles: CSSObject = {
  [mq.md]: { gridColumn: '2 / span 8' },
  [mq.lg]: { gridColumn: '4 / span 6' },
}

const halfLeftStyles: CSSObject = {
  [mq.lg]: { gridColumn: 'span 6' },
}

const halfRightStyles: CSSObject = {
  [mq.lg]: { gridColumn: '7 / span 6' },
}

const thirdCenterStyles: CSSObject = {
  [mq.md]: { gridColumn: '3 / span 8' },
  [mq.lg]: { gridColumn: '4 / span 6' },
  [mq.xl]: { gridColumn: '5 / span 4' },
}

const thirdLeftStyles: CSSObject = {
  [mq.md]: { gridColumn: 'auto / span 8' },
  [mq.lg]: { gridColumn: 'auto / span 6' },
  [mq.xl]: { gridColumn: 'auto / span 4' },
}

const STYLES: Record<ContentWidth, Record<ContentAlignment, CSSObject>> = {
  '1': { left: {}, center: {}, right: {} },
  '2/3': {
    left: {},
    center: twoThirdsCenterStyles,
    right: {},
  },
  '1/2': {
    left: halfLeftStyles,
    center: halfCenterStyles,
    right: halfRightStyles,
  },
  '1/3': {
    left: thirdLeftStyles,
    center: thirdCenterStyles,
    right: {},
  },
}
