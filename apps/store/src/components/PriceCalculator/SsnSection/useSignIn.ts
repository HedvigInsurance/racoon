import { datadogLogs } from '@datadog/browser-logs'
import { useCallback, useState } from 'react'
import { PageLink } from '@/utils/PageLink'

type Params = {
  shopSessionId: string
  onSuccess: () => void
}

export const useSignIn = ({ shopSessionId, onSuccess }: Params) => {
  const [loading, setLoading] = useState(false)

  const onSubmit = useCallback(
    async (ssn: string) => {
      setLoading(true)
      try {
        const response = await fetch(PageLink.apiLoginSe(), {
          method: 'POST',
          body: JSON.stringify({ ssn }),
          headers: {
            'Content-Type': 'application/json',
          },
        })
        if (!response.ok) {
          throw new Error('Could not log in with BankID')
        }

        // TODO: Authenticate ShopSession
        console.log('TODO: Authenticate ShopSession: ', shopSessionId)

        onSuccess()
      } catch (error) {
        datadogLogs.logger.error('Error logging in with BankID', { error })
      } finally {
        setLoading(false)
      }
    },
    [shopSessionId, onSuccess],
  )

  return [onSubmit, loading] as const
}
