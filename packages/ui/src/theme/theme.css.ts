import { createTheme, createThemeContract } from '@vanilla-extract/css'
import { theme } from './theme'
import { nullifyObject } from './utils'

export const tokens = createThemeContract(nullifyObject(theme))

export const mainTheme = createTheme(tokens, theme)
