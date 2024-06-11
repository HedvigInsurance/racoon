import { sprinkles } from 'ui/src/theme/sprinkles.css'
import { Space, Heading } from 'ui'
import * as GridLayout from '@/components/GridLayout/GridLayout'
import { CarTrialDebuggerForm } from './CarTrialDebuggerForm'

function CarTrialDebuggerPage() {
  return (
    <Space>
      <GridLayout.Root>
        <GridLayout.Content width="1/3" align="center">
          <Space y={2}>
            <Heading className={sprinkles({ mt: 'xl' })} as="h1" align="center" balance={true}>
              Create car trial
            </Heading>
            <CarTrialDebuggerForm />
          </Space>
        </GridLayout.Content>
      </GridLayout.Root>
    </Space>
  )
}

export default CarTrialDebuggerPage
