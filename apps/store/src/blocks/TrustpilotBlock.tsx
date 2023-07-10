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

  return (
    <Wrapper {...storyblokEditable(blok)}>
      <Link href={blok.link.url} target="_blank" rel="noopener">
        <ScoreText as="span">
          {t('TRUSTPILOT_SCORE', { score: data.score })}
        </ScoreText>
        <ReviewText as="span" color="textGreen" size={{_: 'md', md: 'xl'}}>
          {t('TRUSTPILOT_REVIEWS_COUNT', {
            numberOfReviews: numberGrouping(data.totalReviews),
          })}
          <TrustpilotLogo width="5.5em" />
        </ReviewText>
      </Link>
    </Wrapper>
  )
}

const Wrapper = styled.div({
  display: 'grid',
  placeItems: 'center',
  backgroundColor: theme.colors.signalGreenFill,
  paddingBlock: theme.space[10],
  paddingInline: theme.space.md,
})

const Link = styled.a({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.space.md,
})

const ScoreText = styled(Text)({
  lineHeight: '1.32',
  fontSize: theme.fontSizes[11],
  [mq.md]: {
    // Font size this high is an edge case. That's why I'm not using Text's 'size' prop
    fontSize: '12.5rem',
  },
})

const ReviewText = styled(Text)({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.space.xxs,

  [mq.lg]: {
    gap: theme.space.xs,
  },
})

TrustpilotBlock.blockName = 'trustpilot'
