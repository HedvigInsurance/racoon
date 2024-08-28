import { RefObject, useCallback, useEffect, useMemo, useState } from 'react'
import {
  ClaimInsurableLimitsFragment,
  ClaimPetDiagnosisFragment,
  InsurableLimitsCategory,
  PaymentOrderBreakdownCategoryInput,
  useCreatePetDiagnosisMutation,
} from 'types/generated/graphql'
import { Modal, extractErrorMessage } from '@hedvig-ui'
import {
  Button,
  Dialog,
  Div,
  Dropdown,
  Flex,
  Grid,
  Input,
  TextDatePicker,
} from '@hedvig-ui/redesign'
import { formatMoney } from '@hedvig-ui/utils/money'
import { css } from './InsurableLimitsPaymentOrderFormSection.css'
import { PlusIcon, XCircleIcon } from '@hedvig-ui/icons'
import { LayoutGroup, motion } from 'framer-motion'
import { useClaim } from '@hope/features/claims/hooks/use-claim'
import { PaymentOrderFormSection } from './ClaimPaymentOrderFormNew'
import { splitInsurableLimitsCategories } from '@hope/features/claims/new/Overview/InsurableLimits/util'
import gql from 'graphql-tag'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

export const InsurableLimitsPaymentOrderFormSection: PaymentOrderFormSection = {
  Component,
  extractPayload,
}

function Component({ formRef }: { formRef: RefObject<HTMLFormElement> }) {
  const { insurableLimits, contract, petDiagnoses, refetch } = useClaim()
  const limits = insurableLimits!
  const contractId = contract!.id

  const [totals, setTotals] = useState({
    amount: 0,
    deductible: 0,
  })
  const [chosenCategoryIds, setChosenCategoryIds] = useState<string[]>([])
  const [isAddingCategory, setIsAddingCategory] = useState(false)

  const { selectedDiagnosis, selectDiagnosis, createDiagnosis } =
    usePetDiagnoses({
      contractId,
      availableDiagnoses: petDiagnoses,
    })

  const toggleChosenCategory = (category?: string) => {
    if (!category) return

    if (chosenCategoryIds.includes(category)) {
      setChosenCategoryIds((prev) => prev.filter((c) => c !== category))
      return
    }

    setChosenCategoryIds((prev) => [...prev, category])
    return
  }

  const categories = produceCategories(limits, selectedDiagnosis)
  const chosenCategories = categories.other.filter((c) =>
    chosenCategoryIds.includes(c.id),
  )
  const unchosenCategories = categories.other.filter(
    (c) => !chosenCategoryIds.includes(c.id),
  )
  const currency = limits.totalLimit.currency

  const updateTotals = useCallback(() => {
    const form = formRef.current
    if (!form) return

    const totals = extractPayload(new FormData(form), { currency })

    setTotals({
      amount: totals.amount.amount,
      deductible: totals.deductible.amount,
    })
    // `chosenCategoryIds` indirectly influences this callback through
    // visibility of form fields, but the react hook can't see that. So we
    // want the dependency, but have to disable the lint check
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formRef, currency, chosenCategoryIds])

  useEffect(() => {
    updateTotals()
  }, [updateTotals])

  return (
    <>
      <PetDiagnosisSelector
        availableDiagnoses={petDiagnoses}
        selectedDiagnosis={selectedDiagnosis}
        selectDiagnosis={selectDiagnosis}
        createDiagnosis={createDiagnosis}
        onDiagnosisCreated={refetch}
      />
      <Grid equalColumns={3} gap="small">
        <Flex direction="column" gap="small">
          <span className={css.categoryColumnHeading}>Deductibles</span>
          <CategoryInput
            category={categories.fixedDeductible}
            currency={currency}
            onChange={updateTotals}
          />
          <CategoryInput
            category={categories.variableDeductible}
            currency={currency}
            onChange={updateTotals}
          />
        </Flex>

        <Flex direction={'column'} gap={'small'}>
          <span className={css.categoryColumnHeading}>Categories</span>
          <LayoutGroup>
            {chosenCategories.map((c) => (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                key={c.id}
                className={css.categoryWrapper}
              >
                <div
                  className={css.removeCategoryButton}
                  onClick={() => {
                    toggleChosenCategory(c.id)
                  }}
                >
                  <XCircleIcon />
                </div>
                <div className={css.categoryOverflowContainer}>
                  <CategoryInput
                    category={c}
                    currency={currency}
                    onChange={updateTotals}
                  />
                </div>
              </motion.div>
            ))}
          </LayoutGroup>
          <Button
            type="button"
            variant="ghost"
            size="large"
            className={css.addCategoryButton}
            onClick={() => setIsAddingCategory(true)}
          >
            <PlusIcon /> Add new category
          </Button>
        </Flex>

        <Flex direction={'column'} gap={'small'}>
          <span className={css.categoryColumnHeading}>Totals</span>
          <Input
            disabled
            label="Total deductible"
            value={totals.deductible}
            affix={{ content: currency }}
            readOnly
          />
          <Input
            disabled
            label="Paid amount"
            value={totals.amount}
            affix={{ content: currency }}
            readOnly
          />
        </Flex>
      </Grid>

      <Modal
        visible={isAddingCategory}
        onClose={() => setIsAddingCategory(false)}
      >
        <AddCategoryPopup
          categories={unchosenCategories}
          onSelect={(id) => {
            toggleChosenCategory(id)
            if (unchosenCategories.length === 1) {
              setIsAddingCategory(false)
            }
          }}
        />
      </Modal>
    </>
  )
}

const CategoryInput = ({
  category,
  currency,
  onChange,
}: {
  category: ListableInsurableLimitCategory
  currency: string
  onChange: () => void
}) => {
  return (
    <Input
      type="number"
      name={`CATEGORY:${category.id}`}
      label={category.displayName}
      min={0}
      step=".01"
      affix={{
        content: category.remaining
          ? formatMoney(category.remaining) + ' left'
          : currency,
      }}
      onChange={onChange}
    />
  )
}

const AddCategoryPopup = ({
  categories,
  onSelect,
}: {
  categories: ListableInsurableLimitCategory[]
  onSelect: (categoryId: string) => void
}) => {
  return (
    <Div className={css.addCategoryPopup.wrapper}>
      {categories.map((c) => (
        <Flex
          key={c.id}
          justify="space-between"
          gap="large"
          className={css.addCategoryPopup.option}
          onClick={() => onSelect(c.id)}
        >
          <span>{c.displayName}</span>
          <span className={css.addCategoryPopup.mutedText}>
            {c.remaining ? formatMoney(c.remaining) + ' left' : ''}
          </span>
        </Flex>
      ))}
    </Div>
  )
}

function extractPayload(data: FormData, { currency }: { currency: string }) {
  const categoryFieldNames = [...data.keys()].filter((key) =>
    key.startsWith('CATEGORY:'),
  )

  let payoutAmount = 0
  let deductibleAmount = 0
  const categoryBreakdown: PaymentOrderBreakdownCategoryInput[] = []

  categoryFieldNames.forEach((fieldName) => {
    const category = fieldName.replace('CATEGORY:', '')
    const isDeductible =
      category === 'FIXED_DEDUCTIBLE' || category === 'VARIABLE_DEDUCTIBLE'
    const formEnteredValue = parseFloat(data.get(fieldName)!.toString())

    if (isNaN(formEnteredValue)) return

    if (isDeductible) {
      deductibleAmount += formEnteredValue
    } else {
      payoutAmount += formEnteredValue
    }
    categoryBreakdown.push({
      category: category,
      amount: {
        amount: formEnteredValue,
        currency,
      },
    })
  })

  return {
    amount: {
      amount: +Number(payoutAmount).toFixed(2),
      currency,
    },
    deductible: {
      amount: +Number(deductibleAmount).toFixed(2),
      currency,
    },
    categoryBreakdown,
  }
}

type ListableInsurableLimitCategory = {
  id: string
  displayName: string
  remaining?: {
    currency: string
    amount: number
  }
}

type Categories = {
  fixedDeductible: ListableInsurableLimitCategory
  variableDeductible: ListableInsurableLimitCategory
  other: ListableInsurableLimitCategory[]
}

const produceCategories = (
  limits: ClaimInsurableLimitsFragment,
  petDiagnosis?: ClaimPetDiagnosisFragment,
): Categories => {
  const [fixedDeductibleCategory, otherCategories] =
    splitInsurableLimitsCategories(limits)

  const transformLimitCategory = (
    category: InsurableLimitsCategory,
  ): ListableInsurableLimitCategory => {
    let amount = category.limit.amount - category.usage.amount
    const diagnosisLimit = petDiagnosis?.categoryLimits?.find(
      (cl) => cl.category === category.id,
    )?.limit
    if (diagnosisLimit !== undefined) {
      amount = diagnosisLimit - category.usage.amount
    }
    return {
      ...category,
      remaining: {
        currency: category.limit.currency,
        amount,
      },
    }
  }

  const variableDeductible = {
    id: 'VARIABLE_DEDUCTIBLE',
    displayName: 'Variable Deductible',
  }
  const other = {
    id: 'PET_OTHER',
    displayName: 'Other',
  }

  return {
    fixedDeductible: transformLimitCategory(fixedDeductibleCategory),
    variableDeductible,
    other: [...otherCategories.map(transformLimitCategory), other],
  }
}

gql`
  mutation CreatePetDiagnosis($input: PetDiagnosisCreateInput!) {
    petDiagnosis_create(input: $input) {
      ...ClaimPetDiagnosis
    }
  }
`

type CreateDiagnosisInput = {
  date: string
  name: string
}

const usePetDiagnoses = ({
  contractId,
  availableDiagnoses,
}: {
  contractId: string
  availableDiagnoses: ClaimPetDiagnosisFragment[]
}) => {
  const [selectedDiagnosisId, setSelectedDiagnosisId] = useState<string>()
  const [createDiagnosisMutation, { loading: creating }] =
    useCreatePetDiagnosisMutation()

  const selectedDiagnosis = useMemo(
    () => availableDiagnoses.find((d) => d.id === selectedDiagnosisId),
    [availableDiagnoses, selectedDiagnosisId],
  )

  function selectDiagnosis(id?: string) {
    setSelectedDiagnosisId(id)
  }

  const createDiagnosis = useCallback(
    ({ date, name }: CreateDiagnosisInput) => {
      if (creating) {
        return Promise.reject()
      }
      return toast.promise(
        createDiagnosisMutation({
          variables: {
            input: {
              contractId,
              date,
              name,
            },
          },
        }),
        {
          loading: 'Adding diagnosis',
          success: 'Diagnosis added',
          error: ({ message }) => extractErrorMessage(message),
        },
      )
    },
    [contractId, createDiagnosisMutation, creating],
  )

  return {
    selectedDiagnosis,
    selectDiagnosis,
    createDiagnosis,
  }
}

function PetDiagnosisSelector({
  availableDiagnoses,
  selectedDiagnosis,
  selectDiagnosis,
  createDiagnosis,
  onDiagnosisCreated,
}: {
  availableDiagnoses: ClaimPetDiagnosisFragment[]
  selectedDiagnosis: ClaimPetDiagnosisFragment | undefined
  selectDiagnosis: (id?: string) => void
  createDiagnosis: (input: CreateDiagnosisInput) => Promise<unknown>
  onDiagnosisCreated: () => Promise<unknown>
}) {
  const [isAddingNewDiagnosis, setIsAddingNewDiagnosis] = useState(false)
  const [newDiagnosisDate, setNewDiagnosisDate] = useState<string>()
  const [newDiagnosisName, setNewDiagnosisName] = useState('')

  const newDiagnosisInputValid = !!newDiagnosisDate && !!newDiagnosisName.trim()

  async function submitNewDiagnosis() {
    if (!newDiagnosisInputValid) {
      return
    }
    try {
      await createDiagnosis({ date: newDiagnosisDate, name: newDiagnosisName })
      setIsAddingNewDiagnosis(false)
      onDiagnosisCreated()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Flex gap="sm">
      <div className={css.diagnosis.select}>
        <Dropdown
          label="Use diagnosis for payout"
          options={[
            {
              value: 'not_selected',
              label: 'None',
              selected: selectedDiagnosis === undefined,
              action: () => selectDiagnosis(undefined),
            },
            ...availableDiagnoses.map((diagnosis) => ({
              value: diagnosis.id,
              label: `${diagnosis.name}, ${format(diagnosis.date, 'y-MM-dd')}`,
              selected: selectedDiagnosis?.id === diagnosis.id,
              action: () => selectDiagnosis(diagnosis.id),
            })),
          ]}
        />
      </div>

      <div>
        <Dialog.Root
          open={isAddingNewDiagnosis}
          onOpenChange={setIsAddingNewDiagnosis}
        >
          <Dialog.Trigger asChild>
            <Button>+ New Diagnosis </Button>
          </Dialog.Trigger>

          <Dialog.Content>
            <Div px="lg" py="md" className={css.diagnosis.dialog}>
              <Dialog.Title>New pet diagnosis</Dialog.Title>
              <Flex direction="column" gap="md" mt="lg">
                <TextDatePicker
                  label="Date of discovery"
                  value={newDiagnosisDate ?? undefined}
                  onChange={(dateString) =>
                    setNewDiagnosisDate(dateString ?? undefined)
                  }
                />
                <Input
                  label="Name of diagnosis"
                  type="text"
                  value={newDiagnosisName}
                  onChange={(e) => setNewDiagnosisName(e.target.value)}
                />
                <Flex gap="xs">
                  <Button onClick={submitNewDiagnosis}>Create</Button>
                  <Button
                    variant="secondary"
                    onClick={() => setIsAddingNewDiagnosis(false)}
                  >
                    Cancel
                  </Button>
                </Flex>
              </Flex>
            </Div>
          </Dialog.Content>
        </Dialog.Root>
      </div>
    </Flex>
  )
}
