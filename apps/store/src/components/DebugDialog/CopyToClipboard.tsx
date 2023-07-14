'use client'

import styled from '@emotion/styled'
import { useEffect, useState } from 'react'
import { CheckIcon, Text, theme } from 'ui'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'

export const CopyToClipboard = (props: { children: string }) => {
  const [copied, setCopied] = useState(false)

  const copy = () => {
    navigator.clipboard.writeText(props.children)
    setCopied(true)
  }

  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => {
        setCopied(false)
      }, 5000)

      return () => clearTimeout(timeout)
    }
  }, [copied])

  return (
    <CopyToClipboardWrapper>
      <Elipsis as="p" size="sm">
        {props.children}
      </Elipsis>
      <CopyToClipboardButton onClick={copy}>
        {copied ? (
          <SpaceFlex align="center" space={0.5}>
            <CheckIcon size="1em" />
            Copied
          </SpaceFlex>
        ) : (
          'Copy'
        )}
      </CopyToClipboardButton>
    </CopyToClipboardWrapper>
  )
}

const CopyToClipboardWrapper = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.space.lg,

  backgroundColor: theme.colors.gray100,
  padding: theme.space.xs,
  borderRadius: theme.radius.xs,
  border: `1px solid ${theme.colors.gray300}`,

  '@media (hover: hover)': {
    '&:hover': {
      backgroundColor: theme.colors.gray200,
    },
  },
})

const Elipsis = styled(Text)({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

const CopyToClipboardButton = styled.button({
  cursor: 'pointer',
  flexShrink: 0,
})
