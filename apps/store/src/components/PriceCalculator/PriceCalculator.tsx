import { datadogRum } from '@datadog/browser-rum'
import { useAtomValue, useSetAtom } from 'jotai'
import {
  activeFormSectionIdAtom,
  currentPriceIntentIdAtom,
  GOTO_NEXT_SECTION,
  priceCalculatorFormAtom,
  priceIntentAtom,
} from '@/components/PriceCalculator/priceCalculatorAtoms'
import { usePriceTemplate } from '@/components/ProductPage/PurchaseForm/priceTemplateAtom'
import {
  prefillData,
  setupForm,
  updateFormState,
} from '@/services/PriceCalculator/PriceCalculator.helpers'
import { type Form } from '@/services/PriceCalculator/PriceCalculator.types'
import { type PriceIntent } from '@/services/priceIntent/priceIntent.types'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { AutomaticField } from './AutomaticField'
import { FetchInsurance } from './FetchInsurance'
import { FetchInsuranceContainer } from './FetchInsuranceContainer'
import { FormGrid } from './FormGrid/FormGrid'
import { PriceCalculatorAccordion } from './PriceCalculatorAccordion'
import { PriceCalculatorSection } from './PriceCalculatorSection'
import { useShowFetchInsurance } from './useFetchInsurance'
import { useHandleSubmitPriceCalculatorSection } from './useHandleSubmitPriceCalculatorSection'
import { showPriceIntentWarningAtom } from './Warning/showPriceIntentWarningAtom'
import { Warning } from './Warning/Warning'

type Props = {
  onConfirm: () => void
}

type CustomerData = {
  ssn?: string | null
  email?: string | null
}

export const PriceCalculator = (props: Props) => {
  const { onConfirm } = props
  const { shopSession } = useShopSession()
  if (shopSession == null) {
    throw new Error('shopSession must be ready')
  }
  const priceIntentId = useAtomValue(currentPriceIntentIdAtom)
  if (priceIntentId == null) {
    throw new Error('priceIntentId must be set')
  }
  const form = useAtomValue(priceCalculatorFormAtom)
  const priceIntent = useAtomValue(priceIntentAtom)
  const priceTemplate = usePriceTemplate()

  const setActiveSectionId = useSetAtom(activeFormSectionIdAtom)

  const showFetchInsurance = useShowFetchInsurance({ priceIntentId })
  const showPriceIntentWarning = useSetAtom(showPriceIntentWarningAtom)
  const handleSubmitSection = useHandleSubmitPriceCalculatorSection({
    onSuccess({ priceIntent, customer }) {
      const form = setupForm({
        customer,
        priceIntent,
        template: priceTemplate,
      })
      if (isFormReadyToConfirm({ form, priceIntent, customer })) {
        onConfirm()
      } else {
        if (priceIntent.warning) {
          showPriceIntentWarning(true)
          datadogRum.addAction('Show PriceIntent Warning')
        }
        if (priceIntent.externalInsurer) {
          // NOTE: We're still going to the next section underneath Insurely prompt
          showFetchInsurance()
        }

        // If we show a warning, prevent the user from going to the
        // next section without interacting with the warning dialog
        if (!priceIntent.warning) {
          goToNextSection()
        }
      }
    },
  })

  const goToNextSection = () => {
    setActiveSectionId(GOTO_NEXT_SECTION)
  }

  return (
    <>
      <PriceCalculatorAccordion>
        {(section, sectionIndex) => (
          <PriceCalculatorSection
            section={section}
            onSubmit={handleSubmitSection}
            last={sectionIndex === form.sections.length - 1}
          >
            <FormGrid items={section.items}>
              {(field, index) => (
                <AutomaticField
                  field={field}
                  priceIntent={priceIntent}
                  // We don't want to mess up focusing for the user by setting autoFocus on the
                  // first item in the form, since that would make it unintuitive to navigate our
                  // site. But when the user is in the form editing, even having submitted the first
                  // section, we want to set autoFocus for the next section. Hence sectionIndex > 0
                  autoFocus={sectionIndex > 0 && index === 0}
                />
              )}
            </FormGrid>
          </PriceCalculatorSection>
        )}
      </PriceCalculatorAccordion>

      {priceIntent.warning && (
        <Warning priceIntentWarning={priceIntent.warning} onConfirm={goToNextSection} />
      )}

      <FetchInsuranceContainer priceIntent={priceIntent}>
        {({ externalInsurer, insurely }) => (
          <FetchInsurance
            shopSession={shopSession}
            priceIntentId={priceIntent.id}
            externalInsurer={externalInsurer}
            insurely={insurely}
            productName={priceIntent.product.name}
          />
        )}
      </FetchInsuranceContainer>
    </>
  )
}

type IsFormReadyToConfirmParams = {
  form: Form
  customer?: CustomerData | null
  priceIntent: PriceIntent
}

const isFormReadyToConfirm = ({ form, customer, priceIntent }: IsFormReadyToConfirmParams) => {
  const filledForm = prefillData({
    form,
    data: { ...customer, ...priceIntent.data },
    valueField: 'value',
  })
  const updatedForm = updateFormState(filledForm)
  return updatedForm.sections.every((section) => section.state === 'valid')
}
