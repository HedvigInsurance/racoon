import styled from '@emotion/styled'
import { Button, useConfirmDialog } from '@hedvig-ui'
import gql from 'graphql-tag'
import { toast } from 'react-hot-toast'
import { usePurgeTasksMutation } from 'types/generated/graphql'

gql`
  mutation PurgeTasks {
    purgeTasks
  }
`

const Wrapper = styled.div`
  padding: 2rem;
`

export default function TasksToolPage() {
  const [purgeTasks, { loading }] = usePurgeTasksMutation()
  const { confirm } = useConfirmDialog()

  const handleRecreateTasks = () => {
    confirm(
      'Are you sure you want to purge and recreate all current tasks?',
    ).then(() => {
      toast.promise(purgeTasks(), {
        success: 'Tasks purged, will be recreated in a moment',
        loading: 'Purging tasks',
        error: 'Could not purge tasks',
      })
    })
  }

  return (
    <Wrapper>
      <Button onClick={handleRecreateTasks} disabled={loading}>
        Recreate tasks
      </Button>
    </Wrapper>
  )
}
