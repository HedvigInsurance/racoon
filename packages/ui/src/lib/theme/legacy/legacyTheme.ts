import { radius } from '../radius'
import { space } from '../space'
import { fonts, fontSizes } from '../typography'
import { legacyColors } from './legacyColors'

export const legacyTheme = {
  colors: legacyColors,
  fonts,
  fontSizes,
  radius,
  space,
}

export type LegacyTheme = typeof legacyTheme
