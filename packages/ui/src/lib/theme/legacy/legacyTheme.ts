import { radius } from '../radius'
import { space } from '../space'
import { legacyColors } from './legacyColors'
import { fonts, fontSizes } from '../typography'

export const legacyTheme = {
  colors: legacyColors,
  fonts,
  fontSizes,
  radius,
  space,
}

export type LegacyTheme = typeof legacyTheme
