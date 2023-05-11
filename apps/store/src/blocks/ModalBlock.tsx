import styled from '@emotion/styled'
import { SbBlokData, StoryblokComponent, storyblokEditable } from '@storyblok/react'
import { motion } from 'framer-motion'
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
          <AnimationWrapper
            initial={{ opacity: 0, y: '2vh' }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ...theme.transitions.framer.easeInOutCubic }}
          >
            {blok.modalContent.map((nestedBlock) => (
              <StoryblokComponent key={nestedBlock._uid} blok={nestedBlock} />
            ))}
          </AnimationWrapper>
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

const AnimationWrapper = styled(motion.div)({
  width: '100%',
})
