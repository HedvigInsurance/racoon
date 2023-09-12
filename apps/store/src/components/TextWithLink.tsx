import styled from '@emotion/styled'
import Link from 'next/link'
import { type ComponentProps } from 'react'
import { Text } from 'ui'
import { nestedLinkStyles } from './RichText/RichText.styles'

type Props = ComponentProps<typeof Text> & ComponentProps<typeof Link> & { children: string }

export const TextWithLink = ({ children, href, target, ...otherProps }: Props) => {
  const [beforeLink, rest] = children.split('[[', 2)

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (rest === undefined) {
    return <Text {...otherProps}>{children}</Text>
  }

  const [linkText, afterLink] = rest.split(']]', 2)

  return (
    <StyledTextWithLink {...otherProps}>
      {beforeLink}
      <Link href={href} target={target}>
        {linkText}
      </Link>
      {afterLink}
    </StyledTextWithLink>
  )
}

const StyledTextWithLink = styled(Text)(nestedLinkStyles)
