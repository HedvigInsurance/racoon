import { RemixBrowser } from 'remix'
import { RemixI18NextProvider } from 'remix-i18next'
import { hydrate } from 'react-dom'
import { i18nextInit } from './services/i18next'

i18nextInit().then((i18n) => {
  return hydrate(
    <RemixI18NextProvider i18n={i18n}>
      <RemixBrowser />
    </RemixI18NextProvider>,
    document,
  )
})
