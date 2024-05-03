import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { Heading, Text, theme } from 'ui'
import { useIsEmbedded } from '@/utils/useIsEmbedded'
import { PDFViewer } from '../PDFViewer'

type Props = {
  items: Array<{ title: string; value: string }>
  documents: Array<{ title: string; url: string }>
  className?: string
}

export const ProductDetails = ({ items, documents, ...props }: Props) => {
  const { t } = useTranslation('cart')
  const isEmbedded = useIsEmbedded()

  return (
    <Wrapper {...props}>
      <ul>
        {items.map(({ title, value }) => (
          <ListItem key={title}>
            <Text as="p" color="textTranslucentSecondary">
              {title}
            </Text>
            <Text as="p" color="textTranslucentSecondary">
              {value}
            </Text>
          </ListItem>
        ))}
      </ul>

      <Heading as="h4" variant="standard.18" color="textTranslucentPrimary">
        {t('DOCUMENTS')}
      </Heading>

      <ul>
        {documents.map(({ title, url }) => (
          <li key={title}>
            {isEmbedded ? (
              <PDFViewer url={url}>
                <DocumentLink as="button">
                  {title}
                  <Sup> PDF</Sup>
                </DocumentLink>
              </PDFViewer>
            ) : (
              <DocumentLink href={url} target="_blank" rel="noopener noreferrer">
                {title}
                <Sup> PDF</Sup>
              </DocumentLink>
            )}
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

const DocumentLink = styled.a({
  fontFamily: theme.fonts.standard,
  fontSize: theme.fontSizes.md,
  lineHeight: '1.6',
  color: theme.colors.textTranslucentSecondary,

  '&:hover': { color: theme.colors.textTranslucentPrimary },
  '&:focus-visible': {
    boxShadow: theme.shadow.focus,
    borderRadius: theme.space.xxs,
  },
})

const Sup = styled.sup({
  verticalAlign: 'super',
  fontSize: '70%',
  lineHeight: 1,
})
