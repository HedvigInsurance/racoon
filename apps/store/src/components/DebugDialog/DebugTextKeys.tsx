import { usePathname, useSearchParams } from 'next/navigation'
import { ButtonNextLink } from '@/components/ButtonNextLink'
import { ORIGIN_URL } from '@/utils/PageLink'

export const DebugTextKeys = () => {
  const pathname = usePathname()
  const debugUrl = new URL(pathname ?? '', ORIGIN_URL)
  const searchParams = useSearchParams()
  const isDebugTextkeys = searchParams?.get('debug') === 'textkeys'
  debugUrl.searchParams.set('debug', isDebugTextkeys ? 'none' : 'textkeys')

  return (
    <ButtonNextLink variant="secondary" href={debugUrl} replace={true} fullWidth={true}>
      {isDebugTextkeys ? 'Reset' : 'Debug'} text keys
    </ButtonNextLink>
  )
}
