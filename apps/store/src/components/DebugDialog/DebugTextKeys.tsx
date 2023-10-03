import { useRouter } from 'next/router'
import { ButtonNextLink } from '@/components/ButtonNextLink'
import { ORIGIN_URL } from '@/utils/PageLink'

export const DebugTextKeys = () => {
  const router = useRouter()
  const debugUrl = new URL(router.asPath, ORIGIN_URL)
  const isDebugTextkeys = debugUrl.searchParams.get('debug') === 'textkeys'
  debugUrl.searchParams.set('debug', isDebugTextkeys ? 'none' : 'textkeys')

  return (
    <ButtonNextLink variant="secondary" href={debugUrl} replace={true}>
      {isDebugTextkeys ? 'Reset' : 'Debug'} text keys
    </ButtonNextLink>
  )
}
