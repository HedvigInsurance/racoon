import styled from '@emotion/styled'
import { storyblokEditable } from '@storyblok/react'
import { mq } from 'ui'
import { SbBaseBlockProps } from '@/services/storyblok/storyblok'

type Props = {
  size: string
}

type SpaceSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

const spaceBlockScale = {
  _: {
    xs: '1.5rem',
    sm: '3rem',
    md: '5rem',
    lg: '6rem',
    xl: '9rem',
  },
  lg: {
    xs: '3rem',
    sm: '5rem',
    md: '9rem',
    lg: '12rem',
    xl: '18rem',
  },
} as const

type SpacerBlockProps = SbBaseBlockProps<Props>

export const SpacerBlock = ({ blok }: SpacerBlockProps) => {
  return <Spacer size={blok.size} {...storyblokEditable} />
}

SpacerBlock.blockName = 'spacer'

const Spacer = styled.div<Props>(({ size }) => ({
  height: spaceBlockScale['_'][size as SpaceSize],

  [mq.lg]: {
    height: spaceBlockScale['lg'][size as SpaceSize],
  },
}))
