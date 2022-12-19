const gray = {
  25: 'hsl(0, 0%, 98%)',
  50: 'hsl(0, 0%, 96%)',
  100: 'hsl(0, 0%, 94%)',
  200: 'hsl(0, 0%, 92%)',
  300: 'hsl(0, 0%, 88%)',
  400: 'hsl(0, 0%, 81%)',
  500: 'hsl(0, 0%, 73%)',
  600: 'hsl(0, 0%, 63%)',
  700: 'hsl(0, 0%, 52%)',
  800: 'hsl(0, 0%, 40%)',
  900: 'hsl(0, 0%, 25%)',
  1000: 'hsl(0, 0%, 7%)',
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
