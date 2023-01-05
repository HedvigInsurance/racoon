import { useTranslation } from 'next-i18next'
import { Button, Text } from 'ui'
import * as FullscreenDialog from '@/components/FullscreenDialog/FullscreenDialog'
import { Pillow } from '@/components/Pillow/Pillow'
import { useFormatter } from '@/utils/useFormatter'
import { CartEntry } from './CartInventory.types'
import * as DetailsSheet from './DetailsSheet'

// TODO: placeholder data
const ROWS = [
  { label: 'Start date', value: '13 dec. 2023' },
  { label: 'Address', value: 'Kungsholmsvägen 12' },
  { label: 'Postal code', value: '113 59' },
] as const

type Props = CartEntry & {
  children: React.ReactNode
}

export const DetailsSheetDialog = ({ children, pillow, title, cost, documents }: Props) => {
  const { t } = useTranslation('cart')
  const formatter = useFormatter()

  return (
    <FullscreenDialog.Root>
      {children}

      <FullscreenDialog.Modal
        Footer={
          <FullscreenDialog.Close asChild>
            <Button type="button">{t('DETAILS_SHEET_DISMISS_BUTTON')}</Button>
          </FullscreenDialog.Close>
        }
      >
        <DetailsSheet.Root>
          <DetailsSheet.Header>
            <Pillow size="large" {...pillow} />
            <div>
              <Text size="lg" align="center">
                {title}
              </Text>
              <Text size="lg" color="textSecondary" align="center">
                {formatter.monthlyPrice(cost)}
              </Text>
            </div>
          </DetailsSheet.Header>
          <DetailsSheet.Main>
            <DetailsSheet.Table>
              {ROWS.map((item) => (
                <DetailsSheet.Row key={item.label}>
                  <Text size="lg" color="textSecondary">
                    {item.label}
                  </Text>
                  <Text size="lg">{item.value}</Text>
                </DetailsSheet.Row>
              ))}
            </DetailsSheet.Table>

            <DetailsSheet.HorizontalList>
              {documents.map((item) => (
                <Button
                  key={item.url}
                  size="small"
                  variant="secondary"
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.displayName}
                </Button>
              ))}
            </DetailsSheet.HorizontalList>
          </DetailsSheet.Main>
        </DetailsSheet.Root>
      </FullscreenDialog.Modal>
    </FullscreenDialog.Root>
  )
}
