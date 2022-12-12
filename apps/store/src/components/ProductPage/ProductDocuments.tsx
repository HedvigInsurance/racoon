import styled from '@emotion/styled'
import { Card, CardContent } from 'ui/src/components/Card/Card'
import { Space } from 'ui'
import { getColor, HeadingLabel } from 'ui'
import { ProductData } from '@/components/ProductPage/ProductPage.types'
import { Text } from '@/components/Text/Text'
import { InsuranceDocument } from '@/services/apollo/generated'

type Props = {
  heading: string
  productData: ProductData
}

export const ProductDocuments = ({ heading, productData }: Props) => {
  if (productData.variants.length < 1) {
    console.warn('No product variants, hiding productDocuments')
    return null
  }
  return (
    <ProductDocumentsWrapper>
      <Space y={1}>
        <ProductDocumentsLabel>{heading}</ProductDocumentsLabel>
        {productData.variants.flatMap((variant) =>
          variant.documents.map((doc, i) => (
            <ProductDocument key={`${variant.typeOfContract}_${i}`} doc={doc} />
          )),
        )}
      </Space>
    </ProductDocumentsWrapper>
  )
}

const ProductDocument = ({ doc }: { doc: InsuranceDocument }) => {
  const documentType = doc.url.substring(doc.url.lastIndexOf('.') + 1)
  return (
    <DocumentCard>
      <a href={doc.url} target="_blank" rel="noopener noreferrer">
        <CardContent>
          <Text size="m">
            {doc.displayName} <DocumentType>{documentType}</DocumentType>
          </Text>
          <Text size="m" color="gray500">
            {doc.type}
          </Text>
        </CardContent>
      </a>
    </DocumentCard>
  )
}

const ProductDocumentsWrapper = styled.div(({ theme }) => ({
  paddingInline: theme.space[4],
  marginBlock: theme.space[4],
}))

const ProductDocumentsLabel = styled(HeadingLabel)({})

// TODO: Add hover style to Card or LinkCard component
const DocumentCard = styled(Card)({
  backgroundColor: getColor('gray200'),
})

const DocumentType = styled.sup({
  fontVariant: 'small-caps',
  verticalAlign: 'super',
})
