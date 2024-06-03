import { Heading, Text } from 'ui'
import { Pillow } from '@/components/Pillow/Pillow'
import { pillow, textWrapper, wrapper } from './ProductHero.css'

type Props = {
  name: string
  description: string
  pillow: { src: string; alt?: string }
  size: 'small' | 'large'
}

export const ProductHero = (props: Props) => {
  return (
    <div className={wrapper}>
      <Pillow
        className={pillow}
        size={props.size === 'small' ? 'large' : 'xxlarge'}
        {...props.pillow}
        priority={true}
      />

      <div className={textWrapper}>
        <Heading as="h1" variant="standard.24" align="center">
          {props.name}
        </Heading>
        <Text size="xs" color="textSecondary" align="center">
          {props.description}
        </Text>
      </div>
    </div>
  )
}
