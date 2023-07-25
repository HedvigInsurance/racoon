import styled from '@emotion/styled'
import { theme } from 'ui'

export const AdyenDropinStyles = styled.div({
  '.adyen-checkout__dropin': {
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.lg,
    padding: theme.space.lg,
    paddingBottom: theme.space.md,
    boxShadow: theme.shadow.default,
  },

  '.adyen-checkout__payment-method__header': {
    paddingInline: 0,
    paddingTop: 0,
  },

  '.adyen-checkout__payment-method__header__title': {
    padding: 0,
  },

  '.adyen-checkout__payment-method': {
    background: 'transparent',
    border: 0,
  },

  '.adyen-checkout__payment-method__details': {
    paddingInline: 0,
  },

  '.adyen-checkout__button': {
    borderRadius: theme.radius.sm,
    marginTop: theme.space.md,
  },
  '.adyen-checkout__button__icon': { display: 'none' },

  '.adyen-checkout__label__text': {
    color: theme.colors.textPrimary,
    fontSize: theme.fontSizes.xs,
    marginBottom: theme.space.xxs,
  },

  '.adyen-checkout__input': {
    border: 0,
    height: '3.5rem',
    paddingInline: theme.space.md,

    borderRadius: theme.radius.md,
    // Match background of inputs inside iframes
    backgroundColor: 'rgb(240, 240, 240)',
  },
})
