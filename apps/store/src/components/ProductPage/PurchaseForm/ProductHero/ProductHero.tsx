'use client'
import { Heading, Text, yStack } from 'ui'
import { Pillow } from '@/components/Pillow/Pillow'
import { pillow } from './ProductHero.css'

type Props = {
  name: string
  description?: string
  pillow: { src: string; alt?: string | null }
  size: 'small' | 'large'
}

export function ProductHero(props: Props) {
  return (
    <div className={yStack({ gap: 'md' })}>
      <Pillow
        className={pillow}
        size={props.size === 'small' ? 'large' : 'xxlarge'}
        {...props.pillow}
        priority={true}
      />

      <div className={yStack({ gap: 'sm' })}>
        <Heading as="h1" variant="standard.24" align="center">
          {props.name}
        </Heading>
        {props.description && (
          <Text size="xs" color="textSecondary" align="center">
            {props.description}
          </Text>
        )}
      </div>
    </div>
  )
}
