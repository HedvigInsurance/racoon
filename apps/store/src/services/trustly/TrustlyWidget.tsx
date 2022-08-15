import Script from 'next/script'
import { useTrustly } from './useTrustly'

export const TrustlyWidget = () => {
  const { handleOnLoad, scriptSrc } = useTrustly()

  return (
    <>
      <Script src={scriptSrc} strategy="afterInteractive" onLoad={handleOnLoad} />
      <div id="trustly-widget"></div>
    </>
  )
}
