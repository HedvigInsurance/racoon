export const gray = {
  25: 'hsl(0, 0%, 98%)',
  50: 'hsl(0, 0%, 96%)',
  100: 'hsl(0, 0%, 94%)',
  200: 'hsl(0, 0%, 92%)',
  300: 'hsl(0, 0%, 88%)',
  400: 'hsl(0, 0%, 81%)',
  500: 'hsl(0, 0%, 71%)',
  600: 'hsl(0, 0%, 59%)',
  700: 'hsl(0, 0%, 45%)',
  800: 'hsl(0, 0%, 31%)',
  900: 'hsl(0, 0%, 19%)',
  1000: 'hsl(0, 0%, 7%)',
} as const

export const green = {
  50: 'hsl(85, 100%, 90%)',
  100: 'hsl(85, 73%, 87%)',
  200: 'hsl(85, 66%, 84%)',
  300: 'hsl(85, 58%, 80%)',
  400: 'hsl(85, 54%, 76%)',
  500: 'hsl(85, 50%, 70%)',
  600: 'hsl(140, 70%, 47%)',
  700: 'hsl(100, 25%, 45%)',
  800: 'hsl(100, 28%, 32%)',
  900: 'hsl(100, 40%, 18%)',
} as const

export const red = {
  50: 'hsl(7, 100%, 97%)',
  100: 'hsl(7, 86%, 95%)',
  200: 'hsl(7, 76%, 92%)',
  300: 'hsl(7, 82%, 89%)',
  400: 'hsl(7, 91%, 83%)',
  500: 'hsl(7, 91%, 78%)',
  600: 'hsl(7, 100%, 61%)',
  700: 'hsl(7, 61%, 57%)',
  800: 'hsl(7, 76%, 40%)',
  900: 'hsl(7, 100%, 22%)',
} as const

export const yellow = {
  50: 'hsl(55, 100%, 91%)',
  100: 'hsl(55, 75%, 86%)',
  200: 'hsl(55, 60%, 80%)',
  300: 'hsl(55, 55%, 76%)',
  400: 'hsl(55, 50%, 72%)',
  500: 'hsl(55, 50%, 67%)',
  600: 'hsl(55, 100%, 70%)',
  700: 'hsl(50, 30%, 49%)',
  800: 'hsl(50, 42%, 36%)',
  900: 'hsl(50, 80%, 20%)',
} as const

const blue = {
  50: 'hsl(202, 100%, 96%)',
  100: 'hsl(202, 68%, 93%)',
  200: 'hsl(202, 57%, 88%)',
  300: 'hsl(202, 57%, 84%)',
  400: 'hsl(202, 50%, 77%)',
  500: 'hsl(202, 47%, 73%)',
  600: 'hsl(202, 94%, 66%)',
  700: 'hsl(210, 35%, 45%)',
  800: 'hsl(210, 45%, 34%)',
  900: 'hsl(210, 50%, 24%)',
} as const

const purple = {
  100: 'hsl(265, 51%, 93%)',
  200: 'hsl(265, 31%, 87%)',
} as const

export const highlight = {
  blue: { fill1: blue[100], fill2: blue[200] },
  purple: { fill1: purple[100], fill2: purple[200] },
  yellow: { fill1: yellow[100], fill2: yellow[200] },
} as const

export const signal = {
  green: { fill1: green[100], fill3: green[300], element: green[600], text: green[800] },
  amber: { fill1: yellow[100], fill3: yellow[300], element: yellow[600], text: yellow[800] },
  red: { fill1: red[100], fill3: red[300], element: red[600], text: red[800] },
} as const

const oldPurple = {
  100: '#f5ebf5',
  300: '#e3d7ee',
  500: '#d7c6e6',
  700: '#ccb9df',
  800: '#bea4d5',
  900: '#8c67ad',
} as const

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
  green50: green[50],
  green100: green[100],
  green200: green[200],
  green300: green[300],
  green500: green[500],
  green600: green[600],
  green700: green[700],
  green800: green[800],
  green900: green[900],
  purple100: oldPurple[100],
  purple300: oldPurple[300],
  purple500: oldPurple[500],
  purple700: oldPurple[700],
  purple800: oldPurple[800],
  purple900: oldPurple[900],
  red50: red[50],
  red100: red[100],
  red200: red[200],
  red300: red[300],
  red500: red[500],
  red600: red[600],
  red700: red[700],
  red800: red[800],
  red900: red[900],
  yellow50: yellow[50],
  yellow100: yellow[100],
  yellow200: yellow[200],
  yellow300: yellow[300],
  yellow500: yellow[500],
  yellow600: yellow[600],
  yellow700: yellow[700],
  yellow800: yellow[800],
  yellow900: yellow[900],
  black: '#000000',
  white: '#ffffff',
  // Alias colors
  dark: gray[1000],
  light: gray[25],
  lavender: oldPurple[500],
  textPrimary: gray[1000],
  textSecondary: gray[700],
  textTertiary: gray[500],
  textDisabled: gray[400],
  textNegative: gray[25],
  border: gray[400],

  // Highlight colors
  // Used as fill on light backgrounds
  blueFill1: highlight.blue.fill1,
  purpleFill1: highlight.purple.fill1,
  yellowFill1: highlight.yellow.fill1,
  // Used as fill on gray backgrounds
  blueFill2: highlight.blue.fill2,
  purpleFill2: highlight.purple.fill2,
  yellowFill2: highlight.yellow.fill2,
  // Signal colors
  greenFill1: signal.green.fill1,
  greenFill3: signal.green.fill3,
  greenElement: signal.green.element,
  greenText: signal.green.text,
  amberFill1: signal.amber.fill1,
  amberFill3: signal.amber.fill3,
  amberElement: signal.amber.element,
  amberText: signal.amber.text,
  redFill1: signal.red.fill1,
  redFill3: signal.red.fill3,
  redElement: signal.red.element,
  redText: signal.red.text,
} as const

export type UIColors = typeof colors
export type UIColorKeys = keyof typeof colors
