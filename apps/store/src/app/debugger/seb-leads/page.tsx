import { Heading, sprinkles, Text, yStack } from 'ui'
import { SebLeadsDebuggerForm } from '@/app/debugger/seb-leads/CreateSebLeadsForm'
import { ImportSebLeadForm } from '@/app/debugger/seb-leads/ImportSebLeadForm'
import * as GridLayout from '@/components/GridLayout/GridLayout'

function SebLeadsDebuggerPage() {
  if (process.env.VERCEL_ENV === 'production') {
    return <Text>Only available in test environment</Text>
  }
  return (
    <GridLayout.Root>
      <GridLayout.Content width="1/3" align="center">
        <div className={yStack({ gap: 'md' })}>
          <Heading as="h2">Create SEB Lead</Heading>
          <SebLeadsDebuggerForm />
          <Heading as="h2" className={sprinkles({ marginTop: 'xl' })}>
            Import SEB Lead
          </Heading>
          <ImportSebLeadForm />
        </div>
      </GridLayout.Content>
    </GridLayout.Root>
  )
}

export default SebLeadsDebuggerPage

export const metadata = {
  robots: 'noindex, nofollow',
}
