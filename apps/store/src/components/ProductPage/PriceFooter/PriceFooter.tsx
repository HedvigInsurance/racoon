import styled from '@emotion/styled'
import { Button, Separate, Space } from 'ui'

export type PriceFooterProps = {
  children: React.ReactNode
}

export const PriceFooter = ({ children }: PriceFooterProps) => {
  return (
    <Wrapper y={1}>
      <FlexButton fullWidth>
        <Separate Separator={<Separator />}>{children}</Separate>
      </FlexButton>
    </Wrapper>
  )
}

const Wrapper = styled(Space)(({ theme }) => ({
  backgroundColor: theme.colors.white,
  boxShadow: '0px -1px 1px rgba(0, 0, 0, 0.1), 0px -4px 8px rgba(0, 0, 0, 0.1)',
  padding: `${theme.space[3]} ${theme.space[4]}`,
}))

const FlexButton = styled(Button)(() => ({
  display: 'flex',
}))

const Separator = styled.div(({ theme }) => ({
  width: 1,
  backgroundColor: theme.colors.gray600,
  margin: `0 ${theme.space[3]}`,
  alignSelf: 'stretch',
}))
