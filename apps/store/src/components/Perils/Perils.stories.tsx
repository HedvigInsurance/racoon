import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { MarketLabel } from '@/lib/l10n/types'
import { InsuranceNames, ProductNames } from '@/services/mockProductService'
import { Perils } from './Perils'
import { ShieldIcon } from './ShieldIcon'

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

export const Default = Template.bind({})
Default.args = {
  product: {
    name: ProductNames.SE_CAR,
    displayName: 'Car insurance',
    market: MarketLabel.SE,
    insurances: [
      {
        name: InsuranceNames.SE_CAR,
        displayName: 'Car insurance',
        perils: [
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
        ],
      },
    ],
  },
}
