'use client'
import { useMemo } from 'react'
import * as Tabs from 'ui'
import { yStack } from 'ui'
import type { PerilFragment, ProductVariantFragment } from '@/services/graphql/generated'
import { Perils } from '../Perils'

type Props = {
  variants: Array<ProductVariantFragment>
}

export const PerilsTabs = ({ variants }: Props) => {
  const allPerils = useMemo(() => {
    const perilsMap = new Map(
      variants.flatMap((item) => item.perils.map((peril) => [peril.title, peril])),
    )
    return Array.from(perilsMap.values())
  }, [variants])

  const getMissingItems = (items: Array<PerilFragment>) => {
    const addedPerils = new Set<string>(items.map((item) => item.title))
    return allPerils.filter((item) => !addedPerils.has(item.title))
  }

  return (
    <Tabs.Root defaultValue={variants[1].typeOfContract}>
      <div className={yStack({ gap: 'lg' })}>
        <Tabs.List type="filled">
          {variants.map((variant) => {
            return (
              <Tabs.Trigger
                key={variant.typeOfContract}
                value={variant.typeOfContract}
                asChild={true}
              >
                {variant.displayNameSubtype}
              </Tabs.Trigger>
            )
          })}
        </Tabs.List>

        {variants.map((variant) => {
          return (
            <Tabs.Content
              key={variant.typeOfContract}
              value={variant.typeOfContract}
              data-value={variant.typeOfContract}
            >
              <Perils items={variant.perils} missingItems={getMissingItems(variant.perils)} />
            </Tabs.Content>
          )
        })}
      </div>
    </Tabs.Root>
  )
}
