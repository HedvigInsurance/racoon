import styled from '@emotion/styled'
import { Heading, Space } from 'ui'
import { Pillow } from '@/components/Pillow/Pillow'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'

export type ProductSummaryProps = {
  title: string
  children: React.ReactNode
  gradient: readonly [string, string]
}

export const ProductSummary = ({
  title,
  children,
  gradient: [fromColor, toColor],
}: ProductSummaryProps) => {
  return (
    <Space y={1}>
      <SpaceFlex space={1} align="center" direction="vertical">
        <Pillow size="xlarge" fromColor={fromColor} toColor={toColor} />
        <div>
          <Heading as="h2" variant="standard.20">
            {title}
          </Heading>
        </div>
      </SpaceFlex>
      {typeof children === 'string' ? <GrayText>{children}</GrayText> : children}
    </Space>
  )
}

const GrayText = styled.p(({ theme }) => ({
  fontSize: theme.fontSizes[2],
  textAlign: 'center',
  color: theme.colors.gray600,
}))
