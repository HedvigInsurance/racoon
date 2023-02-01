import styled from '@emotion/styled'
import { theme } from 'ui'

export const AdyenDropinStyles = styled.div({
  '.adyen-checkout__dropin': {
    backgroundColor: theme.colors.white,
    border: `1px solid ${theme.colors.gray500}`,
    borderRadius: 8,
  },

  '.adyen-checkout__payment-method': {
    background: 'transparent',
    border: 0,
  },

  '.adyen-checkout__payment-method__details': {
    paddingLeft: theme.space[2],
    paddingRight: theme.space[2],
  },

  '.adyen-checkout__button': {
    backgroundColor: theme.colors.gray900,
  },

  '.adyen-checkout__label__text': { color: theme.colors.gray900 },

  '.adyen-checkout__label--focused': {
    '.adyen-checkout__label__text': { color: theme.colors.gray900 },
  },

  '.adyen-checkout__input': {
    backgroundColor: theme.colors.white,
    border: `1px solid ${theme.colors.gray300}`,
    borderRadius: 8,
    height: 52,
  },

  '.adyen-checkout__button__icon': { display: 'none' },
})
