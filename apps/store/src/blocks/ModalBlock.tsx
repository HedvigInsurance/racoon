'use client'
import styled from '@emotion/styled'
import type { SbBlokData } from '@storyblok/react'
import { StoryblokComponent, storyblokEditable } from '@storyblok/react'
import type { ComponentProps } from 'react'
import { useState } from 'react'
import { Button } from 'ui/src/components/Button/Button'
import { FullscreenDialog } from 'ui/src/components/Dialog/FullscreenDialog'
import { theme, visuallyHidden } from 'ui'
import type { SbBaseBlockProps } from '@/services/storyblok/storyblok'

export type ModalBlockProps = SbBaseBlockProps<{
  buttonText: string
  buttonVariant?: ComponentProps<typeof Button>['variant']
  buttonSize?: ComponentProps<typeof Button>['size']
  modalContent: Array<SbBlokData>
}>

export const ModalBlock = ({ blok }: ModalBlockProps) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Wrapper {...storyblokEditable(blok)}>
      <FullscreenDialog.Root open={isOpen} onOpenChange={setIsOpen}>
        <FullscreenDialog.Trigger asChild>
          <Button variant={blok.buttonVariant ?? 'primary'} size={blok.buttonSize ?? 'medium'}>
            {blok.buttonText}
          </Button>
        </FullscreenDialog.Trigger>

        <FullscreenDialog.Modal>
          <FullscreenDialog.Title className={visuallyHidden} />
          {blok.modalContent.map((nestedBlock) => (
            <StoryblokComponent key={nestedBlock._uid} blok={nestedBlock} nested={true} />
          ))}
        </FullscreenDialog.Modal>
      </FullscreenDialog.Root>
    </Wrapper>
  )
}

const Wrapper = styled.div({
  display: 'flex',
  justifyContent: 'center',
  paddingLeft: theme.space.md,
  paddingRight: theme.space.md,
})
