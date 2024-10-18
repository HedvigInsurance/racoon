import { datadogRum } from '@datadog/browser-rum'
import styled from '@emotion/styled'
import { useState } from 'react'
import { Dialog } from 'ui/src/components/Dialog/Dialog'
import { Button, theme } from 'ui'
import { useShowAppError } from '@/services/appErrors/appErrorAtom'
import { useMemberAreaMemberInfoQuery, useTrustlyInitMutation } from '@/services/graphql/generated'
import { getTrustlyInitMutationVariables } from '@/services/trustly/createTrustlyUrl'
import {
  TRUSTLY_IFRAME_MAX_HEIGHT,
  TRUSTLY_IFRAME_MAX_WIDTH,
  TrustlyIframe,
} from '@/services/trustly/TrustlyIframe'
import { useRoutingLocale } from '@/utils/l10n/useRoutingLocale'

type State = { type: 'IDLE' } | { type: 'READY'; trustlyUrl: string }

export const PaymentConnection = ({ startButtonText }: { startButtonText: string }) => {
  const showError = useShowAppError()
  const locale = useRoutingLocale()
  const [createTrustlyUrl, result] = useTrustlyInitMutation({
    onError: showError,
    onCompleted(data) {
      const trustlyUrl = data.registerDirectDebit2.url
      setState({ type: 'READY', trustlyUrl })
    },
  })
  const [state, setState] = useState<State>({ type: 'IDLE' })

  const handleClickStart = () => {
    datadogRum.addAction('Payment Config Start')
    createTrustlyUrl({ variables: getTrustlyInitMutationVariables(locale) })
  }

  const handleClose = () => {
    datadogRum.addAction('Payment Config Close')
    setState({ type: 'IDLE' })
  }

  const { refetch } = useMemberAreaMemberInfoQuery()
  const handleSuccess = async () => {
    datadogRum.addAction('Payment Config Success')
    await refetch()
    setState({ type: 'IDLE' })
  }

  const handleFail = () => setState({ type: 'IDLE' })

  return (
    <>
      <Button loading={result.loading} onClick={handleClickStart} fullWidth={true}>
        {startButtonText}
      </Button>

      <Dialog.Root open={state.type === 'READY'} onOpenChange={handleClose}>
        <DialogIframeContent centerContent={true} onClose={handleClose}>
          <DialogIframeWindow>
            {state.type === 'READY' && (
              <TrustlyIframe url={state.trustlyUrl} onSuccess={handleSuccess} onFail={handleFail} />
            )}
          </DialogIframeWindow>
        </DialogIframeContent>
      </Dialog.Root>
    </>
  )
}

const DialogIframeContent = styled(Dialog.Content)({
  height: '100%',
  maxHeight: TRUSTLY_IFRAME_MAX_HEIGHT,
  width: '100%',
  maxWidth: TRUSTLY_IFRAME_MAX_WIDTH,
  padding: theme.space.xs,
  alignSelf: 'center',
})

const DialogIframeWindow = styled(Dialog.Window)({
  height: '100%',
  borderRadius: theme.radius.sm,
  overflowY: 'auto',
})
