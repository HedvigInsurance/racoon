import styled from '@emotion/styled'
import { Card, CardContent } from 'ui/src/components/Card/Card'
import { getColor, HeadingLabel, mq, Space, Text, theme } from 'ui'
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
    <DocumentCard>
      <a href={doc.url} target="_blank" rel="noopener noreferrer">
        <CardContent>
          <Text size="sm">
            {doc.displayName} <DocumentType>{documentType}</DocumentType>
          </Text>
        </CardContent>
      </a>
    </DocumentCard>
  )
}

const ProductDocumentsWrapper = styled.div({
  paddingInline: theme.space[4],
  marginBlock: theme.space[4],

  [mq.lg]: {
    maxWidth: '32rem',
  },
})

// TODO: Add hover style to Card or LinkCard component
// TODO: Provide default card background in app theme
const DocumentCard = styled(Card)({
  backgroundColor: getColor('gray200'),
})

const DocumentType = styled.sup({
  fontVariant: 'small-caps',
  verticalAlign: 'super',
})
