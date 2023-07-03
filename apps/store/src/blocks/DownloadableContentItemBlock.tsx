import React from 'react'
import { DownloadableContentItem } from '@/components/DownloadableContentItem/DownloadableContentItem'
import { LinkField, SbBaseBlockProps, StoryblokAsset } from '@/services/storyblok/storyblok'

export type DownloadableContentItemBlockProps = SbBaseBlockProps<{
  thumbnail: StoryblokAsset
  fileLink: LinkField
}>

export const DownloadableContentItemBlock = ({ blok }: DownloadableContentItemBlockProps) => {
  return <DownloadableContentItem thumbnail={blok.thumbnail} url={blok.fileLink.url} />
}

DownloadableContentItemBlock.blockName = 'downloadableContentItem'
