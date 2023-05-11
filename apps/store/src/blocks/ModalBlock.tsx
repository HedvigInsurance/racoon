import styled from '@emotion/styled'
import { SbBlokData, StoryblokComponent, storyblokEditable } from '@storyblok/react'
import { ComponentProps, useState } from 'react'
import { Button, theme } from 'ui'
import * as FullscreenDialog from '@/components/FullscreenDialog/FullscreenDialog'
import { SbBaseBlockProps } from '@/services/storyblok/storyblok'

export type ModalBlockProps = SbBaseBlockProps<{
  buttonText: string
  buttonVariant?: ComponentProps<typeof Button>['variant']
  buttonSize?: ComponentProps<typeof Button>['size']
  modalContent: SbBlokData[]
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

        <FullscreenDialog.Modal center={true}>
          {blok.modalContent.map((nestedBlock) => (
            <StoryblokComponent key={nestedBlock._uid} blok={nestedBlock} />
          ))}
        </FullscreenDialog.Modal>
      </FullscreenDialog.Root>
    </Wrapper>
  )
}

ModalBlock.blockName = 'modal'

const Wrapper = styled.div({
  display: 'flex',
  justifyContent: 'center',
  paddingLeft: theme.space.md,
  paddingRight: theme.space.md,
})
