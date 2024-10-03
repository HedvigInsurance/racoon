import { useTranslation } from 'next-i18next'
import { Button, Text, grid, yStack } from 'ui'
import { ImageWithPlaceholder } from '@/components/ImageWithPlaceholder/ImageWithPlaceholder'
import { getAppStoreLink } from '@/utils/appStoreLinks'
import { useRoutingLocale } from '@/utils/l10n/useRoutingLocale'
import { appDownloadText } from './AppDownload.css'
import qrCodeImage from './download-app-qrcode.png'

export function AppDownload() {
  const locale = useRoutingLocale()

  const { t } = useTranslation('checkout')

  return (
    <div className={yStack({ gap: 'lg', alignItems: 'center' })}>
      <ImageWithPlaceholder
        src={qrCodeImage}
        alt={t('APP_DOWNLOAD_QRCODE_ALT')}
        width={168}
        height={168}
        priority={true}
      />

      <Text className={appDownloadText} align="center" balance>
        {t('APP_DOWNLOAD_QRCODE_TEXT')}
      </Text>

      <div {...grid({ columns: 2, gap: 'xs' })}>
        <Button
          as="a"
          href={getAppStoreLink('apple', locale).toString()}
          target="_blank"
          rel="noopener noreferrer"
          variant="secondary"
          size="medium"
        >
          App Store
        </Button>
        <Button
          as="a"
          href={getAppStoreLink('google', locale).toString()}
          target="_blank"
          rel="noopener noreferrer"
          variant="secondary"
          size="medium"
        >
          Google Play
        </Button>
      </div>
    </div>
  )
}
