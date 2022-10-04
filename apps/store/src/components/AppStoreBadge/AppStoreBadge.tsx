import Image, { StaticImageData } from 'next/image'
import { IsoLocale, Locale } from '@/lib/l10n/types'
import { AppleDaDk } from './AppleDaDk'
import { AppleEn } from './AppleEn'
import { AppleNbNo } from './AppleNbNo'
import { AppleSvSe } from './AppleSvSe'
import GoogleDaDk from './images/google-da-dk.png'
import GoogleEn from './images/google-en.png'
import GoogleNbNo from './images/google-nb-no.png'
import GoogleSvSe from './images/google-sv-se.png'

export type AppStoreBadgeProps = {
  type: 'apple' | 'google'
  locale: IsoLocale
}

const APPLE_BADGE: Record<IsoLocale, () => JSX.Element> = {
  [Locale.SvSe]: AppleSvSe,
  [Locale.EnSe]: AppleEn,
  [Locale.DaDk]: AppleDaDk,
  [Locale.EnDk]: AppleEn,
  [Locale.NbNo]: AppleNbNo,
  [Locale.EnNo]: AppleEn,
}

const GOOGLE_BADGE_SRC: Record<IsoLocale, StaticImageData> = {
  [Locale.SvSe]: GoogleSvSe,
  [Locale.EnSe]: GoogleEn,
  [Locale.DaDk]: GoogleDaDk,
  [Locale.EnDk]: GoogleEn,
  [Locale.NbNo]: GoogleNbNo,
  [Locale.EnNo]: GoogleEn,
}

export const AppStoreBadge = ({ type, locale }: AppStoreBadgeProps) => {
  if (type === 'apple') {
    const Component = APPLE_BADGE[locale]
    return <Component />
  }

  return (
    <Image
      src={GOOGLE_BADGE_SRC[locale]}
      alt="Google Play Store"
      height={48}
      width={161.14285}
      placeholder="blur"
    />
  )
}
