import styled from '@emotion/styled'
import type { Meta, StoryFn } from '@storybook/react'
import { useCallback } from 'react'
import { Heading } from '../components/Heading/Heading'
import { Space } from '../components/Space'
import { theme } from '../theme'
import { AndroidIcon } from './AndroidIcon'
import { AppleIcon } from './AppleIcon'
import { ArrowForwardIcon } from './ArrowIcon'
import { BankIdIcon } from './BankIdIcon'
import { CheckIcon } from './CheckIcon'
import { ChevronIcon } from './Chevron'
import { CrossIcon } from './CrossIcon'
import { CrossIconSmall } from './CrossIconSmall'
import { InfoIcon } from './InfoIcon'
import { LockIcon } from './LockIcon'
import { MailIcon } from './MailIcon'
import { MinusIcon } from './MinusIcon'
import { NeArrow } from './NeArrow'
import { PauseIcon } from './PauseIcon'
import { PhoneIcon } from './PhoneIcon'
import { PlayIcon } from './PlayIcon'
import { PlusIcon } from './PlusIcon'
import { RestartIcon } from './RestartIcon'
import { RoundCheckIcon } from './RoundCheckIcon'
import { StarIcon } from './StarIcon'
import { WarningTriangleIcon } from './WarningTriangleIcon'

const AllIcons = {
  AndroidIcon,
  AppleIcon,
  ArrowForwardIcon,
  BankIdIcon,
  CheckIcon,
  ChevronIcon,
  CrossIcon,
  CrossIconSmall,
  InfoIcon,
  LockIcon,
  MailIcon,
  MinusIcon,
  NeArrow,
  PauseIcon,
  PhoneIcon,
  PlayIcon,
  PlusIcon,
  RestartIcon,
  RoundCheckIcon,
  StarIcon,
  WarningTriangleIcon,
}

type IconProps = {
  icon: string
}
const Icon = ({ icon }: IconProps) => {
  const Component = AllIcons[icon as keyof typeof AllIcons]
  return <Component />
}

const meta: Meta<typeof Icon> = {
  title: 'Icons',
  component: Icon,
}
export default meta

const AllIconNames = Object.keys(AllIcons)

const Template: StoryFn<typeof Icon> = () => {
  const updateClipboard = useCallback(async (newClip: string) => {
    try {
      await window.navigator.clipboard.writeText(newClip).catch((e) => console.warn(e))
      console.log(`Copied ${newClip} to clipboard`)
    } catch (error) {
      console.warn(error)
    }
  }, [])

  return (
    <Page>
      <Space y={1}>
        <Heading as="h1">Icons</Heading>
        <IconGrid>
          {AllIconNames.map((icon) => (
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            <IconWrapper key={icon} onClick={() => updateClipboard(icon)}>
              <Icon icon={icon} />
              <IconName>{icon}</IconName>
            </IconWrapper>
          ))}
        </IconGrid>
      </Space>
    </Page>
  )
}

export const Icons = {
  render: Template,
}

const Page = styled.div({
  height: '100vh',
})

const IconWrapper = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  width: 216,
  height: 150,
  padding: '1rem',
  overflow: 'hidden',
  backgroundColor: theme.colors.white,
  borderRadius: theme.radius.md,
  boxShadow: theme.shadow.default,
  border: '1px solid hsla(0, 0%, 0%, 0.1)',
  ':hover': {
    cursor: 'pointer',
  },
  ':active': { backgroundColor: theme.colors.green50 },
  ' svg': { border: 'dotted 1px green' },
})

const IconGrid = styled.div({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '2rem 1rem',
  marginBottom: '3rem',
})

const IconName = styled.div({
  paddingTop: '1rem',
})
