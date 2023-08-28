import styled from '@emotion/styled'
import { storyblokEditable } from '@storyblok/react'
import { useTranslation } from 'react-i18next'
import { Text, theme, mq } from 'ui'
import { TrustpilotLogo } from '@/components/TrustpilotLogo/TrustpilotLogo'
import { SbBaseBlockProps } from '@/services/storyblok/storyblok'
import { LinkField } from '@/services/storyblok/storyblok'
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

  return (
    <Wrapper {...storyblokEditable(blok)}>
      <ScoreText as="span">{t('TRUSTPILOT_SCORE', { score: data.score })}</ScoreText>
      <Link href={blok.link.url} target={isInternalLink ? '_self' : '_blank'} rel="noopener">
        <ReviewText as="span" color="textSecondaryOnGray">
          {t('TRUSTPILOT_REVIEWS_COUNT', {
            numberOfReviews: numberGrouping(data.totalReviews),
          })}
          <TrustpilotLogo width="7em" />
        </ReviewText>
      </Link>
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

const Link = styled.a({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.space.md,
})

const ScoreText = styled(Text)({
  fontSize: '1em',
})

const ReviewText = styled(Text)({
  display: 'inline-flex',
  alignItems: 'end',
  gap: theme.space.xxs,
  fontSize: '0.16em',

  [mq.lg]: {
    gap: theme.space.xs,
    fontSize: '0.12em',
  },
})

TrustpilotBlock.blockName = 'trustpilot'
