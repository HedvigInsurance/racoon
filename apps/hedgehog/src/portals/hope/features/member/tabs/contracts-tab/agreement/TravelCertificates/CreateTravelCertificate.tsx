import styled from '@emotion/styled'
import { FormEventHandler, useRef, useState } from 'react'
import {
  Button,
  ButtonsGroup,
  Checkbox,
  DateTimePicker,
  FadeIn,
  Flex,
  formatSsn,
  FourthLevelHeadline,
  InfoRow,
  Input,
  Label,
  Paragraph,
  Shadowed,
  useClickOutside,
} from '@hedvig-ui'
import { Trash } from 'react-bootstrap-icons'
import {
  useCreateTravelCertificate,
  type CoInsured,
} from './use-create-travel-certificate'

const CreateTravelCertificateWrapper = styled.div`
  position: relative;
`

const CreateNewTravelCertificatePopup = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 10;
  padding: 1rem;

  border-radius: 0.4rem;
  background-color: #fafafa;
  box-shadow: 0px 0px 25px rgba(0, 0, 0, 0.1);
`

const SubmitTip = styled(Paragraph)`
  padding-top: 0.5rem;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.semiStrongForeground};
`

type CreateTravelCertificateProps = {
  contractId: string
}

export const CreateTravelCertificate = (
  props: CreateTravelCertificateProps,
) => {
  const { create: createTravelCertificate, isCreating } =
    useCreateTravelCertificate()

  const [shouldShowPopup, setShouldShowPopup] = useState(false)
  const popupRef = useRef(null)
  useClickOutside(popupRef, (e) => {
    setShouldShowPopup(false)
    e.stopPropagation()
  })

  const [includedCoInsured, setIncludedCoInsured] = useState<CoInsured[]>([])
  const [fullName, setFullName] = useState('')
  const [ssn, setSsn] = useState('')
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [isMemberIncluded, setIsMemberIncluded] = useState(true)

  const addCoInsured: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()

    if (!fullName || !ssn) return

    setIncludedCoInsured((prev) => [...prev, { fullName, ssn }])
    setFullName('')
    setSsn('')
  }

  const removeCoInsured = (coInsuredToRemove: CoInsured) => {
    setIncludedCoInsured((prev) =>
      prev.filter(
        (coInsured) =>
          !(
            coInsured.fullName === coInsuredToRemove.fullName &&
            coInsured.ssn === coInsuredToRemove.ssn
          ),
      ),
    )
  }

  return (
    <CreateTravelCertificateWrapper>
      {shouldShowPopup ? (
        <CreateNewTravelCertificatePopup ref={popupRef}>
          <Flex direction="column" gap="small">
            <FourthLevelHeadline>
              Create new travel certificate
            </FourthLevelHeadline>

            {!!includedCoInsured.length && (
              <div>
                <Label>Co insured</Label>

                {includedCoInsured.map((coInsured) => (
                  <InfoRow key={coInsured.ssn}>
                    <Flex gap="small" align="center" justify="space-between">
                      <span>{`${coInsured.fullName}, ${formatSsn(
                        coInsured.ssn,
                      )}`}</span>

                      <Button
                        style={{ paddingBlock: '0.25rem' }}
                        type="button"
                        variant="tertiary"
                        icon={<Trash />}
                        onClick={() => removeCoInsured(coInsured)}
                      />
                    </Flex>
                  </InfoRow>
                ))}
              </div>
            )}
            <form onSubmit={addCoInsured}>
              <Label>Add co insured</Label>

              <Flex gap="tiny">
                <Input
                  style={{ minWidth: '10rem' }}
                  placeholder="Full name..."
                  value={fullName}
                  onChange={({ currentTarget: { value } }) =>
                    setFullName(value)
                  }
                  required
                />

                <Input
                  style={{ minWidth: '10rem' }}
                  placeholder="SSN..."
                  value={ssn}
                  onChange={({ currentTarget: { value } }) => setSsn(value)}
                  required
                />
              </Flex>

              <Button
                style={{
                  visibility: 'hidden',
                  height: 0,
                  position: 'absolute',
                }}
                type="submit"
              />

              {!!fullName && !!ssn && (
                <FadeIn duration={200}>
                  <SubmitTip>
                    Press <Shadowed>Enter</Shadowed> to add
                  </SubmitTip>
                </FadeIn>
              )}
            </form>

            <Flex gap="tiny">
              <div>
                <Label>Start date</Label>
                <DateTimePicker date={startDate} setDate={setStartDate} />
              </div>
              <div>
                <Label>End date</Label>
                <DateTimePicker
                  placeholder="optional"
                  date={endDate}
                  setDate={setEndDate}
                />
              </div>
            </Flex>

            <Checkbox
              label="Member included in certificate?"
              checked={isMemberIncluded}
              onChange={() => setIsMemberIncluded((prev) => !prev)}
            />

            <ButtonsGroup>
              <form
                onSubmit={(event) => {
                  event.preventDefault()
                  createTravelCertificate({
                    contractId: props.contractId,
                    includedCoInsured,
                    startDate,
                    endDate,
                    isMemberIncluded,
                  })
                }}
              >
                <Button
                  type="submit"
                  variant="primary"
                  disabled={
                    isCreating ||
                    (!isMemberIncluded && !includedCoInsured.length)
                  }
                >
                  Create
                </Button>
              </form>

              <Button
                type="button"
                variant="tertiary"
                onClick={() => setShouldShowPopup(false)}
              >
                Cancel
              </Button>
            </ButtonsGroup>
          </Flex>
        </CreateNewTravelCertificatePopup>
      ) : (
        <Button
          size="small"
          variant="primary"
          onClick={() => setShouldShowPopup(true)}
          disabled={isCreating}
        >
          Create new
        </Button>
      )}
    </CreateTravelCertificateWrapper>
  )
}
