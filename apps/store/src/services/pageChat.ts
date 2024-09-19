const HIDE_CHAT_PAGE_PROP = '_hideChat'

export const hideChatOnPage = (hidden?: boolean) => ({ [HIDE_CHAT_PAGE_PROP]: hidden ?? true })
export const hasHiddenChat = (props: Record<string, unknown>) => Boolean(props[HIDE_CHAT_PAGE_PROP])
