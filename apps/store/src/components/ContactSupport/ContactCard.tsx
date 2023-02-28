import styled from '@emotion/styled'
import { Space, theme } from 'ui'
import { Message } from '../Animations/Message/Message'
import { NumberPad } from '../Animations/NumberPad/NumberPad'

export const IconOptions = {
  Message: 'message',
  NumberPad: 'numberPad',
} as const

type ContactCardProps = {
  icon: (typeof IconOptions)[keyof typeof IconOptions]
  children: React.ReactNode
}

export const ContactCard = ({ icon, children }: ContactCardProps) => {
  const IconComponent = {
    message: Message,
    numberPad: NumberPad,
  }[icon]

  return (
    <Card>
      <Space y={1.5}>
        <IconComponent />
        <div>{children}</div>
      </Space>
    </Card>
  )
}

const Card = styled.div({
  backgroundColor: theme.colors.gray100,
  borderRadius: theme.radius.md,
  boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.15)',
  padding: `${theme.space.xl} ${theme.space.sm}`,
  backdropFilter: 'blur(20px)',

  '@media (hover: hover)': {
    ':hover': { backgroundColor: theme.colors.gray200 },
  },
})
