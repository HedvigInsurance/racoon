export type JSONPassage = {
  id: string
  name: string
  url: string
  text: string
}

export type JSONComputedValue = {
  key: string
  value: string
}

export type JSONStory = {
  id: string
  name: string
  lastUpdate: string
  locales: Array<string>

  metadata: Array<unknown>

  passages: Array<JSONPassage>
  startPassage: string

  keywords: Record<string, string>
  trackableProperties: Array<string>
  computedStoreValues: Array<JSONComputedValue>
}

export enum Attribute {
  NextLink = 'next',
  ToLink = 'to',
  Key = 'key',
  From = 'from',
  As = 'as',
  Title = 'title',
  Placeholder = 'placeholder',
  IsLarge = 'large',
  Mask = 'mask',
  Unit = 'unit',
  MinValue = 'minvalue',
  Value = 'value',
  Redirect = 'redirect',
  When = 'when',
  QuoteCardId = 'id',
  InsuranceTypes = 'insurancetypes',
}
