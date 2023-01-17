import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { PerilFragment } from '@/services/apollo/generated'
import { Perils } from './Perils'

export const mockedPerils: PerilFragment[] = [
  {
    icon: {
      variants: {
        light: {
          svgUrl: 'https://promise.hedvig.com/car_traffic_personal_injury_a14171ca7a.svg',
        },
      },
    },
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
    icon: {
      variants: {
        light: {
          svgUrl: 'https://promise.hedvig.com/car_traffic_thrid_party_property_0a6eef1ac9.svg',
        },
      },
    },
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
    icon: {
      variants: {
        light: {
          svgUrl: 'https://promise.hedvig.com/car_theft_burglary_c98ad8e370.svg',
        },
      },
    },
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
    icon: {
      variants: {
        light: {
          svgUrl: 'https://promise.hedvig.com/car_theft_burglary_c98ad8e370.svg',
        },
      },
    },
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
    icon: {
      variants: {
        light: {
          svgUrl: 'https://promise.hedvig.com/car_theft_burglary_c98ad8e370.svg',
        },
      },
    },
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
    icon: {
      variants: {
        light: {
          svgUrl: 'https://promise.hedvig.com/car_theft_burglary_c98ad8e370.svg',
        },
      },
    },
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
