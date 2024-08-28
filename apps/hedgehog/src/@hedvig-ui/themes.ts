import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { colorsV3, fonts, getCdnFontFaces } from '@hedviginsurance/brand'
import { colors } from './redesign/palette'

const fontSize = {
  tiny: '0.75rem',
  small: '0.875rem',
  medium: '1rem',
  large: '1.125rem',
  huge: '1.25rem',
} as const

const spacing = {
  fraction: '0.25rem',
  tiny: '0.5rem',
  small: '1rem',
  medium: '2rem',
  large: '3rem',
  huge: '6rem',
} as const

const sharedTheme = {
  fontSize,
  spacing,
  colors,
}

export const lightTheme = {
  type: 'light',
  ...sharedTheme,
  background: colorsV3.gray100,
  backgroundLight: colorsV3.white,
  accentBackground: colorsV3.gray300,
  accentBackgroundHighlight: colorsV3.gray100,
  foreground: colorsV3.gray900,
  semiStrongForeground: colorsV3.gray700,
  placeholderColor: colorsV3.gray500,
  border: '#c6d6e4',
  borderStrong: '#36658f',
  backgroundTransparent: 'rgba(0, 0, 0, .1)',
  backgroundTransparentContrast: 'rgba(255, 255, 255, .4)',
  accent: '#36658f',
  accentLight: '#c6d6e4',
  accentLighter: '#e0eaf3',
  accentSaturated: '#CFE2F2',
  accentContrast: colorsV3.white,
  accentSecondary: colorsV3.gray300,
  accentSecondaryLight: colorsV3.gray100,
  accentSecondaryContrast: colorsV3.gray900,
  accentThird: '#c6d6e4',
  accentThirdLight: '#e0eaf3',
  accentThirdContrast: colorsV3.gray900,
  danger: '#e24646',
  lightDanger: '#eecccc',
  success: '#199381',
  lightSuccess: '#b7eae2',
  warning: '#fbd45b',
  darkWarning: '#a48009',
  lightWarning: '#faeaab',
  highlight: '#c4a8ef',
  darkHighlight: '#491299',
  mutedText: colorsV3.gray500,
  mutedBackground: colorsV3.gray300,
  defaultButtonBackground: colorsV3.gray300,
  highlightedButtonBackground: colorsV3.gray500,
  activeInsuranceBackground: '#199381',
  activeInsuranceForeground: '#fff',
  pendingInsuranceBackground: '#fbd45b',
  pendingInsuranceForeground: '#fff',
  terminatedInsuranceBackground: '#e24646',
  terminatedInsuranceForeground: '#fff',
  hotkeyBackground: 'rgba(0, 133, 255, 0.15)',
  hotkeyText: '#0085FF',
}

export type ThemeType = typeof lightTheme

export const darkTheme: ThemeType = {
  type: 'dark',
  ...sharedTheme,
  background: colorsV3.gray900,
  backgroundLight: colorsV3.gray800,
  accentBackground: colorsV3.gray700,
  accentBackgroundHighlight: colorsV3.gray900,
  foreground: colorsV3.white,
  semiStrongForeground: colorsV3.gray500,
  placeholderColor: colorsV3.gray500,
  border: '#203446',
  borderStrong: '#4581b5',
  backgroundTransparent: 'rgba(255, 255, 255, .1)',
  backgroundTransparentContrast: 'rgba(0, 0, 0, .4)',
  accent: '#4581b5',
  accentLight: '#203446',
  accentLighter: '#192b3c',
  accentSaturated: '#314A61',
  accentContrast: colorsV3.white,
  accentSecondary: colorsV3.gray500,
  accentSecondaryLight: colorsV3.gray700,
  accentSecondaryContrast: colorsV3.gray900,
  accentThird: '#203446',
  accentThirdLight: '#192b3c',
  accentThirdContrast: colorsV3.white,
  danger: '#e24646',
  lightDanger: '#eecccc',
  success: '#199381',
  lightSuccess: '#b7eae2',
  warning: '#fbd45b',
  darkWarning: '#92720f',
  lightWarning: '#efe7ce',
  highlight: '#be9bf3',
  darkHighlight: '#290958',
  mutedText: colorsV3.gray500,
  mutedBackground: colorsV3.gray700,
  defaultButtonBackground: colorsV3.gray800,
  highlightedButtonBackground: colorsV3.gray500,
  activeInsuranceBackground: '#199381',
  activeInsuranceForeground: '#fff',
  pendingInsuranceBackground: '#fbd45b',
  pendingInsuranceForeground: '#fff',
  terminatedInsuranceBackground: '#e24646',
  terminatedInsuranceForeground: '#fff',
  hotkeyBackground: 'rgba(0, 133, 255, 0.15)',
  hotkeyText: '#0085FF',
}

export const GlobalStyles = css`
  ${getCdnFontFaces()}

  :root {
    --chat-width: 600px;

    @media (max-width: 1600px) {
      --chat-width: 400px;
    }
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: ${fonts.HEDVIG_LETTERS_STANDARD}, sans-serif;
    -webkit-font-smoothing: antialiased;
  }

  body {
    font-family: ${fonts.HEDVIG_LETTERS_STANDARD}, sans-serif;
    line-height: 1.2;
    letter-spacing: -0.01em;
    margin: 0;
    padding: 0;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-family: ${fonts.HEDVIG_LETTERS_STANDARD}, sans-serif;
    font-kerning: none;
    font-weight: 400;
  }
`

export const BaseStyle = styled.div`
  ${({ theme }) => css`
    a {
      color: ${theme.accent};
      text-decoration: none;
      transition: color 200ms;
      &:hover,
      &:focus {
        color: ${theme.accentLight};
      }
    }

    strong {
      color: ${theme.foreground};
    }

    tbody td {
      color: ${theme.foreground};
      border: ${theme.borderStrong};
      background: ${theme.accentLighter};
      padding: 0.75rem;
      border: 0;
      border-top: 1px solid ${theme.border};
    }

    tr.active td {
      position: relative;
      background: ${theme.accentLight};

      :first-of-type::before {
        content: ' ';
        width: 0;
        height: 0;
        border-top: 15px solid transparent;
        border-bottom: 15px solid transparent;
        border-left: 10px solid ${theme.borderStrong};

        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
      }
    }
  }
`};
`
