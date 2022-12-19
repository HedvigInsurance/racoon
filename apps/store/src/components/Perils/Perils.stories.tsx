import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { Perils } from './Perils'
import { ShieldIcon } from './ShieldIcon'

const mockedPerils = [
  {
    id: 'waterLeaks',
    icon: <ShieldIcon size="22px" />,
    name: 'Water leaks',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent at dictum urna. Pellentesque gravida, sapien ut maximus cursus, dui ligula sodales nisl, sed placerat felis metus quis dolor.',
    covered: [
      'Lorem ipsum dolor sit amet',
      'Sed fermentum tempus',
      'Morbi at egestas tortor',
      'Quisque venenatis lacus dolor',
    ],
    notCovered: ['Morbi vitae elit sapien', 'Duis sed viverra nibh'],
  },
  {
    id: 'fire',
    icon: <ShieldIcon size="22px" />,
    name: 'Fire',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent at dictum urna. Pellentesque gravida, sapien ut maximus cursus, dui ligula sodales nisl, sed placerat felis metus quis dolor.',
    covered: ['Lorem ipsum dolor sit amet', 'Sed fermentum tempus'],
    notCovered: [
      'Morbi at egestas tortor',
      'Morbi vitae elit sapien',
      'Duis sed viverra nibh',
      'Quisque venenatis lacus dolor',
    ],
  },
  {
    id: 'storms',
    icon: <ShieldIcon size="22px" />,
    name: 'Storms',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent at dictum urna. Pellentesque gravida, sapien ut maximus cursus, dui ligula sodales nisl, sed placerat felis metus quis dolor.',
    covered: [
      'Lorem ipsum dolor sit amet',
      'Sed fermentum tempus',
      'Quisque venenatis lacus dolor',
    ],
    notCovered: ['Morbi vitae elit sapien'],
  },
  {
    id: 'assault',
    icon: <ShieldIcon size="22px" />,
    name: 'Assault',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent at dictum urna. Pellentesque gravida, sapien ut maximus cursus, dui ligula sodales nisl, sed placerat felis metus quis dolor.',
    covered: [
      'Lorem ipsum dolor sit amet',
      'Sed fermentum tempus',
      'Quisque venenatis lacus dolor',
    ],
    notCovered: ['Morbi vitae elit sapien'],
  },
  {
    id: 'white-goods',
    icon: <ShieldIcon size="22px" />,
    name: 'White Goods',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent at dictum urna. Pellentesque gravida, sapien ut maximus cursus, dui ligula sodales nisl, sed placerat felis metus quis dolor.',
    covered: [
      'Lorem ipsum dolor sit amet',
      'Sed fermentum tempus',
      'Quisque venenatis lacus dolor',
    ],
    notCovered: ['Morbi vitae elit sapien'],
  },
  {
    id: 'criminal-damage',
    icon: <ShieldIcon size="22px" />,
    name: 'Criminal Damage',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent at dictum urna. Pellentesque gravida, sapien ut maximus cursus, dui ligula sodales nisl, sed placerat felis metus quis dolor.',
    covered: [
      'Lorem ipsum dolor sit amet',
      'Sed fermentum tempus',
      'Quisque venenatis lacus dolor',
    ],
    notCovered: ['Morbi vitae elit sapien'],
  },
]

export default {
  title: 'Perils',
  component: Perils,
  parameters: {
    viewport: {
      viewports: INITIAL_VIEWPORTS,
      defaultViewport: 'iphonese2',
    },
  },
} as ComponentMeta<typeof Perils>

const Template: ComponentStory<typeof Perils> = (props) => <Perils {...props} />

export const FourItemsOrMore = Template.bind({})
FourItemsOrMore.args = {
  items: mockedPerils,
}

export const LessThanFourItems = Template.bind({})
LessThanFourItems.args = {
  items: mockedPerils.slice(0, 2),
}
