export type WidgetEvent =
  | { status: 'success' }
  | { status: 'cancel' }
  | { status: 'error' }
  | { status: 'close' }
  | { status: 'event'; message: { requestId: string } }

export const publishWidgetEvent = (event: WidgetEvent): void => {
  if (window.ReactNativeWebView) {
    window.ReactNativeWebView.postMessage(JSON.stringify(event))
    console.debug(`Widget event (native) sent:`, event)
    return
  }

  window.parent.postMessage(event, '*')
  console.debug(`Widget event (web) sent:`, event)
}
