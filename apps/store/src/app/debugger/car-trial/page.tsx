import { Space, Heading, theme } from 'ui'
import * as GridLayout from '@/components/GridLayout/GridLayout'
import { CarTrialDebuggerForm } from './CarTrialDebuggerForm'

function CarTrialDebuggerPage() {
  return (
    <Space>
      <GridLayout.Root>
        <GridLayout.Content width="1/3" align="center">
          <Space y={2}>
            <Heading
              as="h1"
              align="center"
              balance={true}
              variant={{ _: 'serif.24', lg: 'serif.32' }}
              mt={theme.space.xl}
            >
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
