import styled from '@emotion/styled'
import type { ReactNode } from 'react'
import { Dialog } from 'ui/src/components/Dialog/Dialog'
import { CrossIcon } from 'ui/src/icons/CrossIcon'
import { theme } from 'ui'

type Props = {
  url: string
  children: ReactNode
}

export const PDFViewer = (props: Props) => {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild={true}>{props.children}</Dialog.Trigger>
      <DialogContent>
        <DialogClose>
          <CrossIcon />
        </DialogClose>
        <Iframe src={`/pdfjs/web/viewer.html?file=${props.url}`} />
      </DialogContent>
    </Dialog.Root>
  )
}

const DialogContent = styled(Dialog.Content)({
  height: `calc(100% - ${theme.space.md})`,
  marginTop: theme.space.md,
  boxShadow: 'rgba(0, 0, 0, 0.06) 0px 2px 12px',
  maxWidth: '1024px',
  marginInline: 'auto',
})

const DialogClose = styled(Dialog.Close)({
  width: '100%',
  paddingInline: theme.space.lg,
  backgroundColor: theme.colors.opaque1,
  borderTopLeftRadius: theme.radius.md,
  borderTopRightRadius: theme.radius.md,
  height: '3rem',
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
})

const Iframe = styled.iframe({
  width: '100%',
  height: '100%',
  border: 0,
})
