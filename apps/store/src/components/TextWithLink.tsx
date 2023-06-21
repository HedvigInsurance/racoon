import styled from '@emotion/styled'
import Link from 'next/link'
import { Text } from 'ui'
import { nestedLinkStyles } from './RichText/RichText.styles'

type Props = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string
  children: string
}

export const TextWithLink = ({ children, ...linkProps }: Props) => {
  const [beforeLink, rest] = children.split('[[', 2)

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (rest === undefined) {
    return (
      <Text size="xs" align="center" balance={true}>
        {children}
      </Text>
    )
  }

  const [linkText, afterLink] = rest.split(']]', 2)

  return (
    <StyledTextWithLink size="xs" align="center" balance={true}>
      {beforeLink}
      <Link {...linkProps}>{linkText}</Link>
      {afterLink}
    </StyledTextWithLink>
  )
}

const StyledTextWithLink = styled(Text)(nestedLinkStyles)
