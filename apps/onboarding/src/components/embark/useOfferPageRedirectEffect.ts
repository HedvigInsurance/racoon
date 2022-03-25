import { ClientPassage, PassageElement } from 'embark-core'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { PageLink } from '@/lib/page-link'

export const useOfferPageRedirectEffect = (passage: ClientPassage) => {
  const router = useRouter()
  useEffect(() => {
    if (passage.action?.type === PassageElement.QuoteCartOfferRedirect) {
      router.push(
        PageLink.old_offer({
          locale: router.locale,
          quoteCartId: passage.action.id,
          types: passage.action.insuranceTypes,
        }),
      )
    }
  }, [router, passage])
}
