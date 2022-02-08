import { ExternalLinkButton } from '@/components/button'
import type { NextPage } from 'next'
import { PageLayout } from '../components/page-layout'
import { PageLink } from '@/lib/page-link'
import { useTranslation } from 'next-i18next'

const ForeverPageReady: NextPage = () => {
  const { t } = useTranslation()

  return (
    <PageLayout>
      <div className="space-y-4 animate-fadeInUp">
        <p className="text-center text-gray-700">{t('FOREVER_INTRO_READY_QUESTION')}</p>
        <ExternalLinkButton href={PageLink.landing()}>
          {t('FOREVER_INTRO_READY_CTA')}
        </ExternalLinkButton>
      </div>
    </PageLayout>
  )
}

export { getStaticProps } from '../index.page'

export default ForeverPageReady
