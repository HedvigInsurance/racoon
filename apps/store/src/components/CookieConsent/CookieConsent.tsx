'use client'

import { getCookie } from 'cookies-next'
import { useAtom } from 'jotai'
import Link from 'next/link'
import Script from 'next/script'
import { useTranslation } from 'next-i18next'
import React, { useEffect, useState } from 'react'
import { Button, Space, Text } from 'ui'
import { GTMAppScript } from '@/services/gtm'
import { useRoutingLocale } from '@/utils/l10n/useRoutingLocale'
import { PageLink } from '@/utils/PageLink'
import type { OneTrustApi } from '../GTMLoader'
import { useSaveConsent } from '../GTMLoader'
import { readMoreLink, buttonGroup, cookieBanner } from './CookieConsent.css'
import { loadOneTrustAtom } from './OneTrustAtom'

const COOKIE_CONSENT_SCRIPT_ID = {
  TEST: '628f5fee-1891-418c-9ed2-f893b8a3998a-test',
  PRODUCTION: '628f5fee-1891-418c-9ed2-f893b8a3998a',
}

// Only use prod script in production
const scriptId =
  process.env.VERCEL_ENV === 'production'
    ? COOKIE_CONSENT_SCRIPT_ID.PRODUCTION
    : COOKIE_CONSENT_SCRIPT_ID.TEST

type CookieConsent = {
  showBanner: boolean
  initializeGtm: boolean
  action: 'allowAll' | 'openSettings' | null
}

export function CookieConsent() {
  const saveConsent = useSaveConsent()
  const cookieValue = getCookie('OptanonAlertBoxClosed')
  const [loadOneTrust, setLoadOneTrust] = useAtom(loadOneTrustAtom)
  const { t } = useTranslation(['cookieConsent', 'common'])
  const locale = useRoutingLocale()

  // Make sure we don't show the cookie banner or load GTM before we have read the OneTrust cookie
  const [cookieConsent, setCookieConsent] = useState<CookieConsent>({
    showBanner: false,
    initializeGtm: false,
    action: null,
  })

  useEffect(() => {
    const isAlertBoxClosed = cookieValue !== undefined
    setCookieConsent((prevState) => ({
      ...prevState,
      initializeGtm: isAlertBoxClosed,
      showBanner: !isAlertBoxClosed,
    }))
  }, [cookieValue])

  const handleOneTrustLoaded = () => {
    ;(window as any).OptanonWrapper = function () {
      const OneTrust = (window as any).OneTrust as OneTrustApi

      // Hide OneTrust cookie banner since we render our own banner
      const banner = document.getElementById('onetrust-banner-sdk')
      if (banner) {
        banner.style.display = 'none'
      }

      if (cookieConsent.action === 'allowAll' && !OneTrust.IsAlertBoxClosed()) {
        OneTrust.AllowAll()
        saveConsent()
        setCookieConsent((prevState) => ({
          ...prevState,
          initializeGtm: true,
        }))

        // Omit loading OneTrust script after updated consent
        setLoadOneTrust(false)
      }

      if (cookieConsent.action === 'openSettings') {
        OneTrust.ToggleInfoDisplay()
        // Remove overflow hidden when settings dialog is closed
        OneTrust.OnConsentChanged(() => {
          const html = document.querySelector('html')
          const body = document.querySelector('body')
          if (html && body) {
            html.style.overflow = 'unset'
            body.style.overflow = 'unset'
          }

          setCookieConsent((prevState) => ({
            ...prevState,
            initializeGtm: true,
          }))

          // Omit loading OneTrust script after updated consent
          setLoadOneTrust(false)
        })
      }
    }
  }

  const handleAccept = () => {
    setLoadOneTrust(true)
    setCookieConsent((prevState) => ({
      ...prevState,
      action: 'allowAll',
      showBanner: false,
    }))
  }

  const handleCookieSettings = () => {
    setLoadOneTrust(true)
    setCookieConsent((prevState) => ({
      ...prevState,
      action: 'openSettings',
      showBanner: false,
    }))
  }

  return (
    <>
      {loadOneTrust && (
        <Script
          id="onetrust-loader"
          src="https://cdn.cookielaw.org/scripttemplates/otSDKStub.js"
          data-document-language="true"
          type="text/javascript"
          data-domain-script={scriptId}
          onLoad={handleOneTrustLoaded}
        />
      )}

      {cookieConsent.initializeGtm && <GTMAppScript />}

      {cookieConsent.showBanner && (
        <div className={cookieBanner}>
          <Space y={{ base: 1.5, md: 2 }}>
            <Space y={0.25}>
              <Text color="textNegative">{t('cookieConsent:COOKIE_CONSENT_HEADING')}</Text>
              <Text as="div" color="textTertiary" size={{ _: 'xs', sm: 'md' }}>
                {t('cookieConsent:COOKIE_CONSENT_BODY')}
                <Link
                  href={PageLink.cookiesInfo({ locale }).pathname}
                  className={readMoreLink}
                  rel="noopener"
                  target="_blank"
                >
                  {t('common:READ_MORE')}
                </Link>
              </Text>
            </Space>
            <div className={buttonGroup}>
              <Button variant="ghost-alt" size="medium" onClick={handleCookieSettings}>
                {t('cookieConsent:COOKIE_CONSENT_SETTINGS_BUTTON')}
              </Button>
              <Button variant="secondary-alt" size="medium" onClick={handleAccept}>
                {t('cookieConsent:COOKIE_CONSENT_ALLOW_ALL_BUTTON')}
              </Button>
            </div>
          </Space>
        </div>
      )}
    </>
  )
}
