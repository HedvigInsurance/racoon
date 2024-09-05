import * as Tabs from 'ui'
import { yStack, Heading } from 'ui'
import { Perils } from '../Perils'
import type { PerilsTableProps, VariantPerils } from './PerilsTable'

type Props = {
  variantsPerils: Array<VariantPerils>
} & PerilsTableProps

export const PerilsTabs = ({ heading, description, variantsPerils }: Props) => {
  return (
    <Tabs.Root defaultValue={variantsPerils[1].typeOfContract}>
      <div className={yStack({ gap: 'lg' })}>
        <div>
          <Heading as="p" color="textPrimary" variant="standard.24" balance={true}>
            {heading}
          </Heading>
          <Heading as="p" color="textSecondary" variant="standard.24" balance={true}>
            {description}
          </Heading>
        </div>
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
