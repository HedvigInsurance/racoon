'use client'
import { storyblokEditable } from '@storyblok/react'
import { useSearchParams } from 'next/navigation'
import type { ReactNode } from 'react'
import { Suspense, useEffect, useState } from 'react'
import { ButtonNextLink } from '@/components/ButtonNextLink'
import type { LinkField, SbBaseBlockProps } from '@/services/storyblok/storyblok'
import { getLinkFieldURL } from '@/services/storyblok/Storyblok.helpers'
import { mergeSearchParams } from '@/utils/mergeSearchParams'

type Props = SbBaseBlockProps<{
  text: string
  link: LinkField
}>

export function WidgetFlowStartButtonBlock({ blok }: Props) {
  return (
    <Suspense>
      <StartButton {...storyblokEditable(blok)} href={getLinkFieldURL(blok.link)}>
        {blok.text}
      </StartButton>
    </Suspense>
  )
}

type StartButtonProps = {
  href: string
  children: ReactNode
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
      size="large"
      loading={loading}
    >
      {children}
    </ButtonNextLink>
  )
}
