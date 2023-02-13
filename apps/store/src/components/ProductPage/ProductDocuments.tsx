import styled from '@emotion/styled'
import { mq, NeArrow, Space, Text, theme } from 'ui'
import { GridLayout, TEXT_CONTENT_MAX_WIDTH } from '@/components/GridLayout/GridLayout'
import { InsuranceDocument } from '@/services/apollo/generated'

type Props = {
  heading: string
  description: string
  docs: Array<InsuranceDocument>
}

export const ProductDocuments = ({ heading, description, docs }: Props) => {
  return (
    <Layout>
      <GridLayout.Content width="1/2" align="left">
        <Content>
          <Text size={{ _: 'xl', lg: 'xxl' }}>{heading}</Text>
          <Text size={{ _: 'xl', lg: 'xxl' }} color="textSecondary">
            {description}
          </Text>
        </Content>
      </GridLayout.Content>
      <GridLayout.Content width="1/2" align="right">
        <Space y={{ base: 0.25, lg: 0.5 }}>
          {docs.map((doc, index) => (
            <ProductDocument key={index} doc={doc} />
          ))}
        </Space>
      </GridLayout.Content>
    </Layout>
  )
}

const ProductDocument = ({ doc }: { doc: InsuranceDocument }) => {
  const documentType = doc.url.includes('.') ? doc.url.substring(doc.url.lastIndexOf('.') + 1) : ''

  return (
    <DownloadFileLink href={doc.url} target="_blank" rel="noopener nofollow">
      <Ellipsis>
        {doc.displayName} <DocumentType>{documentType}</DocumentType>
      </Ellipsis>

      <StyledNeArrow size="1rem" />
    </DownloadFileLink>
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
    boxShadow: `0 0 0 1px ${theme.colors.textPrimary}`,
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
