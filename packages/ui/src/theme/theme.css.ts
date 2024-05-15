import { createTheme } from '@vanilla-extract/css'
import { theme } from './theme'

export const [mainTheme, tokens] = createTheme(theme)
