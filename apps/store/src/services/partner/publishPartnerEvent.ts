export type PartnerEvent =
  | { status: 'success' }
  | { status: 'cancel' }
  | { status: 'error' }
  | { status: 'close' }
  | { status: 'event'; message: { requestId: string } }

export const publishPartnerEvent = (event: PartnerEvent): void => {
  if (window.ReactNativeWebView) {
    window.ReactNativeWebView.postMessage(JSON.stringify(event))
    console.debug(`Partner event (native) sent:`, event)
    return
  }

  window.parent.postMessage(event, '*')
  console.debug(`Partner event (web) sent:`, event)
}
