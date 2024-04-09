'use client'

import Link from 'next/link'
import type { CSSProperties } from 'react'
import { contentFontClassName } from '@/utils/fonts'
import { FALLBACK_LOCALE } from '@/utils/l10n/locales'
import { getLocaleOrFallback } from '@/utils/l10n/localeUtils'
import { PageLink } from '@/utils/PageLink'

// GOTCHA: vanilla-extract does not insert CSS into global error page for some reason
const wrapperStyle: CSSProperties = {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '1rem',
}

const headerStyle = {
  fontSize: '1.75rem',
}

// No i18n since rendering needs to be sync and it takes no props
// - No components that depend on emotion styles
// - Hardcoded strings
export default function GlobalErrorPage() {
  const locale = getLocaleOrFallback(FALLBACK_LOCALE).routingLocale
  return (
    <html>
      <body className={contentFontClassName}>
        <div style={wrapperStyle}>
          <h1 style={headerStyle}>Något gick fel</h1>
          <Link href={PageLink.home({ locale })}>Gå till startsidan</Link>
        </div>
      </body>
    </html>
  )
}
