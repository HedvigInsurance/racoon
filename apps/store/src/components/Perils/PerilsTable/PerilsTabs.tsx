import * as Tabs from 'ui'
import { yStack } from 'ui'
import { Perils } from '../Perils'
import type { VariantPerils } from './PerilsTable'

type Props = {
  variantsPerils: Array<VariantPerils>
}

export const PerilsTabs = ({ variantsPerils }: Props) => {
  return (
    <Tabs.Root defaultValue={variantsPerils[1].typeOfContract}>
      <div className={yStack({ gap: 'lg' })}>
        <Tabs.List type="filled">
          {variantsPerils.map((variant) => {
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

        {variantsPerils.map((variant) => {
          return (
            <Tabs.Content
              key={variant.typeOfContract}
              value={variant.typeOfContract}
              data-value={variant.typeOfContract}
            >
              <Perils items={variant.perils} missingItems={variant.missingPerils} />
            </Tabs.Content>
          )
        })}
      </div>
    </Tabs.Root>
  )
}
