import styled from '@emotion/styled'
import Link from 'next/link'
import React from 'react'
import { mq, Text, theme } from 'ui'
import { Pillow } from '@/components/Pillow/Pillow'

export type ProductPillowProps = {
  name: string
  label?: string
  image?: string
  url: string
}

export const ProductPillow = ({ name, image, url }: ProductPillowProps) => {
  return (
    <PillowLink href={url}>
      <StyledPillow src={image} size="large" />
      <Text as="span" size="md">
        {name}
      </Text>
    </PillowLink>
  )
}

const PillowLink = styled(Link)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.space.sm,
  padding: `${theme.space.sm} ${theme.space.md}`,
  borderRadius: theme.radius.sm,

  ':focus': {
    backgroundColor: theme.colors.grayTranslucent100,
  },
})

const StyledPillow = styled(Pillow)({
  [mq.lg]: {
    height: '6rem',
    width: '6rem',
  },
})
