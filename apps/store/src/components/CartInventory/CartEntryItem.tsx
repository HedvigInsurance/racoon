import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import Link, { LinkProps } from 'next/link'
import { FormEvent } from 'react'
import { Button, Dialog, Heading, Space, Text } from 'ui'
import { Pillow } from '@/components/Pillow/Pillow'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { useCartEntryRemoveMutation } from '@/services/apollo/generated'
import { useFormatter } from '@/utils/useFormatter'
import { CartEntry } from './CartInventory.types'

type Props = CartEntry & { cartId: string }

export const CartEntryItem = (props: Props) => {
  const { cartId, offerId, title, startDate, cost, pillow } = props
  const { t } = useTranslation('cart')
  const formatter = useFormatter()

  const [removeCartEntry, { loading }] = useCartEntryRemoveMutation({
    refetchQueries: 'active',
    awaitRefetchQueries: true,
  })

  const handleSubmit = (offerId: string) => async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await removeCartEntry({ variables: { cartId, offerId } })
  }

  return (
    <Dialog.Root>
      <Wrapper>
        <Pillow size="small" {...pillow} />
        <Space y={1}>
          <div>
            <Text size="l">{title}</Text>
            <Text size="l" color="textSecondary">
              {/* @TODO: display "automatically switches" if cancellation is requested" */}
              {startDate
                ? t('CART_ENTRY_DATE_LABEL', { date: formatter.fromNow(startDate), ns: 'cart' })
                : 'Starts sometime...'}
            </Text>
          </div>
          <SpaceFlex space={0.25}>
            <LinkButtonSecondary href="#">
              {t('VIEW_ENTRY_DETAILS_BUTTON', { ns: 'cart' })}
            </LinkButtonSecondary>
            <Dialog.Trigger asChild>
              <TextButton disabled={loading}>{t('REMOVE_ENTRY_BUTTON', { ns: 'cart' })}</TextButton>
            </Dialog.Trigger>
          </SpaceFlex>
        </Space>
        <Text size="l">{formatter.monthlyPrice(cost)}</Text>
      </Wrapper>

      <StyledDialogContent>
        <DialogContentWrapper>
          <form onSubmit={handleSubmit(offerId)}>
            <Space y={1}>
              <Heading as="h2" variant="standard.20">
                Remove insurance?
              </Heading>
              <ButtonWrapper>
                <Dialog.Trigger asChild>
                  <Button type="button" variant="outlined">
                    Dont remove
                  </Button>
                </Dialog.Trigger>

                <Button type="submit" disabled={loading}>
                  Remove
                </Button>
              </ButtonWrapper>
            </Space>
          </form>
        </DialogContentWrapper>
      </StyledDialogContent>
    </Dialog.Root>
  )
}

const Wrapper = styled.li(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '3rem minmax(0, 1fr) auto',
  gap: theme.space[3],
}))

const SecondaryButton = styled.button(({ theme }) => ({
  fontSize: theme.fontSizes[1],
  paddingLeft: theme.space[4],
  paddingRight: theme.space[4],
  paddingTop: theme.space[2],
  paddingBottom: theme.space[2],
  borderRadius: theme.radius.xs,
  backgroundColor: theme.colors.gray200,
  boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.15)',

  ':disabled': {
    opacity: 0.6,
  },
}))

const LinkButtonSecondary = styled(SecondaryButton)<LinkProps>()
LinkButtonSecondary.defaultProps = { as: Link }

const TextButton = styled(SecondaryButton)({
  backgroundColor: 'transparent',
  boxShadow: 'none',
})

const StyledDialogContent = styled(Dialog.Content)(({ theme }) => ({
  height: '100%',
  paddingLeft: theme.space[4],
  paddingRight: theme.space[4],
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}))

const DialogContentWrapper = styled(Dialog.Window)(({ theme }) => ({
  padding: theme.space[4],
  textAlign: 'center',
  borderRadius: theme.radius.sm,
  width: '100%',
  maxWidth: '32rem',
}))

const ButtonWrapper = styled.div(({ theme }) => ({
  display: 'grid',
  gridAutoColumns: 'minmax(0, 1fr)',
  gridAutoFlow: 'column',
  gap: theme.space[2],
}))
