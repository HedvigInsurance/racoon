enum Status {
  Success = 'success',
  Close = 'close',
  Event = 'event',
}

export type WidgetEvent =
  | { status: Status.Success }
  | { status: Status.Close }
  | { status: Status.Event; message: { requestId: string } }

const sendWidgetEvent = (event: WidgetEvent): void => {
  if (window.ReactNativeWebView) {
    window.ReactNativeWebView.postMessage(JSON.stringify(event))
    console.debug(`Widget event (native) sent:`, event)
    return
  }

  window.parent.postMessage(event, '*')
  console.debug(`Widget event (web) sent:`, event)
}

export const publishWidgetEvent = {
  success: () => sendWidgetEvent({ status: Status.Success }),
  close: () => sendWidgetEvent({ status: Status.Close }),
  event: (message: { requestId: string }) => sendWidgetEvent({ status: Status.Event, message }),
}

const STATUS_OPTIONS = Object.values(Status)
export const isWidgetEvent = (event: MessageEvent): event is MessageEvent<WidgetEvent> => {
  return STATUS_OPTIONS.includes(event.data.status)
}
