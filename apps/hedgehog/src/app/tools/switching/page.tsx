import * as Collapsible from '@radix-ui/react-collapsible'

import {
  Flex,
  Table,
  TableColumn,
  TableHeader,
  TableRow,
} from '@hedvig-ui/redesign'

import { SwitcherCaseFragment } from 'types/generated/graphql'

import SwitcherCaseDetails from './components/SwitcherCaseDetails'

import { MemberCell } from './components/MemberCell'
import { cssUtil } from '@hedvig-ui/redesign/theme/cssUtil.css'
import { ArrowDownUp } from 'react-bootstrap-icons'
import { CurrentInsurerCell } from './components/CurrentInsurerCell'
import { HedvigInsuranceCell } from './components/HedvigInsuranceCell'
import { RecentEventCell } from './components/RecentEventCell'
import { CompleteSwitcherCase } from './components/CompleteSwitcherCase'
import { AddSwitcherCaseNote } from './components/AddSwitcherCaseNote'
import { MarkAsReminded } from './components/MarkSwitcherCaseAsReminded'
import { CopySwitchConfirmationFormLink } from './components/CopySwitchConfirmationFormLink'
import { DownloadMandate } from './components/DownloadMandate'
import { AbortSwitcherCase } from './components/AbortSwitcherCase'
import { getSwticherCases } from './actions'

export type PropsWithSwitcherCase<T = unknown> = T & {
  switcher: SwitcherCaseFragment
}

export default async function SwitchingPage() {
  const switcherCases = await getSwticherCases()

  return (
    <Flex direction="column" p="lg">
      <h1>🏡 Switching</h1>
      <Table mt={'lg'} templateColumns="1fr 1fr 1fr 1.5fr 0.1fr">
        <TableHeader>
          <TableColumn>Member</TableColumn>
          <TableColumn>Current insurance</TableColumn>
          <TableColumn>Hedvig insurance</TableColumn>
          <TableColumn>Recent event</TableColumn>
          <TableColumn>{/*Toggle icon*/}</TableColumn>
        </TableHeader>

        {switcherCases.map((switcherCase) => (
          <Collapsible.Root key={switcherCase.id}>
            <Collapsible.Trigger asChild>
              <TableRow className={cssUtil.pointer}>
                <TableColumn>
                  <MemberCell switcher={switcherCase} />
                </TableColumn>

                <TableColumn>
                  <CurrentInsurerCell switcher={switcherCase} />
                </TableColumn>

                <TableColumn>
                  <HedvigInsuranceCell switcher={switcherCase} />
                </TableColumn>

                <TableColumn>
                  <RecentEventCell switcher={switcherCase} />
                </TableColumn>

                <TableColumn>
                  <ArrowDownUp />
                </TableColumn>
              </TableRow>
            </Collapsible.Trigger>

            <Collapsible.Content>
              <SwitcherCaseDetails.Root>
                <SwitcherCaseDetails.Events switcher={switcherCase} />

                <SwitcherCaseDetails.Actions>
                  <CompleteSwitcherCase switcher={switcherCase} />

                  <AddSwitcherCaseNote switcher={switcherCase} />

                  <MarkAsReminded switcher={switcherCase} />

                  <CopySwitchConfirmationFormLink switcher={switcherCase} />

                  {switcherCase.mandatePdfUrl && (
                    <DownloadMandate switcher={switcherCase} />
                  )}

                  <AbortSwitcherCase switcher={switcherCase} />
                </SwitcherCaseDetails.Actions>
              </SwitcherCaseDetails.Root>
            </Collapsible.Content>
          </Collapsible.Root>
        ))}
      </Table>
    </Flex>
  )
}
