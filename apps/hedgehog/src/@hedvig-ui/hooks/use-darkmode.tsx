'use client'

import { createContext, useContext, useState } from 'react'
import * as React from 'react'
import { ThemeProvider } from '@emotion/react'
import { darkTheme, lightTheme } from '@hedvig-ui'

export const getDefaultIsDarkmode = () => {
  const isServer = typeof window === 'undefined'

  return isServer
    ? false
    : window.localStorage.getItem('hedvig:theming:darkmode') === 'true'
}

export const UseDarkmode = createContext<{
  isDarkmode: boolean
  setIsDarkmode: (newIsDarkmode: boolean) => void
}>({
  isDarkmode: getDefaultIsDarkmode(),
  setIsDarkmode: () => void 0,
})

export const useDarkmode = () => useContext(UseDarkmode)

export const DarkmodeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isDarkmode, setIsDarkmode] = useState(getDefaultIsDarkmode())

  const theme = {
    ...(isDarkmode ? darkTheme : lightTheme),
  }

  return (
    <UseDarkmode.Provider
      value={{
        isDarkmode,
        setIsDarkmode: (newIsDarkmode) => {
          setIsDarkmode(newIsDarkmode)
          localStorage.setItem(
            'hedvig:theming:darkmode',
            JSON.stringify(newIsDarkmode),
          )
        },
      }}
    >
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </UseDarkmode.Provider>
  )
}
