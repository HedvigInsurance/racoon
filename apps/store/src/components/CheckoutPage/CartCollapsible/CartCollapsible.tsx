import styled from '@emotion/styled'
import * as Collapsible from '@radix-ui/react-collapsible'
import { ReactNode, useState } from 'react'
import { MinusIcon, Text, theme } from 'ui'
import { CartCost } from '@/components/CartInventory/CartInventory.types'
import { PlusIcon } from '@/components/Perils/PlusIcon'
import { useFormatter } from '@/utils/useFormatter'

type Props = {
  title: string
  cost: CartCost
  children: ReactNode
}

export const CartCollapsible = ({ children, title, cost }: Props) => {
  const formatter = useFormatter()

  const [open, setOpen] = useState(false)
  const closed = !open

  return (
    <Collapsible.Root open={open} onOpenChange={setOpen}>
      <Trigger>
        <SpaceBetween>
          <Text size="md">{title}</Text>
          {closed && (
            <Text size="md" color="textSecondary">
              {formatter.monthlyPrice(cost.total)}
            </Text>
          )}
        </SpaceBetween>
        {open ? <MinusIcon size="1.25rem" /> : <PlusIcon size="1.25rem" />}
      </Trigger>
      <Collapsible.Content>{children}</Collapsible.Content>
    </Collapsible.Root>
  )
}

const Trigger = styled(Collapsible.Trigger)({
  width: '100%',
  height: '3.5rem',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: theme.space.xxs,

  backgroundColor: theme.colors.light,
  ':focus-visible': {
    borderRadius: theme.radius.xs,
    boxShadow: `${theme.colors.light} 0 0 0 3px, ${theme.colors.textPrimary} 0 0 0 4px`,
  },
})

const SpaceBetween = styled.div({
  flex: 1,
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: theme.space.sm,
})
