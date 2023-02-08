import styled from '@emotion/styled'
import { Button, HeadingLabel, mq, NeArrow, Space, theme } from 'ui'
import { InsuranceDocument } from '@/services/apollo/generated'

type Props = {
  heading: string
  docs: Array<InsuranceDocument>
}

export const ProductDocuments = ({ heading, docs }: Props) => {
  return (
    <ProductDocumentsWrapper>
      <Space y={1}>
        <HeadingLabel>{heading}</HeadingLabel>
        {docs.map((doc, index) => (
          <ProductDocument key={index} doc={doc} />
        ))}
      </Space>
    </ProductDocumentsWrapper>
  )
}

const ProductDocument = ({ doc }: { doc: InsuranceDocument }) => {
  const documentType = doc.url.includes('.') ? doc.url.substring(doc.url.lastIndexOf('.') + 1) : ''

  return (
    <DownloadFileButton
      variant="secondary"
      href={doc.url}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Ellipsis>
        {doc.displayName} <DocumentType>{documentType}</DocumentType>
      </Ellipsis>

      <StyledNeArrow size="1rem" />
    </DownloadFileButton>
  )
}

const ProductDocumentsWrapper = styled.div({
  padding: theme.space.md,

  [mq.lg]: {
    maxWidth: '32rem',
  },
})

const DownloadFileButton = styled(Button)({
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.space.md,
  // Counter the padding from the "DocumentType"
  paddingTop: theme.space.xs,
  height: 'auto',
  fontSize: theme.fontSizes.xl,
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
