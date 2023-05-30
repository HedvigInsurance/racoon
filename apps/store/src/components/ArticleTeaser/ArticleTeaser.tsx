import styled from '@emotion/styled'
import Link from 'next/link'
import { type ReactNode } from 'react'
import { Badge, Heading, Space, Text } from 'ui'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'

const Root = (props: { children: ReactNode }) => {
  return <RelativeSpace y={1}>{props.children}</RelativeSpace>
}

const RelativeSpace = styled(Space)({
  position: 'relative',
})

const Header = (props: { children: ReactNode }) => {
  return <Space y={0.25}>{props.children}</Space>
}

const Date = (props: { children: ReactNode }) => {
  return (
    <Text size="sm" color="textSecondary">
      {props.children}
    </Text>
  )
}

type ContentProps = {
  children: ReactNode
  title: string
  href: string
}

const Content = (props: ContentProps) => {
  return (
    <div>
      <ExtendedLink href={props.href}>
        <Heading as="h3" variant="standard.20">
          {props.title}
        </Heading>
      </ExtendedLink>
      <ClampedText size="lg" color="textSecondary">
        {props.children}
      </ClampedText>
    </div>
  )
}

const ExtendedLink = styled(Link)({
  // Make the whole teaser clickable
  '&::after': {
    content: '""',
    position: 'absolute',
    inset: 0,
  },
})

const ClampedText = styled(Text)({
  display: '-webkit-box',
  WebkitLineClamp: 3,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
})

const BadgeList = (props: { children: ReactNode }) => {
  return <SpaceFlex space={0.25}>{props.children}</SpaceFlex>
}

export const ArticleTeaser = {
  Root,
  Header,
  Date,
  Content,
  BadgeList,
  Badge,
} as const
