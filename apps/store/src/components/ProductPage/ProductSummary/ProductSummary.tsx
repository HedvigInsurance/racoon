import styled from '@emotion/styled'
import { Heading, Space } from 'ui'
import { Pillow } from '@/components/Pillow/Pillow'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'

const STAR_SYMBOL = '★'

export type ProductSummaryProps = {
  title: string
  starScore: number
  children: React.ReactNode
  gradient: readonly [string, string]
}

export const ProductSummary = ({
  title,
  starScore,
  children,
  gradient: [fromColor, toColor],
}: ProductSummaryProps) => {
  return (
    <Space y={1}>
      <SpaceFlex space={1} align="center">
        <Pillow size="small" fromColor={fromColor} toColor={toColor} />
        <div>
          <Heading as="h2" variant="standard.20">
            {title}
          </Heading>
          <SmallGrayText>
            {STAR_SYMBOL} {starScore}/5
          </SmallGrayText>
        </div>
      </SpaceFlex>
      {typeof children === 'string' ? <GrayText>{children}</GrayText> : children}
    </Space>
  )
}

const SmallGrayText = styled.p(({ theme }) => ({
  fontSize: theme.fontSizes[1],
  color: theme.colors.gray600,
}))

const GrayText = styled.p(({ theme }) => ({
  fontSize: theme.fontSizes[2],
  color: theme.colors.gray600,
}))
