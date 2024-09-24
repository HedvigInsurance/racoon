import { useTranslation } from 'next-i18next'
import { SupText, Text } from 'ui'
import { PDFViewer } from '@/components/PDFViewer'
import { type ProductOfferFragment } from '@/services/graphql/generated'
import { useIsEmbedded } from '@/utils/useIsEmbedded'

type Props = {
  documents: ProductOfferFragment['variant']['documents']
}

export function CartItemProductDocuments({ documents }: Props) {
  const { t } = useTranslation('cart')

  const isEmbedded = useIsEmbedded()

  const productDocuments = documents.map((item) => ({
    title: item.displayName,
    url: item.url,
  }))

  return (
    <div>
      <Text size={{ _: 'body', sm: 'md' }}>{t('DOCUMENTS_SECTION_LABEL')}</Text>
      <ul>
        {productDocuments.map(({ title, url }) => (
          <li key={title}>
            {isEmbedded ? (
              <PDFViewer url={url}>
                <button>
                  <Text size={{ _: 'body', sm: 'md' }} as="span" color="textTranslucentSecondary">
                    {title}
                    <SupText>PDF</SupText>
                  </Text>
                </button>
              </PDFViewer>
            ) : (
              <a href={url} target="_blank" rel="noopener noreferrer">
                <Text size={{ _: 'body', sm: 'md' }} as="span" color="textTranslucentSecondary">
                  {title}
                  <SupText>PDF</SupText>
                </Text>
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
