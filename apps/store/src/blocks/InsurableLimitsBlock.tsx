import styled from '@emotion/styled'
import { InsurableLimits } from '@/components/InsurableLimits/InsurableLimits'
import { Statistic } from '@/components/Statistic/Statistic'
import { SbBaseBlockProps } from '@/services/storyblok/storyblok'
import { filterByBlockType } from '@/services/storyblok/Storyblok.helpers'

type InsurableLimitsBlockProps = SbBaseBlockProps<{
  items: Array<InsurableLimitBlockProps['blok']>
}>

const StyledInsurableLimits = styled(InsurableLimits)(({ theme }) => ({
  padding: theme.space[4],
}))

export const InsurableLimitsBlock = ({ blok }: InsurableLimitsBlockProps) => {
  const items = filterByBlockType(blok.items, InsurableLimitBlock.blockName)
  return (
    <StyledInsurableLimits>
      {items.map((nestedBlock) => (
        <InsurableLimitBlock key={nestedBlock._uid} blok={nestedBlock} />
      ))}
    </StyledInsurableLimits>
  )
}
InsurableLimitsBlock.blockName = 'insurableLimits'

type InsurableLimitBlockProps = SbBaseBlockProps<{
  label: string
  limit: string
}>
const InsurableLimitBlock = ({ blok }: InsurableLimitBlockProps) => {
  return <Statistic label={blok.label} value={blok.limit} />
}
InsurableLimitBlock.blockName = 'insurableLimit'
