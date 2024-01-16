import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { useState, useRef, useId, useLayoutEffect, type RefObject } from 'react'
import { Text, theme, mq } from 'ui'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { TrustpilotLogo } from '@/components/TrustpilotLogo/TrustpilotLogo'
import { Review } from '@/features/memberReviews/memberReviews.types'
import { useFormatter } from '@/utils/useFormatter'
import { Stars } from './Stars'
import { VerifiedIcon } from './VerifiedIcon'

type Props = Review & {
  className?: string
}

export const ReviewComment = ({ type, score, date, content, className }: Props) => {
  const { t } = useTranslation('common')
  const formatter = useFormatter()
  const id = useId()
  const contentRef = useRef<HTMLDivElement>(null)
  const isTruncated = useIsTruncated(contentRef)

  return (
    <Wrapper className={className}>
      <Stars score={score} />

      <ExpandCheckbox id={id} type="checkbox" />
      <Content ref={contentRef}>
        <StyledText>{content}</StyledText>
      </Content>
      <ReadMore style={{ display: isTruncated ? 'revert' : 'none' }} htmlFor={id} role="button">
        {t('REVIEW_COMMENTS_READ_MORE')}
      </ReadMore>

      <Footer>
        <SpaceFlex direction="horizontal" align="center" space={0.25}>
          {type === 'product' && (
            <>
              <VerifiedIcon />

              <Text as="span" size="xs">
                {t('VERIFIED_CUSTOMER_LABEL')}
              </Text>
            </>
          )}
          {type === 'company' && <TrustpilotLogo width={97} height={24} />}
        </SpaceFlex>

        <Text as="span" size="xs">
          {formatter.dateFull(new Date(date), { abbreviateMonth: true })}
        </Text>
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

  [mq.md]: {
    padding: theme.space.lg,
    gap: theme.space.md,
  },
})

const Content = styled.div({
  flex: '1 0',
  display: '-webkit-box',
  WebkitLineClamp: 4,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
})

const StyledText = styled(Text)({
  whiteSpace: 'normal',
})

const ReadMore = styled.label({
  alignSelf: 'flex-start',
  color: theme.colors.textSecondary,
  textDecoration: 'underline',
  textUnderlineOffset: 2,
  textDecorationColor: 'currentColor',

  '@media (hover: hover)': {
    ':hover': {
      cursor: 'pointer',
      color: theme.colors.textPrimary,
    },
  },
})

const ExpandCheckbox = styled.input({
  // Visibly hide the checkbox
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  width: 1,
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  whiteSpace: 'nowrap',

  [`&:checked + ${Content}`]: {
    WebkitLineClamp: 'unset',
  },

  [`&:checked ~ ${ReadMore}`]: {
    display: 'none',
  },
  [`&:focus-visible ~ ${ReadMore}`]: {
    boxShadow: theme.shadow.focus,
  },
})

const Footer = styled.footer({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  color: theme.colors.textTranslucentSecondary,
})

const useIsTruncated = (ref: RefObject<HTMLDivElement>): boolean => {
  const [isTruncated, setIsTruncated] = useState(false)

  useLayoutEffect(() => {
    const checkTruncation = (element: HTMLDivElement) => {
      const isTruncated = element.offsetHeight < element.scrollHeight
      setIsTruncated(isTruncated)
    }

    if (ref.current) {
      checkTruncation(ref.current)
    }

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const element = entry.target as HTMLDivElement
        checkTruncation(element)
      }
    })
    if (ref.current) {
      resizeObserver.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        resizeObserver.unobserve(ref.current)
      }
    }
  }, [ref])

  return isTruncated
}
