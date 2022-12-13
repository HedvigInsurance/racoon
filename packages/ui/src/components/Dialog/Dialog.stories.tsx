import styled from '@emotion/styled'
import { Meta, Story } from '@storybook/react'
import { useState } from 'react'
import { Heading } from '../Heading/Heading'
import { Space } from '../Space'
import * as Dialog from './Dialog'

const storyMeta: Meta = {
  title: 'Dialog',
  parameters: {
    backgrounds: {
      default: 'gray100',
    },
  },
}

export default storyMeta

export const Default: Story = () => {
  const [open, setOpen] = useState(false)

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <button>Open Dialog</button>
      </Dialog.Trigger>
      <DialogContent>
        <Wrapper>
          <Space y={1}>
            <Heading as="h1">This is a sample dialog!</Heading>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. In nibh lacus, rutrum vitae
              quam ut, elementum elementum nunc.
            </p>
            <Footer>
              <button onClick={() => setOpen(false)}>Close</button>
            </Footer>
          </Space>
        </Wrapper>
      </DialogContent>
    </Dialog.Root>
  )
}

const DialogContent = styled(Dialog.Content)({
  display: 'grid',
  placeItems: 'center',
})

const Wrapper = styled.div({
  width: 'min(400rem / 16, 80vw)',
  marginInline: 'auto',
  backgroundColor: 'white',
  paddingBlock: '16px',
  paddingInline: '24px',
  borderRadius: '8px',
  boxShadow: '0 0 4px rgba(0 0 0 0.6)',
})

const Footer = styled.footer({
  display: 'flex',
  justifyContent: 'flex-end',
})
