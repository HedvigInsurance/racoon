import styled from '@emotion/styled'
import { mq, NeArrow, theme } from 'ui'

type Props = {
  url: string
  displayName: string
}

export const InsuranceDocumentLink = ({ url, displayName }: Props) => {
  const extension = getExtensionFromUrl(url)

  return (
    <DownloadFileLink href={url} target="_blank" rel="noopener nofollow">
      <Ellipsis>
        {displayName} <DocumentType>{extension}</DocumentType>
      </Ellipsis>

      <StyledNeArrow size="1rem" />
    </DownloadFileLink>
  )
}
const getExtensionFromUrl = (urlString: string): string => {
  try {
    const url = new URL(urlString)
    if (url.pathname.includes('.')) {
      return url.pathname.split('.').at(-1)!
    }
    return ''
  } catch (err) {
    console.warn(`Failed to parse url: ${urlString}`)
    return ''
  }
}

const DownloadFileLink = styled.a({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.space.md,
  // Counter the padding from the "DocumentType"
  paddingTop: theme.space.xs,
  height: 'auto',
  fontSize: theme.fontSizes.md,
  backgroundColor: theme.colors.opaque1,
  borderRadius: theme.radius.sm,

  ':hover': {
    backgroundColor: theme.colors.gray200,
  },

  ':active': {
    backgroundColor: theme.colors.opaque3,
  },

  ':focus-visible': {
    boxShadow: theme.shadow.focus,
  },

  [mq.lg]: {
    fontSize: theme.fontSizes.lg,
  },
})

const Ellipsis = styled.span({
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
})

const DocumentType = styled.sup({
  fontVariant: 'small-caps',
  verticalAlign: 'super',
})

const StyledNeArrow = styled(NeArrow)({
  flexShrink: 0,
  position: 'relative',
  top: theme.space.xxs,
})