import styled from '@emotion/styled'
import { SbBlokData, storyblokEditable } from '@storyblok/react'
import { Perils } from '@/components/Perils/Perils'
import { ShieldIcon } from '@/components/Perils/ShieldIcon'

const ITEMS = [
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
]

export const PerilsBlock = (blok: SbBlokData) => {
  return (
    <Wrapper {...storyblokEditable(blok)}>
      <Perils items={ITEMS} />
    </Wrapper>
  )
}

PerilsBlock.blockName = 'perils'

const Wrapper = styled.div(({ theme }) => ({
  paddingLeft: theme.space[4],
  paddingRight: theme.space[4],
}))
