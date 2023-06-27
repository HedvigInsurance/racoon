// TODO: Typecheck key and namespace value
// Annotate translation keys for extraction

import { Namespace, ParseKeys } from 'i18next'

// useTranslation('purchase-form')
export const tKey = <ns extends Namespace>(key: ParseKeys<ns>) => key

// Make sure scanner puts translations in proper  namespaces
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const setI18nNamespace = (ns: string) => {}
