import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import React from 'react'
import { theme } from 'ui/src/theme/theme'
import type { StoryblokAsset } from '@/services/storyblok/storyblok'
import { getImgSrc } from '@/services/storyblok/Storyblok.helpers'
import { ImageWithPlaceholder } from '../ImageWithPlaceholder/ImageWithPlaceholder'
import { linkStyles } from '../RichText/RichText.styles'

export type DownloadableContentProps = {
  url: string
  thumbnail: StoryblokAsset
}

export const DownloadableContentItem = ({ thumbnail, url }: DownloadableContentProps) => {
  const { t } = useTranslation('common')
  return (
    <div>
      <Wrapper>
        <Image src={getImgSrc(thumbnail.filename)} alt={thumbnail.alt} fill />
      </Wrapper>
      <Link href={getImgSrc(url)} download={true} rel="nofollow noreferrer">
        {t('DOWNLOAD_ASSET')}
      </Link>
    </div>
  )
}

const Wrapper = styled.div({
  position: 'relative',
  aspectRatio: '6 / 4',
})

const Image = styled(ImageWithPlaceholder)({
  objectFit: 'cover',
  borderRadius: theme.radius.sm,
})

const Link = styled.a(linkStyles, {
  display: 'inline-block',
  marginBlock: theme.space.xs,
  marginInline: theme.space.xs,
})
