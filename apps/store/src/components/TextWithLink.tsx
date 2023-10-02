import styled from '@emotion/styled'
import Link from 'next/link'
import { type ComponentProps } from 'react'
import { Text } from 'ui'
import { nestedLinkStyles } from './RichText/RichText.styles'

type WithLinkProps = Pick<ComponentProps<typeof Link>, 'href' | 'target'> & { children: string }

type Props = WithLinkProps & ComponentProps<typeof Text>

export const TextWithLink = ({ children, href, target, ...otherProps }: Props) => {
  return (
    <Text {...otherProps}>
      <WithLink href={href} target={target}>
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

  return (
    <NestedLink>
      {beforeLink}
      <Link href={props.href} target={props.target}>
        {linkText}
      </Link>
      {afterLink}
    </NestedLink>
  )
}

const NestedLink = styled.span(nestedLinkStyles)
