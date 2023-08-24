import { datadogLogs } from '@datadog/browser-logs'
import Script from 'next/script'
import { useRef } from 'react'
import { theme } from 'ui'
import { useCurrentLocale } from '@/utils/l10n/useCurrentLocale'

const TRUSTPILOT_TEMPLATE_ID = '539ad60defb9600b94d7df2c'

export const TrustpilotReviewsBlock = () => {
  const trustboxRef = useRef<HTMLDivElement | null>(null)
  const { locale, language } = useCurrentLocale()

  const handleLoad = () => {
    if (trustboxRef.current) {
      window.Trustpilot?.loadFromElement(trustboxRef.current, true)
    } else {
      datadogLogs.logger.warn('[TrustpilotReviews]: could not found reference to trustbox element')
    }
  }

  const handleError = () => {
    datadogLogs.logger.warn('[TrustpilotReviews]: Failed to load Trustpilot script')
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
        style={{ paddingInline: theme.space.md }}
        data-locale={locale}
        data-template-id={TRUSTPILOT_TEMPLATE_ID}
        data-businessunit-id={process.env.NEXT_PUBLIC_TRUSTPILOT_HEDVIG_BUSINESS_UNIT_ID}
        data-style-width="100%"
        data-style-height="750px"
        data-theme="light"
        data-stars="1,2,3,4,5"
        data-review-languages={language}
        data-text-color={theme.colors.textPrimary}
      />
    </>
  )
}

TrustpilotReviewsBlock.blockName = 'trustpilotReviews'
