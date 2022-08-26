import styled from '@emotion/styled'
import { useState } from 'react'
import { Button, Heading, Space } from 'ui'
import * as Dialog from '@/components/Dialog/Dialog'
import { useRefreshData } from '@/hooks/useRefreshData'
import { PageLink } from '@/lib/PageLink'
import { useCurrencyFormatter } from '@/utils/useCurrencyFormatter'
import { useForm } from './useForm'

export type CartCardProps = {
  lineId: string
  title: string
  price: number
  currency: string
}

export const CartCard = ({ lineId, title, price, currency }: CartCardProps) => {
  const currencyFormatter = useCurrencyFormatter(currency)
  const [open, setOpen] = useState(false)
  const refreshData = useRefreshData()
  const { state, formProps } = useForm({
    onComplete: () => {
      setOpen(false)
      refreshData()
    },
  })

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <ProductCard>
        <IconElement />
        <Content>
          <HeaderElement>
            <div>{title}</div>
            <ExtraElement>{currencyFormatter.format(price)}/mo.</ExtraElement>
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
            <form {...formProps} method="POST" action={PageLink.apiCartLinesRemove({ lineId })}>
              <Space y={1.5}>
                <p>You will lose the discount applied if you remove the insurance.</p>
                <ButtonContainer>
                  <Button type="button" fullWidth variant="outlined" onClick={() => setOpen(false)}>
                    Dont remove
                  </Button>

                  <Button type="submit" fullWidth disabled={state === 'submitting'}>
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

const IconElement = styled.div(
  {
    width: '48px',
    height: '48px',
    borderRadius: '0.75rem',
  },
  (props) => ({
    border: `2px solid ${props.theme.colors.gray500}`,
    backgroundColor: `${props.theme.colors.gray300}`,
  }),
)
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
