import styled from '@emotion/styled'
import { theme } from 'ui'
import { Ticker, TickerItem } from '@/components/Ticker/Ticker'
import { type SbBaseBlockProps } from '@/services/storyblok/storyblok'

type Props = SbBaseBlockProps<{
  topMargin: boolean
  uspText?: string
}>

const TickerBlock = (props: Props) => {
  const uspList = props.blok.uspText?.split('\n') ?? []

  return (
    <>
      {props.blok.topMargin && <Spacer />}
      <Ticker>
        {uspList.map((item, index) => (
          <TickerItem key={index}>{item}</TickerItem>
        ))}
      </Ticker>
    </>
  )
}
TickerBlock.blockName = 'ticker'

const Spacer = styled.div({ height: theme.space.xs })

export default TickerBlock