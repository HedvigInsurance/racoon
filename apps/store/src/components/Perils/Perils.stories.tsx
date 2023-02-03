import { ComponentMeta, ComponentStory } from '@storybook/react'
import { PerilFragment } from '@/services/apollo/generated'
import { Perils } from './Perils'

const mockedPerils: PerilFragment[] = [
  {
    title: 'Water leaks',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent at dictum urna. Pellentesque gravida, sapien ut maximus cursus, dui ligula sodales nisl, sed placerat felis metus quis dolor.',
    covered: [
      'Lorem ipsum dolor sit amet',
      'Sed fermentum tempus',
      'Morbi at egestas tortor',
      'Quisque venenatis lacus dolor',
    ],
    exceptions: ['Morbi vitae elit sapien', 'Duis sed viverra nibh'],
  },
  {
    title: 'Fire',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent at dictum urna. Pellentesque gravida, sapien ut maximus cursus, dui ligula sodales nisl, sed placerat felis metus quis dolor.',
    covered: ['Lorem ipsum dolor sit amet', 'Sed fermentum tempus'],
    exceptions: [
      'Morbi at egestas tortor',
      'Morbi vitae elit sapien',
      'Duis sed viverra nibh',
      'Quisque venenatis lacus dolor',
    ],
  },
  {
    title: 'Storms',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent at dictum urna. Pellentesque gravida, sapien ut maximus cursus, dui ligula sodales nisl, sed placerat felis metus quis dolor.',
    covered: [
      'Lorem ipsum dolor sit amet',
      'Sed fermentum tempus',
      'Quisque venenatis lacus dolor',
    ],
    exceptions: ['Morbi vitae elit sapien'],
  },
  {
    title: 'Assault',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent at dictum urna. Pellentesque gravida, sapien ut maximus cursus, dui ligula sodales nisl, sed placerat felis metus quis dolor.',
    covered: [
      'Lorem ipsum dolor sit amet',
      'Sed fermentum tempus',
      'Quisque venenatis lacus dolor',
    ],
    exceptions: ['Morbi vitae elit sapien'],
  },
  {
    title: 'White Goods',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent at dictum urna. Pellentesque gravida, sapien ut maximus cursus, dui ligula sodales nisl, sed placerat felis metus quis dolor.',
    covered: [
      'Lorem ipsum dolor sit amet',
      'Sed fermentum tempus',
      'Quisque venenatis lacus dolor',
    ],
    exceptions: ['Morbi vitae elit sapien'],
  },
  {
    title: 'Criminal Damage',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent at dictum urna. Pellentesque gravida, sapien ut maximus cursus, dui ligula sodales nisl, sed placerat felis metus quis dolor.',
    covered: [
      'Lorem ipsum dolor sit amet',
      'Sed fermentum tempus',
      'Quisque venenatis lacus dolor',
    ],
    exceptions: ['Morbi vitae elit sapien'],
  },
]

export default {
  title: 'Perils',
  component: Perils,
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
