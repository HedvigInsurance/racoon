import styled from '@emotion/styled'
import { Heading, mq, Space, Text, theme } from 'ui'
import { GridLayout, TEXT_CONTENT_MAX_WIDTH } from '@/components/GridLayout/GridLayout'
import { InsuranceDocumentLink } from '@/components/InsuranceDocumentLink'
import { InsuranceDocumentFragment } from '@/services/graphql/generated'

type Props = {
  heading: string
  description: string
  docs: Array<InsuranceDocumentFragment>
}

export const ProductDocuments = ({ heading, description, docs }: Props) => {
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
          {docs.map((doc, index) => (
            <InsuranceDocumentLink key={index} url={doc.url} displayName={doc.displayName} />
          ))}
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
