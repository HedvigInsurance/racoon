import styled from '@emotion/styled'
import { storyblokEditable } from '@storyblok/react'
import { SbBaseBlockProps } from '@/services/storyblok/storyblok'

type Props = {
  size: number
}

type SpacerBlockProps = SbBaseBlockProps<Props>

export const SpacerBlock = ({ blok }: SpacerBlockProps) => {
  return <Spacer size={blok.size} {...storyblokEditable} />
}

const Spacer = styled.div<Props>(({ theme, size }) => ({
  height: theme.space[size] ?? size,
}))
