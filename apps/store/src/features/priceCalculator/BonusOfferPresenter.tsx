import { Text, yStack } from 'ui'
import { ButtonNextLink } from '@/components/ButtonNextLink'
import { Skeleton } from '@/components/Skeleton/Skeleton'
import { useRoutingLocale } from '@/utils/l10n/useRoutingLocale'
import { PageLink } from '@/utils/PageLink'

export function BonusOfferPresenter() {
  const locale = useRoutingLocale()

  // WIP: display bonus offer cards
  return (
    <div className={yStack({ gap: 'xl' })}>
      <div>
        <Text size="xl">Lägg till fler försäkringar</Text>
        <Text size="xl" color="textSecondary">
          Få 20% rabatt under första året
        </Text>
      </div>

      <div className={yStack({ gap: 'md' })}>
        <Skeleton style={{ height: '300px' }} />
        <Skeleton style={{ height: '150px' }} />
        <ButtonNextLink href={PageLink.checkout({ locale })}>Go to checkout</ButtonNextLink>
      </div>
    </div>
  )
}
