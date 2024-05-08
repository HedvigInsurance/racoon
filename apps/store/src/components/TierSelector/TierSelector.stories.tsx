import type { Meta, StoryFn } from '@storybook/react'
import { Text } from 'ui'
import * as TierSelector from './TierSelector'

const meta: Meta<typeof TierSelector.Root> = {
  title: 'Purchase Form / Tier Selector',
  component: TierSelector.Root,
  parameters: { grid: { width: '1/3' } },
}

export default meta

const Template: StoryFn<typeof TierSelector.Root> = () => {
  return (
    <TierSelector.Root>
      <TierSelector.Header>
        <Text>Välj skydd</Text>
      </TierSelector.Header>
      <TierSelector.Content>
        <TierSelector.OptionsList>
          <TierSelector.OptionsListItem
            value="first"
            title="Trafikförsäkring"
            price="289 kr/mån"
            description="Grundläggande skydd för att köra bil"
          />

          <TierSelector.OptionsListItem
            value="second"
            title="Halvförsäkring"
            price="699 kr/mån"
            description="Stöld & inbrott, brand, glasskador, m.m."
          />
        </TierSelector.OptionsList>

        <TierSelector.Footer>
          <Text size="xs">Läs mer om bilförsäkring</Text>
        </TierSelector.Footer>
      </TierSelector.Content>
    </TierSelector.Root>
  )
}

export const Default = {
  render: Template,
}
