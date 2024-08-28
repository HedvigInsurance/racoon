import { GsrCaseOfficersUpload } from '@hope/features/tools/gsr-case-officers/GsrCaseOfficersUpload'
import styled from '@emotion/styled'
import { Button, Card, DropdownInput, Flex, Input } from '@hedvig-ui/redesign'
import {
  UpsertGsrCaseOfficerInput,
  useUpsertGsrCaseOfficersMutation,
} from 'types/generated/graphql'
import { FormEventHandler, useState } from 'react'
import toast from 'react-hot-toast'
import { extractErrorMessage } from '@hedvig-ui'

const Wrapper = styled.div`
  padding: 2rem;
`

export default function GsrCaseOfficersPage() {
  const [formRevision, setFormRevision] = useState(0)
  const [upsertOfficer] = useUpsertGsrCaseOfficersMutation()

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const caseOfficer = Object.fromEntries(
      formData.entries(),
    ) as UpsertGsrCaseOfficerInput

    await toast
      .promise(
        upsertOfficer({
          variables: {
            input: [caseOfficer],
          },
        }),
        {
          loading: 'Adding GSR case officer...',
          success: () => {
            setFormRevision(formRevision + 1)
            return 'Case officer added'
          },
          error: ({ message }) => extractErrorMessage(message),
        },
      )
      .catch(() => {
        return
      })
  }
  return (
    <Wrapper>
      <GsrCaseOfficersUpload />

      <Card mt="large">
        <p>Add user as case officer</p>
        <form
          onSubmit={handleSubmit}
          style={{ width: '400px' }}
          key={formRevision}
        >
          <Flex direction="column" gap="small">
            <Input
              label="GSR ID"
              type="text"
              pattern="^GSR\d{5}"
              name="caseOfficerId"
              onInput={(e) => {
                if (e.currentTarget.validity.patternMismatch) {
                  e.currentTarget.setCustomValidity('Follow pattern GSR01234')
                } else {
                  e.currentTarget.setCustomValidity('')
                }
              }}
              required
            />
            <Input label="Email" type="email" name="email" required />
            <DropdownInput
              label="Carrier"
              name="carrier"
              options={[
                { value: 'HEDVIG', label: 'Hedvig' },
                { value: 'EIR', label: 'EIR' },
              ]}
            />
            <div>
              <Button type="submit">Lägg till</Button>
            </div>
          </Flex>
        </form>
      </Card>
    </Wrapper>
  )
}
