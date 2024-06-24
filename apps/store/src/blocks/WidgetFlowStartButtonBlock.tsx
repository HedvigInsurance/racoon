'use client'
import { storyblokEditable } from '@storyblok/react'
import { useSearchParams } from 'next/navigation'
import type { ReactNode } from 'react'
import { Suspense, useEffect, useState } from 'react'
import { ButtonNextLink, type ButtonNextLinkProps } from '@/components/ButtonNextLink'
import type { LinkField, SbBaseBlockProps } from '@/services/storyblok/storyblok'
import { getLinkFieldURL } from '@/services/storyblok/Storyblok.helpers'
import { mergeSearchParams } from '@/utils/mergeSearchParams'

type Props = SbBaseBlockProps<
  {
    text: string
    link: LinkField
  } & Pick<StartButtonProps, 'size' | 'fullWidth'>
>

export function WidgetFlowStartButtonBlock({ blok }: Props) {
  console.log(blok)
  const { link, text, fullWidth = true, size = 'large' } = blok

  return (
    <Suspense>
      <StartButton
        {...storyblokEditable(blok)}
        href={getLinkFieldURL(link)}
        size={size}
        fullWidth={fullWidth}
      >
        {text}
      </StartButton>
    </Suspense>
  )
}

type StartButtonProps = {
  href: string
  children: ReactNode
  size: ButtonNextLinkProps['size']
  fullWidth: ButtonNextLinkProps['fullWidth']
} & ReturnType<typeof storyblokEditable>

function StartButton({ href, children, ...forwardedProps }: StartButtonProps) {
  const [loading, setLoading] = useState(false)
  const [targetHref, setTargetHref] = useState(href)
  const searchParams = useSearchParams()
  useEffect(() => {
    if (searchParams) {
      setTargetHref(mergeSearchParams(href, searchParams))
    }
  }, [href, searchParams])
  return (
    <ButtonNextLink
      {...forwardedProps}
      href={targetHref}
      onClick={() => setLoading(true)}
      variant="primary"
      loading={loading}
    >
      {children}
    </ButtonNextLink>
  )
}
