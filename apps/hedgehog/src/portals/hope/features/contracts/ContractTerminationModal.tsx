import {
  Checkbox,
  ConfirmingButton,
  convertEnumToTitle,
  Flex,
  FourthLevelHeadline,
  InfoTag,
  MainHeadline,
  Modal,
  ModalProps,
  SearchableDropdown,
  Spacing,
  TextArea,
  ThirdLevelHeadline,
} from '@hedvig-ui'
import { useRef, useState } from 'react'
import * as React from 'react'
import styled from '@emotion/styled'
import { useContracts } from '@hope/features/member/tabs/contracts-tab/hooks/use-contracts'
import DatePicker from 'react-datepicker'
import { format, max, parse } from 'date-fns'
import { useTerminateContractMutation } from 'types/generated/graphql'
import { toast } from 'react-hot-toast'
import { TerminationReason } from '@hope/features/member/tabs/contracts-tab/contract/termination-date'

const ContractWrapper = styled.div`
  padding: 2rem;
  min-width: 30rem;
  min-height: 30rem;
`

export const ContractTerminationModal: React.FC<
  {
    memberId: string
  } & ModalProps
> = ({ memberId, ...modalProps }) => {
  const [contracts, { loading }] = useContracts(memberId)

  const datePicker = useRef<DatePicker>(null)

  const [terminateContract, { loading: terminateContractLoading }] =
    useTerminateContractMutation()

  const activeContracts = contracts.filter(
    (contract) => !contract.terminationDate,
  )

  const [currentContractId, setCurrentContractId] = useState<string | null>(
    null,
  )
  const currentContract = activeContracts.find(
    (contract) => contract.id === currentContractId,
  )

  const [terminationDates, setTerminationDates] = useState<
    Record<string, string>
  >({})

  const [terminationReason, setTerminationReason] =
    useState<TerminationReason | null>(null)

  const [comment, setComment] = useState('')

  const minDate = !currentContract
    ? new Date()
    : max([
        new Date(),
        parse(currentContract.masterInception, 'yyyy-MM-dd', new Date()),
      ])

  if (loading) return null

  return (
    <Modal {...modalProps}>
      <ContractWrapper>
        <MainHeadline>Contracts</MainHeadline>
        <FourthLevelHeadline style={{ marginBottom: '10rem' }}>
          Select contracts to terminate
        </FourthLevelHeadline>
        {activeContracts.map((contract) => {
          const terminationDate = terminationDates[contract.id]
          return (
            <div key={contract.id}>
              <Spacing top>
                <ThirdLevelHeadline>
                  <strong>{convertEnumToTitle(contract.insuranceType)}</strong>
                </ThirdLevelHeadline>
                <Flex
                  align="center"
                  gap="tiny"
                  style={{ marginBottom: '1rem', fontSize: '1rem' }}
                >
                  <span>{contract.masterInception}</span> <span>-</span>
                  {!terminationDate ? null : terminationDate ===
                    contract.masterInception ? (
                    <InfoTag status="danger">Delete</InfoTag>
                  ) : (
                    <InfoTag status="info">{terminationDate}</InfoTag>
                  )}
                  <Checkbox
                    checked={!!terminationDate}
                    onChange={
                      !terminationDate
                        ? () => {
                            setCurrentContractId(contract.id)
                            datePicker.current?.setOpen(true)
                          }
                        : () => {
                            setTerminationDates((current) => {
                              const copy = { ...current }
                              delete copy[contract.id]
                              return copy
                            })
                          }
                    }
                  />
                </Flex>
              </Spacing>
            </div>
          )
        })}
        <DatePicker
          minDate={minDate}
          isClearable
          showPopperArrow={false}
          ref={datePicker}
          onChange={(value) => {
            setTerminationDates((current) => ({
              ...current,
              [currentContractId as string]: format(
                value as Date,
                'yyyy-MM-dd',
              ),
            }))
          }}
          customInput={<span />}
        />
        {!!activeContracts.length && (
          <>
            <SearchableDropdown
              position="top"
              value={terminationReason}
              placeholder="Reason"
              onChange={(data) =>
                data && setTerminationReason(data.value as TerminationReason)
              }
              noOptionsMessage={() => 'Reason not found'}
              options={Object.values(TerminationReason).map((reason) => ({
                label: convertEnumToTitle(reason),
                value: reason,
                text: convertEnumToTitle(reason),
              }))}
            />
            <TextArea
              value={comment}
              onChange={({ currentTarget: { value } }) => setComment(value)}
              placeholder="Comment on reason of termination..."
            />
          </>
        )}
        <Flex justify="center" style={{ paddingTop: '1.5rem' }}>
          <ConfirmingButton
            disabled={
              !Object.keys(terminationDates).length ||
              !terminationReason ||
              terminateContractLoading
            }
            status="danger"
            onClick={async () => {
              await toast.promise(
                Promise.all(
                  Object.keys(terminationDates).map(async (contractId) => {
                    const terminationDate = terminationDates[contractId]
                    const masterInception = activeContracts.find(
                      (contract) => contract.id === contractId,
                    )?.masterInception
                    return terminateContract({
                      variables: {
                        contractId,
                        request: {
                          terminationDate,
                          terminationReason: terminationReason ?? '',
                          comment,
                          deleteContract: terminationDate === masterInception,
                        },
                      },
                    })
                  }),
                ),
                {
                  loading: 'Terminating contract(s)',
                  success: () => {
                    modalProps.onClose()
                    return 'Contract(s) terminated'
                  },
                  error: 'Could not terminate contract(s)',
                },
              )
            }}
          >
            {activeContracts.length
              ? `Terminate (${Object.keys(terminationDates).length})`
              : 'No contracts to terminate'}
          </ConfirmingButton>
        </Flex>
      </ContractWrapper>
    </Modal>
  )
}
