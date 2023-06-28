import styled from '@emotion/styled'
import { Heading, Space, Text } from 'ui'
import { Pillow as BasePillow } from '@/components/Pillow/Pillow'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'

type Props = {
  name: string
  description: string
  pillow: { src: string; alt?: string }
  size: 'small' | 'large'
}

export const ProductHero = (props: Props) => {
  return (
    <SpaceFlex space={1} direction="vertical" align="center">
      <CenteredPillow size={props.size === 'small' ? 'large' : 'xxlarge'} {...props.pillow} />

      <Space y={0.75}>
        <Heading as="h1" variant="standard.24" align="center">
          {props.name}
        </Heading>
        <Text size="xs" color="textSecondary" align="center">
          {props.description}
        </Text>
      </Space>
    </SpaceFlex>
  )
}

const CenteredPillow = styled(BasePillow)({ marginInline: 'auto' })
