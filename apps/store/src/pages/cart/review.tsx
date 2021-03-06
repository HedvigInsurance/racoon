import type { NextPageWithLayout } from 'next'
import { Button } from 'ui'
import { LayoutWithMenu } from '@/components/LayoutWithMenu/LayoutWithMenu'
import { useCurrentLocale } from '@/lib/l10n/useCurrentLocale'
import { PageLink } from '@/lib/PageLink'

const NextCartReviewPage: NextPageWithLayout = () => {
  const { apiMarket, locale } = useCurrentLocale()

  return (
    <div>
      <form method="post" action={PageLink.apiCheckoutCreate()}>
        <input type="hidden" name="market" value={apiMarket} />
        <input type="hidden" name="locale" value={locale} />
        <Button>Continue to personal details</Button>
      </form>
    </div>
  )
}

NextCartReviewPage.getLayout = (children) => <LayoutWithMenu>{children}</LayoutWithMenu>

export default NextCartReviewPage
