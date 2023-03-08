import { ComponentMeta, ComponentStory } from '@storybook/react'
import { Text } from 'ui'
import * as TierLevelRadioGroup from './TierLevelRadioGroup'
import * as TierSelector from './TierSelector'

export default {
  title: 'Tier Selector',
  component: TierSelector.Root,
} as ComponentMeta<typeof TierSelector.Root>

const Template: ComponentStory<typeof TierSelector.Root> = () => {
  return (
    <TierSelector.Root>
      <TierSelector.Header>
        <Text>Välj skydd</Text>
      </TierSelector.Header>
      <TierSelector.Content>
        <TierLevelRadioGroup.Root>
          <TierLevelRadioGroup.Item
            value="first"
            title="Trafikförsäkring"
            price="289 kr/mån"
            description="Grundläggande skydd för att köra bil"
          />

          <TierLevelRadioGroup.Item
            value="second"
            title="Halvförsäkring"
            price="699 kr/mån"
            description="Stöld & inbrott, brand, glasskador, m.m."
          />
        </TierLevelRadioGroup.Root>

        <TierSelector.Footer>
          <Text size="xs">Läs mer om bilförsäkring</Text>
        </TierSelector.Footer>
      </TierSelector.Content>
    </TierSelector.Root>
  )
}

export const Default = Template.bind({})
Default.args = {}
