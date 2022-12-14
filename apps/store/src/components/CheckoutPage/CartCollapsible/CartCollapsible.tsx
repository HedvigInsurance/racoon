import styled from '@emotion/styled'
import * as Collapsible from '@radix-ui/react-collapsible'
import { ReactNode, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CartCost } from '@/components/CartInventory/CartInventory.types'
import { MinusIcon } from '@/components/Perils/MinusIcon'
import { PlusIcon } from '@/components/Perils/PlusIcon'
import { Text } from '@/components/Text/Text'
import { I18nNamespace } from '@/utils/l10n/types'
import { useCurrencyFormatter } from '@/utils/useCurrencyFormatter'

type Props = {
  title: string
  cost: CartCost
  children: ReactNode
}

export const CartCollapsible = ({ children, title, cost }: Props) => {
  const currencyFormatter = useCurrencyFormatter(cost.currencyCode)
  const { t } = useTranslation(I18nNamespace.Checkout)

  const [open, setOpen] = useState(false)
  const closed = !open

  return (
    <Collapsible.Root open={open} onOpenChange={setOpen}>
      <Trigger>
        <SpaceBetween>
          <Text size="l">{title}</Text>
          {closed && (
            <Text size="l" color="gray600">
              {t('MONTHLY_PRICE', { displayAmount: currencyFormatter.format(cost.amount) })}
            </Text>
          )}
        </SpaceBetween>
        {open ? <MinusIcon size="1.5rem" /> : <PlusIcon size="1.5rem" />}
      </Trigger>
      <Collapsible.Content>{children}</Collapsible.Content>
    </Collapsible.Root>
  )
}

const Trigger = styled(Collapsible.Trigger)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: theme.space[2],
}))

const SpaceBetween = styled.div(({ theme }) => ({
  flex: 1,
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: theme.space[2],
}))
