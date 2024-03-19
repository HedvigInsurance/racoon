import { Heading, Space } from 'ui'
import * as GridLayout from '@/components/GridLayout/GridLayout'
import { TrialContractForm } from './components/TrialContractForm'

function TrialDebuggerPage() {
  return (
    <GridLayout.Root>
      <GridLayout.Content width="1/3" align="center">
        <Space y={2}>
          <Heading as="h1" align="center">
            Trial Contract Debugger
          </Heading>
          <TrialContractForm />
        </Space>
      </GridLayout.Content>
    </GridLayout.Root>
  )
}

export default TrialDebuggerPage
