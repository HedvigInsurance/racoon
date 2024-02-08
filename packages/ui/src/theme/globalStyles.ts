import { css } from '@emotion/react'
import { theme } from './index'

// TODO: Migrate variables and their application to vanilla-css
export const globalStyles = css`
  :root {
    --body-bg-color: ${theme.colors.backgroundStandard};
    --body-text-color: ${theme.colors.textPrimary};
    --header-bg-transparent-color: hsla(0, 0%, 98%, 0);
  }

  body {
    color: var(--body-text-color);
    background-color: var(--body-bg-color);
  }

  /* Reapply the pointer cursor for anchor tags */

  a,
  button {
    cursor: revert;
  }
`
