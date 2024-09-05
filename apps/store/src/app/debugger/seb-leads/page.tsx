import { Heading, sprinkles, Text, yStack } from 'ui'
import { SebLeadsDebuggerForm } from '@/app/debugger/seb-leads/CreateSebLeadsForm'
import * as GridLayout from '@/components/GridLayout/GridLayout'

function SebLeadsDebuggerPage() {
  if (process.env.VERCEL_ENV === 'production') {
    return <Text>Only available in test environment</Text>
  }
  return (
    <GridLayout.Root>
      <GridLayout.Content width="1/3" align="center">
        <div className={yStack({ gap: 'xl' })}>
          <Heading className={sprinkles({ marginTop: 'xl' })} as="h1" align="center" balance={true}>
            Create SEB Leads
          </Heading>
          <SebLeadsDebuggerForm />
        </div>
      </GridLayout.Content>
    </GridLayout.Root>
  )
}

export default SebLeadsDebuggerPage

export const metadata = {
  robots: 'noindex, nofollow',
}
