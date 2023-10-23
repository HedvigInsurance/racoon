import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { forwardRef } from 'react'
import { theme } from 'ui'
import { zIndexes } from '@/utils/zIndex'

export const ContactUsButton = forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<'button'>
>((props, ref) => {
  const { t } = useTranslation('contact-us')

  return (
    <FixedButton ref={ref} {...props}>
      <Status />
      {t('CONTACT_US_BUTTON_LABEL')}
    </FixedButton>
  )
})
ContactUsButton.displayName = 'ContactUsButton'

const FixedButton = styled.button({
  position: 'fixed',
  right: theme.space.lg,
  bottom: theme.space.lg,
  display: 'inline-flex',
  alignItems: 'baseline',
  gap: theme.space.sm,
  borderRadius: theme.radius.md,
  padding: theme.space.md,
  paddingBlock: theme.space.xs,
  backgroundColor: theme.colors.opaque1,
  fontSize: theme.fontSizes.md,
  zIndex: zIndexes.contactUs,
  cursor: 'pointer',
  filter: 'drop-shadow(0px 1px 1px hsl(0deg 0% 0% / 0.15))',

  '@media (hover: hover)': {
    ':hover': {
      backgroundColor: theme.colors.opaque2,
    },
  },
})

const Status = styled.span({
  flex: '0 0 auto',
  display: 'inline-block',
  width: 14,
  aspectRatio: '1 / 1',
  borderRadius: '50%',
  backgroundColor: theme.colors.green600,
})
