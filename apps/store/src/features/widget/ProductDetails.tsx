import { clsx } from 'clsx'
import { useTranslation } from 'next-i18next'
import { Heading, Text } from 'ui'
import { PDFViewer } from '@/components/PDFViewer'
import { useIsEmbedded } from '@/utils/useIsEmbedded'
import { wrapper, listItem, documentLink, pdfSup } from './ProductDetails.css'

type Props = {
  items: Array<{ title: string; value: string }>
  documents: Array<{ title: string; url: string }>
  className?: string
}

export function ProductDetails({ items, documents, className, ...props }: Props) {
  const { t } = useTranslation('cart')
  const isEmbedded = useIsEmbedded()

  return (
    <div className={clsx(wrapper, className)} {...props}>
      <section>
        <Heading as="h4" variant="standard.18" color="textTranslucentPrimary">
          {t('DETAILS_SECTION_LABEL')}
        </Heading>
        <ul>
          {items.map(({ title, value }) => (
            <li key={title} className={listItem}>
              <Text as="p" color="textTranslucentSecondary">
                {title}
              </Text>
              <Text as="p" color="textTranslucentSecondary" align="right">
                {value}
              </Text>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <Heading as="h4" variant="standard.18" color="textTranslucentPrimary">
          {t('DOCUMENTS_SECTION_LABEL')}
        </Heading>
        <ul>
          {documents.map(({ title, url }) => (
            <li key={title}>
              {isEmbedded ? (
                <PDFViewer url={url}>
                  <button className={documentLink}>
                    {title}
                    <sup className={pdfSup}> PDF</sup>
                  </button>
                </PDFViewer>
              ) : (
                <a className={documentLink} href={url} target="_blank" rel="noopener noreferrer">
                  {title}
                  <sup className={pdfSup}> PDF</sup>
                </a>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
