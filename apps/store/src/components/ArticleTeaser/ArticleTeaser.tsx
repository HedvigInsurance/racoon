import styled from '@emotion/styled'
import NextImage, { type ImageProps } from 'next/image'
import Link from 'next/link'
import { type ReactNode } from 'react'
import { Badge, Heading, Space, Text, theme } from 'ui'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'

const Root = (props: { children: ReactNode }) => {
  return <RelativeSpace y={1}>{props.children}</RelativeSpace>
}

const RelativeSpace = styled(Space)({
  position: 'relative',
})

const RoundedImage = styled(NextImage)({ borderRadius: theme.radius.xl })
const Image = (props: ImageProps) => <RoundedImage {...props} />

type ContentProps = {
  children: ReactNode
  title: string
  href: string
  date: string
}

const Content = (props: ContentProps) => {
  return (
    <ContentWrapper>
      <Space y={0.25}>
        <Text size="sm" color="textSecondary">
          {props.date}
        </Text>
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
      </Space>
    </ContentWrapper>
  )
}

const ContentWrapper = styled.div({ paddingInline: theme.space.xs })

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
  return (
    <ContentWrapper>
      <SpaceFlex space={0.25}>{props.children}</SpaceFlex>
    </ContentWrapper>
  )
}

export const ArticleTeaser = {
  Root,
  Image,
  Content,
  BadgeList,
  Badge,
} as const
