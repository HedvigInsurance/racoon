import { Button, Loadable, MainHeadline, Modal } from '@hedvig-ui'

import * as React from 'react'
import { useGetCarInfoQuery } from 'types/generated/graphql'
import styled from '@emotion/styled'

const Container = styled.div`
  padding: 2rem;
  width: 800px;
  margin: 20px;
  padding: 20px;
  background-color: #f1f1f1;
  border: 1px solid #ddd;
  border-radius: 10px;
  height: 50vh;
  overflow-y: scroll;
`
const Title = styled(MainHeadline)`
  padding-top: 20px;
  margin: 20px;
`

const ExitButton = styled(Button)`
  margin: 0px 20px 20px;
`

interface RegistrationNumberModalProps {
  registrationNumber: string
  onClose: () => void
  visible: boolean
}

export const RegistrationNumberModal: React.FC<
  RegistrationNumberModalProps
> = ({ registrationNumber, onClose, visible }) => {
  const carInfoResult = useGetCarInfoQuery({
    variables: { registrationNumber },
  })

  const jsonData = JSON.parse(carInfoResult.data?.getCarInfo?.response ?? '{}')

  return (
    <Modal visible={visible} onClose={onClose}>
      <Loadable loading={carInfoResult.loading}>
        <Title>Vtr info for {registrationNumber}</Title>
        <Container>
          {carInfoResult.error ? (
            'Oj! An error occurred, well... 🤷'
          ) : (
            <pre>{JSON.stringify(jsonData, null, 2)}</pre>
          )}
        </Container>
        <ExitButton onClick={onClose}>Take me out of here</ExitButton>
      </Loadable>
    </Modal>
  )
}
