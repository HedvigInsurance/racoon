import {
  ConfirmDialogProvider,
  DraftProvider,
  NavigationProvider,
} from '@hedvig-ui'

import { MemberHistoryProvider } from '@hope/common/hooks/use-member-history'
import { TemplateMessagesProvider } from '@hope/features/template-messages/use-template-messages'

import { HopePageRoutes } from '@hope/pages/HopePageRoutes'
import { useEffect } from 'react'
import * as React from 'react'
import TagManager from 'react-gtm-module'
import { CommandLineProvider } from '@hope/features/commands/hooks/use-command-line'

import { MeFragment } from 'types/generated/graphql'

export const App: React.FC<{ me: MeFragment }> = ({ me }) => {
  useEffect(() => {
    if (!me) {
      return
    }

    TagManager.initialize({
      gtmId: 'GTM-MPF6CLX',
      dataLayer: {
        userEmail: me.user.email,
        environment: process.env.NODE_ENV,
      },
    })
  }, [me])

  return (
    <NavigationProvider>
      <MemberHistoryProvider>
        <DraftProvider>
          <CommandLineProvider>
            <TemplateMessagesProvider>
              <ConfirmDialogProvider>
                <HopePageRoutes />
              </ConfirmDialogProvider>
            </TemplateMessagesProvider>
          </CommandLineProvider>
        </DraftProvider>
      </MemberHistoryProvider>
    </NavigationProvider>
  )
}
