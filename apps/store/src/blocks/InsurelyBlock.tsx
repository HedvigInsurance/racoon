'use client'
import { datadogLogs } from '@datadog/browser-logs'
import styled from '@emotion/styled'
import { storyblokEditable } from '@storyblok/react'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { theme } from 'ui'
import * as GridLayout from '@/components/GridLayout/GridLayout'
import {
  INSURELY_IFRAME_MAX_HEIGHT,
  INSURELY_IFRAME_MAX_WIDTH,
} from '@/services/Insurely/Insurely.constants'
import { InsurelyIframe, setInsurelyConfig } from '@/services/Insurely/InsurelyIframe'
import { type GridColumnsField, type SbBaseBlockProps } from '@/services/storyblok/storyblok'

// For Insurely Sales Support Tool
const CONFIG_NAME = 'hedvig-sst'

type Props = SbBaseBlockProps<{
  layout?: GridColumnsField
}>

export const InsurelyBlock = (props: Props) => {
  const handleCompleted = () => {
    datadogLogs.logger.info('InsurelyBlock | Completed')
  }

  const layoutProps = {
    width: props.blok.layout?.widths ?? { base: '1' },
    align: props.blok.layout?.alignment,
  }

  const searchParams = useSearchParams()
  const sessionId = searchParams?.get('sessionId')
  useEffect(() => {
    if (!sessionId) return
    datadogLogs.setGlobalContextProperty('insurelySalesSupportToolSessionId', sessionId)
    setInsurelyConfig({
      showCloseButton: false,
      hideResultsView: false,
      salesSupportToolSessionId: typeof sessionId === 'string' ? sessionId : undefined,
      multiCompanySelect: true,
    })
  }, [sessionId])

  return (
    <GridLayout.Root {...storyblokEditable}>
      <GridLayout.Content {...layoutProps}>
        <StyledInsurelyIframe configName={CONFIG_NAME} onCompleted={handleCompleted} />
      </GridLayout.Content>
    </GridLayout.Root>
  )
}
InsurelyBlock.blockName = 'insurely'

const StyledInsurelyIframe = styled(InsurelyIframe)({
  marginInline: 'auto',
  borderRadius: theme.radius.lg,
  boxShadow: theme.shadow.default,

  width: '100%',
  maxWidth: INSURELY_IFRAME_MAX_WIDTH,
  minHeight: INSURELY_IFRAME_MAX_HEIGHT,
  backgroundColor: theme.colors.white,
})
