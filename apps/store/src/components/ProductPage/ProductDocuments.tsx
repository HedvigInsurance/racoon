import styled from '@emotion/styled'
import { Heading, mq, Space, Text, theme } from 'ui'
import * as GridLayout from '@/components/GridLayout/GridLayout'
import { InsuranceDocumentLink } from '@/components/InsuranceDocumentLink'
import { type InsuranceDocumentFragment, InsuranceDocumentType } from '@/services/graphql/generated'
import { useTracking } from '@/services/Tracking/useTracking'
import { TEXT_CONTENT_MAX_WIDTH } from '../GridLayout/GridLayout.constants'
import { useProductData, useSelectedProductVariant } from '../ProductData/ProductDataProvider'

type Props = {
  heading: string
  description: string
  docs: Array<InsuranceDocumentFragment>
}

export const ProductDocuments = ({ heading, description, docs }: Props) => {
  const tracking = useTracking()
  const selectedVariant = useSelectedProductVariant()
  const productData = useProductData()

  return (
    <Layout>
      <GridLayout.Content width="1/2" align="left">
        <Content>
          <Heading as="h2" variant={{ _: 'standard.24', lg: 'standard.32' }}>
            {heading}
          </Heading>
          <Text size={{ _: 'xl', lg: 'xxl' }} color="textSecondary">
            {description}
          </Text>
        </Content>
      </GridLayout.Content>
      <GridLayout.Content width="1/2" align="right">
        <Space y={{ base: 0.25, lg: 0.5 }}>
          {docs.map((doc, index) => {
            const handleClick = () => {
              if (doc.type === InsuranceDocumentType.TermsAndConditions) {
                let { typeOfContract } = selectedVariant ?? {}
                if (typeOfContract == null) {
                  if (productData.variants.length === 1) {
                    // Single tier products do not have `selectedVariant` in page state
                    typeOfContract = productData.variants[0].typeOfContract
                  } else {
                    console.error(
                      'Cannot report click on terms because selectedVariant is undefined. This should never happen',
                    )
                    return
                  }
                }
                tracking.reportClickTermsAndConditions(productData.name, typeOfContract)
              }
            }
            return (
              <InsuranceDocumentLink
                key={index}
                url={doc.url}
                displayName={doc.displayName}
                onClick={handleClick}
              />
            )
          })}
        </Space>
      </GridLayout.Content>
    </Layout>
  )
}

const Layout = styled(GridLayout.Root)({
  // TODO: harmonize with other grid layouts
  gap: theme.space.lg,
  [mq.lg]: {
    gap: theme.space.md,
    paddingInline: theme.space.lg,
  },
})

const Content = styled.div({
  maxWidth: TEXT_CONTENT_MAX_WIDTH,

  [mq.lg]: {
    paddingRight: theme.space.xl,
  },
})
