import styled from '@emotion/styled'
import { storyblokEditable } from '@storyblok/react'
import { theme } from 'ui'
import { SbBaseBlockProps } from '@/services/storyblok/storyblok'

type SpaceSize = 'sm' | 'md' | 'lg' | 'xl'

type Props = {
  size: SpaceSize
}

const spaceBlockScale = {
  sm: theme.space.xs,
  md: theme.space.md,
  lg: theme.space.lg,
  xl: theme.space.xl,
} as const

type InlineSpaceBlockProps = SbBaseBlockProps<Props>

export const InlineSpaceBlock = ({ blok }: InlineSpaceBlockProps) => {
  return <Spacer size={blok.size} {...storyblokEditable} />
}

InlineSpaceBlock.blockName = 'inlineSpace'

const Spacer = styled.div<Props>(({ size }) => ({
  height: spaceBlockScale[size],
}))
