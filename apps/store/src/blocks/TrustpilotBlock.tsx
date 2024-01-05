import styled from '@emotion/styled'
import { storyblokEditable } from '@storyblok/react'
import { useTranslation } from 'next-i18next'
import { Text, InfoIcon, theme, mq } from 'ui'
import { Tooltip } from '@/components/Tooltip/Tooltip'
import { TrustpilotLogo } from '@/components/TrustpilotLogo/TrustpilotLogo'
import { SbBaseBlockProps } from '@/services/storyblok/storyblok'
import { LinkField } from '@/services/storyblok/storyblok'
import { getLinkFieldURL } from '@/services/storyblok/Storyblok.helpers'
import { useTrustpilotData } from '@/services/trustpilot/trustpilot'
import { useFormatter } from '@/utils/useFormatter'

type Props = SbBaseBlockProps<{
  link: LinkField
}>

export const TrustpilotBlock = ({ blok }: Props) => {
  const { t } = useTranslation('common')
  const { numberGrouping } = useFormatter()
  const data = useTrustpilotData()

  if (!data) {
    console.warn('[TrustpilotBlock]: No Trustpilot data found. Skip rendering.')
    return null
  }

  const isInternalLink = blok.link.linktype === 'story'

  // If no rel is provided, we default to noopener for external links
  const rel = blok.link.rel ?? isInternalLink ? undefined : 'noopener'

  return (
    <Wrapper {...storyblokEditable(blok)}>
      <StyledTrustpilotLogo />

      <ScoreText as="span">{t('TRUSTPILOT_SCORE', { score: data.score })}</ScoreText>

      <ReviewText as="span" size="md" color="textSecondaryOnGray">
        <a href={getLinkFieldURL(blok.link)} target={isInternalLink ? '_self' : '_blank'} rel={rel}>
          {t('TRUSTPILOT_REVIEWS_COUNT', {
            numberOfReviews: numberGrouping(data.totalReviews),
          })}
        </a>

        <Tooltip message={t('TRUSTPILOT_REVIEWS_DISCLAIMER')}>
          <button>
            <InfoIcon size="1em" color={theme.colors.textSecondary} />
          </button>
        </Tooltip>
      </ReviewText>
    </Wrapper>
  )
}

const Wrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  aspectRatio: '4 / 5',
  maxWidth: '100%',
  background: `linear-gradient(
    to bottom,
    transparent 0%,
    hsl(84, 96%, 90%) 30%,
    hsl(84, 98%, 90%) 50%,
    hsl(85, 100%, 90%) 70%,
    transparent 100%
  )`,
  paddingBlock: theme.space[10],
  paddingInline: theme.space.md,
  fontSize: 'clamp(5.5rem, 20vw + 1.2rem, 13rem)',

  [mq.lg]: {
    aspectRatio: '16 / 9',
  },
})

const StyledTrustpilotLogo = styled(TrustpilotLogo)({
  width: '1em',

  [mq.sm]: {
    width: '0.85em',
  },
})

const ScoreText = styled(Text)({
  fontSize: '1em',
  lineHeight: 1,
})

const ReviewText = styled(Text)({
  display: 'flex',
  alignItems: 'center',
  gap: theme.space.xs,
  marginTop: theme.space.lg,
})

TrustpilotBlock.blockName = 'trustpilot'
