import { LinkButton } from 'ui'
import React from 'react'
import styled from '@emotion/styled'
import { useFormattedPrice } from '../hooks/use-formatted-price'
import { useTranslation } from 'next-i18next'

export type FooterProps = {
  buttonText: string
  buttonLinkTo: string
  price: { amount: number; currency: string }
}

const Wrapper = styled.div({
  width: '100vw',
  minHeight: '5rem',
  padding: '1rem',
  position: 'fixed',
  bottom: 0,
  left: 0,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'white',
  boxShadow: '0px -4px 8px rgba(0, 0, 0, 0.05), 0px -8px 16px rgba(0, 0, 0, 0.05)',
})

const InnerWrapper = styled.div({
  width: '100%',
  height: '100%',
  maxWidth: '628px',
  display: 'grid',
  gridTemplateColumns: 'max-content 1fr',
  gap: '1rem',
  alignItems: 'center',
})

const PriceWrapper = styled.div({})

const Price = styled.p(({ theme }) => ({
  fontSize: '1rem',
  lineHeight: '1.5rem',
  color: theme.colors.gray900,
  margin: 0,
}))

const PriceLabel = styled.p(({ theme }) => ({
  fontSize: '0.75rem',
  lineHeight: '1rem',
  color: theme.colors.gray700,
  margin: 0,
}))

export const Footer = ({ buttonText, buttonLinkTo, price }: FooterProps) => {
  const { t } = useTranslation()
  const formattedPrice = useFormattedPrice(price)

  return (
    <Wrapper>
      <InnerWrapper>
        <PriceWrapper>
          <Price>{`${formattedPrice}${t('PRICE_SUFFIX_INTERVAL')}`}</Price>
          <PriceLabel>{t('CANCEL_ANYTIME')}</PriceLabel>
        </PriceWrapper>

        <LinkButton $color="lavender" href={buttonLinkTo}>
          {buttonText}
        </LinkButton>
      </InnerWrapper>
    </Wrapper>
  )
}
