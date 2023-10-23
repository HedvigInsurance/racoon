import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { forwardRef } from 'react'
import { Button, theme } from 'ui'
import { zIndexes } from '@/utils/zIndex'

export const ContactUsButton = forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<'button'>
>((props, ref) => {
  const { t } = useTranslation('contact-us')

  return (
    <FixedButton ref={ref} Icon={<Status />} variant="secondary" size="medium" {...props}>
      {t('CONTACT_US_BUTTON_LABEL')}
    </FixedButton>
  )
})
ContactUsButton.displayName = 'ContactUsButton'

const FixedButton = styled(Button)({
  position: 'fixed',
  right: theme.space.lg,
  bottom: theme.space.lg,
  width: 'auto',
  zIndex: zIndexes.contactUs,
})

const Status = styled.span({
  flex: '0 0 auto',
  display: 'inline-block',
  width: 14,
  aspectRatio: '1 / 1',
  borderRadius: '50%',
  backgroundColor: theme.colors.signalBlueElement,
})
