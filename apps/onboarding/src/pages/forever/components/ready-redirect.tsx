import { ExternalLinkButton } from '@/components/button'
import { CampaignCode } from '@/lib/campaign-code'
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
    <div className="flex flex-col items-center justify-center h-screen space-y-2">
      <p className="text-center text-gray-700">{t('FOREVER_INTRO_READY_QUESTION')}</p>
      <ExternalLinkButton href={PageLink.landing()} onClick={handleClickLink}>
        {t('FOREVER_INTRO_READY_CTA')}
      </ExternalLinkButton>
    </div>
  )
}
