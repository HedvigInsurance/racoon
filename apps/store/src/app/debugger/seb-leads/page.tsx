import { Heading, sprinkles, Text, yStack } from 'ui'
import {GenerateAndSendOfferButton} from "@/app/debugger/seb-leads/GenerateAndSendOfferButton";
import {ImportAndStoreLeadsForm} from "@/app/debugger/seb-leads/ImportAndStoreLeadsForm";
import * as GridLayout from '@/components/GridLayout/GridLayout'
import { SebLeadsDebuggerForm } from './CreateSebLeadsForm'
import { CreateWidgetSessionForm } from './CreateWidgetSessionForm'
import { ImportSebLeadForm } from './ImportSebLeadForm'

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
          <Heading as="h2" className={sprinkles({ marginTop: 'xl' })}>
            Create widget session
          </Heading>
          <CreateWidgetSessionForm />
          <Heading as="h2" className={sprinkles({ marginTop: 'xl' })}>
            Create widget session from existing leads And send offer to customer
          </Heading>
          <GenerateAndSendOfferButton />
          <Heading as="h2" className={sprinkles({ marginTop: 'xl' })}>
            Import and store SEB Leads
          </Heading>
          <ImportAndStoreLeadsForm />
        </div>
      </GridLayout.Content>
    </GridLayout.Root>
  )
}

export default SebLeadsDebuggerPage

export const metadata = {
  robots: 'noindex, nofollow',
}
