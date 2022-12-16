const gray = {
  25: '#fafafa',
  50: '#f5f5f5',
  100: '#f0f0f0',
  200: '#eaeaea',
  300: '#e0e0e0',
  400: '#cfcfcf',
  500: '#bbbbbb',
  600: '#a0a0a0',
  700: '#848484',
  800: '#666666',
  900: '#404040',
  1000: '#121212',
}

const purple = {
  100: '#f5ebf5',
  300: '#e3d7ee',
  500: '#d7c6e6',
  700: '#ccb9df',
  800: '#bea4d5',
  900: '#8c67ad',
}

const red = {
  500: '#e24646',
  600: '#dd2727',
}

export const colors = {
  gray25: gray[25],
  gray50: gray[50],
  gray100: gray[100],
  gray200: gray[200],
  gray300: gray[300],
  gray500: gray[500],
  gray600: gray[600],
  gray700: gray[700],
  gray800: gray[800],
  gray900: gray[900],
  gray1000: gray[1000],
  purple100: purple[100],
  purple300: purple[300],
  purple500: purple[500],
  purple700: purple[700],
  purple800: purple[800],
  purple900: purple[900],
  red500: red[500],
  red600: red[600],
  black: '#000000',
  white: '#ffffff',
  // Alias colors
  dark: gray[1000],
  light: gray[25],
  lavender: purple[500],
  textPrimary: gray[1000],
  textSecondary: gray[700],
  textTertiary: gray[500],
  textDisabled: gray[400],
}

export type UIColor = keyof typeof colors
