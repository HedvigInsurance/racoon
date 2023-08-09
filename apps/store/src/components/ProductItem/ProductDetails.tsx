import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { Heading, Text, theme } from 'ui'

type Props = {
  items: Array<{ title: string; value: string }>
  documents: Array<{ title: string; url: string }>
}

export const ProductDetails = ({ items, documents, ...props }: Props) => {
  const { t } = useTranslation('cart')

  return (
    <Wrapper {...props}>
      <ul>
        {items.map(({ title, value }) => (
          <ListItem key={title}>
            <Text as="p" color="textSecondary">
              {title}
            </Text>
            <Text as="p" color="textSecondary">
              {value}
            </Text>
          </ListItem>
        ))}
      </ul>

      <Heading as="h4" variant="standard.18">
        {t('DOCUMENTS')}
      </Heading>

      <ul>
        {documents.map(({ title, url }) => (
          <li key={title}>
            <a href={url} target="_blank" rel="noopener noreferrer">
              <DocumentLink color="textSecondary">
                {title}
                <Sup> PDF</Sup>
              </DocumentLink>
            </a>
          </li>
        ))}
      </ul>
    </Wrapper>
  )
}

const Wrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
  rowGap: theme.space.md,
})

const ListItem = styled.li({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
})

const DocumentLink = styled(Text)({
  lineHeight: '1.6',
  '&:hover': {
    color: theme.colors.textTranslucentPrimary,
  },
})

const Sup = styled.sup({
  verticalAlign: 'super',
  fontSize: '70%',
  lineHeight: 1,
})
