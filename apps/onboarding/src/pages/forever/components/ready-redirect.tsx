import { CampaignCode } from '@/lib/campaign-code'
import { ExternalLinkButton } from '@/components/button'
import { PageLayout } from './page-layout'
import { PageLink } from '@/lib/page-link'
import { useTranslation } from 'next-i18next'

type ReadyRedirectProps = {
  code: string
}

export const ReadyRedirect = ({ code }: ReadyRedirectProps) => {
  const { t } = useTranslation()

  const handleClickLink = () => {
    CampaignCode.save(code)
    return true
  }

  return (
    <PageLayout>
      <div className="space-y-4 animate-fadeInUp">
        <p className="text-center text-gray-700">{t('FOREVER_INTRO_READY_QUESTION')}</p>
        <ExternalLinkButton href={PageLink.landing()} onClick={handleClickLink}>
          {t('FOREVER_INTRO_READY_CTA')}
        </ExternalLinkButton>
      </div>
    </PageLayout>
  )
}
