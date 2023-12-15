import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { Text, theme, mq } from 'ui'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { useFormatter } from '@/utils/useFormatter'
import { Stars } from './Stars'
import { VerifiedIcon } from './VerifiedIcon'

type Props = {
  score: number
  date: string
  content: string
  className?: string
}

export const ReviewComment = ({ content, date, score, className }: Props) => {
  const { t } = useTranslation('common')
  const formatter = useFormatter()

  return (
    <Wrapper className={className}>
      <Stars score={String(score)} />
      <Content>
        <Text balance={true}>{content}</Text>
      </Content>
      <Footer>
        <SpaceFlex direction="horizontal" align="center" space={0.25}>
          <VerifiedIcon />

          <Text
            size={{
              _: 'xs',
            }}
          >
            {t('VERIFIED_CUSTOMER_LABEL')}
          </Text>
        </SpaceFlex>

        {formatter.dateFull(new Date(date), { abbreviateMonth: true })}
      </Footer>
    </Wrapper>
  )
}

const Wrapper = styled.div({
  flex: '0 0 auto',

  display: 'inline-flex',
  flexDirection: 'column',
  gap: theme.space.xs,
  padding: theme.space.md,
  borderRadius: theme.radius.md,
  backgroundColor: theme.colors.opaque1,
  width: 'min(40ch, 100%)',
  minHeight: '8.5rem',
  maxHeight: '12.5rem',

  [mq.md]: {
    padding: theme.space.lg,
    gap: theme.space.md,
  },
})

const Content = styled.div({
  flex: '1 0',
})

const Footer = styled.footer({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  color: theme.colors.textTranslucentSecondary,
})
