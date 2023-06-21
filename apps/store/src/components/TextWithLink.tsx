import styled from '@emotion/styled'
import Link from 'next/link'
import { Text } from 'ui'
import { nestedLinkStyles } from './RichText/RichText.styles'

export const TextWithLink = (props: { children: string; href: string }) => {
  const [beforeLink, rest] = props.children.split('[[', 2)

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (rest === undefined) {
    return (
      <Text size="xs" align="center" balance={true}>
        {props.children}
      </Text>
    )
  }

  const [linkText, afterLink] = rest.split(']]', 2)

  return (
    <StyledTextWithLink size="xs" align="center" balance={true}>
      {beforeLink}
      <Link href={props.href}>{linkText}</Link>
      {afterLink}
    </StyledTextWithLink>
  )
}

const StyledTextWithLink = styled(Text)(nestedLinkStyles)
