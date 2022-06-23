import { Global } from '@emotion/react'

export const GlobalStyles = () => (
  <Global
    styles={{
      ul: {
        listStyleType: 'disc',
        paddingInlineStart: '2rem',
      },
      a: {
        textDecoration: 'underline',
      },
    }}
  ></Global>
)
