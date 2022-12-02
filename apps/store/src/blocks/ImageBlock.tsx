import styled from '@emotion/styled'
import { storyblokEditable } from '@storyblok/react'
import Image from 'next/image'
import { HeadingBlock, HeadingBlockProps } from '@/blocks/HeadingBlock'
import { ExpectedBlockType, SbBaseBlockProps, StoryblokAsset } from '@/services/storyblok/storyblok'
import { filterByBlockType } from '@/services/storyblok/Storyblok.helpers'

type ImageBlockProps = SbBaseBlockProps<{
  image: StoryblokAsset
  fullBleed?: boolean
  body?: ExpectedBlockType<HeadingBlockProps>
}>

export const ImageBlock = ({ blok }: ImageBlockProps) => {
  const sizeProps = getSizeFromURL(blok.image.filename)
  const headingBlocks = filterByBlockType(blok.body, HeadingBlock.blockName)

  return (
    <Wrapper {...storyblokEditable(blok)} spacing={!blok.fullBleed}>
      <Image src={blok.image.filename} {...sizeProps} alt={blok.image.alt} />
      <BodyWrapper>
        {headingBlocks.map((nestedBlock) => (
          <HeadingBlock key={nestedBlock._uid} blok={nestedBlock} />
        ))}
      </BodyWrapper>
    </Wrapper>
  )
}
ImageBlock.blockName = 'image'

const Wrapper = styled.div<{ spacing: boolean }>(({ theme, spacing = true }) => ({
  paddingLeft: spacing ? theme.space[4] : 0,
  paddingRight: spacing ? theme.space[4] : 0,
  position: 'relative',
}))

const BodyWrapper = styled.div(({ theme }) => ({
  position: 'absolute',
  top: theme.space[4],
  left: theme.space[4],
  right: theme.space[4],
}))

const getSizeFromURL = (url: string) => {
  const [, rawWidth, rawHeight] = url.match(/\/(\d+)x(\d+)\//) || []

  const width = parseInt(rawWidth, 10) || 0
  const height = parseInt(rawHeight, 10) || 0

  return { width, height }
}
