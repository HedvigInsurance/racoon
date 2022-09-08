import styled from '@emotion/styled'
import { Button as UIButton, Separate, Space } from 'ui'

export type FooterProps = {
  children: React.ReactNode
}

export const Footer = ({ children }: FooterProps) => {
  return <Wrapper y={1}>{children}</Wrapper>
}

const Wrapper = styled(Space)(({ theme }) => ({
  backgroundColor: theme.colors.white,
  boxShadow: '0px -1px 1px rgba(0, 0, 0, 0.1), 0px -4px 8px rgba(0, 0, 0, 0.1)',
  padding: `${theme.space[3]} ${theme.space[4]}`,
  width: '100%',
}))

export type ButtonProps = {
  type?: 'button' | 'submit'
  children: React.ReactNode
  onClick: () => void
}

export const Button = ({ onClick, type = 'submit', children }: ButtonProps) => {
  return (
    <FlexButton fullWidth type={type} onClick={onClick}>
      <Separate Separator={<Separator />}>{children}</Separate>
    </FlexButton>
  )
}

const FlexButton = styled(UIButton)(() => ({
  display: 'flex',
}))

const Separator = styled.div(({ theme }) => ({
  width: 1,
  backgroundColor: theme.colors.gray600,
  margin: `0 ${theme.space[3]}`,
  alignSelf: 'stretch',
}))
