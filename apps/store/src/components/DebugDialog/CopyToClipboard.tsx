'use client'

import styled from '@emotion/styled'
import { useEffect, useState } from 'react'
import { Text, theme, useHighlightAnimation } from 'ui'

export const CopyToClipboard = (props: { label: string; children: string }) => {
  const { highlight, animationProps } = useHighlightAnimation<HTMLButtonElement>()
  const [copied, setCopied] = useState(false)

  const copy = () => {
    navigator.clipboard.writeText(props.children)
    setCopied(true)
    highlight()
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
    <CopyToClipboardWrapper type="button" onClick={copy} {...animationProps}>
      <SlimText as="p" size="sm" color="textSecondaryOnGray">
        {props.label}
      </SlimText>

      <Elipsis as="p" size="lg">
        {props.children}
      </Elipsis>
    </CopyToClipboardWrapper>
  )
}

const CopyToClipboardWrapper = styled.button({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  height: '3.25rem',
  width: '100%',

  borderRadius: theme.radius.sm,
  backgroundColor: theme.colors.translucent1,
  paddingInline: theme.space.md,

  '@media (hover: hover)': {
    cursor: 'pointer',

    '&:hover': {
      backgroundColor: theme.colors.translucent2,
    },
  },
})

const Elipsis = styled(Text)({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

const SlimText = styled(Text)({ lineHeight: 1 })
