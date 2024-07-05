import 'server-only'
import { Suspense } from 'react'
import { PurchaseFormClient } from '@/components/ProductPage/PurchaseForm/PurchaseForm'
import { purchaseFormTop } from '@/components/ProductPage/PurchaseForm/PurchaseForm.css'
import { PurchaseFormPillow } from '@/components/ProductPage/PurchaseForm/PurchaseFormPillow'

export type PurchaseFormProps = {
  showAverageRating?: boolean
}

// FIXME: add wrapper from original CMS block
export function PurchaseFormRsc(props: PurchaseFormProps) {
  return (
    <>
      <div className={purchaseFormTop}>
        <Suspense
          fallback={
            <PurchaseFormPillow
              // does not matter, we're showing loading indicator
              buttonLabel={''}
              loading={true}
              showAverageRating={props.showAverageRating}
            />
          }
        >
          <PurchaseFormClient {...props} />
        </Suspense>
      </div>
    </>
  )
}
