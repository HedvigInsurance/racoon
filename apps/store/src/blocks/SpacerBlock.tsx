import styled from '@emotion/styled'
import { storyblokEditable } from '@storyblok/react'
import { theme } from 'ui'
import { SbBaseBlockProps } from '@/services/storyblok/storyblok'

type Props = {
  size: number
}

type SpacerBlockProps = SbBaseBlockProps<Props>

export const SpacerBlock = ({ blok }: SpacerBlockProps) => {
  return <Spacer size={blok.size} {...storyblokEditable} />
}
SpacerBlock.blockName = 'spacer'

const Spacer = styled.div<Props>(({ size }) => ({
  height: theme.space[size as keyof typeof theme.space] ?? size,
}))
