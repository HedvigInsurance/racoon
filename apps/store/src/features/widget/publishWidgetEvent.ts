enum Status {
  Success = 'success',
  Signed = 'signed',
  Close = 'close',
  Event = 'event',
}

/**
 * WidgetEvent
 * Event sent from the widget to the parent window for partner integrations to listen to.
 *
 * - `signed` - The user has successfully signed the insurance
 * - `success` - The user has successfully signed the insurance and connected payment
 * - `close` - The user pressed one of our close buttons.
 * - `event` - An unspecified event is sent to the partner including a second parameter “message” that includes the request ID
 */

export type WidgetEvent =
  | { status: Status.Success }
  | { status: Status.Signed }
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
  signed: () => sendWidgetEvent({ status: Status.Signed }),
  close: () => sendWidgetEvent({ status: Status.Close }),
  event: (message: { requestId: string }) => sendWidgetEvent({ status: Status.Event, message }),
}

const STATUS_OPTIONS = Object.values(Status)
export const isWidgetEvent = (event: MessageEvent): event is MessageEvent<WidgetEvent> => {
  return STATUS_OPTIONS.includes(event.data.status)
}
