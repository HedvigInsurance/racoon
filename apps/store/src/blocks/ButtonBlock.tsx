import styled from '@emotion/styled'
import { storyblokEditable } from '@storyblok/react'
import { useSearchParams } from 'next/navigation'
import { type ComponentProps, useMemo, useState } from 'react'
import { Button, ConditionalWrapper, theme } from 'ui'
import { ButtonNextLink } from '@/components/ButtonNextLink'
import { LinkField, type SbBaseBlockProps } from '@/services/storyblok/storyblok'
import { getLinkFieldURL } from '@/services/storyblok/Storyblok.helpers'
import { mergeSearchParams } from '@/utils/mergeSearchParams'

export type ButtonBlockProps = SbBaseBlockProps<{
  text: string
  link: LinkField
  variant: ComponentProps<typeof Button>['variant']
  size: ComponentProps<typeof Button>['size']
  forwardQueryString?: boolean
  showLoading?: boolean
}>

export const ButtonBlock = ({ blok, nested }: ButtonBlockProps) => {
  const [loading, setLoading] = useState(false)
  const searchParams = useSearchParams()
  const href = useMemo(() => {
    if (blok.forwardQueryString) {
      return mergeSearchParams(getLinkFieldURL(blok.link, blok.text), searchParams)
    }

    return getLinkFieldURL(blok.link, blok.text)
  }, [searchParams, blok.forwardQueryString, blok.link, blok.text])

  return (
    <ConditionalWrapper condition={!nested} wrapWith={(children) => <Wrapper>{children}</Wrapper>}>
      <ButtonNextLink
        {...storyblokEditable(blok)}
        href={href}
        onClick={() => setLoading(true)}
        variant={blok.variant ?? 'primary'}
        size={blok.size ?? 'medium'}
        target={blok.link.target}
        rel={blok.link.rel}
        title={blok.link.title}
        loading={blok.showLoading && loading}
      >
        {blok.text}
      </ButtonNextLink>
    </ConditionalWrapper>
  )
}
ButtonBlock.blockName = 'button'

const Wrapper = styled.div({
  display: 'flex',
  justifyContent: 'center',
  paddingLeft: theme.space.md,
  paddingRight: theme.space.md,
})
