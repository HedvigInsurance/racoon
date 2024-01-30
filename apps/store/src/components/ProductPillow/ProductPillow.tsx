import Link from 'next/link'
import React from 'react'
import { Text } from 'ui'
import { Pillow } from '@/components/Pillow/Pillow'
import { link, pillow } from './ProductPillow.css'

export type ProductPillowProps = {
  name: string
  label?: string
  image?: string
  url: string
}

export const ProductPillow = ({ name, image, url }: ProductPillowProps) => {
  return (
    <Link href={url} className={link}>
      <Pillow src={image} size="large" className={pillow} />
      <Text as="span" size="md">
        {name}
      </Text>
    </Link>
  )
}
