import styled from '@emotion/styled'
import Link from 'next/link'
import { type ComponentProps } from 'react'
import { Text } from 'ui'
import { getLinkRel } from '@/services/storyblok/Storyblok.helpers'
import { nestedLinkStyles } from './RichText/RichText.styles'

type WithLinkProps = Pick<ComponentProps<typeof Link>, 'href' | 'target' | 'rel'> & {
  children: string
}

type Props = WithLinkProps & ComponentProps<typeof Text>

export const TextWithLink = ({ children, href, target, rel, ...otherProps }: Props) => {
  return (
    <Text {...otherProps}>
      <WithLink href={href} target={target} rel={rel}>
        {children}
      </WithLink>
    </Text>
  )
}

export const WithLink = (props: WithLinkProps) => {
  const [beforeLink, rest] = props.children.split('[[', 2)

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (rest === undefined) return <>props.children</>

  const [linkText, afterLink] = rest.split(']]', 2)

  const rel = getLinkRel(props)

  return (
    <NestedLink>
      {beforeLink}
      <Link href={props.href} target={props.target} rel={rel}>
        {linkText}
      </Link>
      {afterLink}
    </NestedLink>
  )
}

const NestedLink = styled.span(nestedLinkStyles)
