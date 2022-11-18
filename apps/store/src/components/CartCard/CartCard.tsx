import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { FormEvent } from 'react'
import { Button, Heading, LinkButton, Space } from 'ui'
import * as Dialog from '@/components/Dialog/Dialog'
import { Pillow } from '@/components/Pillow/Pillow'
import { useCurrencyFormatter } from '@/utils/useCurrencyFormatter'

export type CartCardProps = {
  title: string
  price: number
  currency: string
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  loading: boolean
}

export const CartCard = ({ title, price, currency, onSubmit, loading }: CartCardProps) => {
  const { t } = useTranslation()
  const currencyFormatter = useCurrencyFormatter(currency)

  return (
    <Dialog.Root>
      <ProductCard>
        <Pillow size="small" fromColor="#C0E4F3" toColor="#99AAD8" />
        <Content>
          <HeaderElement>
            <div>{title}</div>
            <ExtraElement>
              {t('MONTHLY_PRICE', { displayAmount: currencyFormatter.format(price) })}
            </ExtraElement>
          </HeaderElement>

          <Dialog.Trigger asChild>
            <RemoveButton>Remove</RemoveButton>
          </Dialog.Trigger>
        </Content>
      </ProductCard>

      <StyledDialogContent>
        <DialogContentWrapper>
          <Space y={1}>
            <Heading as="h2" variant="standard.20">
              Remove insurance?
            </Heading>
            <form onSubmit={onSubmit}>
              <Space y={1.5}>
                <p>You will lose the discount applied if you remove the insurance.</p>
                <ButtonContainer>
                  <Dialog.Trigger>
                    <LinkButton as="span" fullWidth variant="outlined">
                      Dont remove
                    </LinkButton>
                  </Dialog.Trigger>

                  <Button type="submit" fullWidth disabled={loading}>
                    Remove
                  </Button>
                </ButtonContainer>
              </Space>
            </form>
          </Space>
        </DialogContentWrapper>
      </StyledDialogContent>
    </Dialog.Root>
  )
}

const ProductCard = styled.div(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.space[4],
}))

const Content = styled.div({
  flex: 1,
})

const HeaderElement = styled.div(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  gap: theme.space[4],
  width: '100%',
}))

const ExtraElement = styled.div({
  justifySelf: 'end',
})

const RemoveButton = styled.button(({ theme }) => ({
  textDecoration: 'underline',
  fontSize: theme.fontSizes[1],
  cursor: 'pointer',
}))

const ButtonContainer = styled.div(({ theme }) => ({
  display: 'flex',
  gap: theme.space[3],
}))

const StyledDialogContent = styled(Dialog.Content)(({ theme }) => ({
  paddingLeft: theme.space[4],
  paddingRight: theme.space[4],
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}))

const DialogContentWrapper = styled(Dialog.Window)(({ theme }) => ({
  padding: theme.space[4],
  textAlign: 'center',
}))
