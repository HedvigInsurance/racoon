import { datadogLogs } from '@datadog/browser-logs'
import Script from 'next/script'
import { useEffect, useRef, type ComponentPropsWithoutRef } from 'react'
import { theme } from 'ui'
import { useCurrentLocale } from '@/utils/l10n/useCurrentLocale'

const VARIANT_TEMPLATE_ID_MAP: Record<Variant, string> = {
  mini: '53aa8807dec7e10d38f59f32',
  testimonials: '539ad60defb9600b94d7df2c',
}

type Variant = 'mini' | 'testimonials'

type Props = ComponentPropsWithoutRef<'div'> & {
  variant: Variant
  darkMode?: boolean
  className?: string
}

export const TrustpilotWidget = ({ className, variant, darkMode = false, ...others }: Props) => {
  const trustboxRef = useRef<HTMLDivElement | null>(null)
  const { locale } = useCurrentLocale()

  useEffect(() => {
    handleLoad()
  }, [])

  const handleLoad = () => {
    if (trustboxRef.current) {
      window.Trustpilot?.loadFromElement(trustboxRef.current, true)
    } else {
      datadogLogs.logger.warn('[TrustpilotWidget]: could not found reference to trustbox element')
    }
  }

  const handleError = () => {
    datadogLogs.logger.warn('[TrustpilotWidget]: Failed to load Trustpilot script')
  }

  return (
    <>
      <Script
        type="text/javascript"
        src="//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js"
        onLoad={handleLoad}
        onError={handleError}
      />

      <div
        ref={trustboxRef}
        className={className}
        data-locale={locale}
        data-theme={darkMode ? 'dark' : 'light'}
        data-text-color={theme.colors.textPrimary}
        {...others}
        // template-id and businessunit-id should not be overriden
        data-template-id={VARIANT_TEMPLATE_ID_MAP[variant]}
        data-businessunit-id={process.env.NEXT_PUBLIC_TRUSTPILOT_HEDVIG_BUSINESS_UNIT_ID}
      />
    </>
  )
}
