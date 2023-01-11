import styled from '@emotion/styled'
import type { Dispatch, SetStateAction } from 'react'
import { Dialog, CrossIcon, CheckIcon, theme, mq } from 'ui'

export type CoverageDialogProps = {
  open: boolean
  onOpenChange: Dispatch<SetStateAction<boolean>>
  title: string
  perils: Array<string>
}

export const CoverageDialog = ({ open, onOpenChange, title, perils }: CoverageDialogProps) => {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <Wrapper>
          <CloseButtonWrapper>
            <Dialog.Close asChild>
              <IconButton>
                <CrossIcon />
              </IconButton>
            </Dialog.Close>
          </CloseButtonWrapper>
          <Heading>{title}</Heading>
          <PerilsList>
            {perils.map((peril, index) => (
              <Peril key={index}>
                <span>{peril}</span>
                <CheckIcon color={theme.colors.gray500} />
              </Peril>
            ))}
          </PerilsList>
        </Wrapper>
      </DialogContent>
    </Dialog.Root>
  )
}

const DialogContent = styled(Dialog.Content)({
  display: 'grid',
  placeItems: 'center',
  height: '100%',
})

const Wrapper = styled.div(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  width: 'min(35rem, 80vw)',
  maxHeight: '60vh',
  marginInline: 'auto',
  backgroundColor: 'white',
  padding: theme.space[4],
  borderRadius: '8px',
  boxShadow: '0px 16px 40px rgba(0, 0, 0, 0.15)',
  [mq.sm]: {
    padding: theme.space[7],
  },
}))

const CloseButtonWrapper = styled.div(({ theme }) => ({
  position: 'absolute',
  top: theme.space[3],
  right: theme.space[4],
  [mq.sm]: {
    top: theme.space[4],
    right: theme.space[5],
  },
}))

const IconButton = styled.button({
  ':hover': {
    cursor: 'pointer',
  },
  ':focus-visible': {
    outline: '1px solid currentcolor',
  },
})

const Heading = styled.h1(({ theme }) => ({
  fontSize: theme.fontSizes[5],
  textAlign: 'center',
  marginBottom: theme.space[6],
}))

const PerilsList = styled.ul({
  flexGrow: 1,
  overflowY: 'auto',
})

const Peril = styled.li(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.space[2],
  paddingBlock: theme.space[3],
  paddingInlineEnd: theme.space[3],
  borderBottom: `1px solid ${theme.colors.gray300}`,
}))
