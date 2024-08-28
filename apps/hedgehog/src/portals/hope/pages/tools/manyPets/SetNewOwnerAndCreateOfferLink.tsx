import { useState } from 'react'
import * as React from 'react'
import { Button, Card, Flex, Input, Modal } from '@hedvig-ui'
import { useCreateManyPetsOfferLinksNewOwnerMutation } from 'types/generated/graphql'
import { DisplayLinks } from './CreateManyPetsOfferLinksPage'

type PolicyOwnerInformation = {
  firstName: string
  lastName: string
  ssn: string
  city: string
  zipCode: string
  street: string
  email: string
  phoneNumber: string
}

const SetNewManyPetsPolicyOwner = ({ policyId }: { policyId: string }) => {
  const [showModal, setShowModal] = useState(false)
  const [newPolicyOwnerInformation, setNewPolicyOwnerInformation] =
    useState<PolicyOwnerInformation>({
      firstName: '',
      lastName: '',
      ssn: '',
      city: '',
      zipCode: '',
      street: '',
      email: '',
      phoneNumber: '',
    })

  const policyOwnershipTransferRequest = {
    policyId: policyId,
    newPolicyOwnerInformation: newPolicyOwnerInformation,
  }

  const [createNewOwnerLinks, { data, loading, error }] =
    useCreateManyPetsOfferLinksNewOwnerMutation({
      variables: {
        policyOwnershipTransferRequest: policyOwnershipTransferRequest,
      },
    })

  const resetForm = () => {
    setNewPolicyOwnerInformation({
      firstName: '',
      lastName: '',
      ssn: '',
      city: '',
      zipCode: '',
      street: '',
      email: '',
      phoneNumber: '',
    })
  }

  const handleChange = (field: string, value: string) => {
    setNewPolicyOwnerInformation({
      ...newPolicyOwnerInformation,
      [field]: value,
    })
  }

  const submitNewOwner = (e: React.FormEvent) => {
    e.preventDefault()
    setShowModal(false)
    createNewOwnerLinks()
    resetForm()
  }

  const fields = [
    {
      label: 'First Name',
      name: 'firstName',
      placeholder: "Input new owner's first name...",
    },
    {
      label: 'Last Name',
      name: 'lastName',
      placeholder: "Input new owner's last name...",
    },
    { label: 'SSN', name: 'ssn', placeholder: "Input new owner's SSN..." },
    { label: 'City', name: 'city', placeholder: "Input new owner's city..." },
    {
      label: 'Zip Code',
      name: 'zipCode',
      placeholder: "Input new owner's zip code...",
    },
    {
      label: 'Street',
      name: 'street',
      placeholder: "Input new owner's street...",
    },
    {
      label: 'Email',
      name: 'email',
      placeholder: "Input new owner's email...",
    },
    {
      label: 'Phone Number',
      name: 'phoneNumber',
      placeholder: "Input new owner's phone number...",
    },
    {
      label: 'Renewal Date',
      name: 'renewalDate',
      placeholder: "Input new owner's renewal date...",
    },
  ]

  return (
    <>
      <Flex direction="column" gap="small">
        <Button onClick={() => setShowModal(true)}>
          Transfer owner and create links
        </Button>
        <Modal
          onClose={() => {
            setShowModal(false)
            resetForm()
          }}
          visible={showModal}
        >
          <Card>
            <h2>Transfer ownership</h2>
            <form onSubmit={submitNewOwner}>
              <Flex direction="column" gap="small">
                <Flex direction="row" gap="small">
                  {fields.slice(0, 4).map((field) => (
                    <Input
                      key={field.name}
                      label={field.label}
                      placeholder={field.placeholder}
                      // This is fine because I know the keys are the same always as defined above
                      value={
                        newPolicyOwnerInformation[
                          field.name as keyof PolicyOwnerInformation
                        ]
                      }
                      onChange={({ currentTarget: { value } }) =>
                        handleChange(field.name, value)
                      }
                    />
                  ))}
                </Flex>
                <Flex direction="row" gap="small">
                  {fields.slice(4, 8).map((field) => (
                    <Input
                      key={field.name}
                      label={field.label}
                      placeholder={field.placeholder}
                      // This is fine because I know the keys are the same always as defined above
                      value={
                        newPolicyOwnerInformation[
                          field.name as keyof PolicyOwnerInformation
                        ]
                      }
                      onChange={({ currentTarget: { value } }) =>
                        handleChange(field.name, value)
                      }
                    />
                  ))}
                </Flex>
                <Flex direction="row" gap="small">
                  <Button
                    type="submit"
                    status="success"
                    onSubmit={submitNewOwner}
                  >
                    Submit
                  </Button>
                  <Button
                    onClick={(e) => {
                      e.preventDefault()
                      setShowModal(false)
                      resetForm()
                    }}
                    status="danger"
                  >
                    Cancel
                  </Button>
                </Flex>
              </Flex>
            </form>
          </Card>
        </Modal>
        <DisplayLinks
          links={data?.manyPetsOfferLinks_createNewOwner}
          loading={loading}
          error={error}
        />
      </Flex>
    </>
  )
}

export { SetNewManyPetsPolicyOwner }
