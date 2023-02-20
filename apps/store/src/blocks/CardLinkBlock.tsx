import styled from '@emotion/styled'
import { ArrowForwardIcon, theme, mq } from 'ui'
import { SbBaseBlockProps, LinkField } from '@/services/storyblok/storyblok'
import { getLinkFieldURL } from '@/services/storyblok/Storyblok.helpers'
import { Grid } from './CardLinkListBlock'

type CardVariant = 'primary' | 'secondary'

export type CardLinkBlockProps = SbBaseBlockProps<{
  heading: string
  description: string
  link: LinkField
  variant?: CardVariant
}>

export const CardLinkBlock = ({ blok }: CardLinkBlockProps) => {
  return (
    <Card href={getLinkFieldURL(blok.link)} data-variant={blok.variant ?? 'secondary'}>
      <HeadingWrapper>
        <Heading>{blok.heading}</Heading>
        <StyledArrowIcon aria-hidden="true" />
      </HeadingWrapper>
      <Description>{blok.description}</Description>
    </Card>
  )
}
CardLinkBlock.blockName = 'cardLink'

const Card = styled.a({
  display: 'inline-flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  aspectRatio: '2.5 / 1',
  height: '9rem', // 144px
  padding: theme.space.md,
  borderRadius: theme.radius.sm,

  '&[data-variant="primary"]': {
    backgroundColor: theme.colors.blueFill1,

    '@media (hover: hover)': {
      ':hover': {
        backgroundColor: theme.colors.blue200,
      },
    },
  },
  '&[data-variant="secondary"]': {
    backgroundColor: theme.colors.opaque1,

    '@media (hover: hover)': {
      ':hover': {
        backgroundColor: theme.colors.gray200,
      },
    },
  },

  [mq.lg]: {
    aspectRatio: '1.75 / 1',
    height: '16rem', // 256px
    padding: theme.space.lg,
  },

  [`${Grid} &`]: {
    height: '100%',
    width: '100%',
  },
})

const HeadingWrapper = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.space.sm,
})

const Heading = styled.span({
  fontSize: theme.fontSizes.xl,

  [mq.lg]: {
    fontSize: theme.fontSizes.xxl,
  },
})

const StyledArrowIcon = styled(ArrowForwardIcon)({
  width: '1.5rem',
  height: '1.5rem',

  [mq.lg]: {
    width: '2rem',
    height: '2rem',
  },
})

const Description = styled.p({
  fontSize: theme.fontSizes.xs,

  [mq.lg]: {
    fontSize: theme.fontSizes.md,
  },
})
