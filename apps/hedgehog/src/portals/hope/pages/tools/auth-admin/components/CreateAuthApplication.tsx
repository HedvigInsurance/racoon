import { Button, ButtonsGroup, Input, Row, useConfirmDialog } from '@hedvig-ui'
import { toast } from 'react-hot-toast'
import {
  ListAuthApplicationsDocument,
  useCreateApplicationMutation,
} from 'types/generated/graphql'
import { useState } from 'react'
import * as React from 'react'

export const CreateAuthApplication: React.FC = () => {
  const [createPressed, setCreatePressed] = useState(false)
  const [createApplication, { loading: loading }] =
    useCreateApplicationMutation()

  const [applicationName, setApplicationName] = useState('')

  const reset = () => {
    setApplicationName('')
  }

  const { confirm } = useConfirmDialog()

  return !createPressed ? (
    <Button variant="primary" onClick={() => setCreatePressed(true)}>
      Create application
    </Button>
  ) : (
    <Row
      style={{
        width: 'fit-content',
      }}
    >
      <Input
        style={{ width: 'auto', marginRight: '1rem' }}
        disabled={loading}
        value={applicationName}
        placeholder={'Application name'}
        onChange={({ currentTarget: { value } }) => setApplicationName(value)}
      />
      <ButtonsGroup
        style={{
          width: 'fit-content',
        }}
      >
        <Button
          disabled={loading || !applicationName}
          onClick={async () => {
            await confirm(
              `Are you sure you want to create an application called ${applicationName}?`,
            ).then(() =>
              toast.promise(
                createApplication({
                  variables: {
                    applicationName: applicationName,
                  },
                  refetchQueries: [{ query: ListAuthApplicationsDocument }],
                }),
                {
                  loading: 'Creating application',
                  success: () => {
                    reset()
                    return 'Application created'
                  },
                  error: 'Could not create application',
                },
              ),
            )
          }}
        >
          Confirm
        </Button>
        <Button variant="tertiary" onClick={() => setCreatePressed(false)}>
          Cancel
        </Button>
      </ButtonsGroup>
    </Row>
  )
}
