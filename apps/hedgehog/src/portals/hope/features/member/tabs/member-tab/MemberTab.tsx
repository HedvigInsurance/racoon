import styled from '@emotion/styled'
import {
  Button,
  ButtonsGroup,
  FadeIn,
  Input,
  Modal,
  Popover,
  Table,
  TableBody,
  TableColumn,
  TableRow,
} from '@hedvig-ui'
import { dateTimeFormatter } from '@hedvig-ui'
import { ChangeEvent, useState } from 'react'
import * as React from 'react'
import { PencilSquare } from 'react-bootstrap-icons'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import {
  EditMemberInfoInput,
  EditMemberInformationQuery,
  GetMemberInfoDocument,
  useEditMemberInfoMutation,
  useEditMemberInformationQuery,
  useSetFraudulentStatusMutation,
} from 'types/generated/graphql'
import { FraudulentStatusEdit } from '@hope/features/member/tabs/member-tab/FraudulentStatus'
import gql from 'graphql-tag'
import { PartnershipBonus } from './PartnershipBonus'
import { Link } from 'react-router-dom'

const ELIGIBILITY_RULES_URL =
  'https://www.notion.so/hedviginsurance/SAS-EuroBonus-https-www-hedvig-com-se-partner-sas-eurobonus-fb0657c8779a419a8b9100825295b0b4'
const EditMemberModal = styled(Modal)`
  padding: 1rem;

  width: 800px;
  height: 950px;

  overflow: auto;
`

const ButtonWrapper = styled.div`
  width: 100%;
  margin-top: 1em;
  display: flex;
  justify-content: flex-end;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const memberFieldFormatters: Record<
  'signedOn' | 'createdOn',
  (date: string) => string | undefined | 0
> = {
  signedOn: (date: string) => dateTimeFormatter(date, 'yyyy-MM-dd HH:mm:ss'),
  createdOn: (date: string) => dateTimeFormatter(date, 'yyyy-MM-dd HH:mm:ss'),
}

const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

const getFieldName = (field: string) =>
  capitalize(
    field
      ?.match(/([A-Z]?[^A-Z]*)/g)
      ?.slice(0, -1)
      ?.join(' ') ?? '',
  )

const getFieldValue = (value: string | string[]): string => {
  if (!value) {
    return ''
  }

  if (value && typeof value === 'object' && value.constructor === Object) {
    return 'N/A'
  }

  if (Array.isArray(value)) {
    return value.join(', ')
  }

  return value.toString()
}

gql`
  query EditMemberInformation($memberId: ID!) {
    member(id: $memberId) {
      ...EditMemberInformation
    }
  }
  fragment EditMemberInformation on Member {
    memberId
    email
    phoneNumber
    firstName
    lastName
    birthDate
    personalNumber
    status
    signedOn
    createdOn
    pickedLocale
    fraudulentStatus
    fraudulentStatusDescription
    partnershipBonus {
      ...PartnershipBonus
    }
  }

  fragment PartnershipBonus on PartnershipBonus {
    bonusPartner
    bonusNumber
  }
`

export const MemberTab: React.FC<{
  memberId: string
}> = ({ memberId }) => {
  const { data } = useEditMemberInformationQuery({ variables: { memberId } })

  const member = data?.member

  const [modalOpen, setModalOpen] = useState(false)
  const [editMemberInfoRequest, setEditMemberInfoRequest] =
    useState<EditMemberInfoInput>({
      memberId,
    })
  const [editingFraud, setEditFraud] = useState<boolean>(false)
  const [fraudStatus, setFraudStatus] = useState<string | null>(null)
  const [fraudDescription, setFraudDescription] = useState<string | null>(null)
  const [editMemberInfo] = useEditMemberInfoMutation()
  const [setFraudulentStatus] = useSetFraudulentStatusMutation()

  const { register, handleSubmit } = useForm()

  if (!member) {
    return null
  }

  const handleOpen = () => setModalOpen(true)

  const handleClose = () => setModalOpen(false)

  const isDisabled = (field: string) => {
    switch (field.toLowerCase()) {
      case 'memberid':
      case 'personalnumber':
      case 'signedon':
      case 'status':
      case 'pickedlocale':
      case 'createdon':
        return true
      default:
        return false
    }
  }

  const setFieldValue = (field: string, value: string) => {
    setEditMemberInfoRequest({ ...editMemberInfoRequest, [field]: value })
  }

  const handleChange = (field: string, value: string) => {
    if (field === 'firstName' || field === 'lastName') {
      setFieldValue(field, value.charAt(0).toUpperCase() + value.slice(1))
    } else {
      setFieldValue(field, value)
    }
  }

  const handleCancel = () => {
    setEditMemberInfoRequest({
      memberId: member.memberId,
    })
    handleClose()
  }

  const onSubmit = () => {
    editMemberInfo({
      variables: {
        request: editMemberInfoRequest,
      },
      refetchQueries: [
        {
          query: GetMemberInfoDocument,
          variables: {
            memberId: editMemberInfoRequest.memberId,
          },
        },
      ],
    }).then(() => handleClose())
  }

  const memberInfoWithoutSsn: EditMemberInformationQuery['member'] = {
    ...member,
    personalNumber: member?.signedOn ? member?.personalNumber : null,
  }

  delete memberInfoWithoutSsn.__typename
  delete memberInfoWithoutSsn.fraudulentStatus
  delete memberInfoWithoutSsn.fraudulentStatusDescription
  delete memberInfoWithoutSsn.partnershipBonus

  return memberInfoWithoutSsn ? (
    <FadeIn>
      <Table>
        <TableBody>
          {Object.keys(memberInfoWithoutSsn).map((field, id) => {
            const isDate = field === ('createdOn' || 'signedOn')

            return (
              <TableRow key={id} border>
                <TableColumn>{getFieldName(field)}</TableColumn>
                <TableColumn>
                  {isDate
                    ? memberFieldFormatters[field](memberInfoWithoutSsn[field])
                    : getFieldValue(
                        memberInfoWithoutSsn[
                          field as keyof EditMemberInformationQuery['member']
                        ],
                      )}
                </TableColumn>
              </TableRow>
            )
          })}
          <FraudulentStatusEdit
            getFraudStatusInfo={() => ({
              status: fraudStatus || member.fraudulentStatus || '',
              description:
                fraudDescription || member.fraudulentStatusDescription || '',
            })}
            setState={(val, fs, desc) => {
              setEditFraud(val)
              if (fs) {
                setFraudStatus(fs)
              }

              if (desc) {
                setFraudDescription(desc)
              }
            }}
            getState={() => editingFraud}
            onEdit={(newFraudulentStatus, newFraudulentStatusDescription) => {
              toast.promise(
                setFraudulentStatus({
                  variables: {
                    memberId,
                    request: {
                      fraudulentStatus: newFraudulentStatus,
                      fraudulentStatusDescription:
                        newFraudulentStatusDescription,
                    },
                  },
                }),
                {
                  loading: 'Updating fraudulent status',
                  success: 'Fraudulent status updated',
                  error: 'Could not update fraudulent status',
                },
              )
            }}
          />
          <TableRow>
            <TableColumn>
              Partnership Bonus
              <br></br>
              <Popover contents="Go to Notion page">
                <Link target="_blank" to={ELIGIBILITY_RULES_URL}>
                  Eligibility rules
                </Link>
              </Popover>
            </TableColumn>
            <TableColumn>
              <PartnershipBonus
                memberId={member.memberId}
                partnershipBonus={member.partnershipBonus ?? undefined}
              />
            </TableColumn>
          </TableRow>
        </TableBody>
      </Table>

      <ButtonWrapper style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="primary" size="medium" onClick={handleOpen}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <PencilSquare /> <span style={{ marginLeft: 10 }}>Edit Member</span>
          </div>
        </Button>
      </ButtonWrapper>
      <EditMemberModal onClose={handleClose} visible={modalOpen}>
        <Form
          onSubmit={handleSubmit(onSubmit)}
          onChange={(e) => {
            const event = e as unknown as ChangeEvent<HTMLInputElement>
            handleChange(event.target.name, event.target.value)
          }}
        >
          <>
            {Object.keys(memberInfoWithoutSsn).map((field) => (
              <React.Fragment key={field}>
                <Input
                  {...register(field)}
                  label={getFieldName(field)}
                  key={field}
                  disabled={isDisabled(field)}
                  defaultValue={getFieldValue(
                    member[field as keyof EditMemberInformationQuery['member']],
                  )}
                />
              </React.Fragment>
            ))}
          </>
          <ButtonsGroup
            style={{
              justifyContent: 'flex-end',
              marginTop: '1rem',
              marginBottom: '0,5rem',
            }}
          >
            <Button variant="secondary" type="button" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit">Submit</Button>
          </ButtonsGroup>
        </Form>
      </EditMemberModal>
    </FadeIn>
  ) : (
    <h1>No member info</h1>
  )
}
