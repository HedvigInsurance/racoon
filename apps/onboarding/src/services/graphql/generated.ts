import { DocumentNode } from 'graphql'
import gql from 'graphql-tag'
export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  CheckoutPaymentAction: any
  /** A String-representation of Adyen's checkout payments action */
  CheckoutPaymentsAction: any
  /** A date string, such as 2007-12-03 (YYYY-MM-DD), compliant with ISO 8601 standard for representation of dates using the Gregorian calendar. */
  Date: any
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the date-timeformat outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representationof dates and times using the Gregorian calendar. */
  DateTime: any
  Hex: any
  /** An ISO-8601 String representation of a `java.time.Instant`, e.g. "2019-07-03T19:07:38.494081Z". */
  Instant: any
  /** Generic type for json values */
  JSON: any
  JSONObject: any
  JSONString: any
  /** Raw JSON value */
  Json: any
  /** An ISO-8601 String representation of a `java.time.LocalDate`, e.g. "2019-07-03". */
  LocalDate: any
  /** The Long scalar type represents non-fractional signed whole numeric values. Long can represent values between -(2^63) and 2^63 - 1. */
  Long: any
  Object: any
  /** Adyen additional payment details type, used in 3DS flow */
  PaymentDetailsInput: any
  /** Adyen payment details type */
  PaymentMethodDetails: any
  PaymentMethodsResponse: any
  /** A String-representation of Adyen's payments details request */
  PaymentsDetailsRequest: any
  RGBAHue: any
  RGBATransparency: any
  /** Slate-compatible RichText AST */
  RichTextAST: any
  TimeStamp: any
  URL: any
  UUID: any
  /** The `Upload` scalar type represents a file upload. */
  Upload: any
}

export type AcceptedReferral = {
  __typename?: 'AcceptedReferral'
  quantity?: Maybe<Scalars['Int']>
}

export type ActionRequired = {
  __typename?: 'ActionRequired'
  action: Scalars['CheckoutPaymentAction']
  paymentTokenId: Scalars['ID']
}

/** The contract has an inception date in the future and a termination date in the future */
export type ActiveInFutureAndTerminatedInFutureStatus = {
  __typename?: 'ActiveInFutureAndTerminatedInFutureStatus'
  futureInception?: Maybe<Scalars['LocalDate']>
  futureTermination?: Maybe<Scalars['LocalDate']>
}

/** The contract has an inception date set in the future */
export type ActiveInFutureStatus = {
  __typename?: 'ActiveInFutureStatus'
  futureInception?: Maybe<Scalars['LocalDate']>
}

export type ActivePaymentMethodsResponse = {
  __typename?: 'ActivePaymentMethodsResponse'
  storedPaymentMethodsDetails: StoredPaymentMethodsDetails
}

export type ActivePaymentMethodsV2Response = StoredCardDetails | StoredThirdPartyDetails

export type ActivePayoutMethodsResponse = {
  __typename?: 'ActivePayoutMethodsResponse'
  status: PayoutMethodStatus
}

export type ActiveReferral = {
  __typename?: 'ActiveReferral'
  discount: MonetaryAmountV2
  name?: Maybe<Scalars['String']>
}

/** The contract has an inception date set today or in the past without a termination date set */
export type ActiveStatus = {
  __typename?: 'ActiveStatus'
  pastInception?: Maybe<Scalars['LocalDate']>
  upcomingAgreementChange?: Maybe<UpcomingAgreementChange>
}

export type AddCampaignResult = BasicError | QuoteCart

export type AddPaymentTokenResult = BasicError | QuoteCart

export type AddPhotoToKeyGearItemInput = {
  file: S3FileInput
  itemId: Scalars['ID']
}

export type AddReceiptToKeyGearItemInput = {
  file: S3FileInput
  itemId: Scalars['ID']
}

export type AdditionalPaymentDetailsInput = {
  paymentDetailsInput: Scalars['PaymentDetailsInput']
}

export type AdditionalPaymentsDetailsRequest = {
  paymentsDetailsRequest: Scalars['PaymentsDetailsRequest']
}

export type AdditionalPaymentsDetailsResponse =
  | AdditionalPaymentsDetailsResponseAction
  | AdditionalPaymentsDetailsResponseFinished

export type AdditionalPaymentsDetailsResponseAction = {
  __typename?: 'AdditionalPaymentsDetailsResponseAction'
  action: Scalars['CheckoutPaymentsAction']
}

export type AdditionalPaymentsDetailsResponseFinished = {
  __typename?: 'AdditionalPaymentsDetailsResponseFinished'
  resultCode: Scalars['String']
  tokenizationResult: TokenizationResultType
}

export type Address = {
  __typename?: 'Address'
  apartment?: Maybe<Scalars['String']>
  city?: Maybe<Scalars['String']>
  floor?: Maybe<Scalars['String']>
  postalCode: Scalars['String']
  street: Scalars['String']
}

export type AddressAutocompleteOptions = {
  type?: InputMaybe<AddressAutocompleteType>
}

export enum AddressAutocompleteType {
  Apartment = 'APARTMENT',
  Building = 'BUILDING',
  Street = 'STREET',
}

/** A quote-agnostic payload type for changing the addess. */
export type AddressChangeInput = {
  /** Ancillary area. Required if type == HOUSE. */
  ancillaryArea?: InputMaybe<Scalars['Int']>
  /** The target bundle that should have its address changed. */
  contractBundleId: Scalars['ID']
  /** A list of extra buildings outside of the main property. */
  extraBuildings?: InputMaybe<Array<AddressHouseExtraBuilding>>
  /** Set to true if the insurance is concerning a student. Concept used in Sweden, Denmark */
  isStudent?: InputMaybe<Scalars['Boolean']>
  /** Is this property subleted? Required if type == HOUSE. */
  isSubleted?: InputMaybe<Scalars['Boolean']>
  /** Set to true if the insurance is concerning a youth. Concept used in Norway */
  isYouth?: InputMaybe<Scalars['Boolean']>
  /** The total living space, in square meters. */
  livingSpace: Scalars['Int']
  /** Number co-insured, the number of people on the contract except for the policy holder. */
  numberCoInsured: Scalars['Int']
  /** Number of bathrooms. Required if type == HOUSE. */
  numberOfBathrooms?: InputMaybe<Scalars['Int']>
  /** Is this a rental or do does the policy holder own it? */
  ownership: AddressOwnership
  /** The date the member gets access to this new home. */
  startDate: Scalars['LocalDate']
  /** Street value, including number. */
  street: Scalars['String']
  /** Is this an apartment or a house. */
  type: AddressHomeType
  /** Year of construction. Required if type == HOUSE. */
  yearOfConstruction?: InputMaybe<Scalars['Int']>
  /** Zip code. */
  zip: Scalars['String']
}

export type AddressChangeQuoteFailure = {
  __typename?: 'AddressChangeQuoteFailure'
  breachedUnderwritingGuidelines: Array<Scalars['String']>
}

export type AddressChangeQuoteResult = AddressChangeQuoteFailure | AddressChangeQuoteSuccess

export type AddressChangeQuoteSuccess = {
  __typename?: 'AddressChangeQuoteSuccess'
  quoteIds: Array<Scalars['ID']>
}

export enum AddressHomeType {
  Apartment = 'APARTMENT',
  House = 'HOUSE',
}

export type AddressHouseExtraBuilding = {
  area: Scalars['Int']
  hasWaterConnected: Scalars['Boolean']
  type: Scalars['String']
}

export type AddressInput = {
  street: Scalars['String']
  zipCode: Scalars['String']
}

export enum AddressOwnership {
  Brf = 'BRF',
  Own = 'OWN',
  Rent = 'RENT',
}

export type Adyen = {
  __typename?: 'Adyen'
  availablePaymentMethods: Scalars['PaymentMethodsResponse']
}

export type Aggregate = {
  __typename?: 'Aggregate'
  count: Scalars['Int']
}

export type Agreement =
  | DanishAccidentAgreement
  | DanishHomeContentAgreement
  | DanishTravelAgreement
  | NorwegianAccidentAgreement
  | NorwegianHomeContentAgreement
  | NorwegianHouseAgreement
  | NorwegianTravelAgreement
  | SwedishAccidentAgreement
  | SwedishApartmentAgreement
  | SwedishCarAgreement
  | SwedishHouseAgreement
  | SwedishQasaRentalAgreement

export type AgreementCore = {
  activeFrom?: Maybe<Scalars['LocalDate']>
  activeTo?: Maybe<Scalars['LocalDate']>
  carrier?: Maybe<Scalars['String']>
  certificateUrl?: Maybe<Scalars['String']>
  id: Scalars['ID']
  partner?: Maybe<Scalars['String']>
  premium: MonetaryAmountV2
  status: AgreementStatus
}

export enum AgreementStatus {
  /** An agreement that is active today */
  Active = 'ACTIVE',
  /** An agreement that will be active on a future date */
  ActiveInFuture = 'ACTIVE_IN_FUTURE',
  /** An agreement with no activation date, waiting to be activated */
  Pending = 'PENDING',
  /** An agreement that either was never active that is now terminated or was active in the past of a now terminated contract */
  Terminated = 'TERMINATED',
}

export type AngelStory = {
  __typename?: 'AngelStory'
  content: Scalars['String']
}

export enum ApartmentType {
  Brf = 'BRF',
  Rent = 'RENT',
  StudentBrf = 'STUDENT_BRF',
  StudentRent = 'STUDENT_RENT',
}

/** The background image for the login screen */
export type AppMarketingImage = Node & {
  __typename?: 'AppMarketingImage'
  blurhash?: Maybe<Scalars['String']>
  /** The time the document was created */
  createdAt: Scalars['DateTime']
  /** User that created this document */
  createdBy?: Maybe<User>
  /** Get the document in other stages */
  documentInStages: Array<AppMarketingImage>
  /** List of AppMarketingImage versions */
  history: Array<Version>
  /** The unique identifier */
  id: Scalars['ID']
  image?: Maybe<Asset>
  language?: Maybe<Language>
  /** The time the document was published. Null on documents in draft stage. */
  publishedAt?: Maybe<Scalars['DateTime']>
  /** User that last published this document */
  publishedBy?: Maybe<User>
  scheduledIn: Array<ScheduledOperation>
  /** System stage field */
  stage: Stage
  /** The time the document was updated */
  updatedAt: Scalars['DateTime']
  /** User that last updated this document */
  updatedBy?: Maybe<User>
  userInterfaceStyle: UserInterfaceStyle
}

/** The background image for the login screen */
export type AppMarketingImageCreatedByArgs = {
  locales?: InputMaybe<Array<Locale>>
}

/** The background image for the login screen */
export type AppMarketingImageDocumentInStagesArgs = {
  includeCurrent?: Scalars['Boolean']
  inheritLocale?: Scalars['Boolean']
  stages?: Array<Stage>
}

/** The background image for the login screen */
export type AppMarketingImageHistoryArgs = {
  limit?: Scalars['Int']
  skip?: Scalars['Int']
  stageOverride?: InputMaybe<Stage>
}

/** The background image for the login screen */
export type AppMarketingImageImageArgs = {
  locales?: InputMaybe<Array<Locale>>
}

/** The background image for the login screen */
export type AppMarketingImageLanguageArgs = {
  locales?: InputMaybe<Array<Locale>>
}

/** The background image for the login screen */
export type AppMarketingImagePublishedByArgs = {
  locales?: InputMaybe<Array<Locale>>
}

/** The background image for the login screen */
export type AppMarketingImageScheduledInArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  locales?: InputMaybe<Array<Locale>>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<ScheduledOperationWhereInput>
}

/** The background image for the login screen */
export type AppMarketingImageUpdatedByArgs = {
  locales?: InputMaybe<Array<Locale>>
}

export type AppMarketingImageConnectInput = {
  /** Allow to specify document position in list of connected documents, will default to appending at end of list */
  position?: InputMaybe<ConnectPositionInput>
  /** Document to connect */
  where: AppMarketingImageWhereUniqueInput
}

/** A connection to a list of items. */
export type AppMarketingImageConnection = {
  __typename?: 'AppMarketingImageConnection'
  aggregate: Aggregate
  /** A list of edges. */
  edges: Array<AppMarketingImageEdge>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
}

export type AppMarketingImageCreateInput = {
  blurhash?: InputMaybe<Scalars['String']>
  createdAt?: InputMaybe<Scalars['DateTime']>
  image?: InputMaybe<AssetCreateOneInlineInput>
  language?: InputMaybe<LanguageCreateOneInlineInput>
  updatedAt?: InputMaybe<Scalars['DateTime']>
  userInterfaceStyle: UserInterfaceStyle
}

export type AppMarketingImageCreateManyInlineInput = {
  /** Connect multiple existing AppMarketingImage documents */
  connect?: InputMaybe<Array<AppMarketingImageWhereUniqueInput>>
  /** Create and connect multiple existing AppMarketingImage documents */
  create?: InputMaybe<Array<AppMarketingImageCreateInput>>
}

export type AppMarketingImageCreateOneInlineInput = {
  /** Connect one existing AppMarketingImage document */
  connect?: InputMaybe<AppMarketingImageWhereUniqueInput>
  /** Create and connect one AppMarketingImage document */
  create?: InputMaybe<AppMarketingImageCreateInput>
}

/** An edge in a connection. */
export type AppMarketingImageEdge = {
  __typename?: 'AppMarketingImageEdge'
  /** A cursor for use in pagination. */
  cursor: Scalars['String']
  /** The item at the end of the edge. */
  node: AppMarketingImage
}

/** Identifies documents */
export type AppMarketingImageManyWhereInput = {
  /** Logical AND on all given filters. */
  AND?: InputMaybe<Array<AppMarketingImageWhereInput>>
  /** Logical NOT on all given filters combined by AND. */
  NOT?: InputMaybe<Array<AppMarketingImageWhereInput>>
  /** Logical OR on all given filters. */
  OR?: InputMaybe<Array<AppMarketingImageWhereInput>>
  /** Contains search across all appropriate fields. */
  _search?: InputMaybe<Scalars['String']>
  blurhash?: InputMaybe<Scalars['String']>
  /** All values containing the given string. */
  blurhash_contains?: InputMaybe<Scalars['String']>
  /** All values ending with the given string. */
  blurhash_ends_with?: InputMaybe<Scalars['String']>
  /** All values that are contained in given list. */
  blurhash_in?: InputMaybe<Array<Scalars['String']>>
  /** All values that are not equal to given value. */
  blurhash_not?: InputMaybe<Scalars['String']>
  /** All values not containing the given string. */
  blurhash_not_contains?: InputMaybe<Scalars['String']>
  /** All values not ending with the given string */
  blurhash_not_ends_with?: InputMaybe<Scalars['String']>
  /** All values that are not contained in given list. */
  blurhash_not_in?: InputMaybe<Array<Scalars['String']>>
  /** All values not starting with the given string. */
  blurhash_not_starts_with?: InputMaybe<Scalars['String']>
  /** All values starting with the given string. */
  blurhash_starts_with?: InputMaybe<Scalars['String']>
  createdAt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than the given value. */
  createdAt_gt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than or equal the given value. */
  createdAt_gte?: InputMaybe<Scalars['DateTime']>
  /** All values that are contained in given list. */
  createdAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  /** All values less than the given value. */
  createdAt_lt?: InputMaybe<Scalars['DateTime']>
  /** All values less than or equal the given value. */
  createdAt_lte?: InputMaybe<Scalars['DateTime']>
  /** All values that are not equal to given value. */
  createdAt_not?: InputMaybe<Scalars['DateTime']>
  /** All values that are not contained in given list. */
  createdAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  createdBy?: InputMaybe<UserWhereInput>
  id?: InputMaybe<Scalars['ID']>
  /** All values containing the given string. */
  id_contains?: InputMaybe<Scalars['ID']>
  /** All values ending with the given string. */
  id_ends_with?: InputMaybe<Scalars['ID']>
  /** All values that are contained in given list. */
  id_in?: InputMaybe<Array<Scalars['ID']>>
  /** All values that are not equal to given value. */
  id_not?: InputMaybe<Scalars['ID']>
  /** All values not containing the given string. */
  id_not_contains?: InputMaybe<Scalars['ID']>
  /** All values not ending with the given string */
  id_not_ends_with?: InputMaybe<Scalars['ID']>
  /** All values that are not contained in given list. */
  id_not_in?: InputMaybe<Array<Scalars['ID']>>
  /** All values not starting with the given string. */
  id_not_starts_with?: InputMaybe<Scalars['ID']>
  /** All values starting with the given string. */
  id_starts_with?: InputMaybe<Scalars['ID']>
  image?: InputMaybe<AssetWhereInput>
  language?: InputMaybe<LanguageWhereInput>
  publishedAt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than the given value. */
  publishedAt_gt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than or equal the given value. */
  publishedAt_gte?: InputMaybe<Scalars['DateTime']>
  /** All values that are contained in given list. */
  publishedAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  /** All values less than the given value. */
  publishedAt_lt?: InputMaybe<Scalars['DateTime']>
  /** All values less than or equal the given value. */
  publishedAt_lte?: InputMaybe<Scalars['DateTime']>
  /** All values that are not equal to given value. */
  publishedAt_not?: InputMaybe<Scalars['DateTime']>
  /** All values that are not contained in given list. */
  publishedAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  publishedBy?: InputMaybe<UserWhereInput>
  scheduledIn_every?: InputMaybe<ScheduledOperationWhereInput>
  scheduledIn_none?: InputMaybe<ScheduledOperationWhereInput>
  scheduledIn_some?: InputMaybe<ScheduledOperationWhereInput>
  updatedAt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than the given value. */
  updatedAt_gt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than or equal the given value. */
  updatedAt_gte?: InputMaybe<Scalars['DateTime']>
  /** All values that are contained in given list. */
  updatedAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  /** All values less than the given value. */
  updatedAt_lt?: InputMaybe<Scalars['DateTime']>
  /** All values less than or equal the given value. */
  updatedAt_lte?: InputMaybe<Scalars['DateTime']>
  /** All values that are not equal to given value. */
  updatedAt_not?: InputMaybe<Scalars['DateTime']>
  /** All values that are not contained in given list. */
  updatedAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  updatedBy?: InputMaybe<UserWhereInput>
  userInterfaceStyle?: InputMaybe<UserInterfaceStyle>
  /** All values that are contained in given list. */
  userInterfaceStyle_in?: InputMaybe<Array<UserInterfaceStyle>>
  /** All values that are not equal to given value. */
  userInterfaceStyle_not?: InputMaybe<UserInterfaceStyle>
  /** All values that are not contained in given list. */
  userInterfaceStyle_not_in?: InputMaybe<Array<UserInterfaceStyle>>
}

export enum AppMarketingImageOrderByInput {
  BlurhashAsc = 'blurhash_ASC',
  BlurhashDesc = 'blurhash_DESC',
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  PublishedAtAsc = 'publishedAt_ASC',
  PublishedAtDesc = 'publishedAt_DESC',
  UpdatedAtAsc = 'updatedAt_ASC',
  UpdatedAtDesc = 'updatedAt_DESC',
  UserInterfaceStyleAsc = 'userInterfaceStyle_ASC',
  UserInterfaceStyleDesc = 'userInterfaceStyle_DESC',
}

export type AppMarketingImageUpdateInput = {
  blurhash?: InputMaybe<Scalars['String']>
  image?: InputMaybe<AssetUpdateOneInlineInput>
  language?: InputMaybe<LanguageUpdateOneInlineInput>
  userInterfaceStyle?: InputMaybe<UserInterfaceStyle>
}

export type AppMarketingImageUpdateManyInlineInput = {
  /** Connect multiple existing AppMarketingImage documents */
  connect?: InputMaybe<Array<AppMarketingImageConnectInput>>
  /** Create and connect multiple AppMarketingImage documents */
  create?: InputMaybe<Array<AppMarketingImageCreateInput>>
  /** Delete multiple AppMarketingImage documents */
  delete?: InputMaybe<Array<AppMarketingImageWhereUniqueInput>>
  /** Disconnect multiple AppMarketingImage documents */
  disconnect?: InputMaybe<Array<AppMarketingImageWhereUniqueInput>>
  /** Override currently-connected documents with multiple existing AppMarketingImage documents */
  set?: InputMaybe<Array<AppMarketingImageWhereUniqueInput>>
  /** Update multiple AppMarketingImage documents */
  update?: InputMaybe<Array<AppMarketingImageUpdateWithNestedWhereUniqueInput>>
  /** Upsert multiple AppMarketingImage documents */
  upsert?: InputMaybe<Array<AppMarketingImageUpsertWithNestedWhereUniqueInput>>
}

export type AppMarketingImageUpdateManyInput = {
  blurhash?: InputMaybe<Scalars['String']>
  userInterfaceStyle?: InputMaybe<UserInterfaceStyle>
}

export type AppMarketingImageUpdateManyWithNestedWhereInput = {
  /** Update many input */
  data: AppMarketingImageUpdateManyInput
  /** Document search */
  where: AppMarketingImageWhereInput
}

export type AppMarketingImageUpdateOneInlineInput = {
  /** Connect existing AppMarketingImage document */
  connect?: InputMaybe<AppMarketingImageWhereUniqueInput>
  /** Create and connect one AppMarketingImage document */
  create?: InputMaybe<AppMarketingImageCreateInput>
  /** Delete currently connected AppMarketingImage document */
  delete?: InputMaybe<Scalars['Boolean']>
  /** Disconnect currently connected AppMarketingImage document */
  disconnect?: InputMaybe<Scalars['Boolean']>
  /** Update single AppMarketingImage document */
  update?: InputMaybe<AppMarketingImageUpdateWithNestedWhereUniqueInput>
  /** Upsert single AppMarketingImage document */
  upsert?: InputMaybe<AppMarketingImageUpsertWithNestedWhereUniqueInput>
}

export type AppMarketingImageUpdateWithNestedWhereUniqueInput = {
  /** Document to update */
  data: AppMarketingImageUpdateInput
  /** Unique document search */
  where: AppMarketingImageWhereUniqueInput
}

export type AppMarketingImageUpsertInput = {
  /** Create document if it didn't exist */
  create: AppMarketingImageCreateInput
  /** Update document if it exists */
  update: AppMarketingImageUpdateInput
}

export type AppMarketingImageUpsertWithNestedWhereUniqueInput = {
  /** Upsert data */
  data: AppMarketingImageUpsertInput
  /** Unique document search */
  where: AppMarketingImageWhereUniqueInput
}

/** Identifies documents */
export type AppMarketingImageWhereInput = {
  /** Logical AND on all given filters. */
  AND?: InputMaybe<Array<AppMarketingImageWhereInput>>
  /** Logical NOT on all given filters combined by AND. */
  NOT?: InputMaybe<Array<AppMarketingImageWhereInput>>
  /** Logical OR on all given filters. */
  OR?: InputMaybe<Array<AppMarketingImageWhereInput>>
  /** Contains search across all appropriate fields. */
  _search?: InputMaybe<Scalars['String']>
  blurhash?: InputMaybe<Scalars['String']>
  /** All values containing the given string. */
  blurhash_contains?: InputMaybe<Scalars['String']>
  /** All values ending with the given string. */
  blurhash_ends_with?: InputMaybe<Scalars['String']>
  /** All values that are contained in given list. */
  blurhash_in?: InputMaybe<Array<Scalars['String']>>
  /** All values that are not equal to given value. */
  blurhash_not?: InputMaybe<Scalars['String']>
  /** All values not containing the given string. */
  blurhash_not_contains?: InputMaybe<Scalars['String']>
  /** All values not ending with the given string */
  blurhash_not_ends_with?: InputMaybe<Scalars['String']>
  /** All values that are not contained in given list. */
  blurhash_not_in?: InputMaybe<Array<Scalars['String']>>
  /** All values not starting with the given string. */
  blurhash_not_starts_with?: InputMaybe<Scalars['String']>
  /** All values starting with the given string. */
  blurhash_starts_with?: InputMaybe<Scalars['String']>
  createdAt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than the given value. */
  createdAt_gt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than or equal the given value. */
  createdAt_gte?: InputMaybe<Scalars['DateTime']>
  /** All values that are contained in given list. */
  createdAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  /** All values less than the given value. */
  createdAt_lt?: InputMaybe<Scalars['DateTime']>
  /** All values less than or equal the given value. */
  createdAt_lte?: InputMaybe<Scalars['DateTime']>
  /** All values that are not equal to given value. */
  createdAt_not?: InputMaybe<Scalars['DateTime']>
  /** All values that are not contained in given list. */
  createdAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  createdBy?: InputMaybe<UserWhereInput>
  id?: InputMaybe<Scalars['ID']>
  /** All values containing the given string. */
  id_contains?: InputMaybe<Scalars['ID']>
  /** All values ending with the given string. */
  id_ends_with?: InputMaybe<Scalars['ID']>
  /** All values that are contained in given list. */
  id_in?: InputMaybe<Array<Scalars['ID']>>
  /** All values that are not equal to given value. */
  id_not?: InputMaybe<Scalars['ID']>
  /** All values not containing the given string. */
  id_not_contains?: InputMaybe<Scalars['ID']>
  /** All values not ending with the given string */
  id_not_ends_with?: InputMaybe<Scalars['ID']>
  /** All values that are not contained in given list. */
  id_not_in?: InputMaybe<Array<Scalars['ID']>>
  /** All values not starting with the given string. */
  id_not_starts_with?: InputMaybe<Scalars['ID']>
  /** All values starting with the given string. */
  id_starts_with?: InputMaybe<Scalars['ID']>
  image?: InputMaybe<AssetWhereInput>
  language?: InputMaybe<LanguageWhereInput>
  publishedAt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than the given value. */
  publishedAt_gt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than or equal the given value. */
  publishedAt_gte?: InputMaybe<Scalars['DateTime']>
  /** All values that are contained in given list. */
  publishedAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  /** All values less than the given value. */
  publishedAt_lt?: InputMaybe<Scalars['DateTime']>
  /** All values less than or equal the given value. */
  publishedAt_lte?: InputMaybe<Scalars['DateTime']>
  /** All values that are not equal to given value. */
  publishedAt_not?: InputMaybe<Scalars['DateTime']>
  /** All values that are not contained in given list. */
  publishedAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  publishedBy?: InputMaybe<UserWhereInput>
  scheduledIn_every?: InputMaybe<ScheduledOperationWhereInput>
  scheduledIn_none?: InputMaybe<ScheduledOperationWhereInput>
  scheduledIn_some?: InputMaybe<ScheduledOperationWhereInput>
  updatedAt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than the given value. */
  updatedAt_gt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than or equal the given value. */
  updatedAt_gte?: InputMaybe<Scalars['DateTime']>
  /** All values that are contained in given list. */
  updatedAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  /** All values less than the given value. */
  updatedAt_lt?: InputMaybe<Scalars['DateTime']>
  /** All values less than or equal the given value. */
  updatedAt_lte?: InputMaybe<Scalars['DateTime']>
  /** All values that are not equal to given value. */
  updatedAt_not?: InputMaybe<Scalars['DateTime']>
  /** All values that are not contained in given list. */
  updatedAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  updatedBy?: InputMaybe<UserWhereInput>
  userInterfaceStyle?: InputMaybe<UserInterfaceStyle>
  /** All values that are contained in given list. */
  userInterfaceStyle_in?: InputMaybe<Array<UserInterfaceStyle>>
  /** All values that are not equal to given value. */
  userInterfaceStyle_not?: InputMaybe<UserInterfaceStyle>
  /** All values that are not contained in given list. */
  userInterfaceStyle_not_in?: InputMaybe<Array<UserInterfaceStyle>>
}

/** References AppMarketingImage record uniquely */
export type AppMarketingImageWhereUniqueInput = {
  id?: InputMaybe<Scalars['ID']>
}

export type ApproveQuoteResponse = {
  __typename?: 'ApproveQuoteResponse'
  approved: Scalars['Boolean']
}

export type ArrangedPerilCategories = {
  __typename?: 'ArrangedPerilCategories'
  home?: Maybe<PerilCategory>
  me?: Maybe<PerilCategory>
  stuff?: Maybe<PerilCategory>
}

/** Asset system model */
export type Asset = Node & {
  __typename?: 'Asset'
  assetMarketingStory: Array<MarketingStory>
  /** The time the document was created */
  createdAt: Scalars['DateTime']
  /** User that created this document */
  createdBy?: Maybe<User>
  /** Get the document in other stages */
  documentInStages: Array<Asset>
  fileCoreMLModel: Array<CoreMlModel>
  /** The file name */
  fileName: Scalars['String']
  /** The file handle */
  handle: Scalars['String']
  /** The height of the file */
  height?: Maybe<Scalars['Float']>
  /** List of Asset versions */
  history: Array<Version>
  /** The unique identifier */
  id: Scalars['ID']
  imageAppMarketingImage: Array<AppMarketingImage>
  /** System Locale field */
  locale: Locale
  /** Get the other localizations for this document */
  localizations: Array<Asset>
  /** The mime type of the file */
  mimeType?: Maybe<Scalars['String']>
  /** The time the document was published. Null on documents in draft stage. */
  publishedAt?: Maybe<Scalars['DateTime']>
  /** User that last published this document */
  publishedBy?: Maybe<User>
  scheduledIn: Array<ScheduledOperation>
  /** The file size */
  size?: Maybe<Scalars['Float']>
  /** System stage field */
  stage: Stage
  /** The time the document was updated */
  updatedAt: Scalars['DateTime']
  /** User that last updated this document */
  updatedBy?: Maybe<User>
  /** Get the url for the asset with provided transformations applied. */
  url: Scalars['String']
  /** The file width */
  width?: Maybe<Scalars['Float']>
}

/** Asset system model */
export type AssetAssetMarketingStoryArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  locales?: InputMaybe<Array<Locale>>
  orderBy?: InputMaybe<MarketingStoryOrderByInput>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<MarketingStoryWhereInput>
}

/** Asset system model */
export type AssetCreatedAtArgs = {
  variation?: SystemDateTimeFieldVariation
}

/** Asset system model */
export type AssetCreatedByArgs = {
  locales?: InputMaybe<Array<Locale>>
}

/** Asset system model */
export type AssetDocumentInStagesArgs = {
  includeCurrent?: Scalars['Boolean']
  inheritLocale?: Scalars['Boolean']
  stages?: Array<Stage>
}

/** Asset system model */
export type AssetFileCoreMlModelArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  locales?: InputMaybe<Array<Locale>>
  orderBy?: InputMaybe<CoreMlModelOrderByInput>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<CoreMlModelWhereInput>
}

/** Asset system model */
export type AssetHistoryArgs = {
  limit?: Scalars['Int']
  skip?: Scalars['Int']
  stageOverride?: InputMaybe<Stage>
}

/** Asset system model */
export type AssetImageAppMarketingImageArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  locales?: InputMaybe<Array<Locale>>
  orderBy?: InputMaybe<AppMarketingImageOrderByInput>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<AppMarketingImageWhereInput>
}

/** Asset system model */
export type AssetLocalizationsArgs = {
  includeCurrent?: Scalars['Boolean']
  locales?: Array<Locale>
}

/** Asset system model */
export type AssetPublishedAtArgs = {
  variation?: SystemDateTimeFieldVariation
}

/** Asset system model */
export type AssetPublishedByArgs = {
  locales?: InputMaybe<Array<Locale>>
}

/** Asset system model */
export type AssetScheduledInArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  locales?: InputMaybe<Array<Locale>>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<ScheduledOperationWhereInput>
}

/** Asset system model */
export type AssetUpdatedAtArgs = {
  variation?: SystemDateTimeFieldVariation
}

/** Asset system model */
export type AssetUpdatedByArgs = {
  locales?: InputMaybe<Array<Locale>>
}

/** Asset system model */
export type AssetUrlArgs = {
  transformation?: InputMaybe<AssetTransformationInput>
}

export type AssetConnectInput = {
  /** Allow to specify document position in list of connected documents, will default to appending at end of list */
  position?: InputMaybe<ConnectPositionInput>
  /** Document to connect */
  where: AssetWhereUniqueInput
}

/** A connection to a list of items. */
export type AssetConnection = {
  __typename?: 'AssetConnection'
  aggregate: Aggregate
  /** A list of edges. */
  edges: Array<AssetEdge>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
}

export type AssetCreateInput = {
  assetMarketingStory?: InputMaybe<MarketingStoryCreateManyInlineInput>
  createdAt?: InputMaybe<Scalars['DateTime']>
  fileCoreMLModel?: InputMaybe<CoreMlModelCreateManyInlineInput>
  fileName: Scalars['String']
  handle: Scalars['String']
  height?: InputMaybe<Scalars['Float']>
  imageAppMarketingImage?: InputMaybe<AppMarketingImageCreateManyInlineInput>
  /** Inline mutations for managing document localizations excluding the default locale */
  localizations?: InputMaybe<AssetCreateLocalizationsInput>
  mimeType?: InputMaybe<Scalars['String']>
  size?: InputMaybe<Scalars['Float']>
  updatedAt?: InputMaybe<Scalars['DateTime']>
  width?: InputMaybe<Scalars['Float']>
}

export type AssetCreateLocalizationDataInput = {
  createdAt?: InputMaybe<Scalars['DateTime']>
  fileName: Scalars['String']
  handle: Scalars['String']
  height?: InputMaybe<Scalars['Float']>
  mimeType?: InputMaybe<Scalars['String']>
  size?: InputMaybe<Scalars['Float']>
  updatedAt?: InputMaybe<Scalars['DateTime']>
  width?: InputMaybe<Scalars['Float']>
}

export type AssetCreateLocalizationInput = {
  /** Localization input */
  data: AssetCreateLocalizationDataInput
  locale: Locale
}

export type AssetCreateLocalizationsInput = {
  /** Create localizations for the newly-created document */
  create?: InputMaybe<Array<AssetCreateLocalizationInput>>
}

export type AssetCreateManyInlineInput = {
  /** Connect multiple existing Asset documents */
  connect?: InputMaybe<Array<AssetWhereUniqueInput>>
  /** Create and connect multiple existing Asset documents */
  create?: InputMaybe<Array<AssetCreateInput>>
}

export type AssetCreateOneInlineInput = {
  /** Connect one existing Asset document */
  connect?: InputMaybe<AssetWhereUniqueInput>
  /** Create and connect one Asset document */
  create?: InputMaybe<AssetCreateInput>
}

/** An edge in a connection. */
export type AssetEdge = {
  __typename?: 'AssetEdge'
  /** A cursor for use in pagination. */
  cursor: Scalars['String']
  /** The item at the end of the edge. */
  node: Asset
}

/** Identifies documents */
export type AssetManyWhereInput = {
  /** Logical AND on all given filters. */
  AND?: InputMaybe<Array<AssetWhereInput>>
  /** Logical NOT on all given filters combined by AND. */
  NOT?: InputMaybe<Array<AssetWhereInput>>
  /** Logical OR on all given filters. */
  OR?: InputMaybe<Array<AssetWhereInput>>
  /** Contains search across all appropriate fields. */
  _search?: InputMaybe<Scalars['String']>
  assetMarketingStory_every?: InputMaybe<MarketingStoryWhereInput>
  assetMarketingStory_none?: InputMaybe<MarketingStoryWhereInput>
  assetMarketingStory_some?: InputMaybe<MarketingStoryWhereInput>
  createdAt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than the given value. */
  createdAt_gt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than or equal the given value. */
  createdAt_gte?: InputMaybe<Scalars['DateTime']>
  /** All values that are contained in given list. */
  createdAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  /** All values less than the given value. */
  createdAt_lt?: InputMaybe<Scalars['DateTime']>
  /** All values less than or equal the given value. */
  createdAt_lte?: InputMaybe<Scalars['DateTime']>
  /** All values that are not equal to given value. */
  createdAt_not?: InputMaybe<Scalars['DateTime']>
  /** All values that are not contained in given list. */
  createdAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  createdBy?: InputMaybe<UserWhereInput>
  fileCoreMLModel_every?: InputMaybe<CoreMlModelWhereInput>
  fileCoreMLModel_none?: InputMaybe<CoreMlModelWhereInput>
  fileCoreMLModel_some?: InputMaybe<CoreMlModelWhereInput>
  id?: InputMaybe<Scalars['ID']>
  /** All values containing the given string. */
  id_contains?: InputMaybe<Scalars['ID']>
  /** All values ending with the given string. */
  id_ends_with?: InputMaybe<Scalars['ID']>
  /** All values that are contained in given list. */
  id_in?: InputMaybe<Array<Scalars['ID']>>
  /** All values that are not equal to given value. */
  id_not?: InputMaybe<Scalars['ID']>
  /** All values not containing the given string. */
  id_not_contains?: InputMaybe<Scalars['ID']>
  /** All values not ending with the given string */
  id_not_ends_with?: InputMaybe<Scalars['ID']>
  /** All values that are not contained in given list. */
  id_not_in?: InputMaybe<Array<Scalars['ID']>>
  /** All values not starting with the given string. */
  id_not_starts_with?: InputMaybe<Scalars['ID']>
  /** All values starting with the given string. */
  id_starts_with?: InputMaybe<Scalars['ID']>
  imageAppMarketingImage_every?: InputMaybe<AppMarketingImageWhereInput>
  imageAppMarketingImage_none?: InputMaybe<AppMarketingImageWhereInput>
  imageAppMarketingImage_some?: InputMaybe<AppMarketingImageWhereInput>
  publishedAt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than the given value. */
  publishedAt_gt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than or equal the given value. */
  publishedAt_gte?: InputMaybe<Scalars['DateTime']>
  /** All values that are contained in given list. */
  publishedAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  /** All values less than the given value. */
  publishedAt_lt?: InputMaybe<Scalars['DateTime']>
  /** All values less than or equal the given value. */
  publishedAt_lte?: InputMaybe<Scalars['DateTime']>
  /** All values that are not equal to given value. */
  publishedAt_not?: InputMaybe<Scalars['DateTime']>
  /** All values that are not contained in given list. */
  publishedAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  publishedBy?: InputMaybe<UserWhereInput>
  scheduledIn_every?: InputMaybe<ScheduledOperationWhereInput>
  scheduledIn_none?: InputMaybe<ScheduledOperationWhereInput>
  scheduledIn_some?: InputMaybe<ScheduledOperationWhereInput>
  updatedAt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than the given value. */
  updatedAt_gt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than or equal the given value. */
  updatedAt_gte?: InputMaybe<Scalars['DateTime']>
  /** All values that are contained in given list. */
  updatedAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  /** All values less than the given value. */
  updatedAt_lt?: InputMaybe<Scalars['DateTime']>
  /** All values less than or equal the given value. */
  updatedAt_lte?: InputMaybe<Scalars['DateTime']>
  /** All values that are not equal to given value. */
  updatedAt_not?: InputMaybe<Scalars['DateTime']>
  /** All values that are not contained in given list. */
  updatedAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  updatedBy?: InputMaybe<UserWhereInput>
}

export enum AssetOrderByInput {
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC',
  FileNameAsc = 'fileName_ASC',
  FileNameDesc = 'fileName_DESC',
  HandleAsc = 'handle_ASC',
  HandleDesc = 'handle_DESC',
  HeightAsc = 'height_ASC',
  HeightDesc = 'height_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  MimeTypeAsc = 'mimeType_ASC',
  MimeTypeDesc = 'mimeType_DESC',
  PublishedAtAsc = 'publishedAt_ASC',
  PublishedAtDesc = 'publishedAt_DESC',
  SizeAsc = 'size_ASC',
  SizeDesc = 'size_DESC',
  UpdatedAtAsc = 'updatedAt_ASC',
  UpdatedAtDesc = 'updatedAt_DESC',
  WidthAsc = 'width_ASC',
  WidthDesc = 'width_DESC',
}

/** Transformations for Assets */
export type AssetTransformationInput = {
  document?: InputMaybe<DocumentTransformationInput>
  image?: InputMaybe<ImageTransformationInput>
  /** Pass true if you want to validate the passed transformation parameters */
  validateOptions?: InputMaybe<Scalars['Boolean']>
}

export type AssetUpdateInput = {
  assetMarketingStory?: InputMaybe<MarketingStoryUpdateManyInlineInput>
  fileCoreMLModel?: InputMaybe<CoreMlModelUpdateManyInlineInput>
  fileName?: InputMaybe<Scalars['String']>
  handle?: InputMaybe<Scalars['String']>
  height?: InputMaybe<Scalars['Float']>
  imageAppMarketingImage?: InputMaybe<AppMarketingImageUpdateManyInlineInput>
  /** Manage document localizations */
  localizations?: InputMaybe<AssetUpdateLocalizationsInput>
  mimeType?: InputMaybe<Scalars['String']>
  size?: InputMaybe<Scalars['Float']>
  width?: InputMaybe<Scalars['Float']>
}

export type AssetUpdateLocalizationDataInput = {
  fileName?: InputMaybe<Scalars['String']>
  handle?: InputMaybe<Scalars['String']>
  height?: InputMaybe<Scalars['Float']>
  mimeType?: InputMaybe<Scalars['String']>
  size?: InputMaybe<Scalars['Float']>
  width?: InputMaybe<Scalars['Float']>
}

export type AssetUpdateLocalizationInput = {
  data: AssetUpdateLocalizationDataInput
  locale: Locale
}

export type AssetUpdateLocalizationsInput = {
  /** Localizations to create */
  create?: InputMaybe<Array<AssetCreateLocalizationInput>>
  /** Localizations to delete */
  delete?: InputMaybe<Array<Locale>>
  /** Localizations to update */
  update?: InputMaybe<Array<AssetUpdateLocalizationInput>>
  upsert?: InputMaybe<Array<AssetUpsertLocalizationInput>>
}

export type AssetUpdateManyInlineInput = {
  /** Connect multiple existing Asset documents */
  connect?: InputMaybe<Array<AssetConnectInput>>
  /** Create and connect multiple Asset documents */
  create?: InputMaybe<Array<AssetCreateInput>>
  /** Delete multiple Asset documents */
  delete?: InputMaybe<Array<AssetWhereUniqueInput>>
  /** Disconnect multiple Asset documents */
  disconnect?: InputMaybe<Array<AssetWhereUniqueInput>>
  /** Override currently-connected documents with multiple existing Asset documents */
  set?: InputMaybe<Array<AssetWhereUniqueInput>>
  /** Update multiple Asset documents */
  update?: InputMaybe<Array<AssetUpdateWithNestedWhereUniqueInput>>
  /** Upsert multiple Asset documents */
  upsert?: InputMaybe<Array<AssetUpsertWithNestedWhereUniqueInput>>
}

export type AssetUpdateManyInput = {
  fileName?: InputMaybe<Scalars['String']>
  height?: InputMaybe<Scalars['Float']>
  /** Optional updates to localizations */
  localizations?: InputMaybe<AssetUpdateManyLocalizationsInput>
  mimeType?: InputMaybe<Scalars['String']>
  size?: InputMaybe<Scalars['Float']>
  width?: InputMaybe<Scalars['Float']>
}

export type AssetUpdateManyLocalizationDataInput = {
  fileName?: InputMaybe<Scalars['String']>
  height?: InputMaybe<Scalars['Float']>
  mimeType?: InputMaybe<Scalars['String']>
  size?: InputMaybe<Scalars['Float']>
  width?: InputMaybe<Scalars['Float']>
}

export type AssetUpdateManyLocalizationInput = {
  data: AssetUpdateManyLocalizationDataInput
  locale: Locale
}

export type AssetUpdateManyLocalizationsInput = {
  /** Localizations to update */
  update?: InputMaybe<Array<AssetUpdateManyLocalizationInput>>
}

export type AssetUpdateManyWithNestedWhereInput = {
  /** Update many input */
  data: AssetUpdateManyInput
  /** Document search */
  where: AssetWhereInput
}

export type AssetUpdateOneInlineInput = {
  /** Connect existing Asset document */
  connect?: InputMaybe<AssetWhereUniqueInput>
  /** Create and connect one Asset document */
  create?: InputMaybe<AssetCreateInput>
  /** Delete currently connected Asset document */
  delete?: InputMaybe<Scalars['Boolean']>
  /** Disconnect currently connected Asset document */
  disconnect?: InputMaybe<Scalars['Boolean']>
  /** Update single Asset document */
  update?: InputMaybe<AssetUpdateWithNestedWhereUniqueInput>
  /** Upsert single Asset document */
  upsert?: InputMaybe<AssetUpsertWithNestedWhereUniqueInput>
}

export type AssetUpdateWithNestedWhereUniqueInput = {
  /** Document to update */
  data: AssetUpdateInput
  /** Unique document search */
  where: AssetWhereUniqueInput
}

export type AssetUpsertInput = {
  /** Create document if it didn't exist */
  create: AssetCreateInput
  /** Update document if it exists */
  update: AssetUpdateInput
}

export type AssetUpsertLocalizationInput = {
  create: AssetCreateLocalizationDataInput
  locale: Locale
  update: AssetUpdateLocalizationDataInput
}

export type AssetUpsertWithNestedWhereUniqueInput = {
  /** Upsert data */
  data: AssetUpsertInput
  /** Unique document search */
  where: AssetWhereUniqueInput
}

/** Identifies documents */
export type AssetWhereInput = {
  /** Logical AND on all given filters. */
  AND?: InputMaybe<Array<AssetWhereInput>>
  /** Logical NOT on all given filters combined by AND. */
  NOT?: InputMaybe<Array<AssetWhereInput>>
  /** Logical OR on all given filters. */
  OR?: InputMaybe<Array<AssetWhereInput>>
  /** Contains search across all appropriate fields. */
  _search?: InputMaybe<Scalars['String']>
  assetMarketingStory_every?: InputMaybe<MarketingStoryWhereInput>
  assetMarketingStory_none?: InputMaybe<MarketingStoryWhereInput>
  assetMarketingStory_some?: InputMaybe<MarketingStoryWhereInput>
  createdAt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than the given value. */
  createdAt_gt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than or equal the given value. */
  createdAt_gte?: InputMaybe<Scalars['DateTime']>
  /** All values that are contained in given list. */
  createdAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  /** All values less than the given value. */
  createdAt_lt?: InputMaybe<Scalars['DateTime']>
  /** All values less than or equal the given value. */
  createdAt_lte?: InputMaybe<Scalars['DateTime']>
  /** All values that are not equal to given value. */
  createdAt_not?: InputMaybe<Scalars['DateTime']>
  /** All values that are not contained in given list. */
  createdAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  createdBy?: InputMaybe<UserWhereInput>
  fileCoreMLModel_every?: InputMaybe<CoreMlModelWhereInput>
  fileCoreMLModel_none?: InputMaybe<CoreMlModelWhereInput>
  fileCoreMLModel_some?: InputMaybe<CoreMlModelWhereInput>
  fileName?: InputMaybe<Scalars['String']>
  /** All values containing the given string. */
  fileName_contains?: InputMaybe<Scalars['String']>
  /** All values ending with the given string. */
  fileName_ends_with?: InputMaybe<Scalars['String']>
  /** All values that are contained in given list. */
  fileName_in?: InputMaybe<Array<Scalars['String']>>
  /** All values that are not equal to given value. */
  fileName_not?: InputMaybe<Scalars['String']>
  /** All values not containing the given string. */
  fileName_not_contains?: InputMaybe<Scalars['String']>
  /** All values not ending with the given string */
  fileName_not_ends_with?: InputMaybe<Scalars['String']>
  /** All values that are not contained in given list. */
  fileName_not_in?: InputMaybe<Array<Scalars['String']>>
  /** All values not starting with the given string. */
  fileName_not_starts_with?: InputMaybe<Scalars['String']>
  /** All values starting with the given string. */
  fileName_starts_with?: InputMaybe<Scalars['String']>
  handle?: InputMaybe<Scalars['String']>
  /** All values containing the given string. */
  handle_contains?: InputMaybe<Scalars['String']>
  /** All values ending with the given string. */
  handle_ends_with?: InputMaybe<Scalars['String']>
  /** All values that are contained in given list. */
  handle_in?: InputMaybe<Array<Scalars['String']>>
  /** All values that are not equal to given value. */
  handle_not?: InputMaybe<Scalars['String']>
  /** All values not containing the given string. */
  handle_not_contains?: InputMaybe<Scalars['String']>
  /** All values not ending with the given string */
  handle_not_ends_with?: InputMaybe<Scalars['String']>
  /** All values that are not contained in given list. */
  handle_not_in?: InputMaybe<Array<Scalars['String']>>
  /** All values not starting with the given string. */
  handle_not_starts_with?: InputMaybe<Scalars['String']>
  /** All values starting with the given string. */
  handle_starts_with?: InputMaybe<Scalars['String']>
  height?: InputMaybe<Scalars['Float']>
  /** All values greater than the given value. */
  height_gt?: InputMaybe<Scalars['Float']>
  /** All values greater than or equal the given value. */
  height_gte?: InputMaybe<Scalars['Float']>
  /** All values that are contained in given list. */
  height_in?: InputMaybe<Array<Scalars['Float']>>
  /** All values less than the given value. */
  height_lt?: InputMaybe<Scalars['Float']>
  /** All values less than or equal the given value. */
  height_lte?: InputMaybe<Scalars['Float']>
  /** All values that are not equal to given value. */
  height_not?: InputMaybe<Scalars['Float']>
  /** All values that are not contained in given list. */
  height_not_in?: InputMaybe<Array<Scalars['Float']>>
  id?: InputMaybe<Scalars['ID']>
  /** All values containing the given string. */
  id_contains?: InputMaybe<Scalars['ID']>
  /** All values ending with the given string. */
  id_ends_with?: InputMaybe<Scalars['ID']>
  /** All values that are contained in given list. */
  id_in?: InputMaybe<Array<Scalars['ID']>>
  /** All values that are not equal to given value. */
  id_not?: InputMaybe<Scalars['ID']>
  /** All values not containing the given string. */
  id_not_contains?: InputMaybe<Scalars['ID']>
  /** All values not ending with the given string */
  id_not_ends_with?: InputMaybe<Scalars['ID']>
  /** All values that are not contained in given list. */
  id_not_in?: InputMaybe<Array<Scalars['ID']>>
  /** All values not starting with the given string. */
  id_not_starts_with?: InputMaybe<Scalars['ID']>
  /** All values starting with the given string. */
  id_starts_with?: InputMaybe<Scalars['ID']>
  imageAppMarketingImage_every?: InputMaybe<AppMarketingImageWhereInput>
  imageAppMarketingImage_none?: InputMaybe<AppMarketingImageWhereInput>
  imageAppMarketingImage_some?: InputMaybe<AppMarketingImageWhereInput>
  mimeType?: InputMaybe<Scalars['String']>
  /** All values containing the given string. */
  mimeType_contains?: InputMaybe<Scalars['String']>
  /** All values ending with the given string. */
  mimeType_ends_with?: InputMaybe<Scalars['String']>
  /** All values that are contained in given list. */
  mimeType_in?: InputMaybe<Array<Scalars['String']>>
  /** All values that are not equal to given value. */
  mimeType_not?: InputMaybe<Scalars['String']>
  /** All values not containing the given string. */
  mimeType_not_contains?: InputMaybe<Scalars['String']>
  /** All values not ending with the given string */
  mimeType_not_ends_with?: InputMaybe<Scalars['String']>
  /** All values that are not contained in given list. */
  mimeType_not_in?: InputMaybe<Array<Scalars['String']>>
  /** All values not starting with the given string. */
  mimeType_not_starts_with?: InputMaybe<Scalars['String']>
  /** All values starting with the given string. */
  mimeType_starts_with?: InputMaybe<Scalars['String']>
  publishedAt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than the given value. */
  publishedAt_gt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than or equal the given value. */
  publishedAt_gte?: InputMaybe<Scalars['DateTime']>
  /** All values that are contained in given list. */
  publishedAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  /** All values less than the given value. */
  publishedAt_lt?: InputMaybe<Scalars['DateTime']>
  /** All values less than or equal the given value. */
  publishedAt_lte?: InputMaybe<Scalars['DateTime']>
  /** All values that are not equal to given value. */
  publishedAt_not?: InputMaybe<Scalars['DateTime']>
  /** All values that are not contained in given list. */
  publishedAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  publishedBy?: InputMaybe<UserWhereInput>
  scheduledIn_every?: InputMaybe<ScheduledOperationWhereInput>
  scheduledIn_none?: InputMaybe<ScheduledOperationWhereInput>
  scheduledIn_some?: InputMaybe<ScheduledOperationWhereInput>
  size?: InputMaybe<Scalars['Float']>
  /** All values greater than the given value. */
  size_gt?: InputMaybe<Scalars['Float']>
  /** All values greater than or equal the given value. */
  size_gte?: InputMaybe<Scalars['Float']>
  /** All values that are contained in given list. */
  size_in?: InputMaybe<Array<Scalars['Float']>>
  /** All values less than the given value. */
  size_lt?: InputMaybe<Scalars['Float']>
  /** All values less than or equal the given value. */
  size_lte?: InputMaybe<Scalars['Float']>
  /** All values that are not equal to given value. */
  size_not?: InputMaybe<Scalars['Float']>
  /** All values that are not contained in given list. */
  size_not_in?: InputMaybe<Array<Scalars['Float']>>
  updatedAt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than the given value. */
  updatedAt_gt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than or equal the given value. */
  updatedAt_gte?: InputMaybe<Scalars['DateTime']>
  /** All values that are contained in given list. */
  updatedAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  /** All values less than the given value. */
  updatedAt_lt?: InputMaybe<Scalars['DateTime']>
  /** All values less than or equal the given value. */
  updatedAt_lte?: InputMaybe<Scalars['DateTime']>
  /** All values that are not equal to given value. */
  updatedAt_not?: InputMaybe<Scalars['DateTime']>
  /** All values that are not contained in given list. */
  updatedAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  updatedBy?: InputMaybe<UserWhereInput>
  width?: InputMaybe<Scalars['Float']>
  /** All values greater than the given value. */
  width_gt?: InputMaybe<Scalars['Float']>
  /** All values greater than or equal the given value. */
  width_gte?: InputMaybe<Scalars['Float']>
  /** All values that are contained in given list. */
  width_in?: InputMaybe<Array<Scalars['Float']>>
  /** All values less than the given value. */
  width_lt?: InputMaybe<Scalars['Float']>
  /** All values less than or equal the given value. */
  width_lte?: InputMaybe<Scalars['Float']>
  /** All values that are not equal to given value. */
  width_not?: InputMaybe<Scalars['Float']>
  /** All values that are not contained in given list. */
  width_not_in?: InputMaybe<Array<Scalars['Float']>>
}

/** References Asset record uniquely */
export type AssetWhereUniqueInput = {
  id?: InputMaybe<Scalars['ID']>
}

export type AuthEvent = {
  __typename?: 'AuthEvent'
  status?: Maybe<AuthState>
}

export enum AuthState {
  Failed = 'FAILED',
  Initiated = 'INITIATED',
  InProgress = 'IN_PROGRESS',
  Success = 'SUCCESS',
}

export type AutoCompleteResponse = {
  __typename?: 'AutoCompleteResponse'
  address: Scalars['String']
  apartment?: Maybe<Scalars['String']>
  city?: Maybe<Scalars['String']>
  floor?: Maybe<Scalars['String']>
  id?: Maybe<Scalars['String']>
  municipalityCode?: Maybe<Scalars['String']>
  postalCode?: Maybe<Scalars['String']>
  streetCode?: Maybe<Scalars['String']>
  streetDisplayName?: Maybe<Scalars['String']>
  streetName?: Maybe<Scalars['String']>
  streetNumber?: Maybe<Scalars['String']>
}

export type AvailablePaymentMethodsResponse = {
  __typename?: 'AvailablePaymentMethodsResponse'
  paymentMethodsResponse: Scalars['PaymentMethodsResponse']
}

export type Avatar = {
  __typename?: 'Avatar'
  URL: Scalars['String']
  data?: Maybe<Scalars['Object']>
  duration: Scalars['Int']
  height: Scalars['Int']
  name: Scalars['String']
  width: Scalars['Int']
}

export type Balance = {
  __typename?: 'Balance'
  currentBalance: MonetaryAmountV2
  failedCharges?: Maybe<Scalars['Int']>
}

export type BankAccount = {
  __typename?: 'BankAccount'
  bankName: Scalars['String']
  descriptor: Scalars['String']
  directDebitStatus?: Maybe<DirectDebitStatus>
}

export type BankIdAuthResponse = {
  __typename?: 'BankIdAuthResponse'
  autoStartToken: Scalars['String']
}

export type BankIdExtraInfo = NorwegianBankIdExtraInfo | SwedishBankIdExtraInfo

export enum BankIdStatus {
  Complete = 'complete',
  Failed = 'failed',
  Pending = 'pending',
}

export type BasicError = Error & {
  __typename?: 'BasicError'
  message: Scalars['String']
}

export type BatchPayload = {
  __typename?: 'BatchPayload'
  /** The number of nodes that have been affected by the Batch operation. */
  count: Scalars['Long']
}

export type BrowserInfo = {
  acceptHeader: Scalars['String']
  colorDepth: Scalars['Int']
  javaEnabled: Scalars['Boolean']
  language: Scalars['String']
  screenHeight: Scalars['Int']
  screenWidth: Scalars['Int']
  timeZoneOffset: Scalars['Int']
  userAgent: Scalars['String']
}

export type BulletPoints = {
  __typename?: 'BulletPoints'
  description: Scalars['String']
  icon: Icon
  title: Scalars['String']
}

export type BundledQuote = {
  __typename?: 'BundledQuote'
  birthDate: Scalars['LocalDate']
  contractPerils: Array<PerilV2>
  currentInsurer?: Maybe<CurrentInsurer>
  data: Scalars['JSON']
  dataCollectionId?: Maybe<Scalars['ID']>
  detailsTable: Table
  displayName: Scalars['String']
  email?: Maybe<Scalars['String']>
  expiresAt: Scalars['LocalDate']
  firstName?: Maybe<Scalars['String']>
  id: Scalars['ID']
  initiatedFrom: Scalars['String']
  insurableLimits: Array<InsurableLimit>
  insuranceTerms: Array<InsuranceTerm>
  insuranceType: Scalars['String']
  lastName?: Maybe<Scalars['String']>
  perils: Array<PerilV2>
  phoneNumber?: Maybe<Scalars['String']>
  price: MonetaryAmountV2
  /** @deprecated Use data instead. */
  quoteDetails: QuoteDetails
  ssn?: Maybe<Scalars['String']>
  startDate?: Maybe<Scalars['LocalDate']>
  termsAndConditions: InsuranceTerm
  typeOfContract: TypeOfContract
}

export type BundledQuoteContractPerilsArgs = {
  locale: Locale
}

export type BundledQuoteDetailsTableArgs = {
  locale: Locale
}

export type BundledQuoteDisplayNameArgs = {
  locale: Locale
}

export type BundledQuoteInsurableLimitsArgs = {
  locale: Locale
}

export type BundledQuoteInsuranceTermsArgs = {
  date?: InputMaybe<Scalars['LocalDate']>
  locale: Locale
  partner?: InputMaybe<Scalars['String']>
}

export type BundledQuotePerilsArgs = {
  locale: Locale
}

export type BundledQuoteTermsAndConditionsArgs = {
  date?: InputMaybe<Scalars['LocalDate']>
  locale: Locale
  partner?: InputMaybe<Scalars['String']>
}

export type Campaign = {
  __typename?: 'Campaign'
  code: Scalars['String']
  displayValue?: Maybe<Scalars['String']>
  expiresAt?: Maybe<Scalars['LocalDate']>
  incentive?: Maybe<Incentive>
  /** @deprecated Don't use for quoteCart API, this is here to fix stitching issues with the old APIs in PP */
  owner?: Maybe<CampaignOwner>
  ownerName?: Maybe<Scalars['String']>
}

export type CampaignDisplayValueArgs = {
  locale: Locale
}

export type CampaignCannotBeCombinedWithExisting = {
  __typename?: 'CampaignCannotBeCombinedWithExisting'
  existingCampaigns: Array<Campaign>
}

export type CampaignDoesNotExist = {
  __typename?: 'CampaignDoesNotExist'
  code: Scalars['String']
}

export type CampaignHasExpired = {
  __typename?: 'CampaignHasExpired'
  code: Scalars['String']
}

export type CampaignInput = {
  content?: InputMaybe<Scalars['String']>
  medium?: InputMaybe<Scalars['String']>
  name?: InputMaybe<Scalars['String']>
  source?: InputMaybe<Scalars['String']>
  term?: InputMaybe<Scalars['String']>
}

export enum CampaignMarket {
  Dk = 'DK',
  No = 'NO',
  Se = 'SE',
}

export type CampaignOwner = {
  __typename?: 'CampaignOwner'
  displayName: Scalars['String']
  id: Scalars['ID']
}

export enum CancelDirectDebitStatus {
  Accepted = 'ACCEPTED',
  DeclinedMissingRequest = 'DECLINED_MISSING_REQUEST',
  DeclinedMissingToken = 'DECLINED_MISSING_TOKEN',
}

export type CannotRedeemCampaignFromDifferentMarket = {
  __typename?: 'CannotRedeemCampaignFromDifferentMarket'
  campaignMarket: CampaignMarket
  code: Scalars['String']
}

export type CannotRedeemEmptyCode = {
  __typename?: 'CannotRedeemEmptyCode'
  code: Scalars['String']
}

export type CannotRedeemOwnCampaign = {
  __typename?: 'CannotRedeemOwnCampaign'
  code: Scalars['String']
}

export type CannotRemoveActiveCampaignCode = {
  __typename?: 'CannotRemoveActiveCampaignCode'
  activeCampaignCodes: Array<Scalars['String']>
}

export type Cashback = {
  __typename?: 'Cashback'
  description?: Maybe<Scalars['String']>
  id?: Maybe<Scalars['ID']>
  imageUrl?: Maybe<Scalars['String']>
  name?: Maybe<Scalars['String']>
  /** @deprecated use description instead */
  paragraph?: Maybe<Scalars['String']>
  /** @deprecated use name instead */
  title?: Maybe<Scalars['String']>
}

export type Charge = {
  __typename?: 'Charge'
  amount: MonetaryAmountV2
  date: Scalars['LocalDate']
}

export type ChargeEstimation = {
  __typename?: 'ChargeEstimation'
  charge: MonetaryAmountV2
  discount: MonetaryAmountV2
  subscription: MonetaryAmountV2
}

export type ChatAction = {
  __typename?: 'ChatAction'
  enabled?: Maybe<Scalars['Boolean']>
  text?: Maybe<Scalars['String']>
  triggerUrl?: Maybe<Scalars['URL']>
}

export type ChatResponse = {
  __typename?: 'ChatResponse'
  body: MessageBody
  globalId: Scalars['ID']
  header: MessageHeader
  id: Scalars['ID']
}

export type ChatResponseAudioInput = {
  file: Scalars['Upload']
  globalId: Scalars['ID']
}

export type ChatResponseBodyAudioInput = {
  url: Scalars['String']
}

export type ChatResponseBodyFileInput = {
  key: Scalars['String']
  mimeType: Scalars['String']
}

export type ChatResponseBodySingleSelectInput = {
  selectedValue: Scalars['ID']
}

export type ChatResponseBodyTextInput = {
  text: Scalars['String']
}

export type ChatResponseFileInput = {
  body: ChatResponseBodyFileInput
  globalId: Scalars['ID']
}

export type ChatResponseSingleSelectInput = {
  body: ChatResponseBodySingleSelectInput
  globalId: Scalars['ID']
}

export type ChatResponseTextInput = {
  body: ChatResponseBodyTextInput
  globalId: Scalars['ID']
}

export type ChatState = {
  __typename?: 'ChatState'
  onboardingDone: Scalars['Boolean']
  ongoingClaim: Scalars['Boolean']
  showOfferScreen: Scalars['Boolean']
}

/** The checkout state of a quote cart, that contains information about the current signing status. */
export type Checkout = {
  __typename?: 'Checkout'
  /**  Url to redirect the user to, in order to complete the checkout. Used for NORWEGIAN_BANK_ID and DANISH_BANK_ID.  */
  redirectUrl?: Maybe<Scalars['String']>
  /**  Current signing status of the session  */
  status: CheckoutStatus
  /**  A user-visible text that explains the current status. Useful for async signing like SE BankID.  */
  statusText?: Maybe<Scalars['String']>
}

export enum CheckoutMethod {
  ApproveOnly = 'APPROVE_ONLY',
  DanishBankId = 'DANISH_BANK_ID',
  NorwegianBankId = 'NORWEGIAN_BANK_ID',
  SimpleSign = 'SIMPLE_SIGN',
  SwedishBankId = 'SWEDISH_BANK_ID',
}

export enum CheckoutStatus {
  /** This signing is completed, which means the quote cart has reached its terminal state. */
  Completed = 'COMPLETED',
  /** The signing has failed - which means it also can be retried. */
  Failed = 'FAILED',
  /**  This signing session is ongoing. Only for async signing like SE BankID.  */
  Pending = 'PENDING',
  /**
   * This signing session is signed, and can be completed (producing an access token).
   *
   * Synchronous signing methods, like simple sign, immediately produce this state.
   */
  Signed = 'SIGNED',
}

export type Claim = {
  __typename?: 'Claim'
  closedAt?: Maybe<Scalars['Instant']>
  contract?: Maybe<Contract>
  files: Array<File>
  id: Scalars['String']
  outcome?: Maybe<ClaimOutcome>
  payout?: Maybe<MonetaryAmountV2>
  progressSegments: Array<ClaimStatusProgressSegment>
  signedAudioURL?: Maybe<Scalars['String']>
  status: ClaimStatus
  /** Brief explanation of the current status of this `Claim` */
  statusParagraph: Scalars['String']
  submittedAt: Scalars['Instant']
  /** Localized end-user presentable `Claim`-type */
  type?: Maybe<Scalars['String']>
}

export enum ClaimOutcome {
  NotCompensated = 'NOT_COMPENSATED',
  NotCovered = 'NOT_COVERED',
  Paid = 'PAID',
}

export enum ClaimStatus {
  BeingHandled = 'BEING_HANDLED',
  Closed = 'CLOSED',
  Reopened = 'REOPENED',
  Submitted = 'SUBMITTED',
}

export type ClaimStatusCard = {
  __typename?: 'ClaimStatusCard'
  /** The underlying Claim represented by this status-card */
  claim: Claim
  id: Scalars['ID']
  pills: Array<ClaimStatusCardPill>
  progressSegments: Array<ClaimStatusProgressSegment>
  subtitle: Scalars['String']
  title: Scalars['String']
}

export type ClaimStatusCardPill = {
  __typename?: 'ClaimStatusCardPill'
  text: Scalars['String']
  type: ClaimStatusCardPillType
}

export enum ClaimStatusCardPillType {
  Closed = 'CLOSED',
  Open = 'OPEN',
  Payment = 'PAYMENT',
  Reopened = 'REOPENED',
}

export type ClaimStatusProgressSegment = {
  __typename?: 'ClaimStatusProgressSegment'
  text: Scalars['String']
  type: ClaimStatusProgressType
}

export enum ClaimStatusProgressType {
  CurrentlyActive = 'CURRENTLY_ACTIVE',
  FutureInactive = 'FUTURE_INACTIVE',
  Paid = 'PAID',
  PastInactive = 'PAST_INACTIVE',
  Reopened = 'REOPENED',
}

export type ClaimsExplainerPage = {
  __typename?: 'ClaimsExplainerPage'
  body: Scalars['String']
  id: Scalars['ID']
  illustration: Icon
}

export type CodeAlreadyTaken = {
  __typename?: 'CodeAlreadyTaken'
  code: Scalars['String']
}

export type CodeTooLong = {
  __typename?: 'CodeTooLong'
  maxCharacters: Scalars['Int']
}

export type CodeTooShort = {
  __typename?: 'CodeTooShort'
  minCharacters: Scalars['Int']
}

export type CollectStatus = {
  __typename?: 'CollectStatus'
  code?: Maybe<Scalars['String']>
  status?: Maybe<BankIdStatus>
}

/** Representing a color value comprising of HEX, RGBA and css color values */
export type Color = {
  __typename?: 'Color'
  css: Scalars['String']
  hex: Scalars['Hex']
  rgba: Rgba
}

/** Accepts either HEX or RGBA color value. At least one of hex or rgba value should be passed. If both are passed RGBA is used. */
export type ColorInput = {
  hex?: InputMaybe<Scalars['Hex']>
  rgba?: InputMaybe<RgbaInput>
}

export type CommonClaim = {
  __typename?: 'CommonClaim'
  icon: Icon
  id: Scalars['String']
  layout: CommonClaimLayouts
  title: Scalars['String']
}

export type CommonClaimLayouts = Emergency | TitleAndBulletPoints

export type CompleteApartmentQuoteDetails = {
  __typename?: 'CompleteApartmentQuoteDetails'
  householdSize: Scalars['Int']
  livingSpace: Scalars['Int']
  street: Scalars['String']
  type: ApartmentType
  zipCode: Scalars['String']
}

export type CompleteHouseQuoteDetails = {
  __typename?: 'CompleteHouseQuoteDetails'
  ancillarySpace: Scalars['Int']
  extraBuildings: Array<ExtraBuilding>
  householdSize: Scalars['Int']
  isSubleted: Scalars['Boolean']
  livingSpace: Scalars['Int']
  numberOfBathrooms: Scalars['Int']
  street: Scalars['String']
  yearOfConstruction: Scalars['Int']
  zipCode: Scalars['String']
}

export type CompleteQuote = {
  __typename?: 'CompleteQuote'
  birthDate: Scalars['LocalDate']
  contractPerils: Array<PerilV2>
  currentInsurer?: Maybe<CurrentInsurer>
  dataCollectionId?: Maybe<Scalars['ID']>
  /** @deprecated Use quoteDetails */
  details: CompleteQuoteDetails
  detailsTable: Table
  displayName: Scalars['String']
  email?: Maybe<Scalars['String']>
  expiresAt: Scalars['LocalDate']
  firstName: Scalars['String']
  id: Scalars['ID']
  insurableLimits: Array<InsurableLimit>
  insuranceCost: InsuranceCost
  insuranceTerms: Array<InsuranceTerm>
  insuranceType: Scalars['String']
  lastName: Scalars['String']
  perils: Array<PerilV2>
  phoneNumber?: Maybe<Scalars['String']>
  quoteDetails: QuoteDetails
  ssn?: Maybe<Scalars['String']>
  startDate?: Maybe<Scalars['LocalDate']>
  termsAndConditions: InsuranceTerm
  typeOfContract: TypeOfContract
}

export type CompleteQuoteContractPerilsArgs = {
  locale: Locale
}

export type CompleteQuoteDetailsTableArgs = {
  locale: Locale
}

export type CompleteQuoteDisplayNameArgs = {
  locale: Locale
}

export type CompleteQuoteInsurableLimitsArgs = {
  locale: Locale
}

export type CompleteQuoteInsuranceTermsArgs = {
  date?: InputMaybe<Scalars['LocalDate']>
  locale: Locale
}

export type CompleteQuotePerilsArgs = {
  locale: Locale
}

export type CompleteQuoteTermsAndConditionsArgs = {
  date?: InputMaybe<Scalars['LocalDate']>
  locale: Locale
}

export type CompleteQuoteDetails =
  | CompleteApartmentQuoteDetails
  | CompleteHouseQuoteDetails
  | UnknownQuoteDetails

/** An inception where all quotes need to have the same startDate and currentInsurer */
export type ConcurrentInception = {
  __typename?: 'ConcurrentInception'
  correspondingQuoteIds: Array<Scalars['ID']>
  /** @deprecated correspondingQuotes is deprecated, doesn't work with QuoteCart use correspondingQuoteIds instead */
  correspondingQuotes: Array<Quote>
  currentInsurer?: Maybe<CurrentInsurer>
  startDate?: Maybe<Scalars['LocalDate']>
}

export type ConnectPaymentFailed = {
  __typename?: 'ConnectPaymentFailed'
  paymentTokenId: Scalars['ID']
}

export type ConnectPaymentFinished = {
  __typename?: 'ConnectPaymentFinished'
  paymentTokenId: Scalars['ID']
  status: TokenStatus
}

export type ConnectPaymentInput = {
  browserInfo?: InputMaybe<BrowserInfo>
  channel: PaymentConnectChannel
  market: Market
  paymentMethodDetails: Scalars['PaymentMethodDetails']
  returnUrl: Scalars['String']
}

export type ConnectPaymentResult = ActionRequired | ConnectPaymentFailed | ConnectPaymentFinished

export type ConnectPositionInput = {
  /** Connect document after specified document */
  after?: InputMaybe<Scalars['ID']>
  /** Connect document before specified document */
  before?: InputMaybe<Scalars['ID']>
  /** Connect document at last position */
  end?: InputMaybe<Scalars['Boolean']>
  /** Connect document at first position */
  start?: InputMaybe<Scalars['Boolean']>
}

export type Contract = {
  __typename?: 'Contract'
  contractPerils: Array<PerilV2>
  createdAt: Scalars['Instant']
  /** "The 'best guess' of the agreement that depicts the member's insurance, either the pending, future, current or, if terminated, past agreement */
  currentAgreement?: Maybe<Agreement>
  currentAgreementDetailsTable: Table
  /** localised information about the details of the contract, for example address / amount of people it covers */
  detailPills: Array<Scalars['String']>
  displayName: Scalars['String']
  gradientOption?: Maybe<TypeOfContractGradientOption>
  holderMember: Scalars['ID']
  id: Scalars['ID']
  /** The date the contract agreement timeline begin, if it has been activated */
  inception?: Maybe<Scalars['LocalDate']>
  insurableLimits: Array<InsurableLimit>
  insuranceTerms: Array<InsuranceTerm>
  logo: Icon
  perils: Array<PerilV2>
  status: ContractStatus
  /** localised information about the current status of the contract */
  statusPills: Array<Scalars['String']>
  supportsAddressChange: Scalars['Boolean']
  switchedFromInsuranceProvider?: Maybe<Scalars['String']>
  /** The date the contract agreement timelinen end, on if it has been terminated */
  termination?: Maybe<Scalars['LocalDate']>
  termsAndConditions: InsuranceTerm
  typeOfContract: TypeOfContract
  upcomingAgreementDetailsTable: Table
  /** An upcoming renewal, present if the member has been notified and the renewal is within 31 days */
  upcomingRenewal?: Maybe<UpcomingRenewal>
}

export type ContractContractPerilsArgs = {
  locale: Locale
}

export type ContractCurrentAgreementDetailsTableArgs = {
  locale: Locale
}

export type ContractDetailPillsArgs = {
  locale: Locale
}

export type ContractInsurableLimitsArgs = {
  locale: Locale
}

export type ContractInsuranceTermsArgs = {
  date?: InputMaybe<Scalars['LocalDate']>
  locale: Locale
  partner?: InputMaybe<Scalars['String']>
}

export type ContractPerilsArgs = {
  locale: Locale
}

export type ContractStatusPillsArgs = {
  locale: Locale
}

export type ContractTermsAndConditionsArgs = {
  date?: InputMaybe<Scalars['LocalDate']>
  locale: Locale
  partner?: InputMaybe<Scalars['String']>
}

export type ContractUpcomingAgreementDetailsTableArgs = {
  locale: Locale
}

export type ContractBundle = {
  __typename?: 'ContractBundle'
  angelStories: ContractBundleAngelStories
  contracts: Array<Contract>
  id: Scalars['ID']
  potentialCrossSells: Array<CrossSell>
}

export type ContractBundlePotentialCrossSellsArgs = {
  locale?: InputMaybe<Locale>
}

export type ContractBundleAngelStories = {
  __typename?: 'ContractBundleAngelStories'
  /** @deprecated use addressChangeV2 */
  addressChange?: Maybe<Scalars['ID']>
  addressChangeV2?: Maybe<Scalars['ID']>
}

export type ContractFaq = {
  __typename?: 'ContractFaq'
  body: Scalars['String']
  headline: Scalars['String']
}

export type ContractHighlight = {
  __typename?: 'ContractHighlight'
  description: Scalars['String']
  title: Scalars['String']
}

export type ContractStatus =
  | ActiveInFutureAndTerminatedInFutureStatus
  | ActiveInFutureStatus
  | ActiveStatus
  | PendingStatus
  | TerminatedInFutureStatus
  | TerminatedStatus
  | TerminatedTodayStatus

/** All of our CoreML models used in the iOS app */
export type CoreMlModel = Node & {
  __typename?: 'CoreMLModel'
  /** The time the document was created */
  createdAt: Scalars['DateTime']
  /** User that created this document */
  createdBy?: Maybe<User>
  /** Get the document in other stages */
  documentInStages: Array<CoreMlModel>
  file?: Maybe<Asset>
  /** List of CoreMLModel versions */
  history: Array<Version>
  /** The unique identifier */
  id: Scalars['ID']
  /** The time the document was published. Null on documents in draft stage. */
  publishedAt?: Maybe<Scalars['DateTime']>
  /** User that last published this document */
  publishedBy?: Maybe<User>
  scheduledIn: Array<ScheduledOperation>
  /** System stage field */
  stage: Stage
  type?: Maybe<CoreMlModelType>
  /** The time the document was updated */
  updatedAt: Scalars['DateTime']
  /** User that last updated this document */
  updatedBy?: Maybe<User>
}

/** All of our CoreML models used in the iOS app */
export type CoreMlModelCreatedByArgs = {
  locales?: InputMaybe<Array<Locale>>
}

/** All of our CoreML models used in the iOS app */
export type CoreMlModelDocumentInStagesArgs = {
  includeCurrent?: Scalars['Boolean']
  inheritLocale?: Scalars['Boolean']
  stages?: Array<Stage>
}

/** All of our CoreML models used in the iOS app */
export type CoreMlModelFileArgs = {
  locales?: InputMaybe<Array<Locale>>
}

/** All of our CoreML models used in the iOS app */
export type CoreMlModelHistoryArgs = {
  limit?: Scalars['Int']
  skip?: Scalars['Int']
  stageOverride?: InputMaybe<Stage>
}

/** All of our CoreML models used in the iOS app */
export type CoreMlModelPublishedByArgs = {
  locales?: InputMaybe<Array<Locale>>
}

/** All of our CoreML models used in the iOS app */
export type CoreMlModelScheduledInArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  locales?: InputMaybe<Array<Locale>>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<ScheduledOperationWhereInput>
}

/** All of our CoreML models used in the iOS app */
export type CoreMlModelUpdatedByArgs = {
  locales?: InputMaybe<Array<Locale>>
}

export type CoreMlModelConnectInput = {
  /** Allow to specify document position in list of connected documents, will default to appending at end of list */
  position?: InputMaybe<ConnectPositionInput>
  /** Document to connect */
  where: CoreMlModelWhereUniqueInput
}

/** A connection to a list of items. */
export type CoreMlModelConnection = {
  __typename?: 'CoreMLModelConnection'
  aggregate: Aggregate
  /** A list of edges. */
  edges: Array<CoreMlModelEdge>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
}

export type CoreMlModelCreateInput = {
  createdAt?: InputMaybe<Scalars['DateTime']>
  file?: InputMaybe<AssetCreateOneInlineInput>
  type?: InputMaybe<CoreMlModelType>
  updatedAt?: InputMaybe<Scalars['DateTime']>
}

export type CoreMlModelCreateManyInlineInput = {
  /** Connect multiple existing CoreMLModel documents */
  connect?: InputMaybe<Array<CoreMlModelWhereUniqueInput>>
  /** Create and connect multiple existing CoreMLModel documents */
  create?: InputMaybe<Array<CoreMlModelCreateInput>>
}

export type CoreMlModelCreateOneInlineInput = {
  /** Connect one existing CoreMLModel document */
  connect?: InputMaybe<CoreMlModelWhereUniqueInput>
  /** Create and connect one CoreMLModel document */
  create?: InputMaybe<CoreMlModelCreateInput>
}

/** An edge in a connection. */
export type CoreMlModelEdge = {
  __typename?: 'CoreMLModelEdge'
  /** A cursor for use in pagination. */
  cursor: Scalars['String']
  /** The item at the end of the edge. */
  node: CoreMlModel
}

/** Identifies documents */
export type CoreMlModelManyWhereInput = {
  /** Logical AND on all given filters. */
  AND?: InputMaybe<Array<CoreMlModelWhereInput>>
  /** Logical NOT on all given filters combined by AND. */
  NOT?: InputMaybe<Array<CoreMlModelWhereInput>>
  /** Logical OR on all given filters. */
  OR?: InputMaybe<Array<CoreMlModelWhereInput>>
  /** Contains search across all appropriate fields. */
  _search?: InputMaybe<Scalars['String']>
  createdAt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than the given value. */
  createdAt_gt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than or equal the given value. */
  createdAt_gte?: InputMaybe<Scalars['DateTime']>
  /** All values that are contained in given list. */
  createdAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  /** All values less than the given value. */
  createdAt_lt?: InputMaybe<Scalars['DateTime']>
  /** All values less than or equal the given value. */
  createdAt_lte?: InputMaybe<Scalars['DateTime']>
  /** All values that are not equal to given value. */
  createdAt_not?: InputMaybe<Scalars['DateTime']>
  /** All values that are not contained in given list. */
  createdAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  createdBy?: InputMaybe<UserWhereInput>
  file?: InputMaybe<AssetWhereInput>
  id?: InputMaybe<Scalars['ID']>
  /** All values containing the given string. */
  id_contains?: InputMaybe<Scalars['ID']>
  /** All values ending with the given string. */
  id_ends_with?: InputMaybe<Scalars['ID']>
  /** All values that are contained in given list. */
  id_in?: InputMaybe<Array<Scalars['ID']>>
  /** All values that are not equal to given value. */
  id_not?: InputMaybe<Scalars['ID']>
  /** All values not containing the given string. */
  id_not_contains?: InputMaybe<Scalars['ID']>
  /** All values not ending with the given string */
  id_not_ends_with?: InputMaybe<Scalars['ID']>
  /** All values that are not contained in given list. */
  id_not_in?: InputMaybe<Array<Scalars['ID']>>
  /** All values not starting with the given string. */
  id_not_starts_with?: InputMaybe<Scalars['ID']>
  /** All values starting with the given string. */
  id_starts_with?: InputMaybe<Scalars['ID']>
  publishedAt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than the given value. */
  publishedAt_gt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than or equal the given value. */
  publishedAt_gte?: InputMaybe<Scalars['DateTime']>
  /** All values that are contained in given list. */
  publishedAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  /** All values less than the given value. */
  publishedAt_lt?: InputMaybe<Scalars['DateTime']>
  /** All values less than or equal the given value. */
  publishedAt_lte?: InputMaybe<Scalars['DateTime']>
  /** All values that are not equal to given value. */
  publishedAt_not?: InputMaybe<Scalars['DateTime']>
  /** All values that are not contained in given list. */
  publishedAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  publishedBy?: InputMaybe<UserWhereInput>
  scheduledIn_every?: InputMaybe<ScheduledOperationWhereInput>
  scheduledIn_none?: InputMaybe<ScheduledOperationWhereInput>
  scheduledIn_some?: InputMaybe<ScheduledOperationWhereInput>
  type?: InputMaybe<CoreMlModelType>
  /** All values that are contained in given list. */
  type_in?: InputMaybe<Array<CoreMlModelType>>
  /** All values that are not equal to given value. */
  type_not?: InputMaybe<CoreMlModelType>
  /** All values that are not contained in given list. */
  type_not_in?: InputMaybe<Array<CoreMlModelType>>
  updatedAt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than the given value. */
  updatedAt_gt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than or equal the given value. */
  updatedAt_gte?: InputMaybe<Scalars['DateTime']>
  /** All values that are contained in given list. */
  updatedAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  /** All values less than the given value. */
  updatedAt_lt?: InputMaybe<Scalars['DateTime']>
  /** All values less than or equal the given value. */
  updatedAt_lte?: InputMaybe<Scalars['DateTime']>
  /** All values that are not equal to given value. */
  updatedAt_not?: InputMaybe<Scalars['DateTime']>
  /** All values that are not contained in given list. */
  updatedAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  updatedBy?: InputMaybe<UserWhereInput>
}

export enum CoreMlModelOrderByInput {
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  PublishedAtAsc = 'publishedAt_ASC',
  PublishedAtDesc = 'publishedAt_DESC',
  TypeAsc = 'type_ASC',
  TypeDesc = 'type_DESC',
  UpdatedAtAsc = 'updatedAt_ASC',
  UpdatedAtDesc = 'updatedAt_DESC',
}

export type CoreMlModelUpdateInput = {
  file?: InputMaybe<AssetUpdateOneInlineInput>
  type?: InputMaybe<CoreMlModelType>
}

export type CoreMlModelUpdateManyInlineInput = {
  /** Connect multiple existing CoreMLModel documents */
  connect?: InputMaybe<Array<CoreMlModelConnectInput>>
  /** Create and connect multiple CoreMLModel documents */
  create?: InputMaybe<Array<CoreMlModelCreateInput>>
  /** Delete multiple CoreMLModel documents */
  delete?: InputMaybe<Array<CoreMlModelWhereUniqueInput>>
  /** Disconnect multiple CoreMLModel documents */
  disconnect?: InputMaybe<Array<CoreMlModelWhereUniqueInput>>
  /** Override currently-connected documents with multiple existing CoreMLModel documents */
  set?: InputMaybe<Array<CoreMlModelWhereUniqueInput>>
  /** Update multiple CoreMLModel documents */
  update?: InputMaybe<Array<CoreMlModelUpdateWithNestedWhereUniqueInput>>
  /** Upsert multiple CoreMLModel documents */
  upsert?: InputMaybe<Array<CoreMlModelUpsertWithNestedWhereUniqueInput>>
}

export type CoreMlModelUpdateManyInput = {
  type?: InputMaybe<CoreMlModelType>
}

export type CoreMlModelUpdateManyWithNestedWhereInput = {
  /** Update many input */
  data: CoreMlModelUpdateManyInput
  /** Document search */
  where: CoreMlModelWhereInput
}

export type CoreMlModelUpdateOneInlineInput = {
  /** Connect existing CoreMLModel document */
  connect?: InputMaybe<CoreMlModelWhereUniqueInput>
  /** Create and connect one CoreMLModel document */
  create?: InputMaybe<CoreMlModelCreateInput>
  /** Delete currently connected CoreMLModel document */
  delete?: InputMaybe<Scalars['Boolean']>
  /** Disconnect currently connected CoreMLModel document */
  disconnect?: InputMaybe<Scalars['Boolean']>
  /** Update single CoreMLModel document */
  update?: InputMaybe<CoreMlModelUpdateWithNestedWhereUniqueInput>
  /** Upsert single CoreMLModel document */
  upsert?: InputMaybe<CoreMlModelUpsertWithNestedWhereUniqueInput>
}

export type CoreMlModelUpdateWithNestedWhereUniqueInput = {
  /** Document to update */
  data: CoreMlModelUpdateInput
  /** Unique document search */
  where: CoreMlModelWhereUniqueInput
}

export type CoreMlModelUpsertInput = {
  /** Create document if it didn't exist */
  create: CoreMlModelCreateInput
  /** Update document if it exists */
  update: CoreMlModelUpdateInput
}

export type CoreMlModelUpsertWithNestedWhereUniqueInput = {
  /** Upsert data */
  data: CoreMlModelUpsertInput
  /** Unique document search */
  where: CoreMlModelWhereUniqueInput
}

/** Identifies documents */
export type CoreMlModelWhereInput = {
  /** Logical AND on all given filters. */
  AND?: InputMaybe<Array<CoreMlModelWhereInput>>
  /** Logical NOT on all given filters combined by AND. */
  NOT?: InputMaybe<Array<CoreMlModelWhereInput>>
  /** Logical OR on all given filters. */
  OR?: InputMaybe<Array<CoreMlModelWhereInput>>
  /** Contains search across all appropriate fields. */
  _search?: InputMaybe<Scalars['String']>
  createdAt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than the given value. */
  createdAt_gt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than or equal the given value. */
  createdAt_gte?: InputMaybe<Scalars['DateTime']>
  /** All values that are contained in given list. */
  createdAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  /** All values less than the given value. */
  createdAt_lt?: InputMaybe<Scalars['DateTime']>
  /** All values less than or equal the given value. */
  createdAt_lte?: InputMaybe<Scalars['DateTime']>
  /** All values that are not equal to given value. */
  createdAt_not?: InputMaybe<Scalars['DateTime']>
  /** All values that are not contained in given list. */
  createdAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  createdBy?: InputMaybe<UserWhereInput>
  file?: InputMaybe<AssetWhereInput>
  id?: InputMaybe<Scalars['ID']>
  /** All values containing the given string. */
  id_contains?: InputMaybe<Scalars['ID']>
  /** All values ending with the given string. */
  id_ends_with?: InputMaybe<Scalars['ID']>
  /** All values that are contained in given list. */
  id_in?: InputMaybe<Array<Scalars['ID']>>
  /** All values that are not equal to given value. */
  id_not?: InputMaybe<Scalars['ID']>
  /** All values not containing the given string. */
  id_not_contains?: InputMaybe<Scalars['ID']>
  /** All values not ending with the given string */
  id_not_ends_with?: InputMaybe<Scalars['ID']>
  /** All values that are not contained in given list. */
  id_not_in?: InputMaybe<Array<Scalars['ID']>>
  /** All values not starting with the given string. */
  id_not_starts_with?: InputMaybe<Scalars['ID']>
  /** All values starting with the given string. */
  id_starts_with?: InputMaybe<Scalars['ID']>
  publishedAt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than the given value. */
  publishedAt_gt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than or equal the given value. */
  publishedAt_gte?: InputMaybe<Scalars['DateTime']>
  /** All values that are contained in given list. */
  publishedAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  /** All values less than the given value. */
  publishedAt_lt?: InputMaybe<Scalars['DateTime']>
  /** All values less than or equal the given value. */
  publishedAt_lte?: InputMaybe<Scalars['DateTime']>
  /** All values that are not equal to given value. */
  publishedAt_not?: InputMaybe<Scalars['DateTime']>
  /** All values that are not contained in given list. */
  publishedAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  publishedBy?: InputMaybe<UserWhereInput>
  scheduledIn_every?: InputMaybe<ScheduledOperationWhereInput>
  scheduledIn_none?: InputMaybe<ScheduledOperationWhereInput>
  scheduledIn_some?: InputMaybe<ScheduledOperationWhereInput>
  type?: InputMaybe<CoreMlModelType>
  /** All values that are contained in given list. */
  type_in?: InputMaybe<Array<CoreMlModelType>>
  /** All values that are not equal to given value. */
  type_not?: InputMaybe<CoreMlModelType>
  /** All values that are not contained in given list. */
  type_not_in?: InputMaybe<Array<CoreMlModelType>>
  updatedAt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than the given value. */
  updatedAt_gt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than or equal the given value. */
  updatedAt_gte?: InputMaybe<Scalars['DateTime']>
  /** All values that are contained in given list. */
  updatedAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  /** All values less than the given value. */
  updatedAt_lt?: InputMaybe<Scalars['DateTime']>
  /** All values less than or equal the given value. */
  updatedAt_lte?: InputMaybe<Scalars['DateTime']>
  /** All values that are not equal to given value. */
  updatedAt_not?: InputMaybe<Scalars['DateTime']>
  /** All values that are not contained in given list. */
  updatedAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  updatedBy?: InputMaybe<UserWhereInput>
}

/** References CoreMLModel record uniquely */
export type CoreMlModelWhereUniqueInput = {
  id?: InputMaybe<Scalars['ID']>
}

export enum CoreMlModelType {
  KeyGearClassifier = 'KeyGearClassifier',
}

export type CreateApartmentInput = {
  householdSize: Scalars['Int']
  livingSpace: Scalars['Int']
  street: Scalars['String']
  type: ApartmentType
  zipCode: Scalars['String']
}

export type CreateDanishAccidentInput = {
  apartment?: InputMaybe<Scalars['String']>
  bbrId?: InputMaybe<Scalars['String']>
  city?: InputMaybe<Scalars['String']>
  coInsured: Scalars['Int']
  floor?: InputMaybe<Scalars['String']>
  isStudent: Scalars['Boolean']
  street: Scalars['String']
  zipCode: Scalars['String']
}

export type CreateDanishHomeContentsInput = {
  apartment?: InputMaybe<Scalars['String']>
  bbrId?: InputMaybe<Scalars['String']>
  city?: InputMaybe<Scalars['String']>
  coInsured: Scalars['Int']
  floor?: InputMaybe<Scalars['String']>
  isStudent: Scalars['Boolean']
  livingSpace: Scalars['Int']
  street: Scalars['String']
  type: DanishHomeContentsType
  zipCode: Scalars['String']
}

export type CreateDanishTravelInput = {
  apartment?: InputMaybe<Scalars['String']>
  bbrId?: InputMaybe<Scalars['String']>
  city?: InputMaybe<Scalars['String']>
  coInsured: Scalars['Int']
  floor?: InputMaybe<Scalars['String']>
  isStudent: Scalars['Boolean']
  street: Scalars['String']
  zipCode: Scalars['String']
}

export type CreateHouseInput = {
  ancillarySpace: Scalars['Int']
  extraBuildings: Array<ExtraBuildingInput>
  householdSize: Scalars['Int']
  isSubleted: Scalars['Boolean']
  livingSpace: Scalars['Int']
  numberOfBathrooms: Scalars['Int']
  street: Scalars['String']
  yearOfConstruction: Scalars['Int']
  zipCode: Scalars['String']
}

export type CreateKeyGearItemInput = {
  category: KeyGearItemCategory
  name?: InputMaybe<Scalars['String']>
  photos: Array<S3FileInput>
  physicalReferenceHash?: InputMaybe<Scalars['String']>
  purchasePrice?: InputMaybe<MonetaryAmountV2Input>
}

export type CreateNorwegianHomeContentsInput = {
  coInsured: Scalars['Int']
  isYouth: Scalars['Boolean']
  livingSpace: Scalars['Int']
  street: Scalars['String']
  type: NorwegianHomeContentsType
  zipCode: Scalars['String']
}

export type CreateNorwegianTravelInput = {
  coInsured: Scalars['Int']
  isYouth: Scalars['Boolean']
}

export type CreateOnboardingQuoteCartInput = {
  locale: Scalars['String']
  market: Market
}

export type CreateQuoteBundleInput = {
  contractBundleId?: InputMaybe<Scalars['ID']>
  initiatedFrom?: InputMaybe<QuoteInitiatedFrom>
  numberCoInsured?: InputMaybe<Scalars['Int']>
  payload: Array<Scalars['JSON']>
}

export type CreateQuoteBundleResult = QuoteBundleError | QuoteCart

export type CreateQuoteBundleSuccess = {
  __typename?: 'CreateQuoteBundleSuccess'
  id: Scalars['ID']
}

export type CreateQuoteCartAccessTokenResult = {
  __typename?: 'CreateQuoteCartAccessTokenResult'
  accessToken: Scalars['String']
}

export type CreateQuoteCartResult = {
  __typename?: 'CreateQuoteCartResult'
  id: Scalars['ID']
}

export type CreateQuoteInput = {
  apartment?: InputMaybe<CreateApartmentInput>
  birthDate?: InputMaybe<Scalars['LocalDate']>
  currentInsurer?: InputMaybe<Scalars['String']>
  danishAccident?: InputMaybe<CreateDanishAccidentInput>
  danishHomeContents?: InputMaybe<CreateDanishHomeContentsInput>
  danishTravel?: InputMaybe<CreateDanishTravelInput>
  dataCollectionId?: InputMaybe<Scalars['ID']>
  email?: InputMaybe<Scalars['String']>
  firstName: Scalars['String']
  house?: InputMaybe<CreateHouseInput>
  id: Scalars['ID']
  lastName: Scalars['String']
  norwegianHomeContents?: InputMaybe<CreateNorwegianHomeContentsInput>
  norwegianTravel?: InputMaybe<CreateNorwegianTravelInput>
  phoneNumber?: InputMaybe<Scalars['String']>
  ssn?: InputMaybe<Scalars['String']>
  startDate?: InputMaybe<Scalars['LocalDate']>
  swedishAccident?: InputMaybe<CreateSwedishAccidentInput>
  swedishApartment?: InputMaybe<CreateSwedishApartmentInput>
  swedishHouse?: InputMaybe<CreateSwedishHouseInput>
}

export type CreateQuoteResult = CompleteQuote | UnderwritingLimitsHit

export type CreateSwedishAccidentInput = {
  householdSize: Scalars['Int']
  isStudent: Scalars['Boolean']
  livingSpace: Scalars['Int']
  street: Scalars['String']
  zipCode: Scalars['String']
}

export type CreateSwedishApartmentInput = {
  householdSize: Scalars['Int']
  livingSpace: Scalars['Int']
  street: Scalars['String']
  type: ApartmentType
  zipCode: Scalars['String']
}

export type CreateSwedishBundleInput = {
  address?: InputMaybe<AddressInput>
  isStudent: Scalars['Boolean']
  ssn: Scalars['String']
}

export type CreateSwedishHouseInput = {
  ancillarySpace: Scalars['Int']
  extraBuildings: Array<ExtraBuildingInput>
  householdSize: Scalars['Int']
  isSubleted: Scalars['Boolean']
  livingSpace: Scalars['Int']
  numberOfBathrooms: Scalars['Int']
  street: Scalars['String']
  yearOfConstruction: Scalars['Int']
  zipCode: Scalars['String']
}

export type CrossSell = {
  __typename?: 'CrossSell'
  action: CrossSellAction
  blurHash: Scalars['String']
  callToAction: Scalars['String']
  contractType: TypeOfContract
  description: Scalars['String']
  imageUrl: Scalars['String']
  info: CrossSellInfo
  title: Scalars['String']
  type: CrossSellType
}

export type CrossSellInfoArgs = {
  locale: Locale
}

export type CrossSellAction = CrossSellChat | CrossSellEmbark

export type CrossSellChat = {
  __typename?: 'CrossSellChat'
  _?: Maybe<Scalars['Boolean']>
}

export type CrossSellEmbark = {
  __typename?: 'CrossSellEmbark'
  /** @deprecated use embarkStoryV2 */
  embarkStory: EmbarkStory
  embarkStoryV2: EmbarkStory
}

export type CrossSellEmbarkEmbarkStoryArgs = {
  locale: Locale
}

export type CrossSellInfo = {
  __typename?: 'CrossSellInfo'
  aboutSection: Scalars['String']
  contractPerils: Array<PerilV2>
  displayName: Scalars['String']
  faq: Array<ContractFaq>
  highlights: Array<ContractHighlight>
  insurableLimits: Array<InsurableLimit>
  insuranceTerms: Array<InsuranceTerm>
}

export type CrossSellQuotesFailure = {
  __typename?: 'CrossSellQuotesFailure'
  breachedUnderwritingGuidelines: Array<Scalars['String']>
}

export type CrossSellQuotesInput = {
  /** Types to Cross-Sell. */
  crossSellTypes: Array<CrossSellType>
  /** Number co-insured, the number of people on the contract except for the policy holder. */
  numberCoInsured: Scalars['Int']
}

export type CrossSellQuotesResult = CrossSellQuotesFailure | CrossSellQuotesSuccess

export type CrossSellQuotesSuccess = {
  __typename?: 'CrossSellQuotesSuccess'
  quoteIds: Array<Scalars['ID']>
}

export enum CrossSellType {
  Accident = 'ACCIDENT',
  Car = 'CAR',
  HomeContent = 'HOME_CONTENT',
  House = 'HOUSE',
  Travel = 'TRAVEL',
}

export type CurrentInsurer = {
  __typename?: 'CurrentInsurer'
  displayName?: Maybe<Scalars['String']>
  id?: Maybe<Scalars['String']>
  switchable?: Maybe<Scalars['Boolean']>
}

export type DanishAccidentAgreement = AgreementCore & {
  __typename?: 'DanishAccidentAgreement'
  activeFrom?: Maybe<Scalars['LocalDate']>
  activeTo?: Maybe<Scalars['LocalDate']>
  address: Address
  carrier?: Maybe<Scalars['String']>
  certificateUrl?: Maybe<Scalars['String']>
  id: Scalars['ID']
  numberCoInsured: Scalars['Int']
  partner?: Maybe<Scalars['String']>
  premium: MonetaryAmountV2
  status: AgreementStatus
  type?: Maybe<DanishAccidentLineOfBusiness>
}

export type DanishAccidentDetails = {
  __typename?: 'DanishAccidentDetails'
  apartment?: Maybe<Scalars['String']>
  bbrId?: Maybe<Scalars['String']>
  city?: Maybe<Scalars['String']>
  coInsured: Scalars['Int']
  floor?: Maybe<Scalars['String']>
  isStudent: Scalars['Boolean']
  street: Scalars['String']
  zipCode: Scalars['String']
}

export enum DanishAccidentLineOfBusiness {
  Regular = 'REGULAR',
  Student = 'STUDENT',
}

export type DanishBankIdAuthResponse = {
  __typename?: 'DanishBankIdAuthResponse'
  redirectUrl: Scalars['String']
}

export type DanishBankIdSession = {
  __typename?: 'DanishBankIdSession'
  /** @deprecated This type i not in use any more */
  redirectUrl?: Maybe<Scalars['String']>
}

export type DanishHomeContentAgreement = AgreementCore & {
  __typename?: 'DanishHomeContentAgreement'
  activeFrom?: Maybe<Scalars['LocalDate']>
  activeTo?: Maybe<Scalars['LocalDate']>
  address: Address
  carrier?: Maybe<Scalars['String']>
  certificateUrl?: Maybe<Scalars['String']>
  id: Scalars['ID']
  numberCoInsured: Scalars['Int']
  partner?: Maybe<Scalars['String']>
  premium: MonetaryAmountV2
  squareMeters: Scalars['Int']
  status: AgreementStatus
  type?: Maybe<DanishHomeContentLineOfBusiness>
}

export enum DanishHomeContentLineOfBusiness {
  Own = 'OWN',
  Rent = 'RENT',
  StudentOwn = 'STUDENT_OWN',
  StudentRent = 'STUDENT_RENT',
}

export type DanishHomeContentsDetails = {
  __typename?: 'DanishHomeContentsDetails'
  apartment?: Maybe<Scalars['String']>
  bbrId?: Maybe<Scalars['String']>
  city?: Maybe<Scalars['String']>
  coInsured: Scalars['Int']
  floor?: Maybe<Scalars['String']>
  isStudent: Scalars['Boolean']
  livingSpace: Scalars['Int']
  street: Scalars['String']
  type: DanishHomeContentsType
  zipCode: Scalars['String']
}

export enum DanishHomeContentsType {
  Own = 'OWN',
  Rent = 'RENT',
}

export type DanishTravelAgreement = AgreementCore & {
  __typename?: 'DanishTravelAgreement'
  activeFrom?: Maybe<Scalars['LocalDate']>
  activeTo?: Maybe<Scalars['LocalDate']>
  address: Address
  carrier?: Maybe<Scalars['String']>
  certificateUrl?: Maybe<Scalars['String']>
  id: Scalars['ID']
  numberCoInsured: Scalars['Int']
  partner?: Maybe<Scalars['String']>
  premium: MonetaryAmountV2
  status: AgreementStatus
  type?: Maybe<DanishTravelLineOfBusiness>
}

export type DanishTravelDetails = {
  __typename?: 'DanishTravelDetails'
  apartment?: Maybe<Scalars['String']>
  bbrId?: Maybe<Scalars['String']>
  city?: Maybe<Scalars['String']>
  coInsured: Scalars['Int']
  floor?: Maybe<Scalars['String']>
  isStudent: Scalars['Boolean']
  street: Scalars['String']
  zipCode: Scalars['String']
}

export enum DanishTravelLineOfBusiness {
  Regular = 'REGULAR',
  Student = 'STUDENT',
}

export type DataCollectingStatusResponse = {
  __typename?: 'DataCollectingStatusResponse'
  imageValue?: Maybe<Scalars['String']>
  status: DataCollectionStatus
  token?: Maybe<Scalars['String']>
}

export type DataCollectingStatusResponseV2 = {
  __typename?: 'DataCollectingStatusResponseV2'
  extraInformation?: Maybe<BankIdExtraInfo>
  id: Scalars['String']
  insuranceCompany?: Maybe<Scalars['String']>
  status: DataCollectionStatus
}

export type DataCollectionPersonalNumberInput = {
  insuranceProvider: Scalars['String']
  personalNumber: Scalars['String']
  reference: Scalars['ID']
}

export type DataCollectionPhoneNumberInput = {
  insuranceProvider: Scalars['String']
  phoneNumber: Scalars['String']
  reference: Scalars['ID']
}

export enum DataCollectionStatus {
  Collecting = 'COLLECTING',
  Completed = 'COMPLETED',
  CompletedEmpty = 'COMPLETED_EMPTY',
  CompletedPartial = 'COMPLETED_PARTIAL',
  Failed = 'FAILED',
  Login = 'LOGIN',
  Running = 'RUNNING',
  UserInput = 'USER_INPUT',
  WaitingForAuthentication = 'WAITING_FOR_AUTHENTICATION',
}

export type DirectDebitResponse = {
  __typename?: 'DirectDebitResponse'
  orderId: Scalars['String']
  url: Scalars['String']
}

export enum DirectDebitStatus {
  Active = 'ACTIVE',
  NeedsSetup = 'NEEDS_SETUP',
  Pending = 'PENDING',
}

export enum DocumentFileTypes {
  Doc = 'doc',
  Docx = 'docx',
  Html = 'html',
  Jpg = 'jpg',
  Odp = 'odp',
  Ods = 'ods',
  Odt = 'odt',
  Pdf = 'pdf',
  Png = 'png',
  Ppt = 'ppt',
  Pptx = 'pptx',
  Svg = 'svg',
  Txt = 'txt',
  Webp = 'webp',
  Xls = 'xls',
  Xlsx = 'xlsx',
}

export type DocumentOutputInput = {
  /**
   * Transforms a document into a desired file type.
   * See this matrix for format support:
   *
   * PDF:	jpg, odp, ods, odt, png, svg, txt, and webp
   * DOC:	docx, html, jpg, odt, pdf, png, svg, txt, and webp
   * DOCX:	doc, html, jpg, odt, pdf, png, svg, txt, and webp
   * ODT:	doc, docx, html, jpg, pdf, png, svg, txt, and webp
   * XLS:	jpg, pdf, ods, png, svg, xlsx, and webp
   * XLSX:	jpg, pdf, ods, png, svg, xls, and webp
   * ODS:	jpg, pdf, png, xls, svg, xlsx, and webp
   * PPT:	jpg, odp, pdf, png, svg, pptx, and webp
   * PPTX:	jpg, odp, pdf, png, svg, ppt, and webp
   * ODP:	jpg, pdf, png, ppt, svg, pptx, and webp
   * BMP:	jpg, odp, ods, odt, pdf, png, svg, and webp
   * GIF:	jpg, odp, ods, odt, pdf, png, svg, and webp
   * JPG:	jpg, odp, ods, odt, pdf, png, svg, and webp
   * PNG:	jpg, odp, ods, odt, pdf, png, svg, and webp
   * WEBP:	jpg, odp, ods, odt, pdf, png, svg, and webp
   * TIFF:	jpg, odp, ods, odt, pdf, png, svg, and webp
   * AI:	    jpg, odp, ods, odt, pdf, png, svg, and webp
   * PSD:	jpg, odp, ods, odt, pdf, png, svg, and webp
   * SVG:	jpg, odp, ods, odt, pdf, png, and webp
   * HTML:	jpg, odt, pdf, svg, txt, and webp
   * TXT:	jpg, html, odt, pdf, svg, and webp
   */
  format?: InputMaybe<DocumentFileTypes>
}

/** Transformations for Documents */
export type DocumentTransformationInput = {
  /** Changes the output for the file. */
  output?: InputMaybe<DocumentOutputInput>
}

export type DocumentVersion = {
  __typename?: 'DocumentVersion'
  createdAt: Scalars['DateTime']
  data?: Maybe<Scalars['Json']>
  id: Scalars['ID']
  revision: Scalars['Int']
  stage: Stage
}

export type EditApartmentInput = {
  householdSize?: InputMaybe<Scalars['Int']>
  livingSpace?: InputMaybe<Scalars['Int']>
  street?: InputMaybe<Scalars['String']>
  type?: InputMaybe<ApartmentType>
  zipCode?: InputMaybe<Scalars['String']>
}

export type EditDanishAccidentInput = {
  apartment?: InputMaybe<Scalars['String']>
  bbrId?: InputMaybe<Scalars['String']>
  city?: InputMaybe<Scalars['String']>
  coInsured?: InputMaybe<Scalars['Int']>
  floor?: InputMaybe<Scalars['String']>
  isStudent?: InputMaybe<Scalars['Boolean']>
  street?: InputMaybe<Scalars['String']>
  zipCode?: InputMaybe<Scalars['String']>
}

export type EditDanishHomeContentsInput = {
  apartment?: InputMaybe<Scalars['String']>
  bbrId?: InputMaybe<Scalars['String']>
  city?: InputMaybe<Scalars['String']>
  coInsured?: InputMaybe<Scalars['Int']>
  floor?: InputMaybe<Scalars['String']>
  isStudent?: InputMaybe<Scalars['Boolean']>
  livingSpace?: InputMaybe<Scalars['Int']>
  street?: InputMaybe<Scalars['String']>
  type?: InputMaybe<DanishHomeContentsType>
  zipCode?: InputMaybe<Scalars['String']>
}

export type EditDanishTravelInput = {
  apartment?: InputMaybe<Scalars['String']>
  bbrId?: InputMaybe<Scalars['String']>
  city?: InputMaybe<Scalars['String']>
  coInsured?: InputMaybe<Scalars['Int']>
  floor?: InputMaybe<Scalars['String']>
  isStudent?: InputMaybe<Scalars['Boolean']>
  street?: InputMaybe<Scalars['String']>
  zipCode?: InputMaybe<Scalars['String']>
}

export type EditHouseInput = {
  ancillarySpace?: InputMaybe<Scalars['Int']>
  extraBuildings?: InputMaybe<Array<ExtraBuildingInput>>
  householdSize?: InputMaybe<Scalars['Int']>
  isSubleted?: InputMaybe<Scalars['Boolean']>
  livingSpace?: InputMaybe<Scalars['Int']>
  numberOfBathrooms?: InputMaybe<Scalars['Int']>
  street?: InputMaybe<Scalars['String']>
  yearOfConstruction?: InputMaybe<Scalars['Int']>
  zipCode?: InputMaybe<Scalars['String']>
}

export type EditNorwegianHomeContentsInput = {
  coInsured?: InputMaybe<Scalars['Int']>
  isYouth?: InputMaybe<Scalars['Boolean']>
  livingSpace?: InputMaybe<Scalars['Int']>
  street?: InputMaybe<Scalars['String']>
  type?: InputMaybe<NorwegianHomeContentsType>
  zipCode?: InputMaybe<Scalars['String']>
}

export type EditNorwegianTravelInput = {
  coInsured?: InputMaybe<Scalars['Int']>
  isYouth?: InputMaybe<Scalars['Boolean']>
}

export type EditQuoteInput = {
  apartment?: InputMaybe<EditApartmentInput>
  birthDate?: InputMaybe<Scalars['LocalDate']>
  currentInsurer?: InputMaybe<Scalars['String']>
  danishAccident?: InputMaybe<EditDanishAccidentInput>
  danishHomeContents?: InputMaybe<EditDanishHomeContentsInput>
  danishTravel?: InputMaybe<EditDanishTravelInput>
  email?: InputMaybe<Scalars['String']>
  firstName?: InputMaybe<Scalars['String']>
  house?: InputMaybe<EditHouseInput>
  id: Scalars['ID']
  lastName?: InputMaybe<Scalars['String']>
  norwegianHomeContents?: InputMaybe<EditNorwegianHomeContentsInput>
  norwegianTravel?: InputMaybe<EditNorwegianTravelInput>
  phoneNumber?: InputMaybe<Scalars['String']>
  ssn?: InputMaybe<Scalars['String']>
  startDate?: InputMaybe<Scalars['LocalDate']>
  swedishAccident?: InputMaybe<EditSwedishAccidentInput>
  swedishApartment?: InputMaybe<EditSwedishApartmentInput>
  swedishHouse?: InputMaybe<EditSwedishHouseInput>
}

export type EditQuoteResult = QuoteBundleError | QuoteCart

export type EditSwedishAccidentInput = {
  householdSize?: InputMaybe<Scalars['Int']>
  isStudent?: InputMaybe<Scalars['Boolean']>
  livingSpace?: InputMaybe<Scalars['Int']>
  street?: InputMaybe<Scalars['String']>
  zipCode?: InputMaybe<Scalars['String']>
}

export type EditSwedishApartmentInput = {
  householdSize?: InputMaybe<Scalars['Int']>
  livingSpace?: InputMaybe<Scalars['Int']>
  street?: InputMaybe<Scalars['String']>
  type?: InputMaybe<ApartmentType>
  zipCode?: InputMaybe<Scalars['String']>
}

export type EditSwedishHouseInput = {
  ancillarySpace?: InputMaybe<Scalars['Int']>
  extraBuildings?: InputMaybe<Array<ExtraBuildingInput>>
  householdSize?: InputMaybe<Scalars['Int']>
  isSubleted?: InputMaybe<Scalars['Boolean']>
  livingSpace?: InputMaybe<Scalars['Int']>
  numberOfBathrooms?: InputMaybe<Scalars['Int']>
  street?: InputMaybe<Scalars['String']>
  yearOfConstruction?: InputMaybe<Scalars['Int']>
  zipCode?: InputMaybe<Scalars['String']>
}

export type EmbarkApiGraphQlConstantVariable = {
  __typename?: 'EmbarkAPIGraphQLConstantVariable'
  as: EmbarkApiGraphQlSingleVariableCasting
  key: Scalars['String']
  value: Scalars['String']
}

export type EmbarkApiGraphQlError = {
  __typename?: 'EmbarkAPIGraphQLError'
  contains?: Maybe<Scalars['String']>
  next: EmbarkLink
}

export type EmbarkApiGraphQlGeneratedVariable = {
  __typename?: 'EmbarkAPIGraphQLGeneratedVariable'
  key: Scalars['String']
  storeAs: Scalars['String']
  type: EmbarkApiGraphQlVariableGeneratedType
}

export type EmbarkApiGraphQlMultiActionVariable = {
  __typename?: 'EmbarkAPIGraphQLMultiActionVariable'
  from: Scalars['String']
  key: Scalars['String']
  variables: Array<EmbarkApiGraphQlVariable>
}

export type EmbarkApiGraphQlResult = {
  __typename?: 'EmbarkAPIGraphQLResult'
  as: Scalars['String']
  key: Scalars['String']
}

export type EmbarkApiGraphQlSingleVariable = {
  __typename?: 'EmbarkAPIGraphQLSingleVariable'
  as: EmbarkApiGraphQlSingleVariableCasting
  from: Scalars['String']
  key: Scalars['String']
}

export enum EmbarkApiGraphQlSingleVariableCasting {
  Boolean = 'boolean',
  File = 'file',
  Int = 'int',
  String = 'string',
}

export type EmbarkApiGraphQlVariable =
  | EmbarkApiGraphQlConstantVariable
  | EmbarkApiGraphQlGeneratedVariable
  | EmbarkApiGraphQlMultiActionVariable
  | EmbarkApiGraphQlSingleVariable

export enum EmbarkApiGraphQlVariableGeneratedType {
  Uuid = 'uuid',
}

export type EmbarkAction =
  | EmbarkAddressAutocompleteAction
  | EmbarkAudioRecorderAction
  | EmbarkDatePickerAction
  | EmbarkExternalInsuranceProviderAction
  | EmbarkMultiAction
  | EmbarkNumberAction
  | EmbarkNumberActionSet
  | EmbarkPreviousInsuranceProviderAction
  | EmbarkSelectAction
  | EmbarkTextAction
  | EmbarkTextActionSet

export type EmbarkActionCore = {
  component: Scalars['String']
}

export type EmbarkAddressAutocompleteAction = EmbarkActionCore & {
  __typename?: 'EmbarkAddressAutocompleteAction'
  component: Scalars['String']
  data: EmbarkAddressAutocompleteActionData
}

export type EmbarkAddressAutocompleteActionData = {
  __typename?: 'EmbarkAddressAutocompleteActionData'
  api?: Maybe<EmbarkApi>
  key: Scalars['String']
  large?: Maybe<Scalars['Boolean']>
  link: EmbarkLink
  placeholder: Scalars['String']
  tooltip?: Maybe<EmbarkTooltip>
}

export type EmbarkApi =
  | EmbarkApiCreateQuote
  | EmbarkApiGraphQlMutation
  | EmbarkApiGraphQlQuery
  | EmbarkApiHouseInformation
  | EmbarkApiPersonalInformation

export type EmbarkApiCore = {
  component: Scalars['String']
}

export type EmbarkApiCreateQuote = EmbarkApiCore & {
  __typename?: 'EmbarkApiCreateQuote'
  component: Scalars['String']
  data: EmbarkApiCreateQuoteData
}

export type EmbarkApiCreateQuoteData = {
  __typename?: 'EmbarkApiCreateQuoteData'
  error: EmbarkLink
  success: EmbarkLink
  uwlimits: EmbarkLink
}

export type EmbarkApiGraphQlMutation = {
  __typename?: 'EmbarkApiGraphQLMutation'
  component: Scalars['String']
  data: EmbarkApiGraphQlMutationData
}

export type EmbarkApiGraphQlMutationData = {
  __typename?: 'EmbarkApiGraphQLMutationData'
  errors: Array<EmbarkApiGraphQlError>
  mutation: Scalars['String']
  next?: Maybe<EmbarkLink>
  results: Array<Maybe<EmbarkApiGraphQlResult>>
  variables: Array<EmbarkApiGraphQlVariable>
}

export type EmbarkApiGraphQlQuery = {
  __typename?: 'EmbarkApiGraphQLQuery'
  component: Scalars['String']
  data: EmbarkApiGraphQlQueryData
}

export type EmbarkApiGraphQlQueryData = {
  __typename?: 'EmbarkApiGraphQLQueryData'
  errors: Array<EmbarkApiGraphQlError>
  next?: Maybe<EmbarkLink>
  query: Scalars['String']
  results: Array<EmbarkApiGraphQlResult>
  variables: Array<EmbarkApiGraphQlVariable>
}

export type EmbarkApiHouseInformation = EmbarkApiCore & {
  __typename?: 'EmbarkApiHouseInformation'
  component: Scalars['String']
  data: EmbarkApiHouseInformationData
}

export type EmbarkApiHouseInformationData = {
  __typename?: 'EmbarkApiHouseInformationData'
  error: EmbarkLink
  match: EmbarkLink
  noMatch: EmbarkLink
}

export type EmbarkApiPersonalInformation = EmbarkApiCore & {
  __typename?: 'EmbarkApiPersonalInformation'
  component: Scalars['String']
  data: EmbarkApiPersonalInformationData
}

export type EmbarkApiPersonalInformationData = {
  __typename?: 'EmbarkApiPersonalInformationData'
  error: EmbarkLink
  match: EmbarkLink
  noMatch: EmbarkLink
}

export type EmbarkAudioRecorderAction = EmbarkActionCore & {
  __typename?: 'EmbarkAudioRecorderAction'
  component: Scalars['String']
  data: EmbarkAudioRecorderActionData
}

export type EmbarkAudioRecorderActionData = {
  __typename?: 'EmbarkAudioRecorderActionData'
  label: Scalars['String']
  next: EmbarkLink
  storeKey: Scalars['String']
}

export type EmbarkComputedStoreValue = {
  __typename?: 'EmbarkComputedStoreValue'
  key: Scalars['String']
  value: Scalars['String']
}

export type EmbarkDatePickerAction = EmbarkActionCore & {
  __typename?: 'EmbarkDatePickerAction'
  component: Scalars['String']
  label: Scalars['String']
  next: EmbarkLink
  storeKey: Scalars['String']
  tooltip?: Maybe<EmbarkTooltip>
}

export type EmbarkDropdownAction = EmbarkActionCore & {
  __typename?: 'EmbarkDropdownAction'
  component: Scalars['String']
  data: EmbarkDropdownActionData
}

export type EmbarkDropdownActionData = {
  __typename?: 'EmbarkDropdownActionData'
  key: Scalars['String']
  label: Scalars['String']
  options: Array<EmbarkDropdownOption>
}

export type EmbarkDropdownOption = {
  __typename?: 'EmbarkDropdownOption'
  text: Scalars['String']
  value: Scalars['String']
}

export type EmbarkExpression =
  | EmbarkExpressionBinary
  | EmbarkExpressionMultiple
  | EmbarkExpressionUnary

export type EmbarkExpressionBinary = {
  __typename?: 'EmbarkExpressionBinary'
  key: Scalars['String']
  text?: Maybe<Scalars['String']>
  type: EmbarkExpressionTypeBinary
  value: Scalars['String']
}

export type EmbarkExpressionMultiple = {
  __typename?: 'EmbarkExpressionMultiple'
  subExpressions: Array<EmbarkExpression>
  text?: Maybe<Scalars['String']>
  type: EmbarkExpressionTypeMultiple
}

export enum EmbarkExpressionTypeBinary {
  Equals = 'EQUALS',
  LessThan = 'LESS_THAN',
  LessThanOrEquals = 'LESS_THAN_OR_EQUALS',
  MoreThan = 'MORE_THAN',
  MoreThanOrEquals = 'MORE_THAN_OR_EQUALS',
  NotEquals = 'NOT_EQUALS',
}

export enum EmbarkExpressionTypeMultiple {
  And = 'AND',
  Or = 'OR',
}

export enum EmbarkExpressionTypeUnary {
  Always = 'ALWAYS',
  Never = 'NEVER',
}

export type EmbarkExpressionUnary = {
  __typename?: 'EmbarkExpressionUnary'
  text?: Maybe<Scalars['String']>
  type: EmbarkExpressionTypeUnary
}

export type EmbarkExternalInsuranceProviderAction = EmbarkActionCore & {
  __typename?: 'EmbarkExternalInsuranceProviderAction'
  component: Scalars['String']
  data: EmbarkExternalInsuranceProviderActionData
}

export type EmbarkExternalInsuranceProviderActionData = {
  __typename?: 'EmbarkExternalInsuranceProviderActionData'
  next: EmbarkLink
  skip: EmbarkLink
  storeKey: Scalars['String']
}

export type EmbarkExternalRedirect = {
  __typename?: 'EmbarkExternalRedirect'
  component: Scalars['String']
  data: EmbarkExternalRedirectData
}

export type EmbarkExternalRedirectData = {
  __typename?: 'EmbarkExternalRedirectData'
  location: EmbarkExternalRedirectLocation
}

export enum EmbarkExternalRedirectLocation {
  Chat = 'Chat',
  Close = 'Close',
  MailingList = 'MailingList',
  Offer = 'Offer',
}

export type EmbarkGroupedResponse = {
  __typename?: 'EmbarkGroupedResponse'
  component: Scalars['String']
  each?: Maybe<EmbarkGroupedResponseEach>
  items: Array<EmbarkMessage>
  title: EmbarkResponseExpression
}

export type EmbarkGroupedResponseEach = {
  __typename?: 'EmbarkGroupedResponseEach'
  content: EmbarkMessage
  key: Scalars['String']
}

export type EmbarkKeywords = {
  __typename?: 'EmbarkKeywords'
  addressAutoCompleteModalDismiss?: Maybe<Scalars['String']>
  addressAutoCompleteModalNotFound?: Maybe<Scalars['String']>
  addressAutoCompleteModalTitle?: Maybe<Scalars['String']>
  backButton?: Maybe<Scalars['String']>
  externalInsuranceProviderAuthOpenBankId?: Maybe<Scalars['String']>
  externalInsuranceProviderAuthScanBankID?: Maybe<Scalars['String']>
  externalInsuranceProviderBETATag?: Maybe<Scalars['String']>
  externalInsuranceProviderBackgroundFetchBody?: Maybe<Scalars['String']>
  externalInsuranceProviderBackgroundFetchTitle?: Maybe<Scalars['String']>
  externalInsuranceProviderConfirmButton?: Maybe<Scalars['String']>
  externalInsuranceProviderConfirmMessage?: Maybe<Scalars['String']>
  externalInsuranceProviderConfirmPrivacyPolicy?: Maybe<Scalars['String']>
  externalInsuranceProviderConfirmRejectButton?: Maybe<Scalars['String']>
  externalInsuranceProviderConfirmTitle?: Maybe<Scalars['String']>
  externalInsuranceProviderContinueButton?: Maybe<Scalars['String']>
  externalInsuranceProviderFailureButton?: Maybe<Scalars['String']>
  externalInsuranceProviderFailureMessage?: Maybe<Scalars['String']>
  externalInsuranceProviderFailureTitle?: Maybe<Scalars['String']>
  externalInsuranceProviderGoBackButton?: Maybe<Scalars['String']>
  externalInsuranceProviderOtherProviderButton?: Maybe<Scalars['String']>
  externalInsuranceProviderPersonalNumberSubtitle?: Maybe<Scalars['String']>
  externalInsuranceProviderPersonalNumberTitle?: Maybe<Scalars['String']>
  externalInsuranceProviderSelectTitle?: Maybe<Scalars['String']>
  externalInsuranceProviderSetupTitle?: Maybe<Scalars['String']>
  previousInsuranceProviderOtherProviderModal?: Maybe<Scalars['String']>
  previousInsuranceProviderOtherProviderModalButton?: Maybe<Scalars['String']>
  selectActionSelectLabel?: Maybe<Scalars['String']>
  tooltipModalInformationLabel?: Maybe<Scalars['String']>
}

export type EmbarkLink = {
  __typename?: 'EmbarkLink'
  label: Scalars['String']
  name: Scalars['String']
}

export type EmbarkMessage = {
  __typename?: 'EmbarkMessage'
  expressions: Array<EmbarkExpression>
  text: Scalars['String']
}

export type EmbarkMultiAction = EmbarkActionCore & {
  __typename?: 'EmbarkMultiAction'
  component: Scalars['String']
  data: EmbarkMultiActionData
}

export type EmbarkMultiActionComponent =
  | EmbarkDropdownAction
  | EmbarkMultiActionNumberAction
  | EmbarkSwitchAction

export type EmbarkMultiActionData = {
  __typename?: 'EmbarkMultiActionData'
  addLabel?: Maybe<Scalars['String']>
  components: Array<EmbarkMultiActionComponent>
  key?: Maybe<Scalars['String']>
  link: EmbarkLink
  maxAmount: Scalars['String']
}

export type EmbarkMultiActionNumberAction = EmbarkActionCore & {
  __typename?: 'EmbarkMultiActionNumberAction'
  component: Scalars['String']
  data: EmbarkMultiActionNumberActionData
}

export type EmbarkMultiActionNumberActionData = {
  __typename?: 'EmbarkMultiActionNumberActionData'
  key: Scalars['String']
  label?: Maybe<Scalars['String']>
  placeholder: Scalars['String']
  unit?: Maybe<Scalars['String']>
}

export type EmbarkNumberAction = EmbarkActionCore & {
  __typename?: 'EmbarkNumberAction'
  component: Scalars['String']
  data: EmbarkNumberActionData
}

export type EmbarkNumberActionData = {
  __typename?: 'EmbarkNumberActionData'
  key: Scalars['String']
  label?: Maybe<Scalars['String']>
  link: EmbarkLink
  maxValue?: Maybe<Scalars['Int']>
  minValue?: Maybe<Scalars['Int']>
  placeholder: Scalars['String']
  unit?: Maybe<Scalars['String']>
}

export type EmbarkNumberActionSet = EmbarkActionCore & {
  __typename?: 'EmbarkNumberActionSet'
  component: Scalars['String']
  data?: Maybe<EmbarkNumberActionSetData>
}

export type EmbarkNumberActionSetData = {
  __typename?: 'EmbarkNumberActionSetData'
  link: EmbarkLink
  numberActions: Array<EmbarkNumberActionSetNumberAction>
}

export type EmbarkNumberActionSetNumberAction = {
  __typename?: 'EmbarkNumberActionSetNumberAction'
  data?: Maybe<EmbarkNumberActionSetNumberActionData>
}

export type EmbarkNumberActionSetNumberActionData = {
  __typename?: 'EmbarkNumberActionSetNumberActionData'
  key: Scalars['String']
  label?: Maybe<Scalars['String']>
  maxValue?: Maybe<Scalars['Int']>
  minValue?: Maybe<Scalars['Int']>
  placeholder: Scalars['String']
  title: Scalars['String']
  unit?: Maybe<Scalars['String']>
}

export type EmbarkOfferRedirect = {
  __typename?: 'EmbarkOfferRedirect'
  component: Scalars['String']
  data: EmbarkOfferRedirectData
}

export type EmbarkOfferRedirectData = {
  __typename?: 'EmbarkOfferRedirectData'
  keys: Array<Scalars['String']>
}

export type EmbarkPartnerConfig = {
  __typename?: 'EmbarkPartnerConfig'
  alignment: EmbarkPartnerConfigAlignment
  image: Scalars['String']
  isDefault: Scalars['Boolean']
  name: Scalars['String']
}

export enum EmbarkPartnerConfigAlignment {
  Center = 'center',
  Left = 'left',
}

export type EmbarkPassage = {
  __typename?: 'EmbarkPassage'
  action?: Maybe<EmbarkAction>
  allLinks: Array<EmbarkLink>
  api?: Maybe<EmbarkApi>
  externalRedirect?: Maybe<EmbarkExternalRedirect>
  id: Scalars['String']
  messages: Array<EmbarkMessage>
  name: Scalars['String']
  offerRedirect?: Maybe<EmbarkOfferRedirect>
  quoteCartOfferRedirects: Array<EmbarkQuoteCartOfferRedirect>
  redirects: Array<EmbarkRedirect>
  response: EmbarkResponse
  text: Scalars['String']
  tooltips: Array<EmbarkTooltip>
  tracks: Array<EmbarkTrack>
  url?: Maybe<Scalars['String']>
  variantedOfferRedirects: Array<EmbarkVariantedOfferRedirect>
}

export type EmbarkPreviousInsuranceProviderAction = EmbarkActionCore & {
  __typename?: 'EmbarkPreviousInsuranceProviderAction'
  component: Scalars['String']
  data: EmbarkPreviousInsuranceProviderActionData
}

export type EmbarkPreviousInsuranceProviderActionData = {
  __typename?: 'EmbarkPreviousInsuranceProviderActionData'
  insuranceProviders: Array<InsuranceProvider>
  next: EmbarkLink
  providers?: Maybe<EmbarkPreviousInsuranceProviderActionDataProviders>
  skip: EmbarkLink
  storeKey: Scalars['String']
  tooltip?: Maybe<EmbarkTooltip>
}

export enum EmbarkPreviousInsuranceProviderActionDataProviders {
  Norwegian = 'NORWEGIAN',
  Swedish = 'SWEDISH',
}

export type EmbarkQuoteCartOfferRedirect = {
  __typename?: 'EmbarkQuoteCartOfferRedirect'
  component: Scalars['String']
  data: EmbarkQuoteCartOfferRedirectData
}

export type EmbarkQuoteCartOfferRedirectData = {
  __typename?: 'EmbarkQuoteCartOfferRedirectData'
  expression: EmbarkExpression
  id: Scalars['String']
  selectedInsuranceTypes: Array<Scalars['String']>
}

export type EmbarkRedirect =
  | EmbarkRedirectBinaryExpression
  | EmbarkRedirectMultipleExpressions
  | EmbarkRedirectUnaryExpression

export type EmbarkRedirectBinaryExpression = {
  __typename?: 'EmbarkRedirectBinaryExpression'
  key: Scalars['String']
  passedExpressionKey?: Maybe<Scalars['String']>
  passedExpressionValue?: Maybe<Scalars['String']>
  to: Scalars['String']
  type: EmbarkExpressionTypeBinary
  value: Scalars['String']
}

export type EmbarkRedirectMultipleExpressions = {
  __typename?: 'EmbarkRedirectMultipleExpressions'
  passedExpressionKey?: Maybe<Scalars['String']>
  passedExpressionValue?: Maybe<Scalars['String']>
  subExpressions: Array<EmbarkExpression>
  to: Scalars['String']
  type: EmbarkExpressionTypeMultiple
}

export type EmbarkRedirectUnaryExpression = {
  __typename?: 'EmbarkRedirectUnaryExpression'
  passedExpressionKey?: Maybe<Scalars['String']>
  passedExpressionValue?: Maybe<Scalars['String']>
  to: Scalars['String']
  type: EmbarkExpressionTypeUnary
}

export type EmbarkResponse = EmbarkGroupedResponse | EmbarkMessage | EmbarkResponseExpression

export type EmbarkResponseExpression = {
  __typename?: 'EmbarkResponseExpression'
  expressions: Array<EmbarkExpression>
  text: Scalars['String']
}

export type EmbarkSelectAction = EmbarkActionCore & {
  __typename?: 'EmbarkSelectAction'
  component: Scalars['String']
  data: EmbarkSelectActionData
}

export type EmbarkSelectActionData = {
  __typename?: 'EmbarkSelectActionData'
  options: Array<EmbarkSelectActionOption>
}

export type EmbarkSelectActionOption = {
  __typename?: 'EmbarkSelectActionOption'
  api?: Maybe<EmbarkApi>
  badge?: Maybe<Scalars['String']>
  keys: Array<Scalars['String']>
  link: EmbarkLink
  tooltip?: Maybe<EmbarkTooltip>
  values: Array<Scalars['String']>
}

export type EmbarkStory = {
  __typename?: 'EmbarkStory'
  computedStoreValues?: Maybe<Array<EmbarkComputedStoreValue>>
  id: Scalars['String']
  keywords: EmbarkKeywords
  name: Scalars['String']
  partnerConfigs: Array<EmbarkPartnerConfig>
  passages: Array<EmbarkPassage>
  startPassage: Scalars['String']
  trackableProperties: Array<Scalars['String']>
}

export type EmbarkStoryMetaDataEntryWebUrlPath = {
  __typename?: 'EmbarkStoryMetaDataEntryWebUrlPath'
  path: Scalars['String']
}

export type EmbarkStoryMetadata = {
  __typename?: 'EmbarkStoryMetadata'
  /** Localized */
  description: Scalars['String']
  metadata: Array<EmbarkStoryMetadataEntry>
  name: Scalars['String']
  /** Localized */
  title: Scalars['String']
  type: EmbarkStoryType
}

export type EmbarkStoryMetadataEntry =
  | EmbarkStoryMetaDataEntryWebUrlPath
  | EmbarkStoryMetadataEntryBackground
  | EmbarkStoryMetadataEntryDiscount
  | EmbarkStoryMetadataEntryPill

export type EmbarkStoryMetadataEntryBackground = {
  __typename?: 'EmbarkStoryMetadataEntryBackground'
  background: EmbarkStoryMetadataEntryBackgroundOption
}

export enum EmbarkStoryMetadataEntryBackgroundOption {
  GradientOne = 'GRADIENT_ONE',
  GradientThree = 'GRADIENT_THREE',
  GradientTwo = 'GRADIENT_TWO',
}

export type EmbarkStoryMetadataEntryDiscount = {
  __typename?: 'EmbarkStoryMetadataEntryDiscount'
  /** @deprecated Use `EmbarkStoryMetadataEntryPill`. */
  discount: Scalars['String']
}

export type EmbarkStoryMetadataEntryPill = {
  __typename?: 'EmbarkStoryMetadataEntryPill'
  /** Localized */
  pill: Scalars['String']
}

export enum EmbarkStoryType {
  AppOnboarding = 'APP_ONBOARDING',
  AppOnboardingQuoteCart = 'APP_ONBOARDING_QUOTE_CART',
  WebOnboarding = 'WEB_ONBOARDING',
}

export type EmbarkSwitchAction = EmbarkActionCore & {
  __typename?: 'EmbarkSwitchAction'
  component: Scalars['String']
  data: EmbarkSwitchActionData
}

export type EmbarkSwitchActionData = {
  __typename?: 'EmbarkSwitchActionData'
  defaultValue: Scalars['Boolean']
  key: Scalars['String']
  label: Scalars['String']
}

export type EmbarkTextAction = EmbarkActionCore & {
  __typename?: 'EmbarkTextAction'
  component: Scalars['String']
  data: EmbarkTextActionData
}

export type EmbarkTextActionData = {
  __typename?: 'EmbarkTextActionData'
  api?: Maybe<EmbarkApi>
  key: Scalars['String']
  large?: Maybe<Scalars['Boolean']>
  link: EmbarkLink
  mask?: Maybe<Scalars['String']>
  placeholder: Scalars['String']
  subtitle?: Maybe<Scalars['String']>
  tooltip?: Maybe<EmbarkTooltip>
}

export type EmbarkTextActionSet = EmbarkActionCore & {
  __typename?: 'EmbarkTextActionSet'
  component: Scalars['String']
  data?: Maybe<EmbarkTextActionSetData>
}

export type EmbarkTextActionSetData = {
  __typename?: 'EmbarkTextActionSetData'
  api?: Maybe<EmbarkApi>
  link: EmbarkLink
  textActions: Array<EmbarkTextActionSetTextAction>
}

export type EmbarkTextActionSetTextAction = {
  __typename?: 'EmbarkTextActionSetTextAction'
  data?: Maybe<EmbarkTextActionSetTextActionData>
}

export type EmbarkTextActionSetTextActionData = {
  __typename?: 'EmbarkTextActionSetTextActionData'
  api?: Maybe<EmbarkApi>
  key: Scalars['String']
  large?: Maybe<Scalars['Boolean']>
  mask?: Maybe<Scalars['String']>
  placeholder: Scalars['String']
  title: Scalars['String']
  tooltip?: Maybe<EmbarkTooltip>
}

export type EmbarkTooltip = {
  __typename?: 'EmbarkTooltip'
  description: Scalars['String']
  title: Scalars['String']
}

export type EmbarkTrack = {
  __typename?: 'EmbarkTrack'
  customData?: Maybe<Scalars['JSONString']>
  eventKeys: Array<Maybe<Scalars['String']>>
  eventName: Scalars['String']
  includeAllKeys: Scalars['Boolean']
}

export type EmbarkVariantedOfferRedirect = {
  __typename?: 'EmbarkVariantedOfferRedirect'
  component: Scalars['String']
  data: EmbarkVariantedOfferRedirectData
}

export type EmbarkVariantedOfferRedirectData = {
  __typename?: 'EmbarkVariantedOfferRedirectData'
  allKeys: Array<Scalars['String']>
  expression: EmbarkExpression
  selectedKeys: Array<Scalars['String']>
}

export type Emergency = {
  __typename?: 'Emergency'
  color: HedvigColor
  /** Phone Number on E.164-format */
  emergencyNumber: Scalars['String']
  title: Scalars['String']
}

export enum Environment {
  Production = 'Production',
  Staging = 'Staging',
}

/**  Base Error interface that contains displayable error message.  */
export type Error = {
  message: Scalars['String']
}

export type ExceededMaximumUpdates = {
  __typename?: 'ExceededMaximumUpdates'
  maximumNumberOfUpdates: Scalars['Int']
  updatesByMember: Scalars['Int']
}

export type ExchangeTokenExpiredResponse = {
  __typename?: 'ExchangeTokenExpiredResponse'
  _?: Maybe<Scalars['Boolean']>
}

export type ExchangeTokenInput = {
  exchangeToken: Scalars['String']
}

export type ExchangeTokenInvalidResponse = {
  __typename?: 'ExchangeTokenInvalidResponse'
  _?: Maybe<Scalars['Boolean']>
}

export type ExchangeTokenResponse =
  | ExchangeTokenExpiredResponse
  | ExchangeTokenInvalidResponse
  | ExchangeTokenSuccessResponse

export type ExchangeTokenSuccessResponse = {
  __typename?: 'ExchangeTokenSuccessResponse'
  token: Scalars['String']
}

export type ExternalInsuranceProvider = {
  __typename?: 'ExternalInsuranceProvider'
  /** @deprecated Use dataCollectionV2 instead */
  dataCollection: Array<InsuranceDataCollection>
  /** @deprecated use dataCollectionStatusV2 instead */
  dataCollectionStatus: DataCollectingStatusResponse
  dataCollectionStatusV2: DataCollectingStatusResponseV2
  dataCollectionV2: Array<InsuranceDataCollectionV2>
  /** @deprecated Use providerStatusV2 instead */
  providerStatus: Array<ProviderStatus>
  providerStatusV2: Array<ProviderStatusV2>
}

export type ExternalInsuranceProviderDataCollectionArgs = {
  reference: Scalars['ID']
}

export type ExternalInsuranceProviderDataCollectionStatusArgs = {
  reference: Scalars['ID']
}

export type ExternalInsuranceProviderDataCollectionStatusV2Args = {
  reference: Scalars['ID']
}

export type ExternalInsuranceProviderDataCollectionV2Args = {
  reference: Scalars['ID']
}

export type ExternalInsuranceProviderMutation = {
  __typename?: 'ExternalInsuranceProviderMutation'
  /** @deprecated Use initiateDataCollectionWithSwedishPersonalNumber, initiateDataCollectionWithNorwegianPersonalNumber or initiateDataCollectionWithNorwegianPhoneNumber */
  initiateDataCollection: DataCollectionStatus
  initiateDataCollectionWithNorwegianPersonalNumber: DataCollectionStatus
  initiateDataCollectionWithNorwegianPhoneNumber: DataCollectionStatus
  initiateDataCollectionWithSwedishPersonalNumber: DataCollectionStatus
  initiateIframeDataCollection: Scalars['ID']
}

export type ExternalInsuranceProviderMutationInitiateDataCollectionArgs = {
  input: InitiateDataCollectionInput
}

export type ExternalInsuranceProviderMutationInitiateDataCollectionWithNorwegianPersonalNumberArgs =
  {
    input: DataCollectionPersonalNumberInput
  }

export type ExternalInsuranceProviderMutationInitiateDataCollectionWithNorwegianPhoneNumberArgs = {
  input: DataCollectionPhoneNumberInput
}

export type ExternalInsuranceProviderMutationInitiateDataCollectionWithSwedishPersonalNumberArgs = {
  input: DataCollectionPersonalNumberInput
}

export type ExternalInsuranceProviderMutationInitiateIframeDataCollectionArgs = {
  input: InitiateIframeDataCollectionInput
}

export type ExtraBuilding = ExtraBuildingValue

export type ExtraBuildingCore = {
  area: Scalars['Int']
  displayName: Scalars['String']
  hasWaterConnected: Scalars['Boolean']
  type: ExtraBuildingType
}

export type ExtraBuildingInput = {
  area: Scalars['Int']
  hasWaterConnected: Scalars['Boolean']
  type: ExtraBuildingType
}

export enum ExtraBuildingType {
  Attefall = 'ATTEFALL',
  Barn = 'BARN',
  Boathouse = 'BOATHOUSE',
  Carport = 'CARPORT',
  Friggebod = 'FRIGGEBOD',
  Garage = 'GARAGE',
  Gazebo = 'GAZEBO',
  Greenhouse = 'GREENHOUSE',
  Guesthouse = 'GUESTHOUSE',
  Other = 'OTHER',
  Outhouse = 'OUTHOUSE',
  Sauna = 'SAUNA',
  Shed = 'SHED',
  Storehouse = 'STOREHOUSE',
}

export type ExtraBuildingValue = ExtraBuildingCore & {
  __typename?: 'ExtraBuildingValue'
  area: Scalars['Int']
  displayName: Scalars['String']
  hasWaterConnected: Scalars['Boolean']
  type: ExtraBuildingType
}

export type FailedToStartSign = {
  __typename?: 'FailedToStartSign'
  errorCode: Scalars['String']
  errorMessage: Scalars['String']
}

/** Frequently asked questions */
export type Faq = Node & {
  __typename?: 'Faq'
  body?: Maybe<Scalars['String']>
  /** The time the document was created */
  createdAt: Scalars['DateTime']
  /** User that created this document */
  createdBy?: Maybe<User>
  /** Get the document in other stages */
  documentInStages: Array<Faq>
  headline?: Maybe<Scalars['String']>
  /** List of Faq versions */
  history: Array<Version>
  /** The unique identifier */
  id: Scalars['ID']
  language?: Maybe<Language>
  /** The time the document was published. Null on documents in draft stage. */
  publishedAt?: Maybe<Scalars['DateTime']>
  /** User that last published this document */
  publishedBy?: Maybe<User>
  scheduledIn: Array<ScheduledOperation>
  /** System stage field */
  stage: Stage
  /** The time the document was updated */
  updatedAt: Scalars['DateTime']
  /** User that last updated this document */
  updatedBy?: Maybe<User>
}

/** Frequently asked questions */
export type FaqCreatedByArgs = {
  locales?: InputMaybe<Array<Locale>>
}

/** Frequently asked questions */
export type FaqDocumentInStagesArgs = {
  includeCurrent?: Scalars['Boolean']
  inheritLocale?: Scalars['Boolean']
  stages?: Array<Stage>
}

/** Frequently asked questions */
export type FaqHistoryArgs = {
  limit?: Scalars['Int']
  skip?: Scalars['Int']
  stageOverride?: InputMaybe<Stage>
}

/** Frequently asked questions */
export type FaqLanguageArgs = {
  locales?: InputMaybe<Array<Locale>>
}

/** Frequently asked questions */
export type FaqPublishedByArgs = {
  locales?: InputMaybe<Array<Locale>>
}

/** Frequently asked questions */
export type FaqScheduledInArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  locales?: InputMaybe<Array<Locale>>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<ScheduledOperationWhereInput>
}

/** Frequently asked questions */
export type FaqUpdatedByArgs = {
  locales?: InputMaybe<Array<Locale>>
}

export type FaqConnectInput = {
  /** Allow to specify document position in list of connected documents, will default to appending at end of list */
  position?: InputMaybe<ConnectPositionInput>
  /** Document to connect */
  where: FaqWhereUniqueInput
}

/** A connection to a list of items. */
export type FaqConnection = {
  __typename?: 'FaqConnection'
  aggregate: Aggregate
  /** A list of edges. */
  edges: Array<FaqEdge>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
}

export type FaqCreateInput = {
  body?: InputMaybe<Scalars['String']>
  createdAt?: InputMaybe<Scalars['DateTime']>
  headline?: InputMaybe<Scalars['String']>
  language?: InputMaybe<LanguageCreateOneInlineInput>
  updatedAt?: InputMaybe<Scalars['DateTime']>
}

export type FaqCreateManyInlineInput = {
  /** Connect multiple existing Faq documents */
  connect?: InputMaybe<Array<FaqWhereUniqueInput>>
  /** Create and connect multiple existing Faq documents */
  create?: InputMaybe<Array<FaqCreateInput>>
}

export type FaqCreateOneInlineInput = {
  /** Connect one existing Faq document */
  connect?: InputMaybe<FaqWhereUniqueInput>
  /** Create and connect one Faq document */
  create?: InputMaybe<FaqCreateInput>
}

/** An edge in a connection. */
export type FaqEdge = {
  __typename?: 'FaqEdge'
  /** A cursor for use in pagination. */
  cursor: Scalars['String']
  /** The item at the end of the edge. */
  node: Faq
}

/** Identifies documents */
export type FaqManyWhereInput = {
  /** Logical AND on all given filters. */
  AND?: InputMaybe<Array<FaqWhereInput>>
  /** Logical NOT on all given filters combined by AND. */
  NOT?: InputMaybe<Array<FaqWhereInput>>
  /** Logical OR on all given filters. */
  OR?: InputMaybe<Array<FaqWhereInput>>
  /** Contains search across all appropriate fields. */
  _search?: InputMaybe<Scalars['String']>
  body?: InputMaybe<Scalars['String']>
  /** All values containing the given string. */
  body_contains?: InputMaybe<Scalars['String']>
  /** All values ending with the given string. */
  body_ends_with?: InputMaybe<Scalars['String']>
  /** All values that are contained in given list. */
  body_in?: InputMaybe<Array<Scalars['String']>>
  /** All values that are not equal to given value. */
  body_not?: InputMaybe<Scalars['String']>
  /** All values not containing the given string. */
  body_not_contains?: InputMaybe<Scalars['String']>
  /** All values not ending with the given string */
  body_not_ends_with?: InputMaybe<Scalars['String']>
  /** All values that are not contained in given list. */
  body_not_in?: InputMaybe<Array<Scalars['String']>>
  /** All values not starting with the given string. */
  body_not_starts_with?: InputMaybe<Scalars['String']>
  /** All values starting with the given string. */
  body_starts_with?: InputMaybe<Scalars['String']>
  createdAt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than the given value. */
  createdAt_gt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than or equal the given value. */
  createdAt_gte?: InputMaybe<Scalars['DateTime']>
  /** All values that are contained in given list. */
  createdAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  /** All values less than the given value. */
  createdAt_lt?: InputMaybe<Scalars['DateTime']>
  /** All values less than or equal the given value. */
  createdAt_lte?: InputMaybe<Scalars['DateTime']>
  /** All values that are not equal to given value. */
  createdAt_not?: InputMaybe<Scalars['DateTime']>
  /** All values that are not contained in given list. */
  createdAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  createdBy?: InputMaybe<UserWhereInput>
  headline?: InputMaybe<Scalars['String']>
  /** All values containing the given string. */
  headline_contains?: InputMaybe<Scalars['String']>
  /** All values ending with the given string. */
  headline_ends_with?: InputMaybe<Scalars['String']>
  /** All values that are contained in given list. */
  headline_in?: InputMaybe<Array<Scalars['String']>>
  /** All values that are not equal to given value. */
  headline_not?: InputMaybe<Scalars['String']>
  /** All values not containing the given string. */
  headline_not_contains?: InputMaybe<Scalars['String']>
  /** All values not ending with the given string */
  headline_not_ends_with?: InputMaybe<Scalars['String']>
  /** All values that are not contained in given list. */
  headline_not_in?: InputMaybe<Array<Scalars['String']>>
  /** All values not starting with the given string. */
  headline_not_starts_with?: InputMaybe<Scalars['String']>
  /** All values starting with the given string. */
  headline_starts_with?: InputMaybe<Scalars['String']>
  id?: InputMaybe<Scalars['ID']>
  /** All values containing the given string. */
  id_contains?: InputMaybe<Scalars['ID']>
  /** All values ending with the given string. */
  id_ends_with?: InputMaybe<Scalars['ID']>
  /** All values that are contained in given list. */
  id_in?: InputMaybe<Array<Scalars['ID']>>
  /** All values that are not equal to given value. */
  id_not?: InputMaybe<Scalars['ID']>
  /** All values not containing the given string. */
  id_not_contains?: InputMaybe<Scalars['ID']>
  /** All values not ending with the given string */
  id_not_ends_with?: InputMaybe<Scalars['ID']>
  /** All values that are not contained in given list. */
  id_not_in?: InputMaybe<Array<Scalars['ID']>>
  /** All values not starting with the given string. */
  id_not_starts_with?: InputMaybe<Scalars['ID']>
  /** All values starting with the given string. */
  id_starts_with?: InputMaybe<Scalars['ID']>
  language?: InputMaybe<LanguageWhereInput>
  publishedAt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than the given value. */
  publishedAt_gt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than or equal the given value. */
  publishedAt_gte?: InputMaybe<Scalars['DateTime']>
  /** All values that are contained in given list. */
  publishedAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  /** All values less than the given value. */
  publishedAt_lt?: InputMaybe<Scalars['DateTime']>
  /** All values less than or equal the given value. */
  publishedAt_lte?: InputMaybe<Scalars['DateTime']>
  /** All values that are not equal to given value. */
  publishedAt_not?: InputMaybe<Scalars['DateTime']>
  /** All values that are not contained in given list. */
  publishedAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  publishedBy?: InputMaybe<UserWhereInput>
  scheduledIn_every?: InputMaybe<ScheduledOperationWhereInput>
  scheduledIn_none?: InputMaybe<ScheduledOperationWhereInput>
  scheduledIn_some?: InputMaybe<ScheduledOperationWhereInput>
  updatedAt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than the given value. */
  updatedAt_gt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than or equal the given value. */
  updatedAt_gte?: InputMaybe<Scalars['DateTime']>
  /** All values that are contained in given list. */
  updatedAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  /** All values less than the given value. */
  updatedAt_lt?: InputMaybe<Scalars['DateTime']>
  /** All values less than or equal the given value. */
  updatedAt_lte?: InputMaybe<Scalars['DateTime']>
  /** All values that are not equal to given value. */
  updatedAt_not?: InputMaybe<Scalars['DateTime']>
  /** All values that are not contained in given list. */
  updatedAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  updatedBy?: InputMaybe<UserWhereInput>
}

export enum FaqOrderByInput {
  BodyAsc = 'body_ASC',
  BodyDesc = 'body_DESC',
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC',
  HeadlineAsc = 'headline_ASC',
  HeadlineDesc = 'headline_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  PublishedAtAsc = 'publishedAt_ASC',
  PublishedAtDesc = 'publishedAt_DESC',
  UpdatedAtAsc = 'updatedAt_ASC',
  UpdatedAtDesc = 'updatedAt_DESC',
}

export type FaqUpdateInput = {
  body?: InputMaybe<Scalars['String']>
  headline?: InputMaybe<Scalars['String']>
  language?: InputMaybe<LanguageUpdateOneInlineInput>
}

export type FaqUpdateManyInlineInput = {
  /** Connect multiple existing Faq documents */
  connect?: InputMaybe<Array<FaqConnectInput>>
  /** Create and connect multiple Faq documents */
  create?: InputMaybe<Array<FaqCreateInput>>
  /** Delete multiple Faq documents */
  delete?: InputMaybe<Array<FaqWhereUniqueInput>>
  /** Disconnect multiple Faq documents */
  disconnect?: InputMaybe<Array<FaqWhereUniqueInput>>
  /** Override currently-connected documents with multiple existing Faq documents */
  set?: InputMaybe<Array<FaqWhereUniqueInput>>
  /** Update multiple Faq documents */
  update?: InputMaybe<Array<FaqUpdateWithNestedWhereUniqueInput>>
  /** Upsert multiple Faq documents */
  upsert?: InputMaybe<Array<FaqUpsertWithNestedWhereUniqueInput>>
}

export type FaqUpdateManyInput = {
  body?: InputMaybe<Scalars['String']>
  headline?: InputMaybe<Scalars['String']>
}

export type FaqUpdateManyWithNestedWhereInput = {
  /** Update many input */
  data: FaqUpdateManyInput
  /** Document search */
  where: FaqWhereInput
}

export type FaqUpdateOneInlineInput = {
  /** Connect existing Faq document */
  connect?: InputMaybe<FaqWhereUniqueInput>
  /** Create and connect one Faq document */
  create?: InputMaybe<FaqCreateInput>
  /** Delete currently connected Faq document */
  delete?: InputMaybe<Scalars['Boolean']>
  /** Disconnect currently connected Faq document */
  disconnect?: InputMaybe<Scalars['Boolean']>
  /** Update single Faq document */
  update?: InputMaybe<FaqUpdateWithNestedWhereUniqueInput>
  /** Upsert single Faq document */
  upsert?: InputMaybe<FaqUpsertWithNestedWhereUniqueInput>
}

export type FaqUpdateWithNestedWhereUniqueInput = {
  /** Document to update */
  data: FaqUpdateInput
  /** Unique document search */
  where: FaqWhereUniqueInput
}

export type FaqUpsertInput = {
  /** Create document if it didn't exist */
  create: FaqCreateInput
  /** Update document if it exists */
  update: FaqUpdateInput
}

export type FaqUpsertWithNestedWhereUniqueInput = {
  /** Upsert data */
  data: FaqUpsertInput
  /** Unique document search */
  where: FaqWhereUniqueInput
}

/** Identifies documents */
export type FaqWhereInput = {
  /** Logical AND on all given filters. */
  AND?: InputMaybe<Array<FaqWhereInput>>
  /** Logical NOT on all given filters combined by AND. */
  NOT?: InputMaybe<Array<FaqWhereInput>>
  /** Logical OR on all given filters. */
  OR?: InputMaybe<Array<FaqWhereInput>>
  /** Contains search across all appropriate fields. */
  _search?: InputMaybe<Scalars['String']>
  body?: InputMaybe<Scalars['String']>
  /** All values containing the given string. */
  body_contains?: InputMaybe<Scalars['String']>
  /** All values ending with the given string. */
  body_ends_with?: InputMaybe<Scalars['String']>
  /** All values that are contained in given list. */
  body_in?: InputMaybe<Array<Scalars['String']>>
  /** All values that are not equal to given value. */
  body_not?: InputMaybe<Scalars['String']>
  /** All values not containing the given string. */
  body_not_contains?: InputMaybe<Scalars['String']>
  /** All values not ending with the given string */
  body_not_ends_with?: InputMaybe<Scalars['String']>
  /** All values that are not contained in given list. */
  body_not_in?: InputMaybe<Array<Scalars['String']>>
  /** All values not starting with the given string. */
  body_not_starts_with?: InputMaybe<Scalars['String']>
  /** All values starting with the given string. */
  body_starts_with?: InputMaybe<Scalars['String']>
  createdAt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than the given value. */
  createdAt_gt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than or equal the given value. */
  createdAt_gte?: InputMaybe<Scalars['DateTime']>
  /** All values that are contained in given list. */
  createdAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  /** All values less than the given value. */
  createdAt_lt?: InputMaybe<Scalars['DateTime']>
  /** All values less than or equal the given value. */
  createdAt_lte?: InputMaybe<Scalars['DateTime']>
  /** All values that are not equal to given value. */
  createdAt_not?: InputMaybe<Scalars['DateTime']>
  /** All values that are not contained in given list. */
  createdAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  createdBy?: InputMaybe<UserWhereInput>
  headline?: InputMaybe<Scalars['String']>
  /** All values containing the given string. */
  headline_contains?: InputMaybe<Scalars['String']>
  /** All values ending with the given string. */
  headline_ends_with?: InputMaybe<Scalars['String']>
  /** All values that are contained in given list. */
  headline_in?: InputMaybe<Array<Scalars['String']>>
  /** All values that are not equal to given value. */
  headline_not?: InputMaybe<Scalars['String']>
  /** All values not containing the given string. */
  headline_not_contains?: InputMaybe<Scalars['String']>
  /** All values not ending with the given string */
  headline_not_ends_with?: InputMaybe<Scalars['String']>
  /** All values that are not contained in given list. */
  headline_not_in?: InputMaybe<Array<Scalars['String']>>
  /** All values not starting with the given string. */
  headline_not_starts_with?: InputMaybe<Scalars['String']>
  /** All values starting with the given string. */
  headline_starts_with?: InputMaybe<Scalars['String']>
  id?: InputMaybe<Scalars['ID']>
  /** All values containing the given string. */
  id_contains?: InputMaybe<Scalars['ID']>
  /** All values ending with the given string. */
  id_ends_with?: InputMaybe<Scalars['ID']>
  /** All values that are contained in given list. */
  id_in?: InputMaybe<Array<Scalars['ID']>>
  /** All values that are not equal to given value. */
  id_not?: InputMaybe<Scalars['ID']>
  /** All values not containing the given string. */
  id_not_contains?: InputMaybe<Scalars['ID']>
  /** All values not ending with the given string */
  id_not_ends_with?: InputMaybe<Scalars['ID']>
  /** All values that are not contained in given list. */
  id_not_in?: InputMaybe<Array<Scalars['ID']>>
  /** All values not starting with the given string. */
  id_not_starts_with?: InputMaybe<Scalars['ID']>
  /** All values starting with the given string. */
  id_starts_with?: InputMaybe<Scalars['ID']>
  language?: InputMaybe<LanguageWhereInput>
  publishedAt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than the given value. */
  publishedAt_gt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than or equal the given value. */
  publishedAt_gte?: InputMaybe<Scalars['DateTime']>
  /** All values that are contained in given list. */
  publishedAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  /** All values less than the given value. */
  publishedAt_lt?: InputMaybe<Scalars['DateTime']>
  /** All values less than or equal the given value. */
  publishedAt_lte?: InputMaybe<Scalars['DateTime']>
  /** All values that are not equal to given value. */
  publishedAt_not?: InputMaybe<Scalars['DateTime']>
  /** All values that are not contained in given list. */
  publishedAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  publishedBy?: InputMaybe<UserWhereInput>
  scheduledIn_every?: InputMaybe<ScheduledOperationWhereInput>
  scheduledIn_none?: InputMaybe<ScheduledOperationWhereInput>
  scheduledIn_some?: InputMaybe<ScheduledOperationWhereInput>
  updatedAt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than the given value. */
  updatedAt_gt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than or equal the given value. */
  updatedAt_gte?: InputMaybe<Scalars['DateTime']>
  /** All values that are contained in given list. */
  updatedAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  /** All values less than the given value. */
  updatedAt_lt?: InputMaybe<Scalars['DateTime']>
  /** All values less than or equal the given value. */
  updatedAt_lte?: InputMaybe<Scalars['DateTime']>
  /** All values that are not equal to given value. */
  updatedAt_not?: InputMaybe<Scalars['DateTime']>
  /** All values that are not contained in given list. */
  updatedAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  updatedBy?: InputMaybe<UserWhereInput>
}

/** References Faq record uniquely */
export type FaqWhereUniqueInput = {
  id?: InputMaybe<Scalars['ID']>
}

export enum Feature {
  KeyGear = 'KeyGear',
  Referrals = 'Referrals',
}

export type File = {
  __typename?: 'File'
  /** S3 bucket that the file was uploaded to. */
  bucket: Scalars['String']
  /** S3 key that can be used to retreive new signed urls in the future. */
  key: Scalars['String']
  /** signedUrl is valid for 30 minutes after upload, don't hang on to this. */
  signedUrl: Scalars['String']
}

export type FreeMonths = {
  __typename?: 'FreeMonths'
  quantity?: Maybe<Scalars['Int']>
}

export type Geo = {
  __typename?: 'Geo'
  countryISOCode: Scalars['String']
}

export type Gif = {
  __typename?: 'Gif'
  url?: Maybe<Scalars['String']>
}

export enum HedvigColor {
  Black = 'Black',
  BlackPurple = 'BlackPurple',
  DarkGray = 'DarkGray',
  DarkPurple = 'DarkPurple',
  LightGray = 'LightGray',
  OffBlack = 'OffBlack',
  OffWhite = 'OffWhite',
  Pink = 'Pink',
  Purple = 'Purple',
  Turquoise = 'Turquoise',
  White = 'White',
  Yellow = 'Yellow',
}

export type HouseInformation = {
  __typename?: 'HouseInformation'
  ancillaryArea: Scalars['Int']
  livingSpace: Scalars['Int']
  yearOfConstruction: Scalars['Int']
}

export type HouseInformationInput = {
  postalNumber: Scalars['String']
  streetAddress: Scalars['String']
}

export type HouseInsuranceCollection = {
  __typename?: 'HouseInsuranceCollection'
  insuranceHolderAddress?: Maybe<Scalars['String']>
  insuranceHolderName?: Maybe<Scalars['String']>
  insuranceName?: Maybe<Scalars['String']>
  insuranceObjectAddress?: Maybe<Scalars['String']>
  insuranceProvider?: Maybe<Scalars['String']>
  insuranceSubType?: Maybe<Scalars['String']>
  insuranceType?: Maybe<Scalars['String']>
  livingArea?: Maybe<Scalars['Int']>
  monthlyDiscount?: Maybe<MonetaryAmountV2>
  monthlyGrossPremium?: Maybe<MonetaryAmountV2>
  monthlyNetPremium?: Maybe<MonetaryAmountV2>
  postalCode?: Maybe<Scalars['String']>
  renewalDate?: Maybe<Scalars['LocalDate']>
}

export type Icon = {
  __typename?: 'Icon'
  /** @deprecated use an icon from a variant instead */
  pdfUrl: Scalars['String']
  /** @deprecated use an icon from a variant instead */
  svgUrl: Scalars['String']
  variants: IconVariants
  /** @deprecated No longer supported */
  vectorDrawableUrl: Scalars['String']
}

export type IconVariant = {
  __typename?: 'IconVariant'
  pdfUrl: Scalars['String']
  svgUrl: Scalars['String']
  /** @deprecated No longer supported */
  vectorDrawableUrl: Scalars['String']
}

export type IconVariants = {
  __typename?: 'IconVariants'
  dark: IconVariant
  light: IconVariant
}

export enum ImageFit {
  /** Resizes the image to fit within the specified parameters without distorting, cropping, or changing the aspect ratio. */
  Clip = 'clip',
  /**
   * Resizes the image to fit the specified parameters exactly by removing any
   * parts of the image that don't fit within the boundaries.
   */
  Crop = 'crop',
  /**
   * Resizes the image to fit within the parameters, but as opposed to 'fit:clip'
   * will not scale the image if the image is smaller than the output size.
   */
  Max = 'max',
  /**
   * Resizes the image to fit the specified parameters exactly by scaling the image
   * to the desired size. The aspect ratio of the image is not respected and the
   * image can be distorted using this method.
   */
  Scale = 'scale',
}

export type ImageResizeInput = {
  /** The default value for the fit parameter is fit:clip. */
  fit?: InputMaybe<ImageFit>
  /** The height in pixels to resize the image to. The value must be an integer from 1 to 10000. */
  height?: InputMaybe<Scalars['Int']>
  /** The width in pixels to resize the image to. The value must be an integer from 1 to 10000. */
  width?: InputMaybe<Scalars['Int']>
}

/** Transformations for Images */
export type ImageTransformationInput = {
  /** Resizes the image */
  resize?: InputMaybe<ImageResizeInput>
}

export type ImportantMessage = Node & {
  __typename?: 'ImportantMessage'
  button?: Maybe<Scalars['String']>
  /** The time the document was created */
  createdAt: Scalars['DateTime']
  /** User that created this document */
  createdBy?: Maybe<User>
  /** Get the document in other stages */
  documentInStages: Array<ImportantMessage>
  /** List of ImportantMessage versions */
  history: Array<Version>
  /** The unique identifier */
  id: Scalars['ID']
  language?: Maybe<Language>
  link?: Maybe<Scalars['String']>
  message?: Maybe<Scalars['String']>
  /** The time the document was published. Null on documents in draft stage. */
  publishedAt?: Maybe<Scalars['DateTime']>
  /** User that last published this document */
  publishedBy?: Maybe<User>
  scheduledIn: Array<ScheduledOperation>
  /** System stage field */
  stage: Stage
  title?: Maybe<Scalars['String']>
  /** The time the document was updated */
  updatedAt: Scalars['DateTime']
  /** User that last updated this document */
  updatedBy?: Maybe<User>
}

export type ImportantMessageCreatedByArgs = {
  locales?: InputMaybe<Array<Locale>>
}

export type ImportantMessageDocumentInStagesArgs = {
  includeCurrent?: Scalars['Boolean']
  inheritLocale?: Scalars['Boolean']
  stages?: Array<Stage>
}

export type ImportantMessageHistoryArgs = {
  limit?: Scalars['Int']
  skip?: Scalars['Int']
  stageOverride?: InputMaybe<Stage>
}

export type ImportantMessageLanguageArgs = {
  locales?: InputMaybe<Array<Locale>>
}

export type ImportantMessagePublishedByArgs = {
  locales?: InputMaybe<Array<Locale>>
}

export type ImportantMessageScheduledInArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  locales?: InputMaybe<Array<Locale>>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<ScheduledOperationWhereInput>
}

export type ImportantMessageUpdatedByArgs = {
  locales?: InputMaybe<Array<Locale>>
}

export type ImportantMessageConnectInput = {
  /** Allow to specify document position in list of connected documents, will default to appending at end of list */
  position?: InputMaybe<ConnectPositionInput>
  /** Document to connect */
  where: ImportantMessageWhereUniqueInput
}

/** A connection to a list of items. */
export type ImportantMessageConnection = {
  __typename?: 'ImportantMessageConnection'
  aggregate: Aggregate
  /** A list of edges. */
  edges: Array<ImportantMessageEdge>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
}

export type ImportantMessageCreateInput = {
  button?: InputMaybe<Scalars['String']>
  createdAt?: InputMaybe<Scalars['DateTime']>
  language?: InputMaybe<LanguageCreateOneInlineInput>
  link?: InputMaybe<Scalars['String']>
  message?: InputMaybe<Scalars['String']>
  title?: InputMaybe<Scalars['String']>
  updatedAt?: InputMaybe<Scalars['DateTime']>
}

export type ImportantMessageCreateManyInlineInput = {
  /** Connect multiple existing ImportantMessage documents */
  connect?: InputMaybe<Array<ImportantMessageWhereUniqueInput>>
  /** Create and connect multiple existing ImportantMessage documents */
  create?: InputMaybe<Array<ImportantMessageCreateInput>>
}

export type ImportantMessageCreateOneInlineInput = {
  /** Connect one existing ImportantMessage document */
  connect?: InputMaybe<ImportantMessageWhereUniqueInput>
  /** Create and connect one ImportantMessage document */
  create?: InputMaybe<ImportantMessageCreateInput>
}

/** An edge in a connection. */
export type ImportantMessageEdge = {
  __typename?: 'ImportantMessageEdge'
  /** A cursor for use in pagination. */
  cursor: Scalars['String']
  /** The item at the end of the edge. */
  node: ImportantMessage
}

/** Identifies documents */
export type ImportantMessageManyWhereInput = {
  /** Logical AND on all given filters. */
  AND?: InputMaybe<Array<ImportantMessageWhereInput>>
  /** Logical NOT on all given filters combined by AND. */
  NOT?: InputMaybe<Array<ImportantMessageWhereInput>>
  /** Logical OR on all given filters. */
  OR?: InputMaybe<Array<ImportantMessageWhereInput>>
  /** Contains search across all appropriate fields. */
  _search?: InputMaybe<Scalars['String']>
  button?: InputMaybe<Scalars['String']>
  /** All values containing the given string. */
  button_contains?: InputMaybe<Scalars['String']>
  /** All values ending with the given string. */
  button_ends_with?: InputMaybe<Scalars['String']>
  /** All values that are contained in given list. */
  button_in?: InputMaybe<Array<Scalars['String']>>
  /** All values that are not equal to given value. */
  button_not?: InputMaybe<Scalars['String']>
  /** All values not containing the given string. */
  button_not_contains?: InputMaybe<Scalars['String']>
  /** All values not ending with the given string */
  button_not_ends_with?: InputMaybe<Scalars['String']>
  /** All values that are not contained in given list. */
  button_not_in?: InputMaybe<Array<Scalars['String']>>
  /** All values not starting with the given string. */
  button_not_starts_with?: InputMaybe<Scalars['String']>
  /** All values starting with the given string. */
  button_starts_with?: InputMaybe<Scalars['String']>
  createdAt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than the given value. */
  createdAt_gt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than or equal the given value. */
  createdAt_gte?: InputMaybe<Scalars['DateTime']>
  /** All values that are contained in given list. */
  createdAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  /** All values less than the given value. */
  createdAt_lt?: InputMaybe<Scalars['DateTime']>
  /** All values less than or equal the given value. */
  createdAt_lte?: InputMaybe<Scalars['DateTime']>
  /** All values that are not equal to given value. */
  createdAt_not?: InputMaybe<Scalars['DateTime']>
  /** All values that are not contained in given list. */
  createdAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  createdBy?: InputMaybe<UserWhereInput>
  id?: InputMaybe<Scalars['ID']>
  /** All values containing the given string. */
  id_contains?: InputMaybe<Scalars['ID']>
  /** All values ending with the given string. */
  id_ends_with?: InputMaybe<Scalars['ID']>
  /** All values that are contained in given list. */
  id_in?: InputMaybe<Array<Scalars['ID']>>
  /** All values that are not equal to given value. */
  id_not?: InputMaybe<Scalars['ID']>
  /** All values not containing the given string. */
  id_not_contains?: InputMaybe<Scalars['ID']>
  /** All values not ending with the given string */
  id_not_ends_with?: InputMaybe<Scalars['ID']>
  /** All values that are not contained in given list. */
  id_not_in?: InputMaybe<Array<Scalars['ID']>>
  /** All values not starting with the given string. */
  id_not_starts_with?: InputMaybe<Scalars['ID']>
  /** All values starting with the given string. */
  id_starts_with?: InputMaybe<Scalars['ID']>
  language?: InputMaybe<LanguageWhereInput>
  link?: InputMaybe<Scalars['String']>
  /** All values containing the given string. */
  link_contains?: InputMaybe<Scalars['String']>
  /** All values ending with the given string. */
  link_ends_with?: InputMaybe<Scalars['String']>
  /** All values that are contained in given list. */
  link_in?: InputMaybe<Array<Scalars['String']>>
  /** All values that are not equal to given value. */
  link_not?: InputMaybe<Scalars['String']>
  /** All values not containing the given string. */
  link_not_contains?: InputMaybe<Scalars['String']>
  /** All values not ending with the given string */
  link_not_ends_with?: InputMaybe<Scalars['String']>
  /** All values that are not contained in given list. */
  link_not_in?: InputMaybe<Array<Scalars['String']>>
  /** All values not starting with the given string. */
  link_not_starts_with?: InputMaybe<Scalars['String']>
  /** All values starting with the given string. */
  link_starts_with?: InputMaybe<Scalars['String']>
  message?: InputMaybe<Scalars['String']>
  /** All values containing the given string. */
  message_contains?: InputMaybe<Scalars['String']>
  /** All values ending with the given string. */
  message_ends_with?: InputMaybe<Scalars['String']>
  /** All values that are contained in given list. */
  message_in?: InputMaybe<Array<Scalars['String']>>
  /** All values that are not equal to given value. */
  message_not?: InputMaybe<Scalars['String']>
  /** All values not containing the given string. */
  message_not_contains?: InputMaybe<Scalars['String']>
  /** All values not ending with the given string */
  message_not_ends_with?: InputMaybe<Scalars['String']>
  /** All values that are not contained in given list. */
  message_not_in?: InputMaybe<Array<Scalars['String']>>
  /** All values not starting with the given string. */
  message_not_starts_with?: InputMaybe<Scalars['String']>
  /** All values starting with the given string. */
  message_starts_with?: InputMaybe<Scalars['String']>
  publishedAt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than the given value. */
  publishedAt_gt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than or equal the given value. */
  publishedAt_gte?: InputMaybe<Scalars['DateTime']>
  /** All values that are contained in given list. */
  publishedAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  /** All values less than the given value. */
  publishedAt_lt?: InputMaybe<Scalars['DateTime']>
  /** All values less than or equal the given value. */
  publishedAt_lte?: InputMaybe<Scalars['DateTime']>
  /** All values that are not equal to given value. */
  publishedAt_not?: InputMaybe<Scalars['DateTime']>
  /** All values that are not contained in given list. */
  publishedAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  publishedBy?: InputMaybe<UserWhereInput>
  scheduledIn_every?: InputMaybe<ScheduledOperationWhereInput>
  scheduledIn_none?: InputMaybe<ScheduledOperationWhereInput>
  scheduledIn_some?: InputMaybe<ScheduledOperationWhereInput>
  title?: InputMaybe<Scalars['String']>
  /** All values containing the given string. */
  title_contains?: InputMaybe<Scalars['String']>
  /** All values ending with the given string. */
  title_ends_with?: InputMaybe<Scalars['String']>
  /** All values that are contained in given list. */
  title_in?: InputMaybe<Array<Scalars['String']>>
  /** All values that are not equal to given value. */
  title_not?: InputMaybe<Scalars['String']>
  /** All values not containing the given string. */
  title_not_contains?: InputMaybe<Scalars['String']>
  /** All values not ending with the given string */
  title_not_ends_with?: InputMaybe<Scalars['String']>
  /** All values that are not contained in given list. */
  title_not_in?: InputMaybe<Array<Scalars['String']>>
  /** All values not starting with the given string. */
  title_not_starts_with?: InputMaybe<Scalars['String']>
  /** All values starting with the given string. */
  title_starts_with?: InputMaybe<Scalars['String']>
  updatedAt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than the given value. */
  updatedAt_gt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than or equal the given value. */
  updatedAt_gte?: InputMaybe<Scalars['DateTime']>
  /** All values that are contained in given list. */
  updatedAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  /** All values less than the given value. */
  updatedAt_lt?: InputMaybe<Scalars['DateTime']>
  /** All values less than or equal the given value. */
  updatedAt_lte?: InputMaybe<Scalars['DateTime']>
  /** All values that are not equal to given value. */
  updatedAt_not?: InputMaybe<Scalars['DateTime']>
  /** All values that are not contained in given list. */
  updatedAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  updatedBy?: InputMaybe<UserWhereInput>
}

export enum ImportantMessageOrderByInput {
  ButtonAsc = 'button_ASC',
  ButtonDesc = 'button_DESC',
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  LinkAsc = 'link_ASC',
  LinkDesc = 'link_DESC',
  MessageAsc = 'message_ASC',
  MessageDesc = 'message_DESC',
  PublishedAtAsc = 'publishedAt_ASC',
  PublishedAtDesc = 'publishedAt_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
  UpdatedAtAsc = 'updatedAt_ASC',
  UpdatedAtDesc = 'updatedAt_DESC',
}

export type ImportantMessageUpdateInput = {
  button?: InputMaybe<Scalars['String']>
  language?: InputMaybe<LanguageUpdateOneInlineInput>
  link?: InputMaybe<Scalars['String']>
  message?: InputMaybe<Scalars['String']>
  title?: InputMaybe<Scalars['String']>
}

export type ImportantMessageUpdateManyInlineInput = {
  /** Connect multiple existing ImportantMessage documents */
  connect?: InputMaybe<Array<ImportantMessageConnectInput>>
  /** Create and connect multiple ImportantMessage documents */
  create?: InputMaybe<Array<ImportantMessageCreateInput>>
  /** Delete multiple ImportantMessage documents */
  delete?: InputMaybe<Array<ImportantMessageWhereUniqueInput>>
  /** Disconnect multiple ImportantMessage documents */
  disconnect?: InputMaybe<Array<ImportantMessageWhereUniqueInput>>
  /** Override currently-connected documents with multiple existing ImportantMessage documents */
  set?: InputMaybe<Array<ImportantMessageWhereUniqueInput>>
  /** Update multiple ImportantMessage documents */
  update?: InputMaybe<Array<ImportantMessageUpdateWithNestedWhereUniqueInput>>
  /** Upsert multiple ImportantMessage documents */
  upsert?: InputMaybe<Array<ImportantMessageUpsertWithNestedWhereUniqueInput>>
}

export type ImportantMessageUpdateManyInput = {
  button?: InputMaybe<Scalars['String']>
  link?: InputMaybe<Scalars['String']>
  message?: InputMaybe<Scalars['String']>
  title?: InputMaybe<Scalars['String']>
}

export type ImportantMessageUpdateManyWithNestedWhereInput = {
  /** Update many input */
  data: ImportantMessageUpdateManyInput
  /** Document search */
  where: ImportantMessageWhereInput
}

export type ImportantMessageUpdateOneInlineInput = {
  /** Connect existing ImportantMessage document */
  connect?: InputMaybe<ImportantMessageWhereUniqueInput>
  /** Create and connect one ImportantMessage document */
  create?: InputMaybe<ImportantMessageCreateInput>
  /** Delete currently connected ImportantMessage document */
  delete?: InputMaybe<Scalars['Boolean']>
  /** Disconnect currently connected ImportantMessage document */
  disconnect?: InputMaybe<Scalars['Boolean']>
  /** Update single ImportantMessage document */
  update?: InputMaybe<ImportantMessageUpdateWithNestedWhereUniqueInput>
  /** Upsert single ImportantMessage document */
  upsert?: InputMaybe<ImportantMessageUpsertWithNestedWhereUniqueInput>
}

export type ImportantMessageUpdateWithNestedWhereUniqueInput = {
  /** Document to update */
  data: ImportantMessageUpdateInput
  /** Unique document search */
  where: ImportantMessageWhereUniqueInput
}

export type ImportantMessageUpsertInput = {
  /** Create document if it didn't exist */
  create: ImportantMessageCreateInput
  /** Update document if it exists */
  update: ImportantMessageUpdateInput
}

export type ImportantMessageUpsertWithNestedWhereUniqueInput = {
  /** Upsert data */
  data: ImportantMessageUpsertInput
  /** Unique document search */
  where: ImportantMessageWhereUniqueInput
}

/** Identifies documents */
export type ImportantMessageWhereInput = {
  /** Logical AND on all given filters. */
  AND?: InputMaybe<Array<ImportantMessageWhereInput>>
  /** Logical NOT on all given filters combined by AND. */
  NOT?: InputMaybe<Array<ImportantMessageWhereInput>>
  /** Logical OR on all given filters. */
  OR?: InputMaybe<Array<ImportantMessageWhereInput>>
  /** Contains search across all appropriate fields. */
  _search?: InputMaybe<Scalars['String']>
  button?: InputMaybe<Scalars['String']>
  /** All values containing the given string. */
  button_contains?: InputMaybe<Scalars['String']>
  /** All values ending with the given string. */
  button_ends_with?: InputMaybe<Scalars['String']>
  /** All values that are contained in given list. */
  button_in?: InputMaybe<Array<Scalars['String']>>
  /** All values that are not equal to given value. */
  button_not?: InputMaybe<Scalars['String']>
  /** All values not containing the given string. */
  button_not_contains?: InputMaybe<Scalars['String']>
  /** All values not ending with the given string */
  button_not_ends_with?: InputMaybe<Scalars['String']>
  /** All values that are not contained in given list. */
  button_not_in?: InputMaybe<Array<Scalars['String']>>
  /** All values not starting with the given string. */
  button_not_starts_with?: InputMaybe<Scalars['String']>
  /** All values starting with the given string. */
  button_starts_with?: InputMaybe<Scalars['String']>
  createdAt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than the given value. */
  createdAt_gt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than or equal the given value. */
  createdAt_gte?: InputMaybe<Scalars['DateTime']>
  /** All values that are contained in given list. */
  createdAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  /** All values less than the given value. */
  createdAt_lt?: InputMaybe<Scalars['DateTime']>
  /** All values less than or equal the given value. */
  createdAt_lte?: InputMaybe<Scalars['DateTime']>
  /** All values that are not equal to given value. */
  createdAt_not?: InputMaybe<Scalars['DateTime']>
  /** All values that are not contained in given list. */
  createdAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  createdBy?: InputMaybe<UserWhereInput>
  id?: InputMaybe<Scalars['ID']>
  /** All values containing the given string. */
  id_contains?: InputMaybe<Scalars['ID']>
  /** All values ending with the given string. */
  id_ends_with?: InputMaybe<Scalars['ID']>
  /** All values that are contained in given list. */
  id_in?: InputMaybe<Array<Scalars['ID']>>
  /** All values that are not equal to given value. */
  id_not?: InputMaybe<Scalars['ID']>
  /** All values not containing the given string. */
  id_not_contains?: InputMaybe<Scalars['ID']>
  /** All values not ending with the given string */
  id_not_ends_with?: InputMaybe<Scalars['ID']>
  /** All values that are not contained in given list. */
  id_not_in?: InputMaybe<Array<Scalars['ID']>>
  /** All values not starting with the given string. */
  id_not_starts_with?: InputMaybe<Scalars['ID']>
  /** All values starting with the given string. */
  id_starts_with?: InputMaybe<Scalars['ID']>
  language?: InputMaybe<LanguageWhereInput>
  link?: InputMaybe<Scalars['String']>
  /** All values containing the given string. */
  link_contains?: InputMaybe<Scalars['String']>
  /** All values ending with the given string. */
  link_ends_with?: InputMaybe<Scalars['String']>
  /** All values that are contained in given list. */
  link_in?: InputMaybe<Array<Scalars['String']>>
  /** All values that are not equal to given value. */
  link_not?: InputMaybe<Scalars['String']>
  /** All values not containing the given string. */
  link_not_contains?: InputMaybe<Scalars['String']>
  /** All values not ending with the given string */
  link_not_ends_with?: InputMaybe<Scalars['String']>
  /** All values that are not contained in given list. */
  link_not_in?: InputMaybe<Array<Scalars['String']>>
  /** All values not starting with the given string. */
  link_not_starts_with?: InputMaybe<Scalars['String']>
  /** All values starting with the given string. */
  link_starts_with?: InputMaybe<Scalars['String']>
  message?: InputMaybe<Scalars['String']>
  /** All values containing the given string. */
  message_contains?: InputMaybe<Scalars['String']>
  /** All values ending with the given string. */
  message_ends_with?: InputMaybe<Scalars['String']>
  /** All values that are contained in given list. */
  message_in?: InputMaybe<Array<Scalars['String']>>
  /** All values that are not equal to given value. */
  message_not?: InputMaybe<Scalars['String']>
  /** All values not containing the given string. */
  message_not_contains?: InputMaybe<Scalars['String']>
  /** All values not ending with the given string */
  message_not_ends_with?: InputMaybe<Scalars['String']>
  /** All values that are not contained in given list. */
  message_not_in?: InputMaybe<Array<Scalars['String']>>
  /** All values not starting with the given string. */
  message_not_starts_with?: InputMaybe<Scalars['String']>
  /** All values starting with the given string. */
  message_starts_with?: InputMaybe<Scalars['String']>
  publishedAt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than the given value. */
  publishedAt_gt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than or equal the given value. */
  publishedAt_gte?: InputMaybe<Scalars['DateTime']>
  /** All values that are contained in given list. */
  publishedAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  /** All values less than the given value. */
  publishedAt_lt?: InputMaybe<Scalars['DateTime']>
  /** All values less than or equal the given value. */
  publishedAt_lte?: InputMaybe<Scalars['DateTime']>
  /** All values that are not equal to given value. */
  publishedAt_not?: InputMaybe<Scalars['DateTime']>
  /** All values that are not contained in given list. */
  publishedAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  publishedBy?: InputMaybe<UserWhereInput>
  scheduledIn_every?: InputMaybe<ScheduledOperationWhereInput>
  scheduledIn_none?: InputMaybe<ScheduledOperationWhereInput>
  scheduledIn_some?: InputMaybe<ScheduledOperationWhereInput>
  title?: InputMaybe<Scalars['String']>
  /** All values containing the given string. */
  title_contains?: InputMaybe<Scalars['String']>
  /** All values ending with the given string. */
  title_ends_with?: InputMaybe<Scalars['String']>
  /** All values that are contained in given list. */
  title_in?: InputMaybe<Array<Scalars['String']>>
  /** All values that are not equal to given value. */
  title_not?: InputMaybe<Scalars['String']>
  /** All values not containing the given string. */
  title_not_contains?: InputMaybe<Scalars['String']>
  /** All values not ending with the given string */
  title_not_ends_with?: InputMaybe<Scalars['String']>
  /** All values that are not contained in given list. */
  title_not_in?: InputMaybe<Array<Scalars['String']>>
  /** All values not starting with the given string. */
  title_not_starts_with?: InputMaybe<Scalars['String']>
  /** All values starting with the given string. */
  title_starts_with?: InputMaybe<Scalars['String']>
  updatedAt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than the given value. */
  updatedAt_gt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than or equal the given value. */
  updatedAt_gte?: InputMaybe<Scalars['DateTime']>
  /** All values that are contained in given list. */
  updatedAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  /** All values less than the given value. */
  updatedAt_lt?: InputMaybe<Scalars['DateTime']>
  /** All values less than or equal the given value. */
  updatedAt_lte?: InputMaybe<Scalars['DateTime']>
  /** All values that are not equal to given value. */
  updatedAt_not?: InputMaybe<Scalars['DateTime']>
  /** All values that are not contained in given list. */
  updatedAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  updatedBy?: InputMaybe<UserWhereInput>
}

/** References ImportantMessage record uniquely */
export type ImportantMessageWhereUniqueInput = {
  id?: InputMaybe<Scalars['ID']>
}

export type InProgressReferral = {
  __typename?: 'InProgressReferral'
  name?: Maybe<Scalars['String']>
}

export type Incentive =
  | FreeMonths
  | IndefinitePercentageDiscount
  | MonthlyCostDeduction
  | NoDiscount
  | PercentageDiscountMonths
  | VisibleNoDiscount

export type IncompleteApartmentQuoteDetails = {
  __typename?: 'IncompleteApartmentQuoteDetails'
  householdSize?: Maybe<Scalars['Int']>
  livingSpace?: Maybe<Scalars['Int']>
  street?: Maybe<Scalars['String']>
  type?: Maybe<ApartmentType>
  zipCode?: Maybe<Scalars['String']>
}

export type IncompleteHouseQuoteDetails = {
  __typename?: 'IncompleteHouseQuoteDetails'
  ancillarySpace?: Maybe<Scalars['Int']>
  extraBuildings?: Maybe<Array<ExtraBuilding>>
  householdSize?: Maybe<Scalars['Int']>
  isSubleted?: Maybe<Scalars['Boolean']>
  livingSpace?: Maybe<Scalars['Int']>
  numberOfBathrooms?: Maybe<Scalars['Int']>
  street?: Maybe<Scalars['String']>
  yearOfConstruction?: Maybe<Scalars['Int']>
  zipCode?: Maybe<Scalars['String']>
}

export type IncompleteQuote = {
  __typename?: 'IncompleteQuote'
  currentInsurer?: Maybe<CurrentInsurer>
  dataCollectionId?: Maybe<Scalars['ID']>
  details?: Maybe<IncompleteQuoteDetails>
  email?: Maybe<Scalars['String']>
  id: Scalars['ID']
  startDate?: Maybe<Scalars['LocalDate']>
}

export type IncompleteQuoteDetails = IncompleteApartmentQuoteDetails | IncompleteHouseQuoteDetails

export type IndefinitePercentageDiscount = {
  __typename?: 'IndefinitePercentageDiscount'
  percentageDiscount: Scalars['Float']
}

/** An inception that may be switchable and has a single date */
export type IndependentInception = {
  __typename?: 'IndependentInception'
  /** @deprecated correspondingQuote is deprecated, doesn't work with QuoteCart use correspondingQuoteId instead */
  correspondingQuote: Quote
  correspondingQuoteId: Scalars['ID']
  currentInsurer?: Maybe<CurrentInsurer>
  startDate?: Maybe<Scalars['LocalDate']>
}

/** A bundle inception where each quote may have an inception different from the others */
export type IndependentInceptions = {
  __typename?: 'IndependentInceptions'
  inceptions: Array<IndependentInception>
}

export type InitWidgetInput = {
  locale: Scalars['String']
  market: Market
  partnerId: Scalars['String']
  requestId: Scalars['String']
}

export type InitiateDataCollectionInput = {
  insuranceProvider: Scalars['String']
  personalNumber: Scalars['String']
  reference: Scalars['ID']
}

export type InitiateIframeDataCollectionInput = {
  collectionId: Scalars['String']
}

export type InsurableLimit = {
  __typename?: 'InsurableLimit'
  description: Scalars['String']
  label: Scalars['String']
  limit: Scalars['String']
  type: InsurableLimitType
}

export enum InsurableLimitType {
  Bike = 'BIKE',
  Deductible = 'DEDUCTIBLE',
  DeductibleAllRisk = 'DEDUCTIBLE_ALL_RISK',
  DeductibleNatureDamage = 'DEDUCTIBLE_NATURE_DAMAGE',
  DentalTreatment = 'DENTAL_TREATMENT',
  GoodsFamily = 'GOODS_FAMILY',
  GoodsIndividual = 'GOODS_INDIVIDUAL',
  InsuredAmount = 'INSURED_AMOUNT',
  LostLuggage = 'LOST_LUGGAGE',
  MedicalExpenses = 'MEDICAL_EXPENSES',
  PermanentInjury = 'PERMANENT_INJURY',
  TravelCancellation = 'TRAVEL_CANCELLATION',
  TravelDays = 'TRAVEL_DAYS',
  TravelDelayedLuggage = 'TRAVEL_DELAYED_LUGGAGE',
  TravelDelayedOnTrip = 'TRAVEL_DELAYED_ON_TRIP',
  TravelIllnessInjuryTransportationHome = 'TRAVEL_ILLNESS_INJURY_TRANSPORTATION_HOME',
  Treatment = 'TREATMENT',
}

export type Insurance = {
  __typename?: 'Insurance'
  activeFrom?: Maybe<Scalars['LocalDate']>
  address?: Maybe<Scalars['String']>
  ancillaryArea?: Maybe<Scalars['Int']>
  arrangedPerilCategories: ArrangedPerilCategories
  certificateUrl?: Maybe<Scalars['String']>
  cost?: Maybe<InsuranceCost>
  /** @deprecated Use previousInsurer instead */
  currentInsurerName?: Maybe<Scalars['String']>
  extraBuildings?: Maybe<Array<ExtraBuilding>>
  /** @deprecated Use previousInsurer instead */
  insuredAtOtherCompany?: Maybe<Scalars['Boolean']>
  isSubleted?: Maybe<Scalars['Boolean']>
  livingSpace?: Maybe<Scalars['Int']>
  /** @deprecated Use cost instead */
  monthlyCost?: Maybe<Scalars['Int']>
  numberOfBathrooms?: Maybe<Scalars['Int']>
  /** @deprecated Use arrangedPerilCategories instead */
  perilCategories?: Maybe<Array<Maybe<PerilCategory>>>
  personsInHousehold?: Maybe<Scalars['Int']>
  policyUrl?: Maybe<Scalars['String']>
  postalNumber?: Maybe<Scalars['String']>
  presaleInformationUrl?: Maybe<Scalars['String']>
  previousInsurer?: Maybe<PreviousInsurer>
  renewal?: Maybe<Renewal>
  /** @deprecated No longer supported */
  safetyIncreasers?: Maybe<Array<Scalars['String']>>
  status: InsuranceStatus
  type?: Maybe<InsuranceType>
  yearOfConstruction?: Maybe<Scalars['Int']>
}

export type InsuranceCost = {
  __typename?: 'InsuranceCost'
  freeUntil?: Maybe<Scalars['LocalDate']>
  monthlyDiscount: MonetaryAmountV2
  monthlyGross: MonetaryAmountV2
  monthlyNet: MonetaryAmountV2
}

export type InsuranceDataCollection = {
  __typename?: 'InsuranceDataCollection'
  insuranceName?: Maybe<Scalars['String']>
  insuranceObjectStreetAddress?: Maybe<Scalars['String']>
  insuranceProvider?: Maybe<Scalars['String']>
  insuranceType?: Maybe<Scalars['String']>
  monthlyDiscount?: Maybe<MonetaryAmountV2>
  monthlyGrossPremium?: Maybe<MonetaryAmountV2>
  monthlyNetPremium?: Maybe<MonetaryAmountV2>
  /** @deprecated Use monthlyNetPremium or monthlyGrossPremium */
  monthlyPremium?: Maybe<MonetaryAmountV2>
  postalNumber?: Maybe<Scalars['String']>
  renewalDate?: Maybe<Scalars['LocalDate']>
}

export type InsuranceDataCollectionV2 = HouseInsuranceCollection | PersonTravelInsuranceCollection

export type InsuranceProvider = {
  __typename?: 'InsuranceProvider'
  externalCollectionId?: Maybe<Scalars['String']>
  hasExternalCapabilities: Scalars['Boolean']
  id: Scalars['String']
  logo: Icon
  name: Scalars['String']
  switchable: Scalars['Boolean']
}

export enum InsuranceProviderAvailability {
  Beta = 'BETA',
  NotImplemented = 'NOT_IMPLEMENTED',
  Ok = 'OK',
}

export enum InsuranceStatus {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
  InactiveWithStartDate = 'INACTIVE_WITH_START_DATE',
  Pending = 'PENDING',
  Terminated = 'TERMINATED',
}

export type InsuranceTerm = {
  __typename?: 'InsuranceTerm'
  displayName: Scalars['String']
  type?: Maybe<InsuranceTermType>
  url: Scalars['String']
}

export enum InsuranceTermType {
  GeneralTerms = 'GENERAL_TERMS',
  PreSaleInfoEuStandard = 'PRE_SALE_INFO_EU_STANDARD',
  PrivacyPolicy = 'PRIVACY_POLICY',
  TermsAndConditions = 'TERMS_AND_CONDITIONS',
}

export enum InsuranceType {
  Brf = 'BRF',
  House = 'HOUSE',
  Rent = 'RENT',
  StudentBrf = 'STUDENT_BRF',
  StudentRent = 'STUDENT_RENT',
}

export type Key = Node & {
  __typename?: 'Key'
  /** The time the document was created */
  createdAt: Scalars['DateTime']
  /** User that created this document */
  createdBy?: Maybe<User>
  /** Describe what the translation is for, never shown to a user. */
  description?: Maybe<Scalars['String']>
  /** Get the document in other stages */
  documentInStages: Array<Key>
  /** List of Key versions */
  history: Array<Version>
  /** The unique identifier */
  id: Scalars['ID']
  keyGearItemCoverageDescription?: Maybe<KeyGearItemCoverage>
  keyGearItemCoverageTitle?: Maybe<KeyGearItemCoverage>
  /** The time the document was published. Null on documents in draft stage. */
  publishedAt?: Maybe<Scalars['DateTime']>
  /** User that last published this document */
  publishedBy?: Maybe<User>
  scheduledIn: Array<ScheduledOperation>
  /** System stage field */
  stage: Stage
  translations: Array<Translation>
  /** The time the document was updated */
  updatedAt: Scalars['DateTime']
  /** User that last updated this document */
  updatedBy?: Maybe<User>
  value: Scalars['String']
}

export type KeyCreatedByArgs = {
  locales?: InputMaybe<Array<Locale>>
}

export type KeyDocumentInStagesArgs = {
  includeCurrent?: Scalars['Boolean']
  inheritLocale?: Scalars['Boolean']
  stages?: Array<Stage>
}

export type KeyHistoryArgs = {
  limit?: Scalars['Int']
  skip?: Scalars['Int']
  stageOverride?: InputMaybe<Stage>
}

export type KeyKeyGearItemCoverageDescriptionArgs = {
  locales?: InputMaybe<Array<Locale>>
}

export type KeyKeyGearItemCoverageTitleArgs = {
  locales?: InputMaybe<Array<Locale>>
}

export type KeyPublishedByArgs = {
  locales?: InputMaybe<Array<Locale>>
}

export type KeyScheduledInArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  locales?: InputMaybe<Array<Locale>>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<ScheduledOperationWhereInput>
}

export type KeyTranslationsArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  locales?: InputMaybe<Array<Locale>>
  orderBy?: InputMaybe<TranslationOrderByInput>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<TranslationWhereInput>
}

export type KeyUpdatedByArgs = {
  locales?: InputMaybe<Array<Locale>>
}

export type KeyConnectInput = {
  /** Allow to specify document position in list of connected documents, will default to appending at end of list */
  position?: InputMaybe<ConnectPositionInput>
  /** Document to connect */
  where: KeyWhereUniqueInput
}

/** A connection to a list of items. */
export type KeyConnection = {
  __typename?: 'KeyConnection'
  aggregate: Aggregate
  /** A list of edges. */
  edges: Array<KeyEdge>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
}

export type KeyCreateInput = {
  ckt8upxgl306b01z00bg1gkdd?: InputMaybe<TranslationCreateManyInlineInput>
  createdAt?: InputMaybe<Scalars['DateTime']>
  description?: InputMaybe<Scalars['String']>
  keyGearItemCoverageDescription?: InputMaybe<KeyGearItemCoverageCreateOneInlineInput>
  keyGearItemCoverageTitle?: InputMaybe<KeyGearItemCoverageCreateOneInlineInput>
  translations?: InputMaybe<TranslationCreateManyInlineInput>
  updatedAt?: InputMaybe<Scalars['DateTime']>
  value: Scalars['String']
}

export type KeyCreateManyInlineInput = {
  /** Connect multiple existing Key documents */
  connect?: InputMaybe<Array<KeyWhereUniqueInput>>
  /** Create and connect multiple existing Key documents */
  create?: InputMaybe<Array<KeyCreateInput>>
}

export type KeyCreateOneInlineInput = {
  /** Connect one existing Key document */
  connect?: InputMaybe<KeyWhereUniqueInput>
  /** Create and connect one Key document */
  create?: InputMaybe<KeyCreateInput>
}

/** An edge in a connection. */
export type KeyEdge = {
  __typename?: 'KeyEdge'
  /** A cursor for use in pagination. */
  cursor: Scalars['String']
  /** The item at the end of the edge. */
  node: Key
}

export type KeyGearItem = {
  __typename?: 'KeyGearItem'
  category: KeyGearItemCategory
  covered: Array<KeyGearItemCoverage>
  deductible: MonetaryAmountV2
  deleted: Scalars['Boolean']
  exceptions: Array<KeyGearItemCoverage>
  id: Scalars['ID']
  maxInsurableAmount?: Maybe<MonetaryAmountV2>
  /**
   * If this item was added automatically - what was the Hash of the identifiable information?
   * Use this to avoid automatically adding an Item which the user has already automatically added or
   * does not wish to have automatically added
   */
  name?: Maybe<Scalars['String']>
  photos: Array<KeyGearItemPhoto>
  physicalReferenceHash?: Maybe<Scalars['String']>
  purchasePrice?: Maybe<MonetaryAmountV2>
  receipts: Array<KeyGearItemReceipt>
  timeOfPurchase?: Maybe<Scalars['LocalDate']>
  valuation?: Maybe<KeyGearItemValuation>
}

export enum KeyGearItemCategory {
  Bike = 'BIKE',
  Computer = 'COMPUTER',
  Jewelry = 'JEWELRY',
  Phone = 'PHONE',
  SmartWatch = 'SMART_WATCH',
  Tablet = 'TABLET',
  Tv = 'TV',
  Watch = 'WATCH',
}

export type KeyGearItemCoverage = Node & {
  __typename?: 'KeyGearItemCoverage'
  /** The time the document was created */
  createdAt: Scalars['DateTime']
  /** User that created this document */
  createdBy?: Maybe<User>
  description?: Maybe<Key>
  /** Get the document in other stages */
  documentInStages: Array<KeyGearItemCoverage>
  /** List of KeyGearItemCoverage versions */
  history: Array<Version>
  /** The unique identifier */
  id: Scalars['ID']
  /** The time the document was published. Null on documents in draft stage. */
  publishedAt?: Maybe<Scalars['DateTime']>
  /** User that last published this document */
  publishedBy?: Maybe<User>
  scheduledIn: Array<ScheduledOperation>
  /** System stage field */
  stage: Stage
  title?: Maybe<Key>
  /** The time the document was updated */
  updatedAt: Scalars['DateTime']
  /** User that last updated this document */
  updatedBy?: Maybe<User>
}

export type KeyGearItemCoverageCreatedByArgs = {
  locales?: InputMaybe<Array<Locale>>
}

export type KeyGearItemCoverageDescriptionArgs = {
  locales?: InputMaybe<Array<Locale>>
}

export type KeyGearItemCoverageDocumentInStagesArgs = {
  includeCurrent?: Scalars['Boolean']
  inheritLocale?: Scalars['Boolean']
  stages?: Array<Stage>
}

export type KeyGearItemCoverageHistoryArgs = {
  limit?: Scalars['Int']
  skip?: Scalars['Int']
  stageOverride?: InputMaybe<Stage>
}

export type KeyGearItemCoveragePublishedByArgs = {
  locales?: InputMaybe<Array<Locale>>
}

export type KeyGearItemCoverageScheduledInArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  locales?: InputMaybe<Array<Locale>>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<ScheduledOperationWhereInput>
}

export type KeyGearItemCoverageTitleArgs = {
  locales?: InputMaybe<Array<Locale>>
}

export type KeyGearItemCoverageUpdatedByArgs = {
  locales?: InputMaybe<Array<Locale>>
}

export type KeyGearItemCoverageConnectInput = {
  /** Allow to specify document position in list of connected documents, will default to appending at end of list */
  position?: InputMaybe<ConnectPositionInput>
  /** Document to connect */
  where: KeyGearItemCoverageWhereUniqueInput
}

/** A connection to a list of items. */
export type KeyGearItemCoverageConnection = {
  __typename?: 'KeyGearItemCoverageConnection'
  aggregate: Aggregate
  /** A list of edges. */
  edges: Array<KeyGearItemCoverageEdge>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
}

export type KeyGearItemCoverageCreateInput = {
  createdAt?: InputMaybe<Scalars['DateTime']>
  description?: InputMaybe<KeyCreateOneInlineInput>
  title?: InputMaybe<KeyCreateOneInlineInput>
  updatedAt?: InputMaybe<Scalars['DateTime']>
}

export type KeyGearItemCoverageCreateManyInlineInput = {
  /** Connect multiple existing KeyGearItemCoverage documents */
  connect?: InputMaybe<Array<KeyGearItemCoverageWhereUniqueInput>>
  /** Create and connect multiple existing KeyGearItemCoverage documents */
  create?: InputMaybe<Array<KeyGearItemCoverageCreateInput>>
}

export type KeyGearItemCoverageCreateOneInlineInput = {
  /** Connect one existing KeyGearItemCoverage document */
  connect?: InputMaybe<KeyGearItemCoverageWhereUniqueInput>
  /** Create and connect one KeyGearItemCoverage document */
  create?: InputMaybe<KeyGearItemCoverageCreateInput>
}

/** An edge in a connection. */
export type KeyGearItemCoverageEdge = {
  __typename?: 'KeyGearItemCoverageEdge'
  /** A cursor for use in pagination. */
  cursor: Scalars['String']
  /** The item at the end of the edge. */
  node: KeyGearItemCoverage
}

/** Identifies documents */
export type KeyGearItemCoverageManyWhereInput = {
  /** Logical AND on all given filters. */
  AND?: InputMaybe<Array<KeyGearItemCoverageWhereInput>>
  /** Logical NOT on all given filters combined by AND. */
  NOT?: InputMaybe<Array<KeyGearItemCoverageWhereInput>>
  /** Logical OR on all given filters. */
  OR?: InputMaybe<Array<KeyGearItemCoverageWhereInput>>
  /** Contains search across all appropriate fields. */
  _search?: InputMaybe<Scalars['String']>
  createdAt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than the given value. */
  createdAt_gt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than or equal the given value. */
  createdAt_gte?: InputMaybe<Scalars['DateTime']>
  /** All values that are contained in given list. */
  createdAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  /** All values less than the given value. */
  createdAt_lt?: InputMaybe<Scalars['DateTime']>
  /** All values less than or equal the given value. */
  createdAt_lte?: InputMaybe<Scalars['DateTime']>
  /** All values that are not equal to given value. */
  createdAt_not?: InputMaybe<Scalars['DateTime']>
  /** All values that are not contained in given list. */
  createdAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  createdBy?: InputMaybe<UserWhereInput>
  description?: InputMaybe<KeyWhereInput>
  id?: InputMaybe<Scalars['ID']>
  /** All values containing the given string. */
  id_contains?: InputMaybe<Scalars['ID']>
  /** All values ending with the given string. */
  id_ends_with?: InputMaybe<Scalars['ID']>
  /** All values that are contained in given list. */
  id_in?: InputMaybe<Array<Scalars['ID']>>
  /** All values that are not equal to given value. */
  id_not?: InputMaybe<Scalars['ID']>
  /** All values not containing the given string. */
  id_not_contains?: InputMaybe<Scalars['ID']>
  /** All values not ending with the given string */
  id_not_ends_with?: InputMaybe<Scalars['ID']>
  /** All values that are not contained in given list. */
  id_not_in?: InputMaybe<Array<Scalars['ID']>>
  /** All values not starting with the given string. */
  id_not_starts_with?: InputMaybe<Scalars['ID']>
  /** All values starting with the given string. */
  id_starts_with?: InputMaybe<Scalars['ID']>
  publishedAt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than the given value. */
  publishedAt_gt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than or equal the given value. */
  publishedAt_gte?: InputMaybe<Scalars['DateTime']>
  /** All values that are contained in given list. */
  publishedAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  /** All values less than the given value. */
  publishedAt_lt?: InputMaybe<Scalars['DateTime']>
  /** All values less than or equal the given value. */
  publishedAt_lte?: InputMaybe<Scalars['DateTime']>
  /** All values that are not equal to given value. */
  publishedAt_not?: InputMaybe<Scalars['DateTime']>
  /** All values that are not contained in given list. */
  publishedAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  publishedBy?: InputMaybe<UserWhereInput>
  scheduledIn_every?: InputMaybe<ScheduledOperationWhereInput>
  scheduledIn_none?: InputMaybe<ScheduledOperationWhereInput>
  scheduledIn_some?: InputMaybe<ScheduledOperationWhereInput>
  title?: InputMaybe<KeyWhereInput>
  updatedAt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than the given value. */
  updatedAt_gt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than or equal the given value. */
  updatedAt_gte?: InputMaybe<Scalars['DateTime']>
  /** All values that are contained in given list. */
  updatedAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  /** All values less than the given value. */
  updatedAt_lt?: InputMaybe<Scalars['DateTime']>
  /** All values less than or equal the given value. */
  updatedAt_lte?: InputMaybe<Scalars['DateTime']>
  /** All values that are not equal to given value. */
  updatedAt_not?: InputMaybe<Scalars['DateTime']>
  /** All values that are not contained in given list. */
  updatedAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  updatedBy?: InputMaybe<UserWhereInput>
}

export enum KeyGearItemCoverageOrderByInput {
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  PublishedAtAsc = 'publishedAt_ASC',
  PublishedAtDesc = 'publishedAt_DESC',
  UpdatedAtAsc = 'updatedAt_ASC',
  UpdatedAtDesc = 'updatedAt_DESC',
}

export type KeyGearItemCoverageUpdateInput = {
  description?: InputMaybe<KeyUpdateOneInlineInput>
  title?: InputMaybe<KeyUpdateOneInlineInput>
}

export type KeyGearItemCoverageUpdateManyInlineInput = {
  /** Connect multiple existing KeyGearItemCoverage documents */
  connect?: InputMaybe<Array<KeyGearItemCoverageConnectInput>>
  /** Create and connect multiple KeyGearItemCoverage documents */
  create?: InputMaybe<Array<KeyGearItemCoverageCreateInput>>
  /** Delete multiple KeyGearItemCoverage documents */
  delete?: InputMaybe<Array<KeyGearItemCoverageWhereUniqueInput>>
  /** Disconnect multiple KeyGearItemCoverage documents */
  disconnect?: InputMaybe<Array<KeyGearItemCoverageWhereUniqueInput>>
  /** Override currently-connected documents with multiple existing KeyGearItemCoverage documents */
  set?: InputMaybe<Array<KeyGearItemCoverageWhereUniqueInput>>
  /** Update multiple KeyGearItemCoverage documents */
  update?: InputMaybe<Array<KeyGearItemCoverageUpdateWithNestedWhereUniqueInput>>
  /** Upsert multiple KeyGearItemCoverage documents */
  upsert?: InputMaybe<Array<KeyGearItemCoverageUpsertWithNestedWhereUniqueInput>>
}

export type KeyGearItemCoverageUpdateManyInput = {
  /** No fields in updateMany data input */
  _?: InputMaybe<Scalars['String']>
}

export type KeyGearItemCoverageUpdateManyWithNestedWhereInput = {
  /** Update many input */
  data: KeyGearItemCoverageUpdateManyInput
  /** Document search */
  where: KeyGearItemCoverageWhereInput
}

export type KeyGearItemCoverageUpdateOneInlineInput = {
  /** Connect existing KeyGearItemCoverage document */
  connect?: InputMaybe<KeyGearItemCoverageWhereUniqueInput>
  /** Create and connect one KeyGearItemCoverage document */
  create?: InputMaybe<KeyGearItemCoverageCreateInput>
  /** Delete currently connected KeyGearItemCoverage document */
  delete?: InputMaybe<Scalars['Boolean']>
  /** Disconnect currently connected KeyGearItemCoverage document */
  disconnect?: InputMaybe<Scalars['Boolean']>
  /** Update single KeyGearItemCoverage document */
  update?: InputMaybe<KeyGearItemCoverageUpdateWithNestedWhereUniqueInput>
  /** Upsert single KeyGearItemCoverage document */
  upsert?: InputMaybe<KeyGearItemCoverageUpsertWithNestedWhereUniqueInput>
}

export type KeyGearItemCoverageUpdateWithNestedWhereUniqueInput = {
  /** Document to update */
  data: KeyGearItemCoverageUpdateInput
  /** Unique document search */
  where: KeyGearItemCoverageWhereUniqueInput
}

export type KeyGearItemCoverageUpsertInput = {
  /** Create document if it didn't exist */
  create: KeyGearItemCoverageCreateInput
  /** Update document if it exists */
  update: KeyGearItemCoverageUpdateInput
}

export type KeyGearItemCoverageUpsertWithNestedWhereUniqueInput = {
  /** Upsert data */
  data: KeyGearItemCoverageUpsertInput
  /** Unique document search */
  where: KeyGearItemCoverageWhereUniqueInput
}

/** Identifies documents */
export type KeyGearItemCoverageWhereInput = {
  /** Logical AND on all given filters. */
  AND?: InputMaybe<Array<KeyGearItemCoverageWhereInput>>
  /** Logical NOT on all given filters combined by AND. */
  NOT?: InputMaybe<Array<KeyGearItemCoverageWhereInput>>
  /** Logical OR on all given filters. */
  OR?: InputMaybe<Array<KeyGearItemCoverageWhereInput>>
  /** Contains search across all appropriate fields. */
  _search?: InputMaybe<Scalars['String']>
  createdAt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than the given value. */
  createdAt_gt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than or equal the given value. */
  createdAt_gte?: InputMaybe<Scalars['DateTime']>
  /** All values that are contained in given list. */
  createdAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  /** All values less than the given value. */
  createdAt_lt?: InputMaybe<Scalars['DateTime']>
  /** All values less than or equal the given value. */
  createdAt_lte?: InputMaybe<Scalars['DateTime']>
  /** All values that are not equal to given value. */
  createdAt_not?: InputMaybe<Scalars['DateTime']>
  /** All values that are not contained in given list. */
  createdAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  createdBy?: InputMaybe<UserWhereInput>
  description?: InputMaybe<KeyWhereInput>
  id?: InputMaybe<Scalars['ID']>
  /** All values containing the given string. */
  id_contains?: InputMaybe<Scalars['ID']>
  /** All values ending with the given string. */
  id_ends_with?: InputMaybe<Scalars['ID']>
  /** All values that are contained in given list. */
  id_in?: InputMaybe<Array<Scalars['ID']>>
  /** All values that are not equal to given value. */
  id_not?: InputMaybe<Scalars['ID']>
  /** All values not containing the given string. */
  id_not_contains?: InputMaybe<Scalars['ID']>
  /** All values not ending with the given string */
  id_not_ends_with?: InputMaybe<Scalars['ID']>
  /** All values that are not contained in given list. */
  id_not_in?: InputMaybe<Array<Scalars['ID']>>
  /** All values not starting with the given string. */
  id_not_starts_with?: InputMaybe<Scalars['ID']>
  /** All values starting with the given string. */
  id_starts_with?: InputMaybe<Scalars['ID']>
  publishedAt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than the given value. */
  publishedAt_gt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than or equal the given value. */
  publishedAt_gte?: InputMaybe<Scalars['DateTime']>
  /** All values that are contained in given list. */
  publishedAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  /** All values less than the given value. */
  publishedAt_lt?: InputMaybe<Scalars['DateTime']>
  /** All values less than or equal the given value. */
  publishedAt_lte?: InputMaybe<Scalars['DateTime']>
  /** All values that are not equal to given value. */
  publishedAt_not?: InputMaybe<Scalars['DateTime']>
  /** All values that are not contained in given list. */
  publishedAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  publishedBy?: InputMaybe<UserWhereInput>
  scheduledIn_every?: InputMaybe<ScheduledOperationWhereInput>
  scheduledIn_none?: InputMaybe<ScheduledOperationWhereInput>
  scheduledIn_some?: InputMaybe<ScheduledOperationWhereInput>
  title?: InputMaybe<KeyWhereInput>
  updatedAt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than the given value. */
  updatedAt_gt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than or equal the given value. */
  updatedAt_gte?: InputMaybe<Scalars['DateTime']>
  /** All values that are contained in given list. */
  updatedAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  /** All values less than the given value. */
  updatedAt_lt?: InputMaybe<Scalars['DateTime']>
  /** All values less than or equal the given value. */
  updatedAt_lte?: InputMaybe<Scalars['DateTime']>
  /** All values that are not equal to given value. */
  updatedAt_not?: InputMaybe<Scalars['DateTime']>
  /** All values that are not contained in given list. */
  updatedAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  updatedBy?: InputMaybe<UserWhereInput>
}

/** References KeyGearItemCoverage record uniquely */
export type KeyGearItemCoverageWhereUniqueInput = {
  id?: InputMaybe<Scalars['ID']>
}

export type KeyGearItemPhoto = {
  __typename?: 'KeyGearItemPhoto'
  file: S3File
  id: Scalars['ID']
  markedAsDeleted: Scalars['Boolean']
}

export type KeyGearItemReceipt = {
  __typename?: 'KeyGearItemReceipt'
  file: S3File
  id: Scalars['ID']
  markedAsDeleted: Scalars['Boolean']
}

export type KeyGearItemValuation = KeyGearItemValuationFixed | KeyGearItemValuationMarketValue

export type KeyGearItemValuationFixed = {
  __typename?: 'KeyGearItemValuationFixed'
  /** Value between 100 and 0 which corresponds to the percentage of the item's value relative to purchase price */
  ratio: Scalars['Int']
  valuation: MonetaryAmountV2
}

export type KeyGearItemValuationMarketValue = {
  __typename?: 'KeyGearItemValuationMarketValue'
  /** Value between 100 and 0 which corresponds to the percentage of the item's value relative to current market value */
  ratio: Scalars['Int']
}

export type KeyGearItemsFilter = {
  /** default: false */
  deleted?: InputMaybe<Scalars['Boolean']>
}

/** Identifies documents */
export type KeyManyWhereInput = {
  /** Logical AND on all given filters. */
  AND?: InputMaybe<Array<KeyWhereInput>>
  /** Logical NOT on all given filters combined by AND. */
  NOT?: InputMaybe<Array<KeyWhereInput>>
  /** Logical OR on all given filters. */
  OR?: InputMaybe<Array<KeyWhereInput>>
  /** Contains search across all appropriate fields. */
  _search?: InputMaybe<Scalars['String']>
  createdAt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than the given value. */
  createdAt_gt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than or equal the given value. */
  createdAt_gte?: InputMaybe<Scalars['DateTime']>
  /** All values that are contained in given list. */
  createdAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  /** All values less than the given value. */
  createdAt_lt?: InputMaybe<Scalars['DateTime']>
  /** All values less than or equal the given value. */
  createdAt_lte?: InputMaybe<Scalars['DateTime']>
  /** All values that are not equal to given value. */
  createdAt_not?: InputMaybe<Scalars['DateTime']>
  /** All values that are not contained in given list. */
  createdAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  createdBy?: InputMaybe<UserWhereInput>
  description?: InputMaybe<Scalars['String']>
  /** All values containing the given string. */
  description_contains?: InputMaybe<Scalars['String']>
  /** All values ending with the given string. */
  description_ends_with?: InputMaybe<Scalars['String']>
  /** All values that are contained in given list. */
  description_in?: InputMaybe<Array<Scalars['String']>>
  /** All values that are not equal to given value. */
  description_not?: InputMaybe<Scalars['String']>
  /** All values not containing the given string. */
  description_not_contains?: InputMaybe<Scalars['String']>
  /** All values not ending with the given string */
  description_not_ends_with?: InputMaybe<Scalars['String']>
  /** All values that are not contained in given list. */
  description_not_in?: InputMaybe<Array<Scalars['String']>>
  /** All values not starting with the given string. */
  description_not_starts_with?: InputMaybe<Scalars['String']>
  /** All values starting with the given string. */
  description_starts_with?: InputMaybe<Scalars['String']>
  id?: InputMaybe<Scalars['ID']>
  /** All values containing the given string. */
  id_contains?: InputMaybe<Scalars['ID']>
  /** All values ending with the given string. */
  id_ends_with?: InputMaybe<Scalars['ID']>
  /** All values that are contained in given list. */
  id_in?: InputMaybe<Array<Scalars['ID']>>
  /** All values that are not equal to given value. */
  id_not?: InputMaybe<Scalars['ID']>
  /** All values not containing the given string. */
  id_not_contains?: InputMaybe<Scalars['ID']>
  /** All values not ending with the given string */
  id_not_ends_with?: InputMaybe<Scalars['ID']>
  /** All values that are not contained in given list. */
  id_not_in?: InputMaybe<Array<Scalars['ID']>>
  /** All values not starting with the given string. */
  id_not_starts_with?: InputMaybe<Scalars['ID']>
  /** All values starting with the given string. */
  id_starts_with?: InputMaybe<Scalars['ID']>
  keyGearItemCoverageDescription?: InputMaybe<KeyGearItemCoverageWhereInput>
  keyGearItemCoverageTitle?: InputMaybe<KeyGearItemCoverageWhereInput>
  publishedAt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than the given value. */
  publishedAt_gt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than or equal the given value. */
  publishedAt_gte?: InputMaybe<Scalars['DateTime']>
  /** All values that are contained in given list. */
  publishedAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  /** All values less than the given value. */
  publishedAt_lt?: InputMaybe<Scalars['DateTime']>
  /** All values less than or equal the given value. */
  publishedAt_lte?: InputMaybe<Scalars['DateTime']>
  /** All values that are not equal to given value. */
  publishedAt_not?: InputMaybe<Scalars['DateTime']>
  /** All values that are not contained in given list. */
  publishedAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  publishedBy?: InputMaybe<UserWhereInput>
  scheduledIn_every?: InputMaybe<ScheduledOperationWhereInput>
  scheduledIn_none?: InputMaybe<ScheduledOperationWhereInput>
  scheduledIn_some?: InputMaybe<ScheduledOperationWhereInput>
  translations_every?: InputMaybe<TranslationWhereInput>
  translations_none?: InputMaybe<TranslationWhereInput>
  translations_some?: InputMaybe<TranslationWhereInput>
  updatedAt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than the given value. */
  updatedAt_gt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than or equal the given value. */
  updatedAt_gte?: InputMaybe<Scalars['DateTime']>
  /** All values that are contained in given list. */
  updatedAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  /** All values less than the given value. */
  updatedAt_lt?: InputMaybe<Scalars['DateTime']>
  /** All values less than or equal the given value. */
  updatedAt_lte?: InputMaybe<Scalars['DateTime']>
  /** All values that are not equal to given value. */
  updatedAt_not?: InputMaybe<Scalars['DateTime']>
  /** All values that are not contained in given list. */
  updatedAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  updatedBy?: InputMaybe<UserWhereInput>
  value?: InputMaybe<Scalars['String']>
  /** All values containing the given string. */
  value_contains?: InputMaybe<Scalars['String']>
  /** All values ending with the given string. */
  value_ends_with?: InputMaybe<Scalars['String']>
  /** All values that are contained in given list. */
  value_in?: InputMaybe<Array<Scalars['String']>>
  /** All values that are not equal to given value. */
  value_not?: InputMaybe<Scalars['String']>
  /** All values not containing the given string. */
  value_not_contains?: InputMaybe<Scalars['String']>
  /** All values not ending with the given string */
  value_not_ends_with?: InputMaybe<Scalars['String']>
  /** All values that are not contained in given list. */
  value_not_in?: InputMaybe<Array<Scalars['String']>>
  /** All values not starting with the given string. */
  value_not_starts_with?: InputMaybe<Scalars['String']>
  /** All values starting with the given string. */
  value_starts_with?: InputMaybe<Scalars['String']>
}

export enum KeyOrderByInput {
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC',
  DescriptionAsc = 'description_ASC',
  DescriptionDesc = 'description_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  PublishedAtAsc = 'publishedAt_ASC',
  PublishedAtDesc = 'publishedAt_DESC',
  UpdatedAtAsc = 'updatedAt_ASC',
  UpdatedAtDesc = 'updatedAt_DESC',
  ValueAsc = 'value_ASC',
  ValueDesc = 'value_DESC',
}

export type KeyUpdateInput = {
  ckt8upxgl306b01z00bg1gkdd?: InputMaybe<TranslationUpdateManyInlineInput>
  description?: InputMaybe<Scalars['String']>
  keyGearItemCoverageDescription?: InputMaybe<KeyGearItemCoverageUpdateOneInlineInput>
  keyGearItemCoverageTitle?: InputMaybe<KeyGearItemCoverageUpdateOneInlineInput>
  translations?: InputMaybe<TranslationUpdateManyInlineInput>
  value?: InputMaybe<Scalars['String']>
}

export type KeyUpdateManyInlineInput = {
  /** Connect multiple existing Key documents */
  connect?: InputMaybe<Array<KeyConnectInput>>
  /** Create and connect multiple Key documents */
  create?: InputMaybe<Array<KeyCreateInput>>
  /** Delete multiple Key documents */
  delete?: InputMaybe<Array<KeyWhereUniqueInput>>
  /** Disconnect multiple Key documents */
  disconnect?: InputMaybe<Array<KeyWhereUniqueInput>>
  /** Override currently-connected documents with multiple existing Key documents */
  set?: InputMaybe<Array<KeyWhereUniqueInput>>
  /** Update multiple Key documents */
  update?: InputMaybe<Array<KeyUpdateWithNestedWhereUniqueInput>>
  /** Upsert multiple Key documents */
  upsert?: InputMaybe<Array<KeyUpsertWithNestedWhereUniqueInput>>
}

export type KeyUpdateManyInput = {
  description?: InputMaybe<Scalars['String']>
}

export type KeyUpdateManyWithNestedWhereInput = {
  /** Update many input */
  data: KeyUpdateManyInput
  /** Document search */
  where: KeyWhereInput
}

export type KeyUpdateOneInlineInput = {
  /** Connect existing Key document */
  connect?: InputMaybe<KeyWhereUniqueInput>
  /** Create and connect one Key document */
  create?: InputMaybe<KeyCreateInput>
  /** Delete currently connected Key document */
  delete?: InputMaybe<Scalars['Boolean']>
  /** Disconnect currently connected Key document */
  disconnect?: InputMaybe<Scalars['Boolean']>
  /** Update single Key document */
  update?: InputMaybe<KeyUpdateWithNestedWhereUniqueInput>
  /** Upsert single Key document */
  upsert?: InputMaybe<KeyUpsertWithNestedWhereUniqueInput>
}

export type KeyUpdateWithNestedWhereUniqueInput = {
  /** Document to update */
  data: KeyUpdateInput
  /** Unique document search */
  where: KeyWhereUniqueInput
}

export type KeyUpsertInput = {
  /** Create document if it didn't exist */
  create: KeyCreateInput
  /** Update document if it exists */
  update: KeyUpdateInput
}

export type KeyUpsertWithNestedWhereUniqueInput = {
  /** Upsert data */
  data: KeyUpsertInput
  /** Unique document search */
  where: KeyWhereUniqueInput
}

/** Identifies documents */
export type KeyWhereInput = {
  /** Logical AND on all given filters. */
  AND?: InputMaybe<Array<KeyWhereInput>>
  /** Logical NOT on all given filters combined by AND. */
  NOT?: InputMaybe<Array<KeyWhereInput>>
  /** Logical OR on all given filters. */
  OR?: InputMaybe<Array<KeyWhereInput>>
  /** Contains search across all appropriate fields. */
  _search?: InputMaybe<Scalars['String']>
  createdAt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than the given value. */
  createdAt_gt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than or equal the given value. */
  createdAt_gte?: InputMaybe<Scalars['DateTime']>
  /** All values that are contained in given list. */
  createdAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  /** All values less than the given value. */
  createdAt_lt?: InputMaybe<Scalars['DateTime']>
  /** All values less than or equal the given value. */
  createdAt_lte?: InputMaybe<Scalars['DateTime']>
  /** All values that are not equal to given value. */
  createdAt_not?: InputMaybe<Scalars['DateTime']>
  /** All values that are not contained in given list. */
  createdAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  createdBy?: InputMaybe<UserWhereInput>
  description?: InputMaybe<Scalars['String']>
  /** All values containing the given string. */
  description_contains?: InputMaybe<Scalars['String']>
  /** All values ending with the given string. */
  description_ends_with?: InputMaybe<Scalars['String']>
  /** All values that are contained in given list. */
  description_in?: InputMaybe<Array<Scalars['String']>>
  /** All values that are not equal to given value. */
  description_not?: InputMaybe<Scalars['String']>
  /** All values not containing the given string. */
  description_not_contains?: InputMaybe<Scalars['String']>
  /** All values not ending with the given string */
  description_not_ends_with?: InputMaybe<Scalars['String']>
  /** All values that are not contained in given list. */
  description_not_in?: InputMaybe<Array<Scalars['String']>>
  /** All values not starting with the given string. */
  description_not_starts_with?: InputMaybe<Scalars['String']>
  /** All values starting with the given string. */
  description_starts_with?: InputMaybe<Scalars['String']>
  id?: InputMaybe<Scalars['ID']>
  /** All values containing the given string. */
  id_contains?: InputMaybe<Scalars['ID']>
  /** All values ending with the given string. */
  id_ends_with?: InputMaybe<Scalars['ID']>
  /** All values that are contained in given list. */
  id_in?: InputMaybe<Array<Scalars['ID']>>
  /** All values that are not equal to given value. */
  id_not?: InputMaybe<Scalars['ID']>
  /** All values not containing the given string. */
  id_not_contains?: InputMaybe<Scalars['ID']>
  /** All values not ending with the given string */
  id_not_ends_with?: InputMaybe<Scalars['ID']>
  /** All values that are not contained in given list. */
  id_not_in?: InputMaybe<Array<Scalars['ID']>>
  /** All values not starting with the given string. */
  id_not_starts_with?: InputMaybe<Scalars['ID']>
  /** All values starting with the given string. */
  id_starts_with?: InputMaybe<Scalars['ID']>
  keyGearItemCoverageDescription?: InputMaybe<KeyGearItemCoverageWhereInput>
  keyGearItemCoverageTitle?: InputMaybe<KeyGearItemCoverageWhereInput>
  publishedAt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than the given value. */
  publishedAt_gt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than or equal the given value. */
  publishedAt_gte?: InputMaybe<Scalars['DateTime']>
  /** All values that are contained in given list. */
  publishedAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  /** All values less than the given value. */
  publishedAt_lt?: InputMaybe<Scalars['DateTime']>
  /** All values less than or equal the given value. */
  publishedAt_lte?: InputMaybe<Scalars['DateTime']>
  /** All values that are not equal to given value. */
  publishedAt_not?: InputMaybe<Scalars['DateTime']>
  /** All values that are not contained in given list. */
  publishedAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  publishedBy?: InputMaybe<UserWhereInput>
  scheduledIn_every?: InputMaybe<ScheduledOperationWhereInput>
  scheduledIn_none?: InputMaybe<ScheduledOperationWhereInput>
  scheduledIn_some?: InputMaybe<ScheduledOperationWhereInput>
  translations_every?: InputMaybe<TranslationWhereInput>
  translations_none?: InputMaybe<TranslationWhereInput>
  translations_some?: InputMaybe<TranslationWhereInput>
  updatedAt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than the given value. */
  updatedAt_gt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than or equal the given value. */
  updatedAt_gte?: InputMaybe<Scalars['DateTime']>
  /** All values that are contained in given list. */
  updatedAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  /** All values less than the given value. */
  updatedAt_lt?: InputMaybe<Scalars['DateTime']>
  /** All values less than or equal the given value. */
  updatedAt_lte?: InputMaybe<Scalars['DateTime']>
  /** All values that are not equal to given value. */
  updatedAt_not?: InputMaybe<Scalars['DateTime']>
  /** All values that are not contained in given list. */
  updatedAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  updatedBy?: InputMaybe<UserWhereInput>
  value?: InputMaybe<Scalars['String']>
  /** All values containing the given string. */
  value_contains?: InputMaybe<Scalars['String']>
  /** All values ending with the given string. */
  value_ends_with?: InputMaybe<Scalars['String']>
  /** All values that are contained in given list. */
  value_in?: InputMaybe<Array<Scalars['String']>>
  /** All values that are not equal to given value. */
  value_not?: InputMaybe<Scalars['String']>
  /** All values not containing the given string. */
  value_not_contains?: InputMaybe<Scalars['String']>
  /** All values not ending with the given string */
  value_not_ends_with?: InputMaybe<Scalars['String']>
  /** All values that are not contained in given list. */
  value_not_in?: InputMaybe<Array<Scalars['String']>>
  /** All values not starting with the given string. */
  value_not_starts_with?: InputMaybe<Scalars['String']>
  /** All values starting with the given string. */
  value_starts_with?: InputMaybe<Scalars['String']>
}

/** References Key record uniquely */
export type KeyWhereUniqueInput = {
  id?: InputMaybe<Scalars['ID']>
  value?: InputMaybe<Scalars['String']>
}

export enum KeyboardType {
  Decimalpad = 'DECIMALPAD',
  Default = 'DEFAULT',
  Email = 'EMAIL',
  Numberpad = 'NUMBERPAD',
  Numeric = 'NUMERIC',
  Phone = 'PHONE',
}

export type Language = Node & {
  __typename?: 'Language'
  appMarketingImages: Array<AppMarketingImage>
  code: Scalars['String']
  /** The time the document was created */
  createdAt: Scalars['DateTime']
  /** User that created this document */
  createdBy?: Maybe<User>
  /** Get the document in other stages */
  documentInStages: Array<Language>
  faqs: Array<Faq>
  /** List of Language versions */
  history: Array<Version>
  /** The unique identifier */
  id: Scalars['ID']
  importantMessageses: Array<ImportantMessage>
  marketingStories: Array<MarketingStory>
  name: Scalars['String']
  /** The time the document was published. Null on documents in draft stage. */
  publishedAt?: Maybe<Scalars['DateTime']>
  /** User that last published this document */
  publishedBy?: Maybe<User>
  scheduledIn: Array<ScheduledOperation>
  /** System stage field */
  stage: Stage
  translation: Array<Translation>
  /** The time the document was updated */
  updatedAt: Scalars['DateTime']
  /** User that last updated this document */
  updatedBy?: Maybe<User>
}

export type LanguageAppMarketingImagesArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  locales?: InputMaybe<Array<Locale>>
  orderBy?: InputMaybe<AppMarketingImageOrderByInput>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<AppMarketingImageWhereInput>
}

export type LanguageCreatedByArgs = {
  locales?: InputMaybe<Array<Locale>>
}

export type LanguageDocumentInStagesArgs = {
  includeCurrent?: Scalars['Boolean']
  inheritLocale?: Scalars['Boolean']
  stages?: Array<Stage>
}

export type LanguageFaqsArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  locales?: InputMaybe<Array<Locale>>
  orderBy?: InputMaybe<FaqOrderByInput>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<FaqWhereInput>
}

export type LanguageHistoryArgs = {
  limit?: Scalars['Int']
  skip?: Scalars['Int']
  stageOverride?: InputMaybe<Stage>
}

export type LanguageImportantMessagesesArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  locales?: InputMaybe<Array<Locale>>
  orderBy?: InputMaybe<ImportantMessageOrderByInput>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<ImportantMessageWhereInput>
}

export type LanguageMarketingStoriesArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  locales?: InputMaybe<Array<Locale>>
  orderBy?: InputMaybe<MarketingStoryOrderByInput>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<MarketingStoryWhereInput>
}

export type LanguagePublishedByArgs = {
  locales?: InputMaybe<Array<Locale>>
}

export type LanguageScheduledInArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  locales?: InputMaybe<Array<Locale>>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<ScheduledOperationWhereInput>
}

export type LanguageTranslationArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  locales?: InputMaybe<Array<Locale>>
  orderBy?: InputMaybe<TranslationOrderByInput>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<TranslationWhereInput>
}

export type LanguageUpdatedByArgs = {
  locales?: InputMaybe<Array<Locale>>
}

export type LanguageConnectInput = {
  /** Allow to specify document position in list of connected documents, will default to appending at end of list */
  position?: InputMaybe<ConnectPositionInput>
  /** Document to connect */
  where: LanguageWhereUniqueInput
}

/** A connection to a list of items. */
export type LanguageConnection = {
  __typename?: 'LanguageConnection'
  aggregate: Aggregate
  /** A list of edges. */
  edges: Array<LanguageEdge>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
}

export type LanguageCreateInput = {
  appMarketingImages?: InputMaybe<AppMarketingImageCreateManyInlineInput>
  code: Scalars['String']
  createdAt?: InputMaybe<Scalars['DateTime']>
  faqs?: InputMaybe<FaqCreateManyInlineInput>
  importantMessageses?: InputMaybe<ImportantMessageCreateManyInlineInput>
  marketingStories?: InputMaybe<MarketingStoryCreateManyInlineInput>
  name: Scalars['String']
  translation?: InputMaybe<TranslationCreateManyInlineInput>
  updatedAt?: InputMaybe<Scalars['DateTime']>
}

export type LanguageCreateManyInlineInput = {
  /** Connect multiple existing Language documents */
  connect?: InputMaybe<Array<LanguageWhereUniqueInput>>
  /** Create and connect multiple existing Language documents */
  create?: InputMaybe<Array<LanguageCreateInput>>
}

export type LanguageCreateOneInlineInput = {
  /** Connect one existing Language document */
  connect?: InputMaybe<LanguageWhereUniqueInput>
  /** Create and connect one Language document */
  create?: InputMaybe<LanguageCreateInput>
}

/** An edge in a connection. */
export type LanguageEdge = {
  __typename?: 'LanguageEdge'
  /** A cursor for use in pagination. */
  cursor: Scalars['String']
  /** The item at the end of the edge. */
  node: Language
}

/** Identifies documents */
export type LanguageManyWhereInput = {
  /** Logical AND on all given filters. */
  AND?: InputMaybe<Array<LanguageWhereInput>>
  /** Logical NOT on all given filters combined by AND. */
  NOT?: InputMaybe<Array<LanguageWhereInput>>
  /** Logical OR on all given filters. */
  OR?: InputMaybe<Array<LanguageWhereInput>>
  /** Contains search across all appropriate fields. */
  _search?: InputMaybe<Scalars['String']>
  appMarketingImages_every?: InputMaybe<AppMarketingImageWhereInput>
  appMarketingImages_none?: InputMaybe<AppMarketingImageWhereInput>
  appMarketingImages_some?: InputMaybe<AppMarketingImageWhereInput>
  code?: InputMaybe<Scalars['String']>
  /** All values containing the given string. */
  code_contains?: InputMaybe<Scalars['String']>
  /** All values ending with the given string. */
  code_ends_with?: InputMaybe<Scalars['String']>
  /** All values that are contained in given list. */
  code_in?: InputMaybe<Array<Scalars['String']>>
  /** All values that are not equal to given value. */
  code_not?: InputMaybe<Scalars['String']>
  /** All values not containing the given string. */
  code_not_contains?: InputMaybe<Scalars['String']>
  /** All values not ending with the given string */
  code_not_ends_with?: InputMaybe<Scalars['String']>
  /** All values that are not contained in given list. */
  code_not_in?: InputMaybe<Array<Scalars['String']>>
  /** All values not starting with the given string. */
  code_not_starts_with?: InputMaybe<Scalars['String']>
  /** All values starting with the given string. */
  code_starts_with?: InputMaybe<Scalars['String']>
  createdAt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than the given value. */
  createdAt_gt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than or equal the given value. */
  createdAt_gte?: InputMaybe<Scalars['DateTime']>
  /** All values that are contained in given list. */
  createdAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  /** All values less than the given value. */
  createdAt_lt?: InputMaybe<Scalars['DateTime']>
  /** All values less than or equal the given value. */
  createdAt_lte?: InputMaybe<Scalars['DateTime']>
  /** All values that are not equal to given value. */
  createdAt_not?: InputMaybe<Scalars['DateTime']>
  /** All values that are not contained in given list. */
  createdAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  createdBy?: InputMaybe<UserWhereInput>
  faqs_every?: InputMaybe<FaqWhereInput>
  faqs_none?: InputMaybe<FaqWhereInput>
  faqs_some?: InputMaybe<FaqWhereInput>
  id?: InputMaybe<Scalars['ID']>
  /** All values containing the given string. */
  id_contains?: InputMaybe<Scalars['ID']>
  /** All values ending with the given string. */
  id_ends_with?: InputMaybe<Scalars['ID']>
  /** All values that are contained in given list. */
  id_in?: InputMaybe<Array<Scalars['ID']>>
  /** All values that are not equal to given value. */
  id_not?: InputMaybe<Scalars['ID']>
  /** All values not containing the given string. */
  id_not_contains?: InputMaybe<Scalars['ID']>
  /** All values not ending with the given string */
  id_not_ends_with?: InputMaybe<Scalars['ID']>
  /** All values that are not contained in given list. */
  id_not_in?: InputMaybe<Array<Scalars['ID']>>
  /** All values not starting with the given string. */
  id_not_starts_with?: InputMaybe<Scalars['ID']>
  /** All values starting with the given string. */
  id_starts_with?: InputMaybe<Scalars['ID']>
  importantMessageses_every?: InputMaybe<ImportantMessageWhereInput>
  importantMessageses_none?: InputMaybe<ImportantMessageWhereInput>
  importantMessageses_some?: InputMaybe<ImportantMessageWhereInput>
  marketingStories_every?: InputMaybe<MarketingStoryWhereInput>
  marketingStories_none?: InputMaybe<MarketingStoryWhereInput>
  marketingStories_some?: InputMaybe<MarketingStoryWhereInput>
  name?: InputMaybe<Scalars['String']>
  /** All values containing the given string. */
  name_contains?: InputMaybe<Scalars['String']>
  /** All values ending with the given string. */
  name_ends_with?: InputMaybe<Scalars['String']>
  /** All values that are contained in given list. */
  name_in?: InputMaybe<Array<Scalars['String']>>
  /** All values that are not equal to given value. */
  name_not?: InputMaybe<Scalars['String']>
  /** All values not containing the given string. */
  name_not_contains?: InputMaybe<Scalars['String']>
  /** All values not ending with the given string */
  name_not_ends_with?: InputMaybe<Scalars['String']>
  /** All values that are not contained in given list. */
  name_not_in?: InputMaybe<Array<Scalars['String']>>
  /** All values not starting with the given string. */
  name_not_starts_with?: InputMaybe<Scalars['String']>
  /** All values starting with the given string. */
  name_starts_with?: InputMaybe<Scalars['String']>
  publishedAt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than the given value. */
  publishedAt_gt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than or equal the given value. */
  publishedAt_gte?: InputMaybe<Scalars['DateTime']>
  /** All values that are contained in given list. */
  publishedAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  /** All values less than the given value. */
  publishedAt_lt?: InputMaybe<Scalars['DateTime']>
  /** All values less than or equal the given value. */
  publishedAt_lte?: InputMaybe<Scalars['DateTime']>
  /** All values that are not equal to given value. */
  publishedAt_not?: InputMaybe<Scalars['DateTime']>
  /** All values that are not contained in given list. */
  publishedAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  publishedBy?: InputMaybe<UserWhereInput>
  scheduledIn_every?: InputMaybe<ScheduledOperationWhereInput>
  scheduledIn_none?: InputMaybe<ScheduledOperationWhereInput>
  scheduledIn_some?: InputMaybe<ScheduledOperationWhereInput>
  translation_every?: InputMaybe<TranslationWhereInput>
  translation_none?: InputMaybe<TranslationWhereInput>
  translation_some?: InputMaybe<TranslationWhereInput>
  updatedAt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than the given value. */
  updatedAt_gt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than or equal the given value. */
  updatedAt_gte?: InputMaybe<Scalars['DateTime']>
  /** All values that are contained in given list. */
  updatedAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  /** All values less than the given value. */
  updatedAt_lt?: InputMaybe<Scalars['DateTime']>
  /** All values less than or equal the given value. */
  updatedAt_lte?: InputMaybe<Scalars['DateTime']>
  /** All values that are not equal to given value. */
  updatedAt_not?: InputMaybe<Scalars['DateTime']>
  /** All values that are not contained in given list. */
  updatedAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  updatedBy?: InputMaybe<UserWhereInput>
}

export enum LanguageOrderByInput {
  CodeAsc = 'code_ASC',
  CodeDesc = 'code_DESC',
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  NameAsc = 'name_ASC',
  NameDesc = 'name_DESC',
  PublishedAtAsc = 'publishedAt_ASC',
  PublishedAtDesc = 'publishedAt_DESC',
  UpdatedAtAsc = 'updatedAt_ASC',
  UpdatedAtDesc = 'updatedAt_DESC',
}

export type LanguageUpdateInput = {
  appMarketingImages?: InputMaybe<AppMarketingImageUpdateManyInlineInput>
  code?: InputMaybe<Scalars['String']>
  faqs?: InputMaybe<FaqUpdateManyInlineInput>
  importantMessageses?: InputMaybe<ImportantMessageUpdateManyInlineInput>
  marketingStories?: InputMaybe<MarketingStoryUpdateManyInlineInput>
  name?: InputMaybe<Scalars['String']>
  translation?: InputMaybe<TranslationUpdateManyInlineInput>
}

export type LanguageUpdateManyInlineInput = {
  /** Connect multiple existing Language documents */
  connect?: InputMaybe<Array<LanguageConnectInput>>
  /** Create and connect multiple Language documents */
  create?: InputMaybe<Array<LanguageCreateInput>>
  /** Delete multiple Language documents */
  delete?: InputMaybe<Array<LanguageWhereUniqueInput>>
  /** Disconnect multiple Language documents */
  disconnect?: InputMaybe<Array<LanguageWhereUniqueInput>>
  /** Override currently-connected documents with multiple existing Language documents */
  set?: InputMaybe<Array<LanguageWhereUniqueInput>>
  /** Update multiple Language documents */
  update?: InputMaybe<Array<LanguageUpdateWithNestedWhereUniqueInput>>
  /** Upsert multiple Language documents */
  upsert?: InputMaybe<Array<LanguageUpsertWithNestedWhereUniqueInput>>
}

export type LanguageUpdateManyInput = {
  /** No fields in updateMany data input */
  _?: InputMaybe<Scalars['String']>
}

export type LanguageUpdateManyWithNestedWhereInput = {
  /** Update many input */
  data: LanguageUpdateManyInput
  /** Document search */
  where: LanguageWhereInput
}

export type LanguageUpdateOneInlineInput = {
  /** Connect existing Language document */
  connect?: InputMaybe<LanguageWhereUniqueInput>
  /** Create and connect one Language document */
  create?: InputMaybe<LanguageCreateInput>
  /** Delete currently connected Language document */
  delete?: InputMaybe<Scalars['Boolean']>
  /** Disconnect currently connected Language document */
  disconnect?: InputMaybe<Scalars['Boolean']>
  /** Update single Language document */
  update?: InputMaybe<LanguageUpdateWithNestedWhereUniqueInput>
  /** Upsert single Language document */
  upsert?: InputMaybe<LanguageUpsertWithNestedWhereUniqueInput>
}

export type LanguageUpdateWithNestedWhereUniqueInput = {
  /** Document to update */
  data: LanguageUpdateInput
  /** Unique document search */
  where: LanguageWhereUniqueInput
}

export type LanguageUpsertInput = {
  /** Create document if it didn't exist */
  create: LanguageCreateInput
  /** Update document if it exists */
  update: LanguageUpdateInput
}

export type LanguageUpsertWithNestedWhereUniqueInput = {
  /** Upsert data */
  data: LanguageUpsertInput
  /** Unique document search */
  where: LanguageWhereUniqueInput
}

/** Identifies documents */
export type LanguageWhereInput = {
  /** Logical AND on all given filters. */
  AND?: InputMaybe<Array<LanguageWhereInput>>
  /** Logical NOT on all given filters combined by AND. */
  NOT?: InputMaybe<Array<LanguageWhereInput>>
  /** Logical OR on all given filters. */
  OR?: InputMaybe<Array<LanguageWhereInput>>
  /** Contains search across all appropriate fields. */
  _search?: InputMaybe<Scalars['String']>
  appMarketingImages_every?: InputMaybe<AppMarketingImageWhereInput>
  appMarketingImages_none?: InputMaybe<AppMarketingImageWhereInput>
  appMarketingImages_some?: InputMaybe<AppMarketingImageWhereInput>
  code?: InputMaybe<Scalars['String']>
  /** All values containing the given string. */
  code_contains?: InputMaybe<Scalars['String']>
  /** All values ending with the given string. */
  code_ends_with?: InputMaybe<Scalars['String']>
  /** All values that are contained in given list. */
  code_in?: InputMaybe<Array<Scalars['String']>>
  /** All values that are not equal to given value. */
  code_not?: InputMaybe<Scalars['String']>
  /** All values not containing the given string. */
  code_not_contains?: InputMaybe<Scalars['String']>
  /** All values not ending with the given string */
  code_not_ends_with?: InputMaybe<Scalars['String']>
  /** All values that are not contained in given list. */
  code_not_in?: InputMaybe<Array<Scalars['String']>>
  /** All values not starting with the given string. */
  code_not_starts_with?: InputMaybe<Scalars['String']>
  /** All values starting with the given string. */
  code_starts_with?: InputMaybe<Scalars['String']>
  createdAt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than the given value. */
  createdAt_gt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than or equal the given value. */
  createdAt_gte?: InputMaybe<Scalars['DateTime']>
  /** All values that are contained in given list. */
  createdAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  /** All values less than the given value. */
  createdAt_lt?: InputMaybe<Scalars['DateTime']>
  /** All values less than or equal the given value. */
  createdAt_lte?: InputMaybe<Scalars['DateTime']>
  /** All values that are not equal to given value. */
  createdAt_not?: InputMaybe<Scalars['DateTime']>
  /** All values that are not contained in given list. */
  createdAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  createdBy?: InputMaybe<UserWhereInput>
  faqs_every?: InputMaybe<FaqWhereInput>
  faqs_none?: InputMaybe<FaqWhereInput>
  faqs_some?: InputMaybe<FaqWhereInput>
  id?: InputMaybe<Scalars['ID']>
  /** All values containing the given string. */
  id_contains?: InputMaybe<Scalars['ID']>
  /** All values ending with the given string. */
  id_ends_with?: InputMaybe<Scalars['ID']>
  /** All values that are contained in given list. */
  id_in?: InputMaybe<Array<Scalars['ID']>>
  /** All values that are not equal to given value. */
  id_not?: InputMaybe<Scalars['ID']>
  /** All values not containing the given string. */
  id_not_contains?: InputMaybe<Scalars['ID']>
  /** All values not ending with the given string */
  id_not_ends_with?: InputMaybe<Scalars['ID']>
  /** All values that are not contained in given list. */
  id_not_in?: InputMaybe<Array<Scalars['ID']>>
  /** All values not starting with the given string. */
  id_not_starts_with?: InputMaybe<Scalars['ID']>
  /** All values starting with the given string. */
  id_starts_with?: InputMaybe<Scalars['ID']>
  importantMessageses_every?: InputMaybe<ImportantMessageWhereInput>
  importantMessageses_none?: InputMaybe<ImportantMessageWhereInput>
  importantMessageses_some?: InputMaybe<ImportantMessageWhereInput>
  marketingStories_every?: InputMaybe<MarketingStoryWhereInput>
  marketingStories_none?: InputMaybe<MarketingStoryWhereInput>
  marketingStories_some?: InputMaybe<MarketingStoryWhereInput>
  name?: InputMaybe<Scalars['String']>
  /** All values containing the given string. */
  name_contains?: InputMaybe<Scalars['String']>
  /** All values ending with the given string. */
  name_ends_with?: InputMaybe<Scalars['String']>
  /** All values that are contained in given list. */
  name_in?: InputMaybe<Array<Scalars['String']>>
  /** All values that are not equal to given value. */
  name_not?: InputMaybe<Scalars['String']>
  /** All values not containing the given string. */
  name_not_contains?: InputMaybe<Scalars['String']>
  /** All values not ending with the given string */
  name_not_ends_with?: InputMaybe<Scalars['String']>
  /** All values that are not contained in given list. */
  name_not_in?: InputMaybe<Array<Scalars['String']>>
  /** All values not starting with the given string. */
  name_not_starts_with?: InputMaybe<Scalars['String']>
  /** All values starting with the given string. */
  name_starts_with?: InputMaybe<Scalars['String']>
  publishedAt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than the given value. */
  publishedAt_gt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than or equal the given value. */
  publishedAt_gte?: InputMaybe<Scalars['DateTime']>
  /** All values that are contained in given list. */
  publishedAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  /** All values less than the given value. */
  publishedAt_lt?: InputMaybe<Scalars['DateTime']>
  /** All values less than or equal the given value. */
  publishedAt_lte?: InputMaybe<Scalars['DateTime']>
  /** All values that are not equal to given value. */
  publishedAt_not?: InputMaybe<Scalars['DateTime']>
  /** All values that are not contained in given list. */
  publishedAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  publishedBy?: InputMaybe<UserWhereInput>
  scheduledIn_every?: InputMaybe<ScheduledOperationWhereInput>
  scheduledIn_none?: InputMaybe<ScheduledOperationWhereInput>
  scheduledIn_some?: InputMaybe<ScheduledOperationWhereInput>
  translation_every?: InputMaybe<TranslationWhereInput>
  translation_none?: InputMaybe<TranslationWhereInput>
  translation_some?: InputMaybe<TranslationWhereInput>
  updatedAt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than the given value. */
  updatedAt_gt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than or equal the given value. */
  updatedAt_gte?: InputMaybe<Scalars['DateTime']>
  /** All values that are contained in given list. */
  updatedAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  /** All values less than the given value. */
  updatedAt_lt?: InputMaybe<Scalars['DateTime']>
  /** All values less than or equal the given value. */
  updatedAt_lte?: InputMaybe<Scalars['DateTime']>
  /** All values that are not equal to given value. */
  updatedAt_not?: InputMaybe<Scalars['DateTime']>
  /** All values that are not contained in given list. */
  updatedAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  updatedBy?: InputMaybe<UserWhereInput>
}

/** References Language record uniquely */
export type LanguageWhereUniqueInput = {
  code?: InputMaybe<Scalars['String']>
  id?: InputMaybe<Scalars['ID']>
  name?: InputMaybe<Scalars['String']>
}

/** An enum representing explicitly endorsed Locales supported by our system. */
export enum Locale {
  DaDk = 'da_DK',
  EnDk = 'en_DK',
  EnNo = 'en_NO',
  EnSe = 'en_SE',
  NbNo = 'nb_NO',
  SvSe = 'sv_SE',
}

/** Representing a geolocation point with latitude and longitude */
export type Location = {
  __typename?: 'Location'
  distance: Scalars['Float']
  latitude: Scalars['Float']
  longitude: Scalars['Float']
}

/** Representing a geolocation point with latitude and longitude */
export type LocationDistanceArgs = {
  from: LocationInput
}

/** Input for a geolocation point with latitude and longitude */
export type LocationInput = {
  latitude: Scalars['Float']
  longitude: Scalars['Float']
}

export type LoggingInput = {
  payload: Scalars['JSONObject']
  severity: LoggingSeverity
  source: LoggingSource
  timestamp: Scalars['TimeStamp']
}

export enum LoggingSeverity {
  Alert = 'ALERT',
  Critical = 'CRITICAL',
  Debug = 'DEBUG',
  Default = 'DEFAULT',
  Emergency = 'EMERGENCY',
  Error = 'ERROR',
  Info = 'INFO',
  Notice = 'NOTICE',
  Warning = 'WARNING',
}

export enum LoggingSource {
  Android = 'ANDROID',
  Ios = 'IOS',
}

export enum Market {
  Denmark = 'DENMARK',
  Norway = 'NORWAY',
  Sweden = 'SWEDEN',
}

export type MarketingStory = Node & {
  __typename?: 'MarketingStory'
  asset: Asset
  backgroundColor: HedvigColor
  /** The time the document was created */
  createdAt: Scalars['DateTime']
  /** User that created this document */
  createdBy?: Maybe<User>
  /** Get the document in other stages */
  documentInStages: Array<MarketingStory>
  duration?: Maybe<Scalars['Float']>
  environment?: Maybe<Environment>
  /** List of MarketingStory versions */
  history: Array<Version>
  /** The unique identifier */
  id: Scalars['ID']
  importance?: Maybe<Scalars['Int']>
  language?: Maybe<Language>
  /** The time the document was published. Null on documents in draft stage. */
  publishedAt?: Maybe<Scalars['DateTime']>
  /** User that last published this document */
  publishedBy?: Maybe<User>
  scheduledIn: Array<ScheduledOperation>
  /** System stage field */
  stage: Stage
  /** The time the document was updated */
  updatedAt: Scalars['DateTime']
  /** User that last updated this document */
  updatedBy?: Maybe<User>
}

export type MarketingStoryAssetArgs = {
  locales?: InputMaybe<Array<Locale>>
}

export type MarketingStoryCreatedByArgs = {
  locales?: InputMaybe<Array<Locale>>
}

export type MarketingStoryDocumentInStagesArgs = {
  includeCurrent?: Scalars['Boolean']
  inheritLocale?: Scalars['Boolean']
  stages?: Array<Stage>
}

export type MarketingStoryHistoryArgs = {
  limit?: Scalars['Int']
  skip?: Scalars['Int']
  stageOverride?: InputMaybe<Stage>
}

export type MarketingStoryLanguageArgs = {
  locales?: InputMaybe<Array<Locale>>
}

export type MarketingStoryPublishedByArgs = {
  locales?: InputMaybe<Array<Locale>>
}

export type MarketingStoryScheduledInArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  locales?: InputMaybe<Array<Locale>>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<ScheduledOperationWhereInput>
}

export type MarketingStoryUpdatedByArgs = {
  locales?: InputMaybe<Array<Locale>>
}

export type MarketingStoryConnectInput = {
  /** Allow to specify document position in list of connected documents, will default to appending at end of list */
  position?: InputMaybe<ConnectPositionInput>
  /** Document to connect */
  where: MarketingStoryWhereUniqueInput
}

/** A connection to a list of items. */
export type MarketingStoryConnection = {
  __typename?: 'MarketingStoryConnection'
  aggregate: Aggregate
  /** A list of edges. */
  edges: Array<MarketingStoryEdge>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
}

export type MarketingStoryCreateInput = {
  asset: AssetCreateOneInlineInput
  backgroundColor: HedvigColor
  createdAt?: InputMaybe<Scalars['DateTime']>
  duration?: InputMaybe<Scalars['Float']>
  environment?: InputMaybe<Environment>
  importance?: InputMaybe<Scalars['Int']>
  language?: InputMaybe<LanguageCreateOneInlineInput>
  updatedAt?: InputMaybe<Scalars['DateTime']>
}

export type MarketingStoryCreateManyInlineInput = {
  /** Connect multiple existing MarketingStory documents */
  connect?: InputMaybe<Array<MarketingStoryWhereUniqueInput>>
  /** Create and connect multiple existing MarketingStory documents */
  create?: InputMaybe<Array<MarketingStoryCreateInput>>
}

export type MarketingStoryCreateOneInlineInput = {
  /** Connect one existing MarketingStory document */
  connect?: InputMaybe<MarketingStoryWhereUniqueInput>
  /** Create and connect one MarketingStory document */
  create?: InputMaybe<MarketingStoryCreateInput>
}

/** An edge in a connection. */
export type MarketingStoryEdge = {
  __typename?: 'MarketingStoryEdge'
  /** A cursor for use in pagination. */
  cursor: Scalars['String']
  /** The item at the end of the edge. */
  node: MarketingStory
}

/** Identifies documents */
export type MarketingStoryManyWhereInput = {
  /** Logical AND on all given filters. */
  AND?: InputMaybe<Array<MarketingStoryWhereInput>>
  /** Logical NOT on all given filters combined by AND. */
  NOT?: InputMaybe<Array<MarketingStoryWhereInput>>
  /** Logical OR on all given filters. */
  OR?: InputMaybe<Array<MarketingStoryWhereInput>>
  /** Contains search across all appropriate fields. */
  _search?: InputMaybe<Scalars['String']>
  asset?: InputMaybe<AssetWhereInput>
  backgroundColor?: InputMaybe<HedvigColor>
  /** All values that are contained in given list. */
  backgroundColor_in?: InputMaybe<Array<HedvigColor>>
  /** All values that are not equal to given value. */
  backgroundColor_not?: InputMaybe<HedvigColor>
  /** All values that are not contained in given list. */
  backgroundColor_not_in?: InputMaybe<Array<HedvigColor>>
  createdAt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than the given value. */
  createdAt_gt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than or equal the given value. */
  createdAt_gte?: InputMaybe<Scalars['DateTime']>
  /** All values that are contained in given list. */
  createdAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  /** All values less than the given value. */
  createdAt_lt?: InputMaybe<Scalars['DateTime']>
  /** All values less than or equal the given value. */
  createdAt_lte?: InputMaybe<Scalars['DateTime']>
  /** All values that are not equal to given value. */
  createdAt_not?: InputMaybe<Scalars['DateTime']>
  /** All values that are not contained in given list. */
  createdAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  createdBy?: InputMaybe<UserWhereInput>
  duration?: InputMaybe<Scalars['Float']>
  /** All values greater than the given value. */
  duration_gt?: InputMaybe<Scalars['Float']>
  /** All values greater than or equal the given value. */
  duration_gte?: InputMaybe<Scalars['Float']>
  /** All values that are contained in given list. */
  duration_in?: InputMaybe<Array<Scalars['Float']>>
  /** All values less than the given value. */
  duration_lt?: InputMaybe<Scalars['Float']>
  /** All values less than or equal the given value. */
  duration_lte?: InputMaybe<Scalars['Float']>
  /** All values that are not equal to given value. */
  duration_not?: InputMaybe<Scalars['Float']>
  /** All values that are not contained in given list. */
  duration_not_in?: InputMaybe<Array<Scalars['Float']>>
  environment?: InputMaybe<Environment>
  /** All values that are contained in given list. */
  environment_in?: InputMaybe<Array<Environment>>
  /** All values that are not equal to given value. */
  environment_not?: InputMaybe<Environment>
  /** All values that are not contained in given list. */
  environment_not_in?: InputMaybe<Array<Environment>>
  id?: InputMaybe<Scalars['ID']>
  /** All values containing the given string. */
  id_contains?: InputMaybe<Scalars['ID']>
  /** All values ending with the given string. */
  id_ends_with?: InputMaybe<Scalars['ID']>
  /** All values that are contained in given list. */
  id_in?: InputMaybe<Array<Scalars['ID']>>
  /** All values that are not equal to given value. */
  id_not?: InputMaybe<Scalars['ID']>
  /** All values not containing the given string. */
  id_not_contains?: InputMaybe<Scalars['ID']>
  /** All values not ending with the given string */
  id_not_ends_with?: InputMaybe<Scalars['ID']>
  /** All values that are not contained in given list. */
  id_not_in?: InputMaybe<Array<Scalars['ID']>>
  /** All values not starting with the given string. */
  id_not_starts_with?: InputMaybe<Scalars['ID']>
  /** All values starting with the given string. */
  id_starts_with?: InputMaybe<Scalars['ID']>
  importance?: InputMaybe<Scalars['Int']>
  /** All values greater than the given value. */
  importance_gt?: InputMaybe<Scalars['Int']>
  /** All values greater than or equal the given value. */
  importance_gte?: InputMaybe<Scalars['Int']>
  /** All values that are contained in given list. */
  importance_in?: InputMaybe<Array<Scalars['Int']>>
  /** All values less than the given value. */
  importance_lt?: InputMaybe<Scalars['Int']>
  /** All values less than or equal the given value. */
  importance_lte?: InputMaybe<Scalars['Int']>
  /** All values that are not equal to given value. */
  importance_not?: InputMaybe<Scalars['Int']>
  /** All values that are not contained in given list. */
  importance_not_in?: InputMaybe<Array<Scalars['Int']>>
  language?: InputMaybe<LanguageWhereInput>
  publishedAt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than the given value. */
  publishedAt_gt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than or equal the given value. */
  publishedAt_gte?: InputMaybe<Scalars['DateTime']>
  /** All values that are contained in given list. */
  publishedAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  /** All values less than the given value. */
  publishedAt_lt?: InputMaybe<Scalars['DateTime']>
  /** All values less than or equal the given value. */
  publishedAt_lte?: InputMaybe<Scalars['DateTime']>
  /** All values that are not equal to given value. */
  publishedAt_not?: InputMaybe<Scalars['DateTime']>
  /** All values that are not contained in given list. */
  publishedAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  publishedBy?: InputMaybe<UserWhereInput>
  scheduledIn_every?: InputMaybe<ScheduledOperationWhereInput>
  scheduledIn_none?: InputMaybe<ScheduledOperationWhereInput>
  scheduledIn_some?: InputMaybe<ScheduledOperationWhereInput>
  updatedAt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than the given value. */
  updatedAt_gt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than or equal the given value. */
  updatedAt_gte?: InputMaybe<Scalars['DateTime']>
  /** All values that are contained in given list. */
  updatedAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  /** All values less than the given value. */
  updatedAt_lt?: InputMaybe<Scalars['DateTime']>
  /** All values less than or equal the given value. */
  updatedAt_lte?: InputMaybe<Scalars['DateTime']>
  /** All values that are not equal to given value. */
  updatedAt_not?: InputMaybe<Scalars['DateTime']>
  /** All values that are not contained in given list. */
  updatedAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  updatedBy?: InputMaybe<UserWhereInput>
}

export enum MarketingStoryOrderByInput {
  BackgroundColorAsc = 'backgroundColor_ASC',
  BackgroundColorDesc = 'backgroundColor_DESC',
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC',
  DurationAsc = 'duration_ASC',
  DurationDesc = 'duration_DESC',
  EnvironmentAsc = 'environment_ASC',
  EnvironmentDesc = 'environment_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  ImportanceAsc = 'importance_ASC',
  ImportanceDesc = 'importance_DESC',
  PublishedAtAsc = 'publishedAt_ASC',
  PublishedAtDesc = 'publishedAt_DESC',
  UpdatedAtAsc = 'updatedAt_ASC',
  UpdatedAtDesc = 'updatedAt_DESC',
}

export type MarketingStoryUpdateInput = {
  asset?: InputMaybe<AssetUpdateOneInlineInput>
  backgroundColor?: InputMaybe<HedvigColor>
  duration?: InputMaybe<Scalars['Float']>
  environment?: InputMaybe<Environment>
  importance?: InputMaybe<Scalars['Int']>
  language?: InputMaybe<LanguageUpdateOneInlineInput>
}

export type MarketingStoryUpdateManyInlineInput = {
  /** Connect multiple existing MarketingStory documents */
  connect?: InputMaybe<Array<MarketingStoryConnectInput>>
  /** Create and connect multiple MarketingStory documents */
  create?: InputMaybe<Array<MarketingStoryCreateInput>>
  /** Delete multiple MarketingStory documents */
  delete?: InputMaybe<Array<MarketingStoryWhereUniqueInput>>
  /** Disconnect multiple MarketingStory documents */
  disconnect?: InputMaybe<Array<MarketingStoryWhereUniqueInput>>
  /** Override currently-connected documents with multiple existing MarketingStory documents */
  set?: InputMaybe<Array<MarketingStoryWhereUniqueInput>>
  /** Update multiple MarketingStory documents */
  update?: InputMaybe<Array<MarketingStoryUpdateWithNestedWhereUniqueInput>>
  /** Upsert multiple MarketingStory documents */
  upsert?: InputMaybe<Array<MarketingStoryUpsertWithNestedWhereUniqueInput>>
}

export type MarketingStoryUpdateManyInput = {
  backgroundColor?: InputMaybe<HedvigColor>
  duration?: InputMaybe<Scalars['Float']>
  environment?: InputMaybe<Environment>
  importance?: InputMaybe<Scalars['Int']>
}

export type MarketingStoryUpdateManyWithNestedWhereInput = {
  /** Update many input */
  data: MarketingStoryUpdateManyInput
  /** Document search */
  where: MarketingStoryWhereInput
}

export type MarketingStoryUpdateOneInlineInput = {
  /** Connect existing MarketingStory document */
  connect?: InputMaybe<MarketingStoryWhereUniqueInput>
  /** Create and connect one MarketingStory document */
  create?: InputMaybe<MarketingStoryCreateInput>
  /** Delete currently connected MarketingStory document */
  delete?: InputMaybe<Scalars['Boolean']>
  /** Disconnect currently connected MarketingStory document */
  disconnect?: InputMaybe<Scalars['Boolean']>
  /** Update single MarketingStory document */
  update?: InputMaybe<MarketingStoryUpdateWithNestedWhereUniqueInput>
  /** Upsert single MarketingStory document */
  upsert?: InputMaybe<MarketingStoryUpsertWithNestedWhereUniqueInput>
}

export type MarketingStoryUpdateWithNestedWhereUniqueInput = {
  /** Document to update */
  data: MarketingStoryUpdateInput
  /** Unique document search */
  where: MarketingStoryWhereUniqueInput
}

export type MarketingStoryUpsertInput = {
  /** Create document if it didn't exist */
  create: MarketingStoryCreateInput
  /** Update document if it exists */
  update: MarketingStoryUpdateInput
}

export type MarketingStoryUpsertWithNestedWhereUniqueInput = {
  /** Upsert data */
  data: MarketingStoryUpsertInput
  /** Unique document search */
  where: MarketingStoryWhereUniqueInput
}

/** Identifies documents */
export type MarketingStoryWhereInput = {
  /** Logical AND on all given filters. */
  AND?: InputMaybe<Array<MarketingStoryWhereInput>>
  /** Logical NOT on all given filters combined by AND. */
  NOT?: InputMaybe<Array<MarketingStoryWhereInput>>
  /** Logical OR on all given filters. */
  OR?: InputMaybe<Array<MarketingStoryWhereInput>>
  /** Contains search across all appropriate fields. */
  _search?: InputMaybe<Scalars['String']>
  asset?: InputMaybe<AssetWhereInput>
  backgroundColor?: InputMaybe<HedvigColor>
  /** All values that are contained in given list. */
  backgroundColor_in?: InputMaybe<Array<HedvigColor>>
  /** All values that are not equal to given value. */
  backgroundColor_not?: InputMaybe<HedvigColor>
  /** All values that are not contained in given list. */
  backgroundColor_not_in?: InputMaybe<Array<HedvigColor>>
  createdAt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than the given value. */
  createdAt_gt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than or equal the given value. */
  createdAt_gte?: InputMaybe<Scalars['DateTime']>
  /** All values that are contained in given list. */
  createdAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  /** All values less than the given value. */
  createdAt_lt?: InputMaybe<Scalars['DateTime']>
  /** All values less than or equal the given value. */
  createdAt_lte?: InputMaybe<Scalars['DateTime']>
  /** All values that are not equal to given value. */
  createdAt_not?: InputMaybe<Scalars['DateTime']>
  /** All values that are not contained in given list. */
  createdAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  createdBy?: InputMaybe<UserWhereInput>
  duration?: InputMaybe<Scalars['Float']>
  /** All values greater than the given value. */
  duration_gt?: InputMaybe<Scalars['Float']>
  /** All values greater than or equal the given value. */
  duration_gte?: InputMaybe<Scalars['Float']>
  /** All values that are contained in given list. */
  duration_in?: InputMaybe<Array<Scalars['Float']>>
  /** All values less than the given value. */
  duration_lt?: InputMaybe<Scalars['Float']>
  /** All values less than or equal the given value. */
  duration_lte?: InputMaybe<Scalars['Float']>
  /** All values that are not equal to given value. */
  duration_not?: InputMaybe<Scalars['Float']>
  /** All values that are not contained in given list. */
  duration_not_in?: InputMaybe<Array<Scalars['Float']>>
  environment?: InputMaybe<Environment>
  /** All values that are contained in given list. */
  environment_in?: InputMaybe<Array<Environment>>
  /** All values that are not equal to given value. */
  environment_not?: InputMaybe<Environment>
  /** All values that are not contained in given list. */
  environment_not_in?: InputMaybe<Array<Environment>>
  id?: InputMaybe<Scalars['ID']>
  /** All values containing the given string. */
  id_contains?: InputMaybe<Scalars['ID']>
  /** All values ending with the given string. */
  id_ends_with?: InputMaybe<Scalars['ID']>
  /** All values that are contained in given list. */
  id_in?: InputMaybe<Array<Scalars['ID']>>
  /** All values that are not equal to given value. */
  id_not?: InputMaybe<Scalars['ID']>
  /** All values not containing the given string. */
  id_not_contains?: InputMaybe<Scalars['ID']>
  /** All values not ending with the given string */
  id_not_ends_with?: InputMaybe<Scalars['ID']>
  /** All values that are not contained in given list. */
  id_not_in?: InputMaybe<Array<Scalars['ID']>>
  /** All values not starting with the given string. */
  id_not_starts_with?: InputMaybe<Scalars['ID']>
  /** All values starting with the given string. */
  id_starts_with?: InputMaybe<Scalars['ID']>
  importance?: InputMaybe<Scalars['Int']>
  /** All values greater than the given value. */
  importance_gt?: InputMaybe<Scalars['Int']>
  /** All values greater than or equal the given value. */
  importance_gte?: InputMaybe<Scalars['Int']>
  /** All values that are contained in given list. */
  importance_in?: InputMaybe<Array<Scalars['Int']>>
  /** All values less than the given value. */
  importance_lt?: InputMaybe<Scalars['Int']>
  /** All values less than or equal the given value. */
  importance_lte?: InputMaybe<Scalars['Int']>
  /** All values that are not equal to given value. */
  importance_not?: InputMaybe<Scalars['Int']>
  /** All values that are not contained in given list. */
  importance_not_in?: InputMaybe<Array<Scalars['Int']>>
  language?: InputMaybe<LanguageWhereInput>
  publishedAt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than the given value. */
  publishedAt_gt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than or equal the given value. */
  publishedAt_gte?: InputMaybe<Scalars['DateTime']>
  /** All values that are contained in given list. */
  publishedAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  /** All values less than the given value. */
  publishedAt_lt?: InputMaybe<Scalars['DateTime']>
  /** All values less than or equal the given value. */
  publishedAt_lte?: InputMaybe<Scalars['DateTime']>
  /** All values that are not equal to given value. */
  publishedAt_not?: InputMaybe<Scalars['DateTime']>
  /** All values that are not contained in given list. */
  publishedAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  publishedBy?: InputMaybe<UserWhereInput>
  scheduledIn_every?: InputMaybe<ScheduledOperationWhereInput>
  scheduledIn_none?: InputMaybe<ScheduledOperationWhereInput>
  scheduledIn_some?: InputMaybe<ScheduledOperationWhereInput>
  updatedAt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than the given value. */
  updatedAt_gt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than or equal the given value. */
  updatedAt_gte?: InputMaybe<Scalars['DateTime']>
  /** All values that are contained in given list. */
  updatedAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  /** All values less than the given value. */
  updatedAt_lt?: InputMaybe<Scalars['DateTime']>
  /** All values less than or equal the given value. */
  updatedAt_lte?: InputMaybe<Scalars['DateTime']>
  /** All values that are not equal to given value. */
  updatedAt_not?: InputMaybe<Scalars['DateTime']>
  /** All values that are not contained in given list. */
  updatedAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  updatedBy?: InputMaybe<UserWhereInput>
}

/** References MarketingStory record uniquely */
export type MarketingStoryWhereUniqueInput = {
  id?: InputMaybe<Scalars['ID']>
}

export type Member = {
  __typename?: 'Member'
  acceptLanguage?: Maybe<Scalars['String']>
  age?: Maybe<Scalars['Int']>
  email?: Maybe<Scalars['String']>
  features: Array<Feature>
  firstName?: Maybe<Scalars['String']>
  id?: Maybe<Scalars['ID']>
  lastName?: Maybe<Scalars['String']>
  phoneNumber?: Maybe<Scalars['String']>
}

export type MemberIsNotEligibleForCampaign = {
  __typename?: 'MemberIsNotEligibleForCampaign'
  code: Scalars['String']
}

export type Message = {
  __typename?: 'Message'
  body: MessageBody
  globalId: Scalars['ID']
  header: MessageHeader
  id: Scalars['ID']
}

export type MessageBody =
  | MessageBodyAudio
  | MessageBodyBankIdCollect
  | MessageBodyFile
  | MessageBodyMultipleSelect
  | MessageBodyNumber
  | MessageBodyParagraph
  | MessageBodySingleSelect
  | MessageBodyText
  | MessageBodyUndefined

export type MessageBodyAudio = MessageBodyCore & {
  __typename?: 'MessageBodyAudio'
  id: Scalars['ID']
  text: Scalars['String']
  type: Scalars['String']
  url?: Maybe<Scalars['String']>
}

export type MessageBodyBankIdCollect = MessageBodyCore & {
  __typename?: 'MessageBodyBankIdCollect'
  id: Scalars['ID']
  referenceId?: Maybe<Scalars['String']>
  text: Scalars['String']
  type: Scalars['String']
}

export type MessageBodyChoices =
  | MessageBodyChoicesLink
  | MessageBodyChoicesSelection
  | MessageBodyChoicesUndefined

export type MessageBodyChoicesCore = {
  selected: Scalars['Boolean']
  text: Scalars['String']
  type: Scalars['String']
  value: Scalars['String']
}

export type MessageBodyChoicesLink = MessageBodyChoicesCore & {
  __typename?: 'MessageBodyChoicesLink'
  appUrl?: Maybe<Scalars['String']>
  selected: Scalars['Boolean']
  text: Scalars['String']
  type: Scalars['String']
  value: Scalars['String']
  view?: Maybe<MessageBodyChoicesLinkView>
  webUrl?: Maybe<Scalars['String']>
}

export enum MessageBodyChoicesLinkView {
  Dashboard = 'DASHBOARD',
  Offer = 'OFFER',
}

export type MessageBodyChoicesSelection = MessageBodyChoicesCore & {
  __typename?: 'MessageBodyChoicesSelection'
  clearable?: Maybe<Scalars['Boolean']>
  selected: Scalars['Boolean']
  text: Scalars['String']
  type: Scalars['String']
  value: Scalars['String']
}

export type MessageBodyChoicesUndefined = MessageBodyChoicesCore & {
  __typename?: 'MessageBodyChoicesUndefined'
  selected: Scalars['Boolean']
  text: Scalars['String']
  type: Scalars['String']
  value: Scalars['String']
}

export type MessageBodyCore = {
  id: Scalars['ID']
  text: Scalars['String']
  type: Scalars['String']
}

export type MessageBodyFile = MessageBodyCore & {
  __typename?: 'MessageBodyFile'
  file: File
  id: Scalars['ID']
  key?: Maybe<Scalars['String']>
  mimeType?: Maybe<Scalars['String']>
  text: Scalars['String']
  type: Scalars['String']
}

export type MessageBodyMultipleSelect = MessageBodyCore & {
  __typename?: 'MessageBodyMultipleSelect'
  choices?: Maybe<Array<Maybe<MessageBodyChoices>>>
  id: Scalars['ID']
  text: Scalars['String']
  type: Scalars['String']
}

export type MessageBodyNumber = MessageBodyCore & {
  __typename?: 'MessageBodyNumber'
  id: Scalars['ID']
  keyboard?: Maybe<KeyboardType>
  placeholder?: Maybe<Scalars['String']>
  text: Scalars['String']
  textContentType?: Maybe<TextContentType>
  type: Scalars['String']
}

export type MessageBodyParagraph = MessageBodyCore & {
  __typename?: 'MessageBodyParagraph'
  id: Scalars['ID']
  text: Scalars['String']
  type: Scalars['String']
}

export type MessageBodySingleSelect = MessageBodyCore & {
  __typename?: 'MessageBodySingleSelect'
  choices?: Maybe<Array<Maybe<MessageBodyChoices>>>
  id: Scalars['ID']
  text: Scalars['String']
  type: Scalars['String']
}

export type MessageBodyText = MessageBodyCore & {
  __typename?: 'MessageBodyText'
  id: Scalars['ID']
  keyboard?: Maybe<KeyboardType>
  placeholder?: Maybe<Scalars['String']>
  text: Scalars['String']
  textContentType?: Maybe<TextContentType>
  type: Scalars['String']
}

export type MessageBodyUndefined = MessageBodyCore & {
  __typename?: 'MessageBodyUndefined'
  id: Scalars['ID']
  text: Scalars['String']
  type: Scalars['String']
}

export type MessageHeader = {
  __typename?: 'MessageHeader'
  editAllowed: Scalars['Boolean']
  fromMyself: Scalars['Boolean']
  loadingIndicator?: Maybe<Scalars['String']>
  markedAsRead: Scalars['Boolean']
  messageId: Scalars['ID']
  pollingInterval: Scalars['Int']
  richTextChatCompatible: Scalars['Boolean']
  shouldRequestPushNotifications: Scalars['Boolean']
  statusMessage?: Maybe<Scalars['String']>
  timeStamp: Scalars['String']
}

export type MonetaryAmountInput = {
  amount: Scalars['String']
  currency: Scalars['String']
}

export type MonetaryAmountV2 = {
  __typename?: 'MonetaryAmountV2'
  amount: Scalars['String']
  currency: Scalars['String']
}

export type MonetaryAmountV2Input = {
  amount: Scalars['String']
  currency: Scalars['String']
}

export type MonthlyCostDeduction = {
  __typename?: 'MonthlyCostDeduction'
  amount?: Maybe<MonetaryAmountV2>
}

export type Mutation = {
  __typename?: 'Mutation'
  _?: Maybe<Scalars['Boolean']>
  addPhotoToKeyGearItem: KeyGearItem
  addReceiptToKeyGearItem: KeyGearItem
  approveQuotes?: Maybe<Scalars['Boolean']>
  /** @deprecated Use `swedishBankIdAuth`. */
  bankIdAuth: BankIdAuthResponse
  cancelDirectDebitRequest: CancelDirectDebitStatus
  /** Create all the quotes needed in relation to a change of address, based on the current state of the member's insurance. */
  createAddressChangeQuotes: AddressChangeQuoteResult
  createClaim: Scalars['ID']
  /** Create all the quotes needed as a result of one of more Cross-Sells */
  createCrossSellQuotes: CrossSellQuotesResult
  createKeyGearItem: KeyGearItem
  createQuote: CreateQuoteResult
  createSession: Scalars['String']
  createSessionV2?: Maybe<SessionInformation>
  danishBankIdAuth: DanishBankIdAuthResponse
  /**
   * """
   * When we've deleted an item, we mark it as deleted and should probably redact all information
   * except for the physicalReferenceHash.
   * """
   */
  deleteKeyGearItem: KeyGearItem
  deletePhotoFromKeyGearItem: KeyGearItem
  deleteReceiptFromKeyGearItem: KeyGearItem
  editLastResponse: Scalars['Boolean']
  editQuote: CreateQuoteResult
  emailSign?: Maybe<Scalars['Boolean']>
  exchangeToken: ExchangeTokenResponse
  externalInsuranceProvider?: Maybe<ExternalInsuranceProviderMutation>
  /** Initiate widget, widget should send requestId, locale, partner id */
  initWidget: PartnerInitWidgetResult
  log?: Maybe<Scalars['Boolean']>
  /** Creates a login attempt which sends an OTP to the provided credential */
  login_createOtpAttempt: Scalars['ID']
  /** Resends the OTP to the provided credential */
  login_resendOtp: Scalars['ID']
  /** Verifies an ongoing login attempt, returning an access token on success */
  login_verifyOtpAttempt: VerifyOtpLoginAttemptResult
  logout: Scalars['Boolean']
  markMessageAsRead: Message
  norwegianBankIdAuth: NorwegianBankIdAuthResponse
  offerClosed: Scalars['Boolean']
  /** Create a new quote cart, used to tie the onboarding journey together. */
  onboardingQuoteCart_create: CreateQuoteCartResult
  /**
   * Initiates a tokenization request to Adyen. This can either succeed/fail immediately, in which case
   * ConnectPaymentFinished is returned, or require additional actions, such as 3DS authentication, from the client.
   */
  paymentConnection_connectPayment: ConnectPaymentResult
  /** Used by the Adyen UI components inside the 3DS authentication flow. */
  paymentConnection_submitAdditionalPaymentDetails: ConnectPaymentResult
  /**
   * Should be used by the web client when the user is redirected back from the 3DS flow. The md and pares values can
   * be retrieved from the Adyen callback.
   */
  paymentConnection_submitAdyenRedirection: ConnectPaymentFinished
  /**
   * Add a campaign by its code to this cart. This campaign won't be "redeemed", but rather
   * left in a pending state on the onboarding until signing occurs and a member is created.
   *
   * Returns an error if there was a problem with redeeming it, or null upon success.
   */
  quoteCart_addCampaign: AddCampaignResult
  /** Add a payment token id to the quote cart. */
  quoteCart_addPaymentToken: AddPaymentTokenResult
  /**
   * Once an cart is "signed", it can be finalized/consumed by this method, which will produce
   * an access token. This access token will serve as the means of authorization towards the member that was
   * created as part of the onboarding.
   *
   * This is needed at this stage because the "connecting payments" stage will happen with an actual signed member.
   */
  quoteCart_createAccessToken: CreateQuoteCartAccessTokenResult
  /** Create a quote and add it to the given cart. */
  quoteCart_createQuoteBundle: CreateQuoteBundleResult
  /** Create a Swedish quote bundle based on SSN. */
  quoteCart_createSwedishBundle: CreateQuoteBundleResult
  /** Edit the cart. Will only update the fields that are present in the payload. */
  quoteCart_editQuote: EditQuoteResult
  /** Initiate widget, widget should send requestId (Avy) and partner name */
  quoteCart_initWidget: CreateQuoteCartResult
  /** Remove the existing campaign. */
  quoteCart_removeCampaign: RemoveCampaignResult
  /**
   * Initiate checkout, optionally tagging a subset of the quotes if not all of them are wanted.
   *
   * Note, the session should only be moved into its checkout state once the prior things, such as campaign, are
   * considered done.
   */
  quoteCart_startCheckout: StartCheckoutResult
  /**
   * Will be called from the client when 1) redeem manually a code, 2) click the link  --Fails if the code is invalid?--
   * @deprecated Use redeemCodeOnV2
   */
  redeemCode: RedemedCodeResult
  redeemCodeV2: RedeemedCodeV2Result
  registerBranchCampaign?: Maybe<Scalars['Boolean']>
  registerDirectDebit: DirectDebitResponse
  registerPushToken?: Maybe<Scalars['Boolean']>
  removeAllDiscountCodes: RemoveCampaignCodeResult
  removeCurrentInsurer: CreateQuoteResult
  /** @deprecated Use removeDiscountCodeV2 */
  removeDiscountCode: RedemedCodeResult
  removeStartDate: CreateQuoteResult
  resetConversation: Scalars['Boolean']
  selectCashbackOption: Cashback
  sendChatAudioResponse: Scalars['Boolean']
  sendChatFileResponse: Scalars['Boolean']
  sendChatSingleSelectResponse: Scalars['Boolean']
  sendChatTextResponse: Scalars['Boolean']
  signOrApproveQuotes: SignOrApprove
  signQuotes: StartSignResponse
  startDirectDebitRegistration: Scalars['URL']
  /** Submit additional payment details */
  submitAdditionalPaymentDetails: AdditionalPaymentsDetailsResponse
  submitAdyenRedirection: SubmitAdyenRedirectionResponse
  swedishBankIdAuth: BankIdAuthResponse
  /** Tokenize payment details per member in order to be used in future and returns the status */
  tokenizePaymentDetails?: Maybe<TokenizationResponse>
  /** Tokenize payout details per member in order to be used in future and returns the status */
  tokenizePayoutDetails?: Maybe<TokenizationResponse>
  triggerCallMeChat?: Maybe<Scalars['Boolean']>
  triggerClaimChat?: Maybe<Scalars['Boolean']>
  triggerFreeTextChat?: Maybe<Scalars['Boolean']>
  updateCategoryForKeyGearItem: KeyGearItem
  updateEmail: Member
  updateKeyGearItemName: KeyGearItem
  updateLanguage: Scalars['Boolean']
  updatePhoneNumber: Member
  updatePickedLocale: Member
  /** # send null to remove */
  updatePurchasePriceForKeyGearItem: KeyGearItem
  updateReferralCampaignCode: UpdateReferralCampaignCodeResult
  /** # send null to remove */
  updateTimeOfPurchaseForKeyGearItem: KeyGearItem
  uploadFile: File
  uploadFiles?: Maybe<Array<File>>
}

export type MutationAddPhotoToKeyGearItemArgs = {
  input: AddPhotoToKeyGearItemInput
}

export type MutationAddReceiptToKeyGearItemArgs = {
  input: AddReceiptToKeyGearItemInput
}

export type MutationApproveQuotesArgs = {
  quoteIds: Array<Scalars['ID']>
}

export type MutationCreateAddressChangeQuotesArgs = {
  input: AddressChangeInput
}

export type MutationCreateClaimArgs = {
  audioFile: Scalars['Upload']
}

export type MutationCreateCrossSellQuotesArgs = {
  input: CrossSellQuotesInput
}

export type MutationCreateKeyGearItemArgs = {
  input: CreateKeyGearItemInput
}

export type MutationCreateQuoteArgs = {
  input: CreateQuoteInput
}

export type MutationCreateSessionArgs = {
  campaign?: InputMaybe<CampaignInput>
  trackingId?: InputMaybe<Scalars['UUID']>
}

export type MutationDanishBankIdAuthArgs = {
  personalNumber: Scalars['String']
}

export type MutationDeleteKeyGearItemArgs = {
  id: Scalars['ID']
}

export type MutationDeletePhotoFromKeyGearItemArgs = {
  id: Scalars['ID']
  itemId: Scalars['ID']
}

export type MutationDeleteReceiptFromKeyGearItemArgs = {
  id: Scalars['ID']
  itemId: Scalars['ID']
}

export type MutationEditQuoteArgs = {
  input: EditQuoteInput
}

export type MutationExchangeTokenArgs = {
  input: ExchangeTokenInput
}

export type MutationInitWidgetArgs = {
  input: PartnerInitWidgetInput
}

export type MutationLogArgs = {
  input: LoggingInput
}

export type MutationLogin_CreateOtpAttemptArgs = {
  input: OtpLoginAttemptInput
}

export type MutationLogin_ResendOtpArgs = {
  id: Scalars['ID']
}

export type MutationLogin_VerifyOtpAttemptArgs = {
  id: Scalars['ID']
  otp: Scalars['String']
}

export type MutationMarkMessageAsReadArgs = {
  globalId: Scalars['ID']
}

export type MutationNorwegianBankIdAuthArgs = {
  personalNumber?: InputMaybe<Scalars['String']>
}

export type MutationOnboardingQuoteCart_CreateArgs = {
  input: CreateOnboardingQuoteCartInput
}

export type MutationPaymentConnection_ConnectPaymentArgs = {
  input: ConnectPaymentInput
}

export type MutationPaymentConnection_SubmitAdditionalPaymentDetailsArgs = {
  input: AdditionalPaymentDetailsInput
  paymentTokenId: Scalars['ID']
}

export type MutationPaymentConnection_SubmitAdyenRedirectionArgs = {
  input: SubmitAdyenRedirectionInput
  paymentTokenId: Scalars['ID']
}

export type MutationQuoteCart_AddCampaignArgs = {
  code: Scalars['String']
  id: Scalars['ID']
}

export type MutationQuoteCart_AddPaymentTokenArgs = {
  id: Scalars['ID']
  paymentTokenId: Scalars['ID']
}

export type MutationQuoteCart_CreateAccessTokenArgs = {
  id: Scalars['ID']
}

export type MutationQuoteCart_CreateQuoteBundleArgs = {
  id: Scalars['ID']
  input: CreateQuoteBundleInput
}

export type MutationQuoteCart_CreateSwedishBundleArgs = {
  id: Scalars['ID']
  input: CreateSwedishBundleInput
}

export type MutationQuoteCart_EditQuoteArgs = {
  id: Scalars['ID']
  payload: Scalars['JSON']
  quoteId: Scalars['ID']
}

export type MutationQuoteCart_InitWidgetArgs = {
  input: InitWidgetInput
}

export type MutationQuoteCart_RemoveCampaignArgs = {
  id: Scalars['ID']
}

export type MutationQuoteCart_StartCheckoutArgs = {
  id: Scalars['ID']
  quoteIds?: InputMaybe<Array<Scalars['ID']>>
}

export type MutationRedeemCodeArgs = {
  code: Scalars['String']
}

export type MutationRedeemCodeV2Args = {
  code: Scalars['String']
  grossPrice?: InputMaybe<MonetaryAmountInput>
}

export type MutationRegisterBranchCampaignArgs = {
  campaign: CampaignInput
}

export type MutationRegisterDirectDebitArgs = {
  clientContext?: InputMaybe<RegisterDirectDebitClientContext>
}

export type MutationRegisterPushTokenArgs = {
  pushToken: Scalars['String']
}

export type MutationRemoveAllDiscountCodesArgs = {
  grossPrice?: InputMaybe<MonetaryAmountInput>
}

export type MutationRemoveCurrentInsurerArgs = {
  input: RemoveCurrentInsurerInput
}

export type MutationRemoveStartDateArgs = {
  input: RemoveStartDateInput
}

export type MutationSelectCashbackOptionArgs = {
  id: Scalars['ID']
  locale?: InputMaybe<Locale>
}

export type MutationSendChatAudioResponseArgs = {
  input: ChatResponseAudioInput
}

export type MutationSendChatFileResponseArgs = {
  input: ChatResponseFileInput
}

export type MutationSendChatSingleSelectResponseArgs = {
  input: ChatResponseSingleSelectInput
}

export type MutationSendChatTextResponseArgs = {
  input: ChatResponseTextInput
}

export type MutationSignOrApproveQuotesArgs = {
  quoteIds: Array<Scalars['ID']>
}

export type MutationSignQuotesArgs = {
  input: SignQuotesInput
}

export type MutationSubmitAdditionalPaymentDetailsArgs = {
  req?: InputMaybe<AdditionalPaymentsDetailsRequest>
}

export type MutationSubmitAdyenRedirectionArgs = {
  req?: InputMaybe<SubmitAdyenRedirectionRequest>
}

export type MutationTokenizePaymentDetailsArgs = {
  req?: InputMaybe<TokenizationRequest>
}

export type MutationTokenizePayoutDetailsArgs = {
  req?: InputMaybe<TokenizationRequest>
}

export type MutationTriggerClaimChatArgs = {
  input: TriggerClaimChatInput
}

export type MutationUpdateCategoryForKeyGearItemArgs = {
  category: KeyGearItemCategory
  itemId: Scalars['ID']
}

export type MutationUpdateEmailArgs = {
  input: Scalars['String']
}

export type MutationUpdateKeyGearItemNameArgs = {
  itemId: Scalars['ID']
  updatedName?: InputMaybe<Scalars['String']>
}

export type MutationUpdateLanguageArgs = {
  input: Scalars['String']
}

export type MutationUpdatePhoneNumberArgs = {
  input: Scalars['String']
}

export type MutationUpdatePickedLocaleArgs = {
  pickedLocale: Locale
}

export type MutationUpdatePurchasePriceForKeyGearItemArgs = {
  itemId: Scalars['ID']
  newPrice?: InputMaybe<MonetaryAmountV2Input>
}

export type MutationUpdateReferralCampaignCodeArgs = {
  code: Scalars['String']
}

export type MutationUpdateTimeOfPurchaseForKeyGearItemArgs = {
  id: Scalars['ID']
  newTimeOfPurchase?: InputMaybe<Scalars['LocalDate']>
}

export type MutationUploadFileArgs = {
  file: Scalars['Upload']
}

export type MutationUploadFilesArgs = {
  files: Array<Scalars['Upload']>
}

export type News = {
  __typename?: 'News'
  illustration: Icon
  paragraph: Scalars['String']
  title: Scalars['String']
}

export type NoDiscount = {
  __typename?: 'NoDiscount'
  _?: Maybe<Scalars['Boolean']>
}

/** An object with an ID */
export type Node = {
  /** The id of the object. */
  id: Scalars['ID']
  /** The Stage of an object */
  stage: Stage
}

export type NorwegianAccidentAgreement = AgreementCore & {
  __typename?: 'NorwegianAccidentAgreement'
  activeFrom?: Maybe<Scalars['LocalDate']>
  activeTo?: Maybe<Scalars['LocalDate']>
  carrier?: Maybe<Scalars['String']>
  certificateUrl?: Maybe<Scalars['String']>
  id: Scalars['ID']
  numberCoInsured: Scalars['Int']
  partner?: Maybe<Scalars['String']>
  premium: MonetaryAmountV2
  status: AgreementStatus
}

export type NorwegianAccidentDetails = {
  __typename?: 'NorwegianAccidentDetails'
  city?: Maybe<Scalars['String']>
  coInsured: Scalars['Int']
  street: Scalars['String']
  zipCode: Scalars['String']
}

export type NorwegianBankIdAuthResponse = {
  __typename?: 'NorwegianBankIdAuthResponse'
  redirectUrl: Scalars['String']
}

export type NorwegianBankIdExtraInfo = {
  __typename?: 'NorwegianBankIdExtraInfo'
  norwegianBankIdWords?: Maybe<Scalars['String']>
}

export type NorwegianBankIdSession = {
  __typename?: 'NorwegianBankIdSession'
  /** @deprecated This type i not in use any more */
  redirectUrl?: Maybe<Scalars['String']>
}

export type NorwegianHomeContentAgreement = AgreementCore & {
  __typename?: 'NorwegianHomeContentAgreement'
  activeFrom?: Maybe<Scalars['LocalDate']>
  activeTo?: Maybe<Scalars['LocalDate']>
  address: Address
  carrier?: Maybe<Scalars['String']>
  certificateUrl?: Maybe<Scalars['String']>
  id: Scalars['ID']
  numberCoInsured: Scalars['Int']
  partner?: Maybe<Scalars['String']>
  premium: MonetaryAmountV2
  squareMeters: Scalars['Int']
  status: AgreementStatus
  type?: Maybe<NorwegianHomeContentLineOfBusiness>
}

export enum NorwegianHomeContentLineOfBusiness {
  Own = 'OWN',
  Rent = 'RENT',
  YouthOwn = 'YOUTH_OWN',
  YouthRent = 'YOUTH_RENT',
}

export type NorwegianHomeContentsDetails = {
  __typename?: 'NorwegianHomeContentsDetails'
  coInsured: Scalars['Int']
  isYouth: Scalars['Boolean']
  livingSpace: Scalars['Int']
  street: Scalars['String']
  type: NorwegianHomeContentsType
  zipCode: Scalars['String']
}

export enum NorwegianHomeContentsType {
  Own = 'OWN',
  Rent = 'RENT',
}

export type NorwegianHouseAgreement = AgreementCore & {
  __typename?: 'NorwegianHouseAgreement'
  activeFrom?: Maybe<Scalars['LocalDate']>
  activeTo?: Maybe<Scalars['LocalDate']>
  address: Address
  carrier?: Maybe<Scalars['String']>
  certificateUrl?: Maybe<Scalars['String']>
  extraBuildings: Array<Maybe<ExtraBuilding>>
  id: Scalars['ID']
  isSubleted: Scalars['Boolean']
  numberCoInsured: Scalars['Int']
  partner?: Maybe<Scalars['String']>
  premium: MonetaryAmountV2
  squareMeters: Scalars['Int']
  status: AgreementStatus
  yearOfConstruction: Scalars['Int']
}

export type NorwegianHouseDetails = {
  __typename?: 'NorwegianHouseDetails'
  coInsured: Scalars['Int']
  extraBuildings: Array<ExtraBuilding>
  isSubleted: Scalars['Boolean']
  livingSpace: Scalars['Int']
  numberOfBathrooms: Scalars['Int']
  numberOfWetUnits: Scalars['Int']
  street: Scalars['String']
  waterLeakageDetector?: Maybe<Scalars['Boolean']>
  yearOfConstruction: Scalars['Int']
  yearOfOwnership: Scalars['Int']
  zipCode: Scalars['String']
}

export type NorwegianTravelAgreement = AgreementCore & {
  __typename?: 'NorwegianTravelAgreement'
  activeFrom?: Maybe<Scalars['LocalDate']>
  activeTo?: Maybe<Scalars['LocalDate']>
  carrier?: Maybe<Scalars['String']>
  certificateUrl?: Maybe<Scalars['String']>
  id: Scalars['ID']
  numberCoInsured: Scalars['Int']
  partner?: Maybe<Scalars['String']>
  premium: MonetaryAmountV2
  status: AgreementStatus
  type?: Maybe<NorwegianTravelLineOfBusiness>
}

export type NorwegianTravelDetails = {
  __typename?: 'NorwegianTravelDetails'
  coInsured: Scalars['Int']
  isYouth: Scalars['Boolean']
}

export enum NorwegianTravelLineOfBusiness {
  Regular = 'REGULAR',
  Youth = 'YOUTH',
}

export type OnboardingSigningSuccess = {
  __typename?: 'OnboardingSigningSuccess'
  status?: Maybe<CheckoutStatus>
}

export type OtpLoginAttemptInput = {
  credential: Scalars['String']
  otpType: OtpType
}

export enum OtpType {
  Email = 'EMAIL',
}

/** Information about pagination in a connection. */
export type PageInfo = {
  __typename?: 'PageInfo'
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['String']>
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean']
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean']
  /** Number of items in the current page. */
  pageSize?: Maybe<Scalars['Int']>
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['String']>
}

export type PartnerInitWidgetInput = {
  locale: Scalars['String']
  market?: InputMaybe<Market>
  partnerId: Scalars['String']
  requestId: Scalars['String']
}

export type PartnerInitWidgetResult = {
  __typename?: 'PartnerInitWidgetResult'
  id: Scalars['ID']
  market: Market
  partnerDefaultCampaignCode?: Maybe<Scalars['String']>
  partnerName: Scalars['String']
}

export enum PayinMethodStatus {
  Active = 'ACTIVE',
  NeedsSetup = 'NEEDS_SETUP',
  Pending = 'PENDING',
}

export enum PaymentConnectChannel {
  Android = 'ANDROID',
  Ios = 'IOS',
  Web = 'WEB',
}

export type PaymentConnection = {
  __typename?: 'PaymentConnection'
  id?: Maybe<Scalars['ID']>
  providers: Array<Provider>
}

export enum PayoutMethodStatus {
  Active = 'ACTIVE',
  NeedsSetup = 'NEEDS_SETUP',
  Pending = 'PENDING',
}

/** The contract is neither active or terminated, waiting to have an inception date set */
export type PendingStatus = {
  __typename?: 'PendingStatus'
  pendingSince?: Maybe<Scalars['LocalDate']>
}

export type PercentageDiscountMonths = {
  __typename?: 'PercentageDiscountMonths'
  percentageDiscount: Scalars['Float']
  quantity: Scalars['Int']
}

export type Peril = {
  __typename?: 'Peril'
  description?: Maybe<Scalars['String']>
  id?: Maybe<Scalars['ID']>
  imageUrl?: Maybe<Scalars['String']>
  title?: Maybe<Scalars['String']>
}

export type PerilCategory = {
  __typename?: 'PerilCategory'
  description?: Maybe<Scalars['String']>
  iconUrl?: Maybe<Scalars['String']>
  perils?: Maybe<Array<Maybe<Peril>>>
  title?: Maybe<Scalars['String']>
}

export type PerilV2 = {
  __typename?: 'PerilV2'
  covered: Array<Scalars['String']>
  description: Scalars['String']
  exceptions: Array<Scalars['String']>
  icon: Icon
  info: Scalars['String']
  shortDescription: Scalars['String']
  title: Scalars['String']
}

export type PersonTravelInsuranceCollection = {
  __typename?: 'PersonTravelInsuranceCollection'
  insuranceHolderAddress?: Maybe<Scalars['String']>
  insuranceHolderName?: Maybe<Scalars['String']>
  insuranceName?: Maybe<Scalars['String']>
  insuranceProvider?: Maybe<Scalars['String']>
  insuranceSubType?: Maybe<Scalars['String']>
  insuranceType?: Maybe<Scalars['String']>
  monthlyDiscount?: Maybe<MonetaryAmountV2>
  monthlyGrossPremium?: Maybe<MonetaryAmountV2>
  monthlyNetPremium?: Maybe<MonetaryAmountV2>
  renewalDate?: Maybe<Scalars['LocalDate']>
}

export type PersonalInformation = {
  __typename?: 'PersonalInformation'
  city: Scalars['String']
  firstName: Scalars['String']
  lastName: Scalars['String']
  postalNumber: Scalars['String']
  streetAddress: Scalars['String']
}

export type PersonalInformationInput = {
  personalNumber: Scalars['String']
}

export enum Platform {
  Android = 'Android',
  IOs = 'iOS',
}

export type PreviousInsurer = {
  __typename?: 'PreviousInsurer'
  displayName?: Maybe<Scalars['String']>
  id: Scalars['ID']
  switchable: Scalars['Boolean']
}

export enum Project {
  All = 'All',
  Android = 'Android',
  App = 'App',
  AppContentService = 'AppContentService',
  BotService = 'BotService',
  Ios = 'IOS',
  MemberService = 'MemberService',
  NotificationService = 'NotificationService',
  ProductPricing = 'ProductPricing',
  Underwriter = 'Underwriter',
  Web = 'Web',
  WebOnboarding = 'WebOnboarding',
}

export type Provider = Adyen | Trustly

export type ProviderStatus = {
  __typename?: 'ProviderStatus'
  functional: Scalars['Boolean']
  insuranceProvider: Scalars['String']
}

export type ProviderStatusV2 = {
  __typename?: 'ProviderStatusV2'
  functional: Scalars['Boolean']
  insuranceProvider: Scalars['String']
  insuranceProviderDisplayName?: Maybe<Scalars['String']>
  status: InsuranceProviderAvailability
}

export type PublishLocaleInput = {
  /** Locales to publish */
  locale: Locale
  /** Stages to publish selected locales to */
  stages: Array<Stage>
}

export type Query = {
  __typename?: 'Query'
  _?: Maybe<Scalars['Boolean']>
  /** Returns all the currently active contracts, combined into bundles. */
  activeContractBundles: Array<ContractBundle>
  /** Returns the active payment method which the member chose to tokenize */
  activePaymentMethods?: Maybe<ActivePaymentMethodsResponse>
  /** Returns the active payment method which the member chose to tokenize now supporting more payment methods then card */
  activePaymentMethodsV2?: Maybe<ActivePaymentMethodsV2Response>
  /** Returns the active payout method which the member chose to tokenize */
  activePayoutMethods?: Maybe<ActivePayoutMethodsResponse>
  adyenPublicKey: Scalars['String']
  angelStory?: Maybe<AngelStory>
  /** Retrieve multiple appMarketingImages */
  appMarketingImages: Array<AppMarketingImage>
  autoCompleteAddress: Array<AutoCompleteResponse>
  /** All locales that are available and activated */
  availableLocales: Array<Locale>
  /** Returns all the available payments methods before the client requests a tokenization */
  availablePaymentMethods: AvailablePaymentMethodsResponse
  /** Returns all the available payouts methods before the client requests a payout tokenization */
  availablePayoutMethods: AvailablePaymentMethodsResponse
  avatars?: Maybe<Array<Maybe<Avatar>>>
  balance: Balance
  bankAccount?: Maybe<BankAccount>
  campaign?: Maybe<Campaign>
  cashback?: Maybe<Cashback>
  cashbackOptions: Array<Maybe<Cashback>>
  chargeEstimation: ChargeEstimation
  chargeHistory: Array<Charge>
  chatActions?: Maybe<Array<Maybe<ChatAction>>>
  chatState: ChatState
  /** Returns all claims the member has */
  claims: Array<Claim>
  claims_statusCards: Array<ClaimStatusCard>
  commonClaims: Array<CommonClaim>
  /** Returns FAQ for TypeOfContract from promise-cms */
  contractFaq: Array<ContractFaq>
  /** Returns perils from promise-cms */
  contractPerils: Array<PerilV2>
  /** Returns all contracts the member currently holds, regardless of activation/termination status */
  contracts: Array<Contract>
  /** Retrieve multiple coreMLModels */
  coreMLModels: Array<CoreMlModel>
  currentChatResponse?: Maybe<ChatResponse>
  embarkStories: Array<EmbarkStoryMetadata>
  embarkStory?: Maybe<EmbarkStory>
  /** returns names of all available embark stories */
  embarkStoryNames: Array<Scalars['String']>
  externalInsuranceProvider?: Maybe<ExternalInsuranceProvider>
  /** Retrieve multiple faqs */
  faqs: Array<Faq>
  file: File
  gateway__?: Maybe<Scalars['Boolean']>
  geo: Geo
  gifs: Array<Maybe<Gif>>
  /** Returns whether a member has at least one contract */
  hasContract: Scalars['Boolean']
  houseInformation?: Maybe<HouseInformation>
  howClaimsWork: Array<ClaimsExplainerPage>
  /** Retrieve multiple importantMessages */
  importantMessages: Array<ImportantMessage>
  insurableLimits: Array<InsurableLimit>
  /** @deprecated Use `contracts` instead */
  insurance: Insurance
  /** Returns the aggregated insurance cost of a member's PENDING, ACTIVE or ACTIVE_IN_FUTURE current agreements */
  insuranceCost?: Maybe<InsuranceCost>
  insuranceProviders: Array<InsuranceProvider>
  insuranceTerms: Array<InsuranceTerm>
  /** Returns whether a member is eligible to create a claim, i.e. if a member has an active contract */
  isEligibleToCreateClaim: Scalars['Boolean']
  keyGearItem?: Maybe<KeyGearItem>
  /** Retrieve multiple keyGearItemCoverages */
  keyGearItemCoverages: Array<KeyGearItemCoverage>
  /** Used */
  keyGearItems: Array<KeyGearItem>
  /** Retrieve multiple languages */
  languages: Array<Language>
  /** @deprecated Legacy concept that should not be used */
  lastQuoteOfMember: Quote
  /** Retrieve multiple marketingStories */
  marketingStories: Array<MarketingStory>
  member: Member
  messages: Array<Maybe<Message>>
  news: Array<News>
  nextChargeDate?: Maybe<Scalars['LocalDate']>
  partner: RapioPartner
  /** Returns the status for the payin method (Trustly's direct debit for Sweden) (Adyen for Norway) */
  payinMethodStatus: PayinMethodStatus
  paymentConnection_providers?: Maybe<Array<Provider>>
  perils: Array<PerilV2>
  personalInformation?: Maybe<PersonalInformation>
  quote: Quote
  quoteBundle: QuoteBundle
  /** Fetch quote cart by its ID. */
  quoteCart: QuoteCart
  /** Returns redeemed campaigns belonging to authedUser */
  redeemedCampaigns: Array<Campaign>
  /** Returns information about the authed member's referralCampaign and referrals */
  referralInformation: Referrals
  referralTerms: ReferralTerm
  /**
   * Returns a type describing whether the 'Self Change' functionality is possible.
   * @deprecated Use angelStories in `activeContractBundles` instead
   */
  selfChangeEligibility: SelfChangeEligibility
  signMethodForQuotes: SignMethod
  signStatus?: Maybe<SignStatus>
  /** Returns termsAndConditions from promise-cms */
  termsAndConditions: InsuranceTerm
  welcome: Array<Welcome>
}

export type QueryAngelStoryArgs = {
  locale?: InputMaybe<Scalars['String']>
  name: Scalars['String']
}

export type QueryAppMarketingImagesArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  locales?: Array<Locale>
  orderBy?: InputMaybe<AppMarketingImageOrderByInput>
  skip?: InputMaybe<Scalars['Int']>
  stage?: Stage
  where?: InputMaybe<AppMarketingImageWhereInput>
}

export type QueryAutoCompleteAddressArgs = {
  input: Scalars['String']
  options?: InputMaybe<AddressAutocompleteOptions>
}

export type QueryCampaignArgs = {
  code: Scalars['String']
}

export type QueryCashbackArgs = {
  locale?: InputMaybe<Locale>
}

export type QueryCashbackOptionsArgs = {
  locale?: InputMaybe<Locale>
}

export type QueryClaims_StatusCardsArgs = {
  locale: Locale
}

export type QueryCommonClaimsArgs = {
  locale: Locale
}

export type QueryContractFaqArgs = {
  contractType: TypeOfContract
  locale: Locale
}

export type QueryContractPerilsArgs = {
  contractType: TypeOfContract
  locale: Locale
}

export type QueryCoreMlModelsArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  locales?: Array<Locale>
  orderBy?: InputMaybe<CoreMlModelOrderByInput>
  skip?: InputMaybe<Scalars['Int']>
  stage?: Stage
  where?: InputMaybe<CoreMlModelWhereInput>
}

export type QueryEmbarkStoriesArgs = {
  locale: Scalars['String']
}

export type QueryEmbarkStoryArgs = {
  locale: Scalars['String']
  name: Scalars['String']
}

export type QueryFaqsArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  locales?: Array<Locale>
  orderBy?: InputMaybe<FaqOrderByInput>
  skip?: InputMaybe<Scalars['Int']>
  stage?: Stage
  where?: InputMaybe<FaqWhereInput>
}

export type QueryFileArgs = {
  key: Scalars['String']
}

export type QueryGifsArgs = {
  query: Scalars['String']
}

export type QueryHouseInformationArgs = {
  input: HouseInformationInput
}

export type QueryHowClaimsWorkArgs = {
  locale: Locale
}

export type QueryImportantMessagesArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  locales?: Array<Locale>
  orderBy?: InputMaybe<ImportantMessageOrderByInput>
  skip?: InputMaybe<Scalars['Int']>
  stage?: Stage
  where?: InputMaybe<ImportantMessageWhereInput>
}

export type QueryInsurableLimitsArgs = {
  contractType: TypeOfContract
  locale: Locale
}

export type QueryInsuranceProvidersArgs = {
  locale: Locale
}

export type QueryInsuranceTermsArgs = {
  carrier?: InputMaybe<Scalars['String']>
  contractType: TypeOfContract
  date?: InputMaybe<Scalars['LocalDate']>
  locale: Locale
  partner?: InputMaybe<Scalars['String']>
}

export type QueryKeyGearItemArgs = {
  id: Scalars['ID']
}

export type QueryKeyGearItemCoveragesArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  locales?: Array<Locale>
  orderBy?: InputMaybe<KeyGearItemCoverageOrderByInput>
  skip?: InputMaybe<Scalars['Int']>
  stage?: Stage
  where?: InputMaybe<KeyGearItemCoverageWhereInput>
}

export type QueryKeyGearItemsArgs = {
  where?: InputMaybe<KeyGearItemsFilter>
}

export type QueryLanguagesArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  locales?: Array<Locale>
  orderBy?: InputMaybe<LanguageOrderByInput>
  skip?: InputMaybe<Scalars['Int']>
  stage?: Stage
  where?: InputMaybe<LanguageWhereInput>
}

export type QueryMarketingStoriesArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  locales?: Array<Locale>
  orderBy?: InputMaybe<MarketingStoryOrderByInput>
  skip?: InputMaybe<Scalars['Int']>
  stage?: Stage
  where?: InputMaybe<MarketingStoryWhereInput>
}

export type QueryNewsArgs = {
  locale: Locale
  platform: Platform
  sinceVersion: Scalars['String']
}

export type QueryPartnerArgs = {
  id: Scalars['ID']
}

export type QueryPaymentConnection_ProvidersArgs = {
  market: Market
}

export type QueryPerilsArgs = {
  contractType: TypeOfContract
  locale: Locale
}

export type QueryPersonalInformationArgs = {
  input: PersonalInformationInput
}

export type QueryQuoteArgs = {
  id?: InputMaybe<Scalars['ID']>
}

export type QueryQuoteBundleArgs = {
  input: QuoteBundleInput
  locale?: InputMaybe<Locale>
}

export type QueryQuoteCartArgs = {
  id: Scalars['ID']
}

export type QueryReferralTermsArgs = {
  locale: Locale
}

export type QuerySignMethodForQuotesArgs = {
  input: Array<Scalars['ID']>
}

export type QueryTermsAndConditionsArgs = {
  carrier?: InputMaybe<Scalars['String']>
  contractType: TypeOfContract
  date?: InputMaybe<Scalars['LocalDate']>
  locale: Locale
  partner?: InputMaybe<Scalars['String']>
}

export type QueryWelcomeArgs = {
  locale: Locale
  platform: Platform
}

export type Quote = CompleteQuote | IncompleteQuote

export type QuoteBundle = {
  __typename?: 'QuoteBundle'
  appConfiguration: QuoteBundleAppConfiguration
  bundleCost: InsuranceCost
  displayName: Scalars['String']
  frequentlyAskedQuestions: Array<Faq>
  inception: QuoteBundleInception
  /** All possible other variations of the current set of bundle ids */
  possibleVariations: Array<QuoteBundleVariant>
  quotes: Array<BundledQuote>
}

export type QuoteBundleDisplayNameArgs = {
  locale: Locale
}

export type QuoteBundleFrequentlyAskedQuestionsArgs = {
  locale: Locale
}

export type QuoteBundleAppConfiguration = {
  __typename?: 'QuoteBundleAppConfiguration'
  approveButtonTerminology: QuoteBundleAppConfigurationApproveButtonTerminology
  gradientOption: TypeOfContractGradientOption
  /** If true, ignore net price fully and always display gross price to the user */
  ignoreCampaigns: Scalars['Boolean']
  postSignStep: QuoteBundleAppConfigurationPostSignStep
  showCampaignManagement: Scalars['Boolean']
  showFAQ: Scalars['Boolean']
  startDateTerminology: QuoteBundleAppConfigurationStartDateTerminology
  title: QuoteBundleAppConfigurationTitle
}

export enum QuoteBundleAppConfigurationApproveButtonTerminology {
  ApproveChanges = 'APPROVE_CHANGES',
  ConfirmPurchase = 'CONFIRM_PURCHASE',
}

export enum QuoteBundleAppConfigurationPostSignStep {
  ConnectPayin = 'CONNECT_PAYIN',
  CrossSell = 'CROSS_SELL',
  Move = 'MOVE',
}

export enum QuoteBundleAppConfigurationStartDateTerminology {
  AccessDate = 'ACCESS_DATE',
  StartDate = 'START_DATE',
}

export enum QuoteBundleAppConfigurationTitle {
  Logo = 'LOGO',
  UpdateSummary = 'UPDATE_SUMMARY',
}

export type QuoteBundleError = Error & {
  __typename?: 'QuoteBundleError'
  limits?: Maybe<Array<UnderwritingLimit>>
  message: Scalars['String']
  /**  The type of the quote that could not be created.  */
  type: Scalars['String']
}

export type QuoteBundleInception = ConcurrentInception | IndependentInceptions

export type QuoteBundleInput = {
  ids: Array<Scalars['ID']>
}

/** A possible alternative bundling variant */
export type QuoteBundleVariant = {
  __typename?: 'QuoteBundleVariant'
  bundle: QuoteBundle
  id: Scalars['ID']
  /** A describing tag of this variant, for example "Most popular" */
  tag?: Maybe<Scalars['String']>
}

/** A possible alternative bundling variant */
export type QuoteBundleVariantBundleArgs = {
  locale?: InputMaybe<Locale>
}

/** A possible alternative bundling variant */
export type QuoteBundleVariantTagArgs = {
  locale: Locale
}

/**
 * An quote cart is a type that exists to guide the client through an onboarding journey,
 * as a means of storing intermediate state up until the point where it is "signed" and then flushed
 * into a proper "member".
 */
export type QuoteCart = {
  __typename?: 'QuoteCart'
  /**  The quote bundle "view" of the quotes created as part of this cart.  */
  bundle?: Maybe<QuoteBundle>
  /**  Campaign, if one has been attached by a code.  */
  campaign?: Maybe<Campaign>
  /**  The ongoing signing state, if it has been initiated - or null if it has not.  */
  checkout?: Maybe<Checkout>
  /**  The accepted checkout methods.  */
  checkoutMethods: Array<CheckoutMethod>
  id: Scalars['ID']
  market: Market
  /** Contains payment token currently attached to the quote cart and information about available payment providers */
  paymentConnection?: Maybe<PaymentConnection>
}

/**
 * An quote cart is a type that exists to guide the client through an onboarding journey,
 * as a means of storing intermediate state up until the point where it is "signed" and then flushed
 * into a proper "member".
 */
export type QuoteCartBundleArgs = {
  locale?: InputMaybe<Locale>
}

export type QuoteDetails =
  | DanishAccidentDetails
  | DanishHomeContentsDetails
  | DanishTravelDetails
  | NorwegianAccidentDetails
  | NorwegianHomeContentsDetails
  | NorwegianHouseDetails
  | NorwegianTravelDetails
  | SwedishAccidentDetails
  | SwedishApartmentQuoteDetails
  | SwedishCarDetails
  | SwedishHouseQuoteDetails

export enum QuoteInitiatedFrom {
  CrossSell = 'CROSS_SELL',
  SelfChange = 'SELF_CHANGE',
}

/** Representing a RGBA color value: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#rgb()_and_rgba() */
export type Rgba = {
  __typename?: 'RGBA'
  a: Scalars['RGBATransparency']
  b: Scalars['RGBAHue']
  g: Scalars['RGBAHue']
  r: Scalars['RGBAHue']
}

/** Input type representing a RGBA color value: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#rgb()_and_rgba() */
export type RgbaInput = {
  a: Scalars['RGBATransparency']
  b: Scalars['RGBAHue']
  g: Scalars['RGBAHue']
  r: Scalars['RGBAHue']
}

export type RapioPartner = {
  __typename?: 'RapioPartner'
  id: Scalars['ID']
  name: Scalars['String']
}

export type RedeemedCodeV2Result =
  | CampaignCannotBeCombinedWithExisting
  | CampaignDoesNotExist
  | CampaignHasExpired
  | CannotRedeemCampaignFromDifferentMarket
  | CannotRedeemEmptyCode
  | CannotRedeemOwnCampaign
  | MemberIsNotEligibleForCampaign
  | SuccessfulRedeemResult

export type RedemedCodeResult = {
  __typename?: 'RedemedCodeResult'
  /** The currently redeemed incentive, this can be null */
  campaigns: Array<Campaign>
  cost: InsuranceCost
}

export type Referral = AcceptedReferral | ActiveReferral | InProgressReferral | TerminatedReferral

export type ReferralTerm = {
  __typename?: 'ReferralTerm'
  url: Scalars['URL']
}

export type Referrals = {
  __typename?: 'Referrals'
  campaign: Campaign
  costReducedIndefiniteDiscount?: Maybe<InsuranceCost>
  invitations: Array<Referral>
  referredBy?: Maybe<Referral>
}

export type RegisterDirectDebitClientContext = {
  failureUrl: Scalars['String']
  successUrl: Scalars['String']
}

export type RemoveCampaignCodeResult =
  | CannotRemoveActiveCampaignCode
  | SuccessfullyRemovedCampaignsResult

export type RemoveCampaignResult = BasicError | QuoteCart

export type RemoveCurrentInsurerInput = {
  id: Scalars['ID']
}

export type RemoveStartDateInput = {
  id: Scalars['ID']
}

export type Renewal = {
  __typename?: 'Renewal'
  certificateUrl: Scalars['String']
  date: Scalars['LocalDate']
}

/** Custom type representing a rich text value comprising of raw rich text ast, html, markdown and text values */
export type RichText = {
  __typename?: 'RichText'
  /** Returns HTMl representation */
  html: Scalars['String']
  /** Returns Markdown representation */
  markdown: Scalars['String']
  /** Returns AST representation */
  raw: Scalars['RichTextAST']
  /** Returns plain-text contents of RichText */
  text: Scalars['String']
}

export type S3File = {
  __typename?: 'S3File'
  preSignedUrl: Scalars['String']
}

export type S3FileInput = {
  bucket: Scalars['String']
  key: Scalars['String']
}

/** Scheduled Operation system model */
export type ScheduledOperation = Node & {
  __typename?: 'ScheduledOperation'
  affectedDocuments: Array<ScheduledOperationAffectedDocument>
  /** The time the document was created */
  createdAt: Scalars['DateTime']
  /** User that created this document */
  createdBy?: Maybe<User>
  /** Operation description */
  description?: Maybe<Scalars['String']>
  /** Get the document in other stages */
  documentInStages: Array<ScheduledOperation>
  /** Operation error message */
  errorMessage?: Maybe<Scalars['String']>
  /** The unique identifier */
  id: Scalars['ID']
  /** The time the document was published. Null on documents in draft stage. */
  publishedAt?: Maybe<Scalars['DateTime']>
  /** User that last published this document */
  publishedBy?: Maybe<User>
  /** Raw operation payload including all details, this field is subject to change */
  rawPayload: Scalars['Json']
  /** The release this operation is scheduled for */
  release?: Maybe<ScheduledRelease>
  /** System stage field */
  stage: Stage
  /** operation Status */
  status: ScheduledOperationStatus
  /** The time the document was updated */
  updatedAt: Scalars['DateTime']
  /** User that last updated this document */
  updatedBy?: Maybe<User>
}

/** Scheduled Operation system model */
export type ScheduledOperationAffectedDocumentsArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  locales?: InputMaybe<Array<Locale>>
  skip?: InputMaybe<Scalars['Int']>
}

/** Scheduled Operation system model */
export type ScheduledOperationCreatedByArgs = {
  locales?: InputMaybe<Array<Locale>>
}

/** Scheduled Operation system model */
export type ScheduledOperationDocumentInStagesArgs = {
  includeCurrent?: Scalars['Boolean']
  inheritLocale?: Scalars['Boolean']
  stages?: Array<Stage>
}

/** Scheduled Operation system model */
export type ScheduledOperationPublishedByArgs = {
  locales?: InputMaybe<Array<Locale>>
}

/** Scheduled Operation system model */
export type ScheduledOperationReleaseArgs = {
  locales?: InputMaybe<Array<Locale>>
}

/** Scheduled Operation system model */
export type ScheduledOperationUpdatedByArgs = {
  locales?: InputMaybe<Array<Locale>>
}

export type ScheduledOperationAffectedDocument =
  | AppMarketingImage
  | Asset
  | CoreMlModel
  | Faq
  | ImportantMessage
  | Key
  | KeyGearItemCoverage
  | Language
  | MarketingStory
  | Translation
  | UserFeature

export type ScheduledOperationConnectInput = {
  /** Allow to specify document position in list of connected documents, will default to appending at end of list */
  position?: InputMaybe<ConnectPositionInput>
  /** Document to connect */
  where: ScheduledOperationWhereUniqueInput
}

/** A connection to a list of items. */
export type ScheduledOperationConnection = {
  __typename?: 'ScheduledOperationConnection'
  aggregate: Aggregate
  /** A list of edges. */
  edges: Array<ScheduledOperationEdge>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
}

export type ScheduledOperationCreateManyInlineInput = {
  /** Connect multiple existing ScheduledOperation documents */
  connect?: InputMaybe<Array<ScheduledOperationWhereUniqueInput>>
}

export type ScheduledOperationCreateOneInlineInput = {
  /** Connect one existing ScheduledOperation document */
  connect?: InputMaybe<ScheduledOperationWhereUniqueInput>
}

/** An edge in a connection. */
export type ScheduledOperationEdge = {
  __typename?: 'ScheduledOperationEdge'
  /** A cursor for use in pagination. */
  cursor: Scalars['String']
  /** The item at the end of the edge. */
  node: ScheduledOperation
}

/** Identifies documents */
export type ScheduledOperationManyWhereInput = {
  /** Logical AND on all given filters. */
  AND?: InputMaybe<Array<ScheduledOperationWhereInput>>
  /** Logical NOT on all given filters combined by AND. */
  NOT?: InputMaybe<Array<ScheduledOperationWhereInput>>
  /** Logical OR on all given filters. */
  OR?: InputMaybe<Array<ScheduledOperationWhereInput>>
  /** Contains search across all appropriate fields. */
  _search?: InputMaybe<Scalars['String']>
  createdAt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than the given value. */
  createdAt_gt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than or equal the given value. */
  createdAt_gte?: InputMaybe<Scalars['DateTime']>
  /** All values that are contained in given list. */
  createdAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  /** All values less than the given value. */
  createdAt_lt?: InputMaybe<Scalars['DateTime']>
  /** All values less than or equal the given value. */
  createdAt_lte?: InputMaybe<Scalars['DateTime']>
  /** All values that are not equal to given value. */
  createdAt_not?: InputMaybe<Scalars['DateTime']>
  /** All values that are not contained in given list. */
  createdAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  createdBy?: InputMaybe<UserWhereInput>
  description?: InputMaybe<Scalars['String']>
  /** All values containing the given string. */
  description_contains?: InputMaybe<Scalars['String']>
  /** All values ending with the given string. */
  description_ends_with?: InputMaybe<Scalars['String']>
  /** All values that are contained in given list. */
  description_in?: InputMaybe<Array<Scalars['String']>>
  /** All values that are not equal to given value. */
  description_not?: InputMaybe<Scalars['String']>
  /** All values not containing the given string. */
  description_not_contains?: InputMaybe<Scalars['String']>
  /** All values not ending with the given string */
  description_not_ends_with?: InputMaybe<Scalars['String']>
  /** All values that are not contained in given list. */
  description_not_in?: InputMaybe<Array<Scalars['String']>>
  /** All values not starting with the given string. */
  description_not_starts_with?: InputMaybe<Scalars['String']>
  /** All values starting with the given string. */
  description_starts_with?: InputMaybe<Scalars['String']>
  errorMessage?: InputMaybe<Scalars['String']>
  /** All values containing the given string. */
  errorMessage_contains?: InputMaybe<Scalars['String']>
  /** All values ending with the given string. */
  errorMessage_ends_with?: InputMaybe<Scalars['String']>
  /** All values that are contained in given list. */
  errorMessage_in?: InputMaybe<Array<Scalars['String']>>
  /** All values that are not equal to given value. */
  errorMessage_not?: InputMaybe<Scalars['String']>
  /** All values not containing the given string. */
  errorMessage_not_contains?: InputMaybe<Scalars['String']>
  /** All values not ending with the given string */
  errorMessage_not_ends_with?: InputMaybe<Scalars['String']>
  /** All values that are not contained in given list. */
  errorMessage_not_in?: InputMaybe<Array<Scalars['String']>>
  /** All values not starting with the given string. */
  errorMessage_not_starts_with?: InputMaybe<Scalars['String']>
  /** All values starting with the given string. */
  errorMessage_starts_with?: InputMaybe<Scalars['String']>
  id?: InputMaybe<Scalars['ID']>
  /** All values containing the given string. */
  id_contains?: InputMaybe<Scalars['ID']>
  /** All values ending with the given string. */
  id_ends_with?: InputMaybe<Scalars['ID']>
  /** All values that are contained in given list. */
  id_in?: InputMaybe<Array<Scalars['ID']>>
  /** All values that are not equal to given value. */
  id_not?: InputMaybe<Scalars['ID']>
  /** All values not containing the given string. */
  id_not_contains?: InputMaybe<Scalars['ID']>
  /** All values not ending with the given string */
  id_not_ends_with?: InputMaybe<Scalars['ID']>
  /** All values that are not contained in given list. */
  id_not_in?: InputMaybe<Array<Scalars['ID']>>
  /** All values not starting with the given string. */
  id_not_starts_with?: InputMaybe<Scalars['ID']>
  /** All values starting with the given string. */
  id_starts_with?: InputMaybe<Scalars['ID']>
  publishedAt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than the given value. */
  publishedAt_gt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than or equal the given value. */
  publishedAt_gte?: InputMaybe<Scalars['DateTime']>
  /** All values that are contained in given list. */
  publishedAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  /** All values less than the given value. */
  publishedAt_lt?: InputMaybe<Scalars['DateTime']>
  /** All values less than or equal the given value. */
  publishedAt_lte?: InputMaybe<Scalars['DateTime']>
  /** All values that are not equal to given value. */
  publishedAt_not?: InputMaybe<Scalars['DateTime']>
  /** All values that are not contained in given list. */
  publishedAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  publishedBy?: InputMaybe<UserWhereInput>
  release?: InputMaybe<ScheduledReleaseWhereInput>
  status?: InputMaybe<ScheduledOperationStatus>
  /** All values that are contained in given list. */
  status_in?: InputMaybe<Array<ScheduledOperationStatus>>
  /** All values that are not equal to given value. */
  status_not?: InputMaybe<ScheduledOperationStatus>
  /** All values that are not contained in given list. */
  status_not_in?: InputMaybe<Array<ScheduledOperationStatus>>
  updatedAt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than the given value. */
  updatedAt_gt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than or equal the given value. */
  updatedAt_gte?: InputMaybe<Scalars['DateTime']>
  /** All values that are contained in given list. */
  updatedAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  /** All values less than the given value. */
  updatedAt_lt?: InputMaybe<Scalars['DateTime']>
  /** All values less than or equal the given value. */
  updatedAt_lte?: InputMaybe<Scalars['DateTime']>
  /** All values that are not equal to given value. */
  updatedAt_not?: InputMaybe<Scalars['DateTime']>
  /** All values that are not contained in given list. */
  updatedAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  updatedBy?: InputMaybe<UserWhereInput>
}

export enum ScheduledOperationOrderByInput {
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC',
  DescriptionAsc = 'description_ASC',
  DescriptionDesc = 'description_DESC',
  ErrorMessageAsc = 'errorMessage_ASC',
  ErrorMessageDesc = 'errorMessage_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  PublishedAtAsc = 'publishedAt_ASC',
  PublishedAtDesc = 'publishedAt_DESC',
  StatusAsc = 'status_ASC',
  StatusDesc = 'status_DESC',
  UpdatedAtAsc = 'updatedAt_ASC',
  UpdatedAtDesc = 'updatedAt_DESC',
}

/** System Scheduled Operation Status */
export enum ScheduledOperationStatus {
  Canceled = 'CANCELED',
  Completed = 'COMPLETED',
  Failed = 'FAILED',
  InProgress = 'IN_PROGRESS',
  Pending = 'PENDING',
}

export type ScheduledOperationUpdateManyInlineInput = {
  /** Connect multiple existing ScheduledOperation documents */
  connect?: InputMaybe<Array<ScheduledOperationConnectInput>>
  /** Disconnect multiple ScheduledOperation documents */
  disconnect?: InputMaybe<Array<ScheduledOperationWhereUniqueInput>>
  /** Override currently-connected documents with multiple existing ScheduledOperation documents */
  set?: InputMaybe<Array<ScheduledOperationWhereUniqueInput>>
}

export type ScheduledOperationUpdateOneInlineInput = {
  /** Connect existing ScheduledOperation document */
  connect?: InputMaybe<ScheduledOperationWhereUniqueInput>
  /** Disconnect currently connected ScheduledOperation document */
  disconnect?: InputMaybe<Scalars['Boolean']>
}

/** Identifies documents */
export type ScheduledOperationWhereInput = {
  /** Logical AND on all given filters. */
  AND?: InputMaybe<Array<ScheduledOperationWhereInput>>
  /** Logical NOT on all given filters combined by AND. */
  NOT?: InputMaybe<Array<ScheduledOperationWhereInput>>
  /** Logical OR on all given filters. */
  OR?: InputMaybe<Array<ScheduledOperationWhereInput>>
  /** Contains search across all appropriate fields. */
  _search?: InputMaybe<Scalars['String']>
  createdAt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than the given value. */
  createdAt_gt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than or equal the given value. */
  createdAt_gte?: InputMaybe<Scalars['DateTime']>
  /** All values that are contained in given list. */
  createdAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  /** All values less than the given value. */
  createdAt_lt?: InputMaybe<Scalars['DateTime']>
  /** All values less than or equal the given value. */
  createdAt_lte?: InputMaybe<Scalars['DateTime']>
  /** All values that are not equal to given value. */
  createdAt_not?: InputMaybe<Scalars['DateTime']>
  /** All values that are not contained in given list. */
  createdAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  createdBy?: InputMaybe<UserWhereInput>
  description?: InputMaybe<Scalars['String']>
  /** All values containing the given string. */
  description_contains?: InputMaybe<Scalars['String']>
  /** All values ending with the given string. */
  description_ends_with?: InputMaybe<Scalars['String']>
  /** All values that are contained in given list. */
  description_in?: InputMaybe<Array<Scalars['String']>>
  /** All values that are not equal to given value. */
  description_not?: InputMaybe<Scalars['String']>
  /** All values not containing the given string. */
  description_not_contains?: InputMaybe<Scalars['String']>
  /** All values not ending with the given string */
  description_not_ends_with?: InputMaybe<Scalars['String']>
  /** All values that are not contained in given list. */
  description_not_in?: InputMaybe<Array<Scalars['String']>>
  /** All values not starting with the given string. */
  description_not_starts_with?: InputMaybe<Scalars['String']>
  /** All values starting with the given string. */
  description_starts_with?: InputMaybe<Scalars['String']>
  errorMessage?: InputMaybe<Scalars['String']>
  /** All values containing the given string. */
  errorMessage_contains?: InputMaybe<Scalars['String']>
  /** All values ending with the given string. */
  errorMessage_ends_with?: InputMaybe<Scalars['String']>
  /** All values that are contained in given list. */
  errorMessage_in?: InputMaybe<Array<Scalars['String']>>
  /** All values that are not equal to given value. */
  errorMessage_not?: InputMaybe<Scalars['String']>
  /** All values not containing the given string. */
  errorMessage_not_contains?: InputMaybe<Scalars['String']>
  /** All values not ending with the given string */
  errorMessage_not_ends_with?: InputMaybe<Scalars['String']>
  /** All values that are not contained in given list. */
  errorMessage_not_in?: InputMaybe<Array<Scalars['String']>>
  /** All values not starting with the given string. */
  errorMessage_not_starts_with?: InputMaybe<Scalars['String']>
  /** All values starting with the given string. */
  errorMessage_starts_with?: InputMaybe<Scalars['String']>
  id?: InputMaybe<Scalars['ID']>
  /** All values containing the given string. */
  id_contains?: InputMaybe<Scalars['ID']>
  /** All values ending with the given string. */
  id_ends_with?: InputMaybe<Scalars['ID']>
  /** All values that are contained in given list. */
  id_in?: InputMaybe<Array<Scalars['ID']>>
  /** All values that are not equal to given value. */
  id_not?: InputMaybe<Scalars['ID']>
  /** All values not containing the given string. */
  id_not_contains?: InputMaybe<Scalars['ID']>
  /** All values not ending with the given string */
  id_not_ends_with?: InputMaybe<Scalars['ID']>
  /** All values that are not contained in given list. */
  id_not_in?: InputMaybe<Array<Scalars['ID']>>
  /** All values not starting with the given string. */
  id_not_starts_with?: InputMaybe<Scalars['ID']>
  /** All values starting with the given string. */
  id_starts_with?: InputMaybe<Scalars['ID']>
  publishedAt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than the given value. */
  publishedAt_gt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than or equal the given value. */
  publishedAt_gte?: InputMaybe<Scalars['DateTime']>
  /** All values that are contained in given list. */
  publishedAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  /** All values less than the given value. */
  publishedAt_lt?: InputMaybe<Scalars['DateTime']>
  /** All values less than or equal the given value. */
  publishedAt_lte?: InputMaybe<Scalars['DateTime']>
  /** All values that are not equal to given value. */
  publishedAt_not?: InputMaybe<Scalars['DateTime']>
  /** All values that are not contained in given list. */
  publishedAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  publishedBy?: InputMaybe<UserWhereInput>
  release?: InputMaybe<ScheduledReleaseWhereInput>
  status?: InputMaybe<ScheduledOperationStatus>
  /** All values that are contained in given list. */
  status_in?: InputMaybe<Array<ScheduledOperationStatus>>
  /** All values that are not equal to given value. */
  status_not?: InputMaybe<ScheduledOperationStatus>
  /** All values that are not contained in given list. */
  status_not_in?: InputMaybe<Array<ScheduledOperationStatus>>
  updatedAt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than the given value. */
  updatedAt_gt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than or equal the given value. */
  updatedAt_gte?: InputMaybe<Scalars['DateTime']>
  /** All values that are contained in given list. */
  updatedAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  /** All values less than the given value. */
  updatedAt_lt?: InputMaybe<Scalars['DateTime']>
  /** All values less than or equal the given value. */
  updatedAt_lte?: InputMaybe<Scalars['DateTime']>
  /** All values that are not equal to given value. */
  updatedAt_not?: InputMaybe<Scalars['DateTime']>
  /** All values that are not contained in given list. */
  updatedAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  updatedBy?: InputMaybe<UserWhereInput>
}

/** References ScheduledOperation record uniquely */
export type ScheduledOperationWhereUniqueInput = {
  id?: InputMaybe<Scalars['ID']>
}

/** Scheduled Release system model */
export type ScheduledRelease = Node & {
  __typename?: 'ScheduledRelease'
  /** The time the document was created */
  createdAt: Scalars['DateTime']
  /** User that created this document */
  createdBy?: Maybe<User>
  /** Release description */
  description?: Maybe<Scalars['String']>
  /** Get the document in other stages */
  documentInStages: Array<ScheduledRelease>
  /** Release error message */
  errorMessage?: Maybe<Scalars['String']>
  /** The unique identifier */
  id: Scalars['ID']
  /** Whether scheduled release should be run */
  isActive: Scalars['Boolean']
  /** Whether scheduled release is implicit */
  isImplicit: Scalars['Boolean']
  /** Operations to run with this release */
  operations: Array<ScheduledOperation>
  /** The time the document was published. Null on documents in draft stage. */
  publishedAt?: Maybe<Scalars['DateTime']>
  /** User that last published this document */
  publishedBy?: Maybe<User>
  /** Release date and time */
  releaseAt?: Maybe<Scalars['DateTime']>
  /** System stage field */
  stage: Stage
  /** Release Status */
  status: ScheduledReleaseStatus
  /** Release Title */
  title?: Maybe<Scalars['String']>
  /** The time the document was updated */
  updatedAt: Scalars['DateTime']
  /** User that last updated this document */
  updatedBy?: Maybe<User>
}

/** Scheduled Release system model */
export type ScheduledReleaseCreatedByArgs = {
  locales?: InputMaybe<Array<Locale>>
}

/** Scheduled Release system model */
export type ScheduledReleaseDocumentInStagesArgs = {
  includeCurrent?: Scalars['Boolean']
  inheritLocale?: Scalars['Boolean']
  stages?: Array<Stage>
}

/** Scheduled Release system model */
export type ScheduledReleaseOperationsArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  locales?: InputMaybe<Array<Locale>>
  orderBy?: InputMaybe<ScheduledOperationOrderByInput>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<ScheduledOperationWhereInput>
}

/** Scheduled Release system model */
export type ScheduledReleasePublishedByArgs = {
  locales?: InputMaybe<Array<Locale>>
}

/** Scheduled Release system model */
export type ScheduledReleaseUpdatedByArgs = {
  locales?: InputMaybe<Array<Locale>>
}

export type ScheduledReleaseConnectInput = {
  /** Allow to specify document position in list of connected documents, will default to appending at end of list */
  position?: InputMaybe<ConnectPositionInput>
  /** Document to connect */
  where: ScheduledReleaseWhereUniqueInput
}

/** A connection to a list of items. */
export type ScheduledReleaseConnection = {
  __typename?: 'ScheduledReleaseConnection'
  aggregate: Aggregate
  /** A list of edges. */
  edges: Array<ScheduledReleaseEdge>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
}

export type ScheduledReleaseCreateInput = {
  createdAt?: InputMaybe<Scalars['DateTime']>
  description?: InputMaybe<Scalars['String']>
  errorMessage?: InputMaybe<Scalars['String']>
  isActive?: InputMaybe<Scalars['Boolean']>
  releaseAt?: InputMaybe<Scalars['DateTime']>
  title?: InputMaybe<Scalars['String']>
  updatedAt?: InputMaybe<Scalars['DateTime']>
}

export type ScheduledReleaseCreateManyInlineInput = {
  /** Connect multiple existing ScheduledRelease documents */
  connect?: InputMaybe<Array<ScheduledReleaseWhereUniqueInput>>
  /** Create and connect multiple existing ScheduledRelease documents */
  create?: InputMaybe<Array<ScheduledReleaseCreateInput>>
}

export type ScheduledReleaseCreateOneInlineInput = {
  /** Connect one existing ScheduledRelease document */
  connect?: InputMaybe<ScheduledReleaseWhereUniqueInput>
  /** Create and connect one ScheduledRelease document */
  create?: InputMaybe<ScheduledReleaseCreateInput>
}

/** An edge in a connection. */
export type ScheduledReleaseEdge = {
  __typename?: 'ScheduledReleaseEdge'
  /** A cursor for use in pagination. */
  cursor: Scalars['String']
  /** The item at the end of the edge. */
  node: ScheduledRelease
}

/** Identifies documents */
export type ScheduledReleaseManyWhereInput = {
  /** Logical AND on all given filters. */
  AND?: InputMaybe<Array<ScheduledReleaseWhereInput>>
  /** Logical NOT on all given filters combined by AND. */
  NOT?: InputMaybe<Array<ScheduledReleaseWhereInput>>
  /** Logical OR on all given filters. */
  OR?: InputMaybe<Array<ScheduledReleaseWhereInput>>
  /** Contains search across all appropriate fields. */
  _search?: InputMaybe<Scalars['String']>
  createdAt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than the given value. */
  createdAt_gt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than or equal the given value. */
  createdAt_gte?: InputMaybe<Scalars['DateTime']>
  /** All values that are contained in given list. */
  createdAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  /** All values less than the given value. */
  createdAt_lt?: InputMaybe<Scalars['DateTime']>
  /** All values less than or equal the given value. */
  createdAt_lte?: InputMaybe<Scalars['DateTime']>
  /** All values that are not equal to given value. */
  createdAt_not?: InputMaybe<Scalars['DateTime']>
  /** All values that are not contained in given list. */
  createdAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  createdBy?: InputMaybe<UserWhereInput>
  description?: InputMaybe<Scalars['String']>
  /** All values containing the given string. */
  description_contains?: InputMaybe<Scalars['String']>
  /** All values ending with the given string. */
  description_ends_with?: InputMaybe<Scalars['String']>
  /** All values that are contained in given list. */
  description_in?: InputMaybe<Array<Scalars['String']>>
  /** All values that are not equal to given value. */
  description_not?: InputMaybe<Scalars['String']>
  /** All values not containing the given string. */
  description_not_contains?: InputMaybe<Scalars['String']>
  /** All values not ending with the given string */
  description_not_ends_with?: InputMaybe<Scalars['String']>
  /** All values that are not contained in given list. */
  description_not_in?: InputMaybe<Array<Scalars['String']>>
  /** All values not starting with the given string. */
  description_not_starts_with?: InputMaybe<Scalars['String']>
  /** All values starting with the given string. */
  description_starts_with?: InputMaybe<Scalars['String']>
  errorMessage?: InputMaybe<Scalars['String']>
  /** All values containing the given string. */
  errorMessage_contains?: InputMaybe<Scalars['String']>
  /** All values ending with the given string. */
  errorMessage_ends_with?: InputMaybe<Scalars['String']>
  /** All values that are contained in given list. */
  errorMessage_in?: InputMaybe<Array<Scalars['String']>>
  /** All values that are not equal to given value. */
  errorMessage_not?: InputMaybe<Scalars['String']>
  /** All values not containing the given string. */
  errorMessage_not_contains?: InputMaybe<Scalars['String']>
  /** All values not ending with the given string */
  errorMessage_not_ends_with?: InputMaybe<Scalars['String']>
  /** All values that are not contained in given list. */
  errorMessage_not_in?: InputMaybe<Array<Scalars['String']>>
  /** All values not starting with the given string. */
  errorMessage_not_starts_with?: InputMaybe<Scalars['String']>
  /** All values starting with the given string. */
  errorMessage_starts_with?: InputMaybe<Scalars['String']>
  id?: InputMaybe<Scalars['ID']>
  /** All values containing the given string. */
  id_contains?: InputMaybe<Scalars['ID']>
  /** All values ending with the given string. */
  id_ends_with?: InputMaybe<Scalars['ID']>
  /** All values that are contained in given list. */
  id_in?: InputMaybe<Array<Scalars['ID']>>
  /** All values that are not equal to given value. */
  id_not?: InputMaybe<Scalars['ID']>
  /** All values not containing the given string. */
  id_not_contains?: InputMaybe<Scalars['ID']>
  /** All values not ending with the given string */
  id_not_ends_with?: InputMaybe<Scalars['ID']>
  /** All values that are not contained in given list. */
  id_not_in?: InputMaybe<Array<Scalars['ID']>>
  /** All values not starting with the given string. */
  id_not_starts_with?: InputMaybe<Scalars['ID']>
  /** All values starting with the given string. */
  id_starts_with?: InputMaybe<Scalars['ID']>
  isActive?: InputMaybe<Scalars['Boolean']>
  /** All values that are not equal to given value. */
  isActive_not?: InputMaybe<Scalars['Boolean']>
  isImplicit?: InputMaybe<Scalars['Boolean']>
  /** All values that are not equal to given value. */
  isImplicit_not?: InputMaybe<Scalars['Boolean']>
  operations_every?: InputMaybe<ScheduledOperationWhereInput>
  operations_none?: InputMaybe<ScheduledOperationWhereInput>
  operations_some?: InputMaybe<ScheduledOperationWhereInput>
  publishedAt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than the given value. */
  publishedAt_gt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than or equal the given value. */
  publishedAt_gte?: InputMaybe<Scalars['DateTime']>
  /** All values that are contained in given list. */
  publishedAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  /** All values less than the given value. */
  publishedAt_lt?: InputMaybe<Scalars['DateTime']>
  /** All values less than or equal the given value. */
  publishedAt_lte?: InputMaybe<Scalars['DateTime']>
  /** All values that are not equal to given value. */
  publishedAt_not?: InputMaybe<Scalars['DateTime']>
  /** All values that are not contained in given list. */
  publishedAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  publishedBy?: InputMaybe<UserWhereInput>
  releaseAt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than the given value. */
  releaseAt_gt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than or equal the given value. */
  releaseAt_gte?: InputMaybe<Scalars['DateTime']>
  /** All values that are contained in given list. */
  releaseAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  /** All values less than the given value. */
  releaseAt_lt?: InputMaybe<Scalars['DateTime']>
  /** All values less than or equal the given value. */
  releaseAt_lte?: InputMaybe<Scalars['DateTime']>
  /** All values that are not equal to given value. */
  releaseAt_not?: InputMaybe<Scalars['DateTime']>
  /** All values that are not contained in given list. */
  releaseAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  status?: InputMaybe<ScheduledReleaseStatus>
  /** All values that are contained in given list. */
  status_in?: InputMaybe<Array<ScheduledReleaseStatus>>
  /** All values that are not equal to given value. */
  status_not?: InputMaybe<ScheduledReleaseStatus>
  /** All values that are not contained in given list. */
  status_not_in?: InputMaybe<Array<ScheduledReleaseStatus>>
  title?: InputMaybe<Scalars['String']>
  /** All values containing the given string. */
  title_contains?: InputMaybe<Scalars['String']>
  /** All values ending with the given string. */
  title_ends_with?: InputMaybe<Scalars['String']>
  /** All values that are contained in given list. */
  title_in?: InputMaybe<Array<Scalars['String']>>
  /** All values that are not equal to given value. */
  title_not?: InputMaybe<Scalars['String']>
  /** All values not containing the given string. */
  title_not_contains?: InputMaybe<Scalars['String']>
  /** All values not ending with the given string */
  title_not_ends_with?: InputMaybe<Scalars['String']>
  /** All values that are not contained in given list. */
  title_not_in?: InputMaybe<Array<Scalars['String']>>
  /** All values not starting with the given string. */
  title_not_starts_with?: InputMaybe<Scalars['String']>
  /** All values starting with the given string. */
  title_starts_with?: InputMaybe<Scalars['String']>
  updatedAt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than the given value. */
  updatedAt_gt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than or equal the given value. */
  updatedAt_gte?: InputMaybe<Scalars['DateTime']>
  /** All values that are contained in given list. */
  updatedAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  /** All values less than the given value. */
  updatedAt_lt?: InputMaybe<Scalars['DateTime']>
  /** All values less than or equal the given value. */
  updatedAt_lte?: InputMaybe<Scalars['DateTime']>
  /** All values that are not equal to given value. */
  updatedAt_not?: InputMaybe<Scalars['DateTime']>
  /** All values that are not contained in given list. */
  updatedAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  updatedBy?: InputMaybe<UserWhereInput>
}

export enum ScheduledReleaseOrderByInput {
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC',
  DescriptionAsc = 'description_ASC',
  DescriptionDesc = 'description_DESC',
  ErrorMessageAsc = 'errorMessage_ASC',
  ErrorMessageDesc = 'errorMessage_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  IsActiveAsc = 'isActive_ASC',
  IsActiveDesc = 'isActive_DESC',
  IsImplicitAsc = 'isImplicit_ASC',
  IsImplicitDesc = 'isImplicit_DESC',
  PublishedAtAsc = 'publishedAt_ASC',
  PublishedAtDesc = 'publishedAt_DESC',
  ReleaseAtAsc = 'releaseAt_ASC',
  ReleaseAtDesc = 'releaseAt_DESC',
  StatusAsc = 'status_ASC',
  StatusDesc = 'status_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
  UpdatedAtAsc = 'updatedAt_ASC',
  UpdatedAtDesc = 'updatedAt_DESC',
}

/** System Scheduled Release Status */
export enum ScheduledReleaseStatus {
  Completed = 'COMPLETED',
  Failed = 'FAILED',
  InProgress = 'IN_PROGRESS',
  Pending = 'PENDING',
}

export type ScheduledReleaseUpdateInput = {
  description?: InputMaybe<Scalars['String']>
  errorMessage?: InputMaybe<Scalars['String']>
  isActive?: InputMaybe<Scalars['Boolean']>
  releaseAt?: InputMaybe<Scalars['DateTime']>
  title?: InputMaybe<Scalars['String']>
}

export type ScheduledReleaseUpdateManyInlineInput = {
  /** Connect multiple existing ScheduledRelease documents */
  connect?: InputMaybe<Array<ScheduledReleaseConnectInput>>
  /** Create and connect multiple ScheduledRelease documents */
  create?: InputMaybe<Array<ScheduledReleaseCreateInput>>
  /** Delete multiple ScheduledRelease documents */
  delete?: InputMaybe<Array<ScheduledReleaseWhereUniqueInput>>
  /** Disconnect multiple ScheduledRelease documents */
  disconnect?: InputMaybe<Array<ScheduledReleaseWhereUniqueInput>>
  /** Override currently-connected documents with multiple existing ScheduledRelease documents */
  set?: InputMaybe<Array<ScheduledReleaseWhereUniqueInput>>
  /** Update multiple ScheduledRelease documents */
  update?: InputMaybe<Array<ScheduledReleaseUpdateWithNestedWhereUniqueInput>>
  /** Upsert multiple ScheduledRelease documents */
  upsert?: InputMaybe<Array<ScheduledReleaseUpsertWithNestedWhereUniqueInput>>
}

export type ScheduledReleaseUpdateManyInput = {
  description?: InputMaybe<Scalars['String']>
  errorMessage?: InputMaybe<Scalars['String']>
  isActive?: InputMaybe<Scalars['Boolean']>
  releaseAt?: InputMaybe<Scalars['DateTime']>
  title?: InputMaybe<Scalars['String']>
}

export type ScheduledReleaseUpdateManyWithNestedWhereInput = {
  /** Update many input */
  data: ScheduledReleaseUpdateManyInput
  /** Document search */
  where: ScheduledReleaseWhereInput
}

export type ScheduledReleaseUpdateOneInlineInput = {
  /** Connect existing ScheduledRelease document */
  connect?: InputMaybe<ScheduledReleaseWhereUniqueInput>
  /** Create and connect one ScheduledRelease document */
  create?: InputMaybe<ScheduledReleaseCreateInput>
  /** Delete currently connected ScheduledRelease document */
  delete?: InputMaybe<Scalars['Boolean']>
  /** Disconnect currently connected ScheduledRelease document */
  disconnect?: InputMaybe<Scalars['Boolean']>
  /** Update single ScheduledRelease document */
  update?: InputMaybe<ScheduledReleaseUpdateWithNestedWhereUniqueInput>
  /** Upsert single ScheduledRelease document */
  upsert?: InputMaybe<ScheduledReleaseUpsertWithNestedWhereUniqueInput>
}

export type ScheduledReleaseUpdateWithNestedWhereUniqueInput = {
  /** Document to update */
  data: ScheduledReleaseUpdateInput
  /** Unique document search */
  where: ScheduledReleaseWhereUniqueInput
}

export type ScheduledReleaseUpsertInput = {
  /** Create document if it didn't exist */
  create: ScheduledReleaseCreateInput
  /** Update document if it exists */
  update: ScheduledReleaseUpdateInput
}

export type ScheduledReleaseUpsertWithNestedWhereUniqueInput = {
  /** Upsert data */
  data: ScheduledReleaseUpsertInput
  /** Unique document search */
  where: ScheduledReleaseWhereUniqueInput
}

/** Identifies documents */
export type ScheduledReleaseWhereInput = {
  /** Logical AND on all given filters. */
  AND?: InputMaybe<Array<ScheduledReleaseWhereInput>>
  /** Logical NOT on all given filters combined by AND. */
  NOT?: InputMaybe<Array<ScheduledReleaseWhereInput>>
  /** Logical OR on all given filters. */
  OR?: InputMaybe<Array<ScheduledReleaseWhereInput>>
  /** Contains search across all appropriate fields. */
  _search?: InputMaybe<Scalars['String']>
  createdAt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than the given value. */
  createdAt_gt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than or equal the given value. */
  createdAt_gte?: InputMaybe<Scalars['DateTime']>
  /** All values that are contained in given list. */
  createdAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  /** All values less than the given value. */
  createdAt_lt?: InputMaybe<Scalars['DateTime']>
  /** All values less than or equal the given value. */
  createdAt_lte?: InputMaybe<Scalars['DateTime']>
  /** All values that are not equal to given value. */
  createdAt_not?: InputMaybe<Scalars['DateTime']>
  /** All values that are not contained in given list. */
  createdAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  createdBy?: InputMaybe<UserWhereInput>
  description?: InputMaybe<Scalars['String']>
  /** All values containing the given string. */
  description_contains?: InputMaybe<Scalars['String']>
  /** All values ending with the given string. */
  description_ends_with?: InputMaybe<Scalars['String']>
  /** All values that are contained in given list. */
  description_in?: InputMaybe<Array<Scalars['String']>>
  /** All values that are not equal to given value. */
  description_not?: InputMaybe<Scalars['String']>
  /** All values not containing the given string. */
  description_not_contains?: InputMaybe<Scalars['String']>
  /** All values not ending with the given string */
  description_not_ends_with?: InputMaybe<Scalars['String']>
  /** All values that are not contained in given list. */
  description_not_in?: InputMaybe<Array<Scalars['String']>>
  /** All values not starting with the given string. */
  description_not_starts_with?: InputMaybe<Scalars['String']>
  /** All values starting with the given string. */
  description_starts_with?: InputMaybe<Scalars['String']>
  errorMessage?: InputMaybe<Scalars['String']>
  /** All values containing the given string. */
  errorMessage_contains?: InputMaybe<Scalars['String']>
  /** All values ending with the given string. */
  errorMessage_ends_with?: InputMaybe<Scalars['String']>
  /** All values that are contained in given list. */
  errorMessage_in?: InputMaybe<Array<Scalars['String']>>
  /** All values that are not equal to given value. */
  errorMessage_not?: InputMaybe<Scalars['String']>
  /** All values not containing the given string. */
  errorMessage_not_contains?: InputMaybe<Scalars['String']>
  /** All values not ending with the given string */
  errorMessage_not_ends_with?: InputMaybe<Scalars['String']>
  /** All values that are not contained in given list. */
  errorMessage_not_in?: InputMaybe<Array<Scalars['String']>>
  /** All values not starting with the given string. */
  errorMessage_not_starts_with?: InputMaybe<Scalars['String']>
  /** All values starting with the given string. */
  errorMessage_starts_with?: InputMaybe<Scalars['String']>
  id?: InputMaybe<Scalars['ID']>
  /** All values containing the given string. */
  id_contains?: InputMaybe<Scalars['ID']>
  /** All values ending with the given string. */
  id_ends_with?: InputMaybe<Scalars['ID']>
  /** All values that are contained in given list. */
  id_in?: InputMaybe<Array<Scalars['ID']>>
  /** All values that are not equal to given value. */
  id_not?: InputMaybe<Scalars['ID']>
  /** All values not containing the given string. */
  id_not_contains?: InputMaybe<Scalars['ID']>
  /** All values not ending with the given string */
  id_not_ends_with?: InputMaybe<Scalars['ID']>
  /** All values that are not contained in given list. */
  id_not_in?: InputMaybe<Array<Scalars['ID']>>
  /** All values not starting with the given string. */
  id_not_starts_with?: InputMaybe<Scalars['ID']>
  /** All values starting with the given string. */
  id_starts_with?: InputMaybe<Scalars['ID']>
  isActive?: InputMaybe<Scalars['Boolean']>
  /** All values that are not equal to given value. */
  isActive_not?: InputMaybe<Scalars['Boolean']>
  isImplicit?: InputMaybe<Scalars['Boolean']>
  /** All values that are not equal to given value. */
  isImplicit_not?: InputMaybe<Scalars['Boolean']>
  operations_every?: InputMaybe<ScheduledOperationWhereInput>
  operations_none?: InputMaybe<ScheduledOperationWhereInput>
  operations_some?: InputMaybe<ScheduledOperationWhereInput>
  publishedAt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than the given value. */
  publishedAt_gt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than or equal the given value. */
  publishedAt_gte?: InputMaybe<Scalars['DateTime']>
  /** All values that are contained in given list. */
  publishedAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  /** All values less than the given value. */
  publishedAt_lt?: InputMaybe<Scalars['DateTime']>
  /** All values less than or equal the given value. */
  publishedAt_lte?: InputMaybe<Scalars['DateTime']>
  /** All values that are not equal to given value. */
  publishedAt_not?: InputMaybe<Scalars['DateTime']>
  /** All values that are not contained in given list. */
  publishedAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  publishedBy?: InputMaybe<UserWhereInput>
  releaseAt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than the given value. */
  releaseAt_gt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than or equal the given value. */
  releaseAt_gte?: InputMaybe<Scalars['DateTime']>
  /** All values that are contained in given list. */
  releaseAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  /** All values less than the given value. */
  releaseAt_lt?: InputMaybe<Scalars['DateTime']>
  /** All values less than or equal the given value. */
  releaseAt_lte?: InputMaybe<Scalars['DateTime']>
  /** All values that are not equal to given value. */
  releaseAt_not?: InputMaybe<Scalars['DateTime']>
  /** All values that are not contained in given list. */
  releaseAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  status?: InputMaybe<ScheduledReleaseStatus>
  /** All values that are contained in given list. */
  status_in?: InputMaybe<Array<ScheduledReleaseStatus>>
  /** All values that are not equal to given value. */
  status_not?: InputMaybe<ScheduledReleaseStatus>
  /** All values that are not contained in given list. */
  status_not_in?: InputMaybe<Array<ScheduledReleaseStatus>>
  title?: InputMaybe<Scalars['String']>
  /** All values containing the given string. */
  title_contains?: InputMaybe<Scalars['String']>
  /** All values ending with the given string. */
  title_ends_with?: InputMaybe<Scalars['String']>
  /** All values that are contained in given list. */
  title_in?: InputMaybe<Array<Scalars['String']>>
  /** All values that are not equal to given value. */
  title_not?: InputMaybe<Scalars['String']>
  /** All values not containing the given string. */
  title_not_contains?: InputMaybe<Scalars['String']>
  /** All values not ending with the given string */
  title_not_ends_with?: InputMaybe<Scalars['String']>
  /** All values that are not contained in given list. */
  title_not_in?: InputMaybe<Array<Scalars['String']>>
  /** All values not starting with the given string. */
  title_not_starts_with?: InputMaybe<Scalars['String']>
  /** All values starting with the given string. */
  title_starts_with?: InputMaybe<Scalars['String']>
  updatedAt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than the given value. */
  updatedAt_gt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than or equal the given value. */
  updatedAt_gte?: InputMaybe<Scalars['DateTime']>
  /** All values that are contained in given list. */
  updatedAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  /** All values less than the given value. */
  updatedAt_lt?: InputMaybe<Scalars['DateTime']>
  /** All values less than or equal the given value. */
  updatedAt_lte?: InputMaybe<Scalars['DateTime']>
  /** All values that are not equal to given value. */
  updatedAt_not?: InputMaybe<Scalars['DateTime']>
  /** All values that are not contained in given list. */
  updatedAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  updatedBy?: InputMaybe<UserWhereInput>
}

/** References ScheduledRelease record uniquely */
export type ScheduledReleaseWhereUniqueInput = {
  id?: InputMaybe<Scalars['ID']>
}

/** These types represent reasons for why the self-change flow cannot be run. */
export enum SelfChangeBlocker {
  /** Member has multiple contracts with mismatching number of co-insured. */
  CoinsuredMismatch = 'COINSURED_MISMATCH',
  /** Contract is already undergoing future changes. */
  HasFutureChanges = 'HAS_FUTURE_CHANGES',
  /** Contract has a termination date set. */
  HasTermination = 'HAS_TERMINATION',
  /** Contract is not currently active. */
  NotActiveToday = 'NOT_ACTIVE_TODAY',
  /** Member has no contracts - changing them makes no sense. */
  NoContracts = 'NO_CONTRACTS',
  /** Contract is still pending, it can't be changed until it is active. */
  StillPending = 'STILL_PENDING',
  /** Member has too many contracts. */
  TooManyContracts = 'TOO_MANY_CONTRACTS',
  /** Member has at least one contract that is not supported at this time */
  UnsupportedContract = 'UNSUPPORTED_CONTRACT',
  /** Member has multiple contracts with mismatching 'youth' status. */
  YouthMismatch = 'YOUTH_MISMATCH',
}

export type SelfChangeEligibility = {
  __typename?: 'SelfChangeEligibility'
  /** The ID of an embark story that contains an address change flow, if eligible. */
  addressChangeEmbarkStoryId?: Maybe<Scalars['ID']>
  /** @deprecated Use addressChangeEmbarkStoryId instead */
  blockers: Array<SelfChangeBlocker>
  /** @deprecated Use addressChangeEmbarkStoryId instead */
  embarkStoryId?: Maybe<Scalars['ID']>
}

export type SessionInformation = {
  __typename?: 'SessionInformation'
  memberId: Scalars['String']
  token: Scalars['String']
}

export type SignEvent = {
  __typename?: 'SignEvent'
  status?: Maybe<SignStatus>
}

export enum SignMethod {
  ApproveOnly = 'APPROVE_ONLY',
  DanishBankId = 'DANISH_BANK_ID',
  NorwegianBankId = 'NORWEGIAN_BANK_ID',
  SimpleSign = 'SIMPLE_SIGN',
  SwedishBankId = 'SWEDISH_BANK_ID',
}

export type SignOrApprove = ApproveQuoteResponse | SignQuoteResponse

export type SignQuoteResponse = {
  __typename?: 'SignQuoteResponse'
  signResponse: StartSignResponse
}

export type SignQuotesInput = {
  failUrl?: InputMaybe<Scalars['String']>
  quoteIds: Array<Scalars['ID']>
  successUrl?: InputMaybe<Scalars['String']>
}

export enum SignState {
  Completed = 'COMPLETED',
  Failed = 'FAILED',
  Initiated = 'INITIATED',
  InProgress = 'IN_PROGRESS',
}

export type SignStatus = {
  __typename?: 'SignStatus'
  collectStatus?: Maybe<CollectStatus>
  signState?: Maybe<SignState>
}

export type SimpleSignSession = {
  __typename?: 'SimpleSignSession'
  id: Scalars['ID']
}

/** Stage system enumeration */
export enum Stage {
  /** The Draft is the default stage for all your content. */
  Draft = 'DRAFT',
  /** The Published stage is where you can publish your content to. */
  Published = 'PUBLISHED',
}

export type StartCheckoutResult = BasicError | QuoteCart

export type StartSignResponse =
  | DanishBankIdSession
  | FailedToStartSign
  | NorwegianBankIdSession
  | SimpleSignSession
  | SwedishBankIdSession

export type StoredCardDetails = {
  __typename?: 'StoredCardDetails'
  brand?: Maybe<Scalars['String']>
  cardName?: Maybe<Scalars['String']>
  expiryMonth: Scalars['String']
  expiryYear: Scalars['String']
  holderName?: Maybe<Scalars['String']>
  id: Scalars['String']
  lastFourDigits: Scalars['String']
}

export type StoredPaymentMethodsDetails = {
  __typename?: 'StoredPaymentMethodsDetails'
  brand?: Maybe<Scalars['String']>
  cardName?: Maybe<Scalars['String']>
  expiryMonth: Scalars['String']
  expiryYear: Scalars['String']
  holderName?: Maybe<Scalars['String']>
  id: Scalars['String']
  lastFourDigits: Scalars['String']
}

export type StoredThirdPartyDetails = {
  __typename?: 'StoredThirdPartyDetails'
  name: Scalars['String']
  type: Scalars['String']
}

export type SubmitAdyenRedirectionInput = {
  md: Scalars['String']
  pares: Scalars['String']
}

export type SubmitAdyenRedirectionRequest = {
  md: Scalars['String']
  pares: Scalars['String']
}

export type SubmitAdyenRedirectionResponse = {
  __typename?: 'SubmitAdyenRedirectionResponse'
  resultCode: Scalars['String']
}

export type Subscription = {
  __typename?: 'Subscription'
  _?: Maybe<Scalars['Boolean']>
  authStatus?: Maybe<AuthEvent>
  chatState: ChatState
  currentChatResponse?: Maybe<ChatResponse>
  /** @deprecated use dataCollectionStatusV2 instead */
  dataCollectionStatus?: Maybe<DataCollectingStatusResponse>
  dataCollectionStatusV2: DataCollectingStatusResponseV2
  message: Message
  quoteCart?: Maybe<QuoteCart>
  signStatus?: Maybe<SignEvent>
}

export type SubscriptionChatStateArgs = {
  mostRecentTimestamp: Scalars['String']
}

export type SubscriptionCurrentChatResponseArgs = {
  mostRecentTimestamp: Scalars['String']
}

export type SubscriptionDataCollectionStatusArgs = {
  reference: Scalars['ID']
}

export type SubscriptionDataCollectionStatusV2Args = {
  reference: Scalars['ID']
}

export type SubscriptionQuoteCartArgs = {
  id: Scalars['ID']
}

/**  Generic success type for mutation success cases when there is nothing to return.  */
export type Success = {
  __typename?: 'Success'
  _?: Maybe<Scalars['Boolean']>
}

export type SuccessfulRedeemResult = {
  __typename?: 'SuccessfulRedeemResult'
  campaigns: Array<Campaign>
  cost?: Maybe<InsuranceCost>
}

export type SuccessfullyRemovedCampaignsResult = {
  __typename?: 'SuccessfullyRemovedCampaignsResult'
  campaignCodes: Array<Scalars['String']>
  insuranceCost?: Maybe<InsuranceCost>
}

export type SuccessfullyUpdatedCode = {
  __typename?: 'SuccessfullyUpdatedCode'
  code: Scalars['String']
}

export type SwedishAccidentAgreement = AgreementCore & {
  __typename?: 'SwedishAccidentAgreement'
  activeFrom?: Maybe<Scalars['LocalDate']>
  activeTo?: Maybe<Scalars['LocalDate']>
  address: Address
  carrier?: Maybe<Scalars['String']>
  certificateUrl?: Maybe<Scalars['String']>
  id: Scalars['ID']
  numberCoInsured: Scalars['Int']
  partner?: Maybe<Scalars['String']>
  premium: MonetaryAmountV2
  squareMeters: Scalars['Int']
  status: AgreementStatus
  type: SwedishAccidentLineOfBusiness
}

export type SwedishAccidentDetails = {
  __typename?: 'SwedishAccidentDetails'
  householdSize: Scalars['Int']
  isStudent: Scalars['Boolean']
  livingSpace: Scalars['Int']
  street: Scalars['String']
  zipCode: Scalars['String']
}

export enum SwedishAccidentLineOfBusiness {
  Regular = 'REGULAR',
  Student = 'STUDENT',
}

export type SwedishApartmentAgreement = AgreementCore & {
  __typename?: 'SwedishApartmentAgreement'
  activeFrom?: Maybe<Scalars['LocalDate']>
  activeTo?: Maybe<Scalars['LocalDate']>
  address: Address
  carrier?: Maybe<Scalars['String']>
  certificateUrl?: Maybe<Scalars['String']>
  id: Scalars['ID']
  numberCoInsured: Scalars['Int']
  partner?: Maybe<Scalars['String']>
  premium: MonetaryAmountV2
  squareMeters: Scalars['Int']
  status: AgreementStatus
  type: SwedishApartmentLineOfBusiness
}

export enum SwedishApartmentLineOfBusiness {
  Brf = 'BRF',
  Rent = 'RENT',
  StudentBrf = 'STUDENT_BRF',
  StudentRent = 'STUDENT_RENT',
}

export type SwedishApartmentQuoteDetails = {
  __typename?: 'SwedishApartmentQuoteDetails'
  householdSize: Scalars['Int']
  livingSpace: Scalars['Int']
  street: Scalars['String']
  type: SwedishApartmentType
  zipCode: Scalars['String']
}

export enum SwedishApartmentType {
  Brf = 'BRF',
  Rent = 'RENT',
  StudentBrf = 'STUDENT_BRF',
  StudentRent = 'STUDENT_RENT',
}

export type SwedishBankIdExtraInfo = {
  __typename?: 'SwedishBankIdExtraInfo'
  autoStartToken?: Maybe<Scalars['ID']>
  swedishBankIdQrCode?: Maybe<Scalars['String']>
}

export type SwedishBankIdSession = {
  __typename?: 'SwedishBankIdSession'
  autoStartToken?: Maybe<Scalars['String']>
}

export type SwedishCarAgreement = AgreementCore & {
  __typename?: 'SwedishCarAgreement'
  activeFrom?: Maybe<Scalars['LocalDate']>
  activeTo?: Maybe<Scalars['LocalDate']>
  address: Address
  carrier?: Maybe<Scalars['String']>
  certificateUrl?: Maybe<Scalars['String']>
  id: Scalars['ID']
  mileage?: Maybe<Scalars['Int']>
  partner?: Maybe<Scalars['String']>
  premium: MonetaryAmountV2
  registrationNumber?: Maybe<Scalars['String']>
  status: AgreementStatus
  type: SwedishCarLineOfBusiness
}

export type SwedishCarDetails = {
  __typename?: 'SwedishCarDetails'
  info?: Maybe<SwedishCarInfo>
  mileage: Scalars['Int']
  registrationNumber: Scalars['String']
}

export type SwedishCarInfo = {
  __typename?: 'SwedishCarInfo'
  makeAndModel?: Maybe<Scalars['String']>
  model?: Maybe<Scalars['String']>
  modelYear?: Maybe<Scalars['String']>
}

export enum SwedishCarLineOfBusiness {
  Full = 'FULL',
  Half = 'HALF',
  Traffic = 'TRAFFIC',
}

export type SwedishHouseAgreement = AgreementCore & {
  __typename?: 'SwedishHouseAgreement'
  activeFrom?: Maybe<Scalars['LocalDate']>
  activeTo?: Maybe<Scalars['LocalDate']>
  address: Address
  ancillaryArea: Scalars['Int']
  carrier?: Maybe<Scalars['String']>
  certificateUrl?: Maybe<Scalars['String']>
  extraBuildings: Array<Maybe<ExtraBuilding>>
  id: Scalars['ID']
  isSubleted: Scalars['Boolean']
  numberCoInsured: Scalars['Int']
  numberOfBathrooms: Scalars['Int']
  partner?: Maybe<Scalars['String']>
  premium: MonetaryAmountV2
  squareMeters: Scalars['Int']
  status: AgreementStatus
  yearOfConstruction: Scalars['Int']
}

export type SwedishHouseQuoteDetails = {
  __typename?: 'SwedishHouseQuoteDetails'
  ancillarySpace: Scalars['Int']
  extraBuildings: Array<ExtraBuilding>
  householdSize: Scalars['Int']
  isSubleted: Scalars['Boolean']
  livingSpace: Scalars['Int']
  numberOfBathrooms: Scalars['Int']
  street: Scalars['String']
  yearOfConstruction: Scalars['Int']
  zipCode: Scalars['String']
}

export type SwedishQasaRentalAgreement = AgreementCore & {
  __typename?: 'SwedishQasaRentalAgreement'
  activeFrom?: Maybe<Scalars['LocalDate']>
  activeTo?: Maybe<Scalars['LocalDate']>
  address: Address
  carrier?: Maybe<Scalars['String']>
  certificateUrl?: Maybe<Scalars['String']>
  id: Scalars['ID']
  monthlyRentalAmount: Scalars['Int']
  partner?: Maybe<Scalars['String']>
  premium: MonetaryAmountV2
  referenceNo?: Maybe<Scalars['String']>
  status: AgreementStatus
  tenantName: Scalars['String']
  totalRentalAmount: Scalars['Int']
  type: SwedishQasaRentalType
}

export enum SwedishQasaRentalType {
  LongTerm = 'LONG_TERM',
  ShortTerm = 'SHORT_TERM',
}

export enum SystemDateTimeFieldVariation {
  Base = 'BASE',
  Combined = 'COMBINED',
  Localization = 'LOCALIZATION',
}

export type Table = {
  __typename?: 'Table'
  sections: Array<TableSection>
  title: Scalars['String']
}

export type TableRow = {
  __typename?: 'TableRow'
  subtitle?: Maybe<Scalars['String']>
  title: Scalars['String']
  value: Scalars['String']
}

export type TableSection = {
  __typename?: 'TableSection'
  rows: Array<TableRow>
  title: Scalars['String']
}

/** The contract is active today but will be terminated in the future, i.e. is active today but will not be in the future */
export type TerminatedInFutureStatus = {
  __typename?: 'TerminatedInFutureStatus'
  futureTermination?: Maybe<Scalars['LocalDate']>
  upcomingAgreementChange?: Maybe<UpcomingAgreementChange>
}

export type TerminatedReferral = {
  __typename?: 'TerminatedReferral'
  name?: Maybe<Scalars['String']>
}

/** The contract has been terminated in the past, terminated on the same date as its start date or has never been activated and has a termination date set */
export type TerminatedStatus = {
  __typename?: 'TerminatedStatus'
  termination?: Maybe<Scalars['LocalDate']>
}

/** The contract has been active and has its termination date set to today, i.e. today is the last day the contract is active */
export type TerminatedTodayStatus = {
  __typename?: 'TerminatedTodayStatus'
  today?: Maybe<Scalars['LocalDate']>
  upcomingAgreementChange?: Maybe<UpcomingAgreementChange>
}

export enum TextContentType {
  AddressCity = 'ADDRESS_CITY',
  AddressCityState = 'ADDRESS_CITY_STATE',
  AddressState = 'ADDRESS_STATE',
  CountryName = 'COUNTRY_NAME',
  CreditCardNumber = 'CREDIT_CARD_NUMBER',
  EmailAddress = 'EMAIL_ADDRESS',
  FamilyName = 'FAMILY_NAME',
  FullStreetAddress = 'FULL_STREET_ADDRESS',
  GivenName = 'GIVEN_NAME',
  JobTitle = 'JOB_TITLE',
  Location = 'LOCATION',
  MiddleName = 'MIDDLE_NAME',
  Name = 'NAME',
  NamePrefix = 'NAME_PREFIX',
  NameSuffix = 'NAME_SUFFIX',
  NickName = 'NICK_NAME',
  None = 'NONE',
  OrganizationName = 'ORGANIZATION_NAME',
  Password = 'PASSWORD',
  PostalCode = 'POSTAL_CODE',
  StreetAddressLine1 = 'STREET_ADDRESS_LINE1',
  StreetAddressLine2 = 'STREET_ADDRESS_LINE2',
  Sublocality = 'SUBLOCALITY',
  TelephoneNumber = 'TELEPHONE_NUMBER',
  Url = 'URL',
  Username = 'USERNAME',
}

export type TitleAndBulletPoints = {
  __typename?: 'TitleAndBulletPoints'
  bulletPoints: Array<BulletPoints>
  buttonTitle: Scalars['String']
  /** @deprecated not used */
  claimFirstMessage: Scalars['String']
  color: HedvigColor
  title: Scalars['String']
}

export enum TokenStatus {
  Authorised = 'AUTHORISED',
  Failed = 'FAILED',
  Pending = 'PENDING',
}

export enum TokenizationChannel {
  Android = 'ANDROID',
  Ios = 'IOS',
  Web = 'WEB',
}

export type TokenizationRequest = {
  browserInfo?: InputMaybe<BrowserInfo>
  channel: TokenizationChannel
  paymentMethodDetails: Scalars['PaymentMethodDetails']
  returnUrl: Scalars['String']
}

export type TokenizationResponse = TokenizationResponseAction | TokenizationResponseFinished

export type TokenizationResponseAction = {
  __typename?: 'TokenizationResponseAction'
  action: Scalars['CheckoutPaymentsAction']
}

export type TokenizationResponseFinished = {
  __typename?: 'TokenizationResponseFinished'
  resultCode: Scalars['String']
  tokenizationResult: TokenizationResultType
}

export enum TokenizationResultType {
  Completed = 'COMPLETED',
  Failed = 'FAILED',
  Pending = 'PENDING',
}

export type Translation = Node & {
  __typename?: 'Translation'
  /** The time the document was created */
  createdAt: Scalars['DateTime']
  /** User that created this document */
  createdBy?: Maybe<User>
  /** Get the document in other stages */
  documentInStages: Array<Translation>
  /** List of Translation versions */
  history: Array<Version>
  /** The unique identifier */
  id: Scalars['ID']
  key?: Maybe<Key>
  keys: Array<Key>
  language?: Maybe<Language>
  /** The time the document was published. Null on documents in draft stage. */
  publishedAt?: Maybe<Scalars['DateTime']>
  /** User that last published this document */
  publishedBy?: Maybe<User>
  scheduledIn: Array<ScheduledOperation>
  /** System stage field */
  stage: Stage
  /** The time the document was updated */
  updatedAt: Scalars['DateTime']
  /** User that last updated this document */
  updatedBy?: Maybe<User>
}

export type TranslationCreatedByArgs = {
  locales?: InputMaybe<Array<Locale>>
}

export type TranslationDocumentInStagesArgs = {
  includeCurrent?: Scalars['Boolean']
  inheritLocale?: Scalars['Boolean']
  stages?: Array<Stage>
}

export type TranslationHistoryArgs = {
  limit?: Scalars['Int']
  skip?: Scalars['Int']
  stageOverride?: InputMaybe<Stage>
}

export type TranslationKeyArgs = {
  locales?: InputMaybe<Array<Locale>>
}

export type TranslationKeysArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  locales?: InputMaybe<Array<Locale>>
  orderBy?: InputMaybe<KeyOrderByInput>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<KeyWhereInput>
}

export type TranslationLanguageArgs = {
  locales?: InputMaybe<Array<Locale>>
}

export type TranslationPublishedByArgs = {
  locales?: InputMaybe<Array<Locale>>
}

export type TranslationScheduledInArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  locales?: InputMaybe<Array<Locale>>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<ScheduledOperationWhereInput>
}

export type TranslationUpdatedByArgs = {
  locales?: InputMaybe<Array<Locale>>
}

export type TranslationConnectInput = {
  /** Allow to specify document position in list of connected documents, will default to appending at end of list */
  position?: InputMaybe<ConnectPositionInput>
  /** Document to connect */
  where: TranslationWhereUniqueInput
}

/** A connection to a list of items. */
export type TranslationConnection = {
  __typename?: 'TranslationConnection'
  aggregate: Aggregate
  /** A list of edges. */
  edges: Array<TranslationEdge>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
}

export type TranslationCreateInput = {
  createdAt?: InputMaybe<Scalars['DateTime']>
  key?: InputMaybe<KeyCreateOneInlineInput>
  keys?: InputMaybe<KeyCreateManyInlineInput>
  language?: InputMaybe<LanguageCreateOneInlineInput>
  updatedAt?: InputMaybe<Scalars['DateTime']>
}

export type TranslationCreateManyInlineInput = {
  /** Connect multiple existing Translation documents */
  connect?: InputMaybe<Array<TranslationWhereUniqueInput>>
  /** Create and connect multiple existing Translation documents */
  create?: InputMaybe<Array<TranslationCreateInput>>
}

export type TranslationCreateOneInlineInput = {
  /** Connect one existing Translation document */
  connect?: InputMaybe<TranslationWhereUniqueInput>
  /** Create and connect one Translation document */
  create?: InputMaybe<TranslationCreateInput>
}

/** An edge in a connection. */
export type TranslationEdge = {
  __typename?: 'TranslationEdge'
  /** A cursor for use in pagination. */
  cursor: Scalars['String']
  /** The item at the end of the edge. */
  node: Translation
}

/** Identifies documents */
export type TranslationManyWhereInput = {
  /** Logical AND on all given filters. */
  AND?: InputMaybe<Array<TranslationWhereInput>>
  /** Logical NOT on all given filters combined by AND. */
  NOT?: InputMaybe<Array<TranslationWhereInput>>
  /** Logical OR on all given filters. */
  OR?: InputMaybe<Array<TranslationWhereInput>>
  /** Contains search across all appropriate fields. */
  _search?: InputMaybe<Scalars['String']>
  createdAt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than the given value. */
  createdAt_gt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than or equal the given value. */
  createdAt_gte?: InputMaybe<Scalars['DateTime']>
  /** All values that are contained in given list. */
  createdAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  /** All values less than the given value. */
  createdAt_lt?: InputMaybe<Scalars['DateTime']>
  /** All values less than or equal the given value. */
  createdAt_lte?: InputMaybe<Scalars['DateTime']>
  /** All values that are not equal to given value. */
  createdAt_not?: InputMaybe<Scalars['DateTime']>
  /** All values that are not contained in given list. */
  createdAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  createdBy?: InputMaybe<UserWhereInput>
  id?: InputMaybe<Scalars['ID']>
  /** All values containing the given string. */
  id_contains?: InputMaybe<Scalars['ID']>
  /** All values ending with the given string. */
  id_ends_with?: InputMaybe<Scalars['ID']>
  /** All values that are contained in given list. */
  id_in?: InputMaybe<Array<Scalars['ID']>>
  /** All values that are not equal to given value. */
  id_not?: InputMaybe<Scalars['ID']>
  /** All values not containing the given string. */
  id_not_contains?: InputMaybe<Scalars['ID']>
  /** All values not ending with the given string */
  id_not_ends_with?: InputMaybe<Scalars['ID']>
  /** All values that are not contained in given list. */
  id_not_in?: InputMaybe<Array<Scalars['ID']>>
  /** All values not starting with the given string. */
  id_not_starts_with?: InputMaybe<Scalars['ID']>
  /** All values starting with the given string. */
  id_starts_with?: InputMaybe<Scalars['ID']>
  key?: InputMaybe<KeyWhereInput>
  keys_every?: InputMaybe<KeyWhereInput>
  keys_none?: InputMaybe<KeyWhereInput>
  keys_some?: InputMaybe<KeyWhereInput>
  language?: InputMaybe<LanguageWhereInput>
  publishedAt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than the given value. */
  publishedAt_gt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than or equal the given value. */
  publishedAt_gte?: InputMaybe<Scalars['DateTime']>
  /** All values that are contained in given list. */
  publishedAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  /** All values less than the given value. */
  publishedAt_lt?: InputMaybe<Scalars['DateTime']>
  /** All values less than or equal the given value. */
  publishedAt_lte?: InputMaybe<Scalars['DateTime']>
  /** All values that are not equal to given value. */
  publishedAt_not?: InputMaybe<Scalars['DateTime']>
  /** All values that are not contained in given list. */
  publishedAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  publishedBy?: InputMaybe<UserWhereInput>
  scheduledIn_every?: InputMaybe<ScheduledOperationWhereInput>
  scheduledIn_none?: InputMaybe<ScheduledOperationWhereInput>
  scheduledIn_some?: InputMaybe<ScheduledOperationWhereInput>
  updatedAt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than the given value. */
  updatedAt_gt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than or equal the given value. */
  updatedAt_gte?: InputMaybe<Scalars['DateTime']>
  /** All values that are contained in given list. */
  updatedAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  /** All values less than the given value. */
  updatedAt_lt?: InputMaybe<Scalars['DateTime']>
  /** All values less than or equal the given value. */
  updatedAt_lte?: InputMaybe<Scalars['DateTime']>
  /** All values that are not equal to given value. */
  updatedAt_not?: InputMaybe<Scalars['DateTime']>
  /** All values that are not contained in given list. */
  updatedAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  updatedBy?: InputMaybe<UserWhereInput>
}

export enum TranslationOrderByInput {
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  PublishedAtAsc = 'publishedAt_ASC',
  PublishedAtDesc = 'publishedAt_DESC',
  UpdatedAtAsc = 'updatedAt_ASC',
  UpdatedAtDesc = 'updatedAt_DESC',
}

export type TranslationUpdateInput = {
  key?: InputMaybe<KeyUpdateOneInlineInput>
  keys?: InputMaybe<KeyUpdateManyInlineInput>
  language?: InputMaybe<LanguageUpdateOneInlineInput>
}

export type TranslationUpdateManyInlineInput = {
  /** Connect multiple existing Translation documents */
  connect?: InputMaybe<Array<TranslationConnectInput>>
  /** Create and connect multiple Translation documents */
  create?: InputMaybe<Array<TranslationCreateInput>>
  /** Delete multiple Translation documents */
  delete?: InputMaybe<Array<TranslationWhereUniqueInput>>
  /** Disconnect multiple Translation documents */
  disconnect?: InputMaybe<Array<TranslationWhereUniqueInput>>
  /** Override currently-connected documents with multiple existing Translation documents */
  set?: InputMaybe<Array<TranslationWhereUniqueInput>>
  /** Update multiple Translation documents */
  update?: InputMaybe<Array<TranslationUpdateWithNestedWhereUniqueInput>>
  /** Upsert multiple Translation documents */
  upsert?: InputMaybe<Array<TranslationUpsertWithNestedWhereUniqueInput>>
}

export type TranslationUpdateManyInput = {
  /** No fields in updateMany data input */
  _?: InputMaybe<Scalars['String']>
}

export type TranslationUpdateManyWithNestedWhereInput = {
  /** Update many input */
  data: TranslationUpdateManyInput
  /** Document search */
  where: TranslationWhereInput
}

export type TranslationUpdateOneInlineInput = {
  /** Connect existing Translation document */
  connect?: InputMaybe<TranslationWhereUniqueInput>
  /** Create and connect one Translation document */
  create?: InputMaybe<TranslationCreateInput>
  /** Delete currently connected Translation document */
  delete?: InputMaybe<Scalars['Boolean']>
  /** Disconnect currently connected Translation document */
  disconnect?: InputMaybe<Scalars['Boolean']>
  /** Update single Translation document */
  update?: InputMaybe<TranslationUpdateWithNestedWhereUniqueInput>
  /** Upsert single Translation document */
  upsert?: InputMaybe<TranslationUpsertWithNestedWhereUniqueInput>
}

export type TranslationUpdateWithNestedWhereUniqueInput = {
  /** Document to update */
  data: TranslationUpdateInput
  /** Unique document search */
  where: TranslationWhereUniqueInput
}

export type TranslationUpsertInput = {
  /** Create document if it didn't exist */
  create: TranslationCreateInput
  /** Update document if it exists */
  update: TranslationUpdateInput
}

export type TranslationUpsertWithNestedWhereUniqueInput = {
  /** Upsert data */
  data: TranslationUpsertInput
  /** Unique document search */
  where: TranslationWhereUniqueInput
}

/** Identifies documents */
export type TranslationWhereInput = {
  /** Logical AND on all given filters. */
  AND?: InputMaybe<Array<TranslationWhereInput>>
  /** Logical NOT on all given filters combined by AND. */
  NOT?: InputMaybe<Array<TranslationWhereInput>>
  /** Logical OR on all given filters. */
  OR?: InputMaybe<Array<TranslationWhereInput>>
  /** Contains search across all appropriate fields. */
  _search?: InputMaybe<Scalars['String']>
  createdAt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than the given value. */
  createdAt_gt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than or equal the given value. */
  createdAt_gte?: InputMaybe<Scalars['DateTime']>
  /** All values that are contained in given list. */
  createdAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  /** All values less than the given value. */
  createdAt_lt?: InputMaybe<Scalars['DateTime']>
  /** All values less than or equal the given value. */
  createdAt_lte?: InputMaybe<Scalars['DateTime']>
  /** All values that are not equal to given value. */
  createdAt_not?: InputMaybe<Scalars['DateTime']>
  /** All values that are not contained in given list. */
  createdAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  createdBy?: InputMaybe<UserWhereInput>
  id?: InputMaybe<Scalars['ID']>
  /** All values containing the given string. */
  id_contains?: InputMaybe<Scalars['ID']>
  /** All values ending with the given string. */
  id_ends_with?: InputMaybe<Scalars['ID']>
  /** All values that are contained in given list. */
  id_in?: InputMaybe<Array<Scalars['ID']>>
  /** All values that are not equal to given value. */
  id_not?: InputMaybe<Scalars['ID']>
  /** All values not containing the given string. */
  id_not_contains?: InputMaybe<Scalars['ID']>
  /** All values not ending with the given string */
  id_not_ends_with?: InputMaybe<Scalars['ID']>
  /** All values that are not contained in given list. */
  id_not_in?: InputMaybe<Array<Scalars['ID']>>
  /** All values not starting with the given string. */
  id_not_starts_with?: InputMaybe<Scalars['ID']>
  /** All values starting with the given string. */
  id_starts_with?: InputMaybe<Scalars['ID']>
  key?: InputMaybe<KeyWhereInput>
  keys_every?: InputMaybe<KeyWhereInput>
  keys_none?: InputMaybe<KeyWhereInput>
  keys_some?: InputMaybe<KeyWhereInput>
  language?: InputMaybe<LanguageWhereInput>
  publishedAt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than the given value. */
  publishedAt_gt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than or equal the given value. */
  publishedAt_gte?: InputMaybe<Scalars['DateTime']>
  /** All values that are contained in given list. */
  publishedAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  /** All values less than the given value. */
  publishedAt_lt?: InputMaybe<Scalars['DateTime']>
  /** All values less than or equal the given value. */
  publishedAt_lte?: InputMaybe<Scalars['DateTime']>
  /** All values that are not equal to given value. */
  publishedAt_not?: InputMaybe<Scalars['DateTime']>
  /** All values that are not contained in given list. */
  publishedAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  publishedBy?: InputMaybe<UserWhereInput>
  scheduledIn_every?: InputMaybe<ScheduledOperationWhereInput>
  scheduledIn_none?: InputMaybe<ScheduledOperationWhereInput>
  scheduledIn_some?: InputMaybe<ScheduledOperationWhereInput>
  updatedAt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than the given value. */
  updatedAt_gt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than or equal the given value. */
  updatedAt_gte?: InputMaybe<Scalars['DateTime']>
  /** All values that are contained in given list. */
  updatedAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  /** All values less than the given value. */
  updatedAt_lt?: InputMaybe<Scalars['DateTime']>
  /** All values less than or equal the given value. */
  updatedAt_lte?: InputMaybe<Scalars['DateTime']>
  /** All values that are not equal to given value. */
  updatedAt_not?: InputMaybe<Scalars['DateTime']>
  /** All values that are not contained in given list. */
  updatedAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  updatedBy?: InputMaybe<UserWhereInput>
}

/** References Translation record uniquely */
export type TranslationWhereUniqueInput = {
  id?: InputMaybe<Scalars['ID']>
}

export type TriggerClaimChatInput = {
  claimTypeId?: InputMaybe<Scalars['ID']>
}

export type Trustly = {
  __typename?: 'Trustly'
  _?: Maybe<Scalars['Boolean']>
}

export enum TypeOfContract {
  DkAccident = 'DK_ACCIDENT',
  DkAccidentStudent = 'DK_ACCIDENT_STUDENT',
  DkHomeContentOwn = 'DK_HOME_CONTENT_OWN',
  DkHomeContentRent = 'DK_HOME_CONTENT_RENT',
  DkHomeContentStudentOwn = 'DK_HOME_CONTENT_STUDENT_OWN',
  DkHomeContentStudentRent = 'DK_HOME_CONTENT_STUDENT_RENT',
  DkTravel = 'DK_TRAVEL',
  DkTravelStudent = 'DK_TRAVEL_STUDENT',
  NoAccident = 'NO_ACCIDENT',
  NoHomeContentOwn = 'NO_HOME_CONTENT_OWN',
  NoHomeContentRent = 'NO_HOME_CONTENT_RENT',
  NoHomeContentYouthOwn = 'NO_HOME_CONTENT_YOUTH_OWN',
  NoHomeContentYouthRent = 'NO_HOME_CONTENT_YOUTH_RENT',
  NoHouse = 'NO_HOUSE',
  NoTravel = 'NO_TRAVEL',
  NoTravelYouth = 'NO_TRAVEL_YOUTH',
  SeAccident = 'SE_ACCIDENT',
  SeAccidentStudent = 'SE_ACCIDENT_STUDENT',
  SeApartmentBrf = 'SE_APARTMENT_BRF',
  SeApartmentRent = 'SE_APARTMENT_RENT',
  SeApartmentStudentBrf = 'SE_APARTMENT_STUDENT_BRF',
  SeApartmentStudentRent = 'SE_APARTMENT_STUDENT_RENT',
  SeCarFull = 'SE_CAR_FULL',
  SeCarHalf = 'SE_CAR_HALF',
  SeCarTraffic = 'SE_CAR_TRAFFIC',
  SeHouse = 'SE_HOUSE',
  SeQasaLongTermRental = 'SE_QASA_LONG_TERM_RENTAL',
  SeQasaShortTermRental = 'SE_QASA_SHORT_TERM_RENTAL',
}

export enum TypeOfContractGradientOption {
  GradientFour = 'GRADIENT_FOUR',
  GradientOne = 'GRADIENT_ONE',
  GradientThree = 'GRADIENT_THREE',
  GradientTwo = 'GRADIENT_TWO',
}

export type UnderwritingLimit = {
  __typename?: 'UnderwritingLimit'
  code: Scalars['String']
}

export type UnderwritingLimitsHit = {
  __typename?: 'UnderwritingLimitsHit'
  limits: Array<UnderwritingLimit>
}

export type UnknownQuoteDetails = {
  __typename?: 'UnknownQuoteDetails'
  unknown?: Maybe<Scalars['String']>
}

export type UnpublishLocaleInput = {
  /** Locales to unpublish */
  locale: Locale
  /** Stages to unpublish selected locales from */
  stages: Array<Stage>
}

/** If present, the upcomingAgreementChange contains info regarding the agreement that will succeed the current one */
export type UpcomingAgreementChange = {
  __typename?: 'UpcomingAgreementChange'
  newAgreement: Agreement
}

export type UpcomingRenewal = {
  __typename?: 'UpcomingRenewal'
  draftCertificateUrl: Scalars['String']
  renewalDate: Scalars['LocalDate']
}

export type UpdateReferralCampaignCodeResult =
  | CodeAlreadyTaken
  | CodeTooLong
  | CodeTooShort
  | ExceededMaximumUpdates
  | SuccessfullyUpdatedCode

/** User system model */
export type User = Node & {
  __typename?: 'User'
  /** The time the document was created */
  createdAt: Scalars['DateTime']
  /** Get the document in other stages */
  documentInStages: Array<User>
  /** The unique identifier */
  id: Scalars['ID']
  /** Flag to determine if user is active or not */
  isActive: Scalars['Boolean']
  /** User Kind. Can be either MEMBER, PAT or PUBLIC */
  kind: UserKind
  /** The username */
  name: Scalars['String']
  /** Profile Picture url */
  picture?: Maybe<Scalars['String']>
  /** The time the document was published. Null on documents in draft stage. */
  publishedAt?: Maybe<Scalars['DateTime']>
  /** System stage field */
  stage: Stage
  /** The time the document was updated */
  updatedAt: Scalars['DateTime']
}

/** User system model */
export type UserDocumentInStagesArgs = {
  includeCurrent?: Scalars['Boolean']
  inheritLocale?: Scalars['Boolean']
  stages?: Array<Stage>
}

export type UserConnectInput = {
  /** Allow to specify document position in list of connected documents, will default to appending at end of list */
  position?: InputMaybe<ConnectPositionInput>
  /** Document to connect */
  where: UserWhereUniqueInput
}

/** A connection to a list of items. */
export type UserConnection = {
  __typename?: 'UserConnection'
  aggregate: Aggregate
  /** A list of edges. */
  edges: Array<UserEdge>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
}

export type UserCreateManyInlineInput = {
  /** Connect multiple existing User documents */
  connect?: InputMaybe<Array<UserWhereUniqueInput>>
}

export type UserCreateOneInlineInput = {
  /** Connect one existing User document */
  connect?: InputMaybe<UserWhereUniqueInput>
}

/** An edge in a connection. */
export type UserEdge = {
  __typename?: 'UserEdge'
  /** A cursor for use in pagination. */
  cursor: Scalars['String']
  /** The item at the end of the edge. */
  node: User
}

export type UserFeature = Node & {
  __typename?: 'UserFeature'
  /** The time the document was created */
  createdAt: Scalars['DateTime']
  /** User that created this document */
  createdBy?: Maybe<User>
  /** Get the document in other stages */
  documentInStages: Array<UserFeature>
  feature?: Maybe<Feature>
  /** List of UserFeature versions */
  history: Array<Version>
  /** The unique identifier */
  id: Scalars['ID']
  memberId?: Maybe<Scalars['String']>
  /** The time the document was published. Null on documents in draft stage. */
  publishedAt?: Maybe<Scalars['DateTime']>
  /** User that last published this document */
  publishedBy?: Maybe<User>
  scheduledIn: Array<ScheduledOperation>
  /** System stage field */
  stage: Stage
  /** The time the document was updated */
  updatedAt: Scalars['DateTime']
  /** User that last updated this document */
  updatedBy?: Maybe<User>
}

export type UserFeatureCreatedByArgs = {
  locales?: InputMaybe<Array<Locale>>
}

export type UserFeatureDocumentInStagesArgs = {
  includeCurrent?: Scalars['Boolean']
  inheritLocale?: Scalars['Boolean']
  stages?: Array<Stage>
}

export type UserFeatureHistoryArgs = {
  limit?: Scalars['Int']
  skip?: Scalars['Int']
  stageOverride?: InputMaybe<Stage>
}

export type UserFeaturePublishedByArgs = {
  locales?: InputMaybe<Array<Locale>>
}

export type UserFeatureScheduledInArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  locales?: InputMaybe<Array<Locale>>
  skip?: InputMaybe<Scalars['Int']>
  where?: InputMaybe<ScheduledOperationWhereInput>
}

export type UserFeatureUpdatedByArgs = {
  locales?: InputMaybe<Array<Locale>>
}

export type UserFeatureConnectInput = {
  /** Allow to specify document position in list of connected documents, will default to appending at end of list */
  position?: InputMaybe<ConnectPositionInput>
  /** Document to connect */
  where: UserFeatureWhereUniqueInput
}

/** A connection to a list of items. */
export type UserFeatureConnection = {
  __typename?: 'UserFeatureConnection'
  aggregate: Aggregate
  /** A list of edges. */
  edges: Array<UserFeatureEdge>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
}

export type UserFeatureCreateInput = {
  createdAt?: InputMaybe<Scalars['DateTime']>
  feature?: InputMaybe<Feature>
  memberId?: InputMaybe<Scalars['String']>
  updatedAt?: InputMaybe<Scalars['DateTime']>
}

export type UserFeatureCreateManyInlineInput = {
  /** Connect multiple existing UserFeature documents */
  connect?: InputMaybe<Array<UserFeatureWhereUniqueInput>>
  /** Create and connect multiple existing UserFeature documents */
  create?: InputMaybe<Array<UserFeatureCreateInput>>
}

export type UserFeatureCreateOneInlineInput = {
  /** Connect one existing UserFeature document */
  connect?: InputMaybe<UserFeatureWhereUniqueInput>
  /** Create and connect one UserFeature document */
  create?: InputMaybe<UserFeatureCreateInput>
}

/** An edge in a connection. */
export type UserFeatureEdge = {
  __typename?: 'UserFeatureEdge'
  /** A cursor for use in pagination. */
  cursor: Scalars['String']
  /** The item at the end of the edge. */
  node: UserFeature
}

/** Identifies documents */
export type UserFeatureManyWhereInput = {
  /** Logical AND on all given filters. */
  AND?: InputMaybe<Array<UserFeatureWhereInput>>
  /** Logical NOT on all given filters combined by AND. */
  NOT?: InputMaybe<Array<UserFeatureWhereInput>>
  /** Logical OR on all given filters. */
  OR?: InputMaybe<Array<UserFeatureWhereInput>>
  /** Contains search across all appropriate fields. */
  _search?: InputMaybe<Scalars['String']>
  createdAt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than the given value. */
  createdAt_gt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than or equal the given value. */
  createdAt_gte?: InputMaybe<Scalars['DateTime']>
  /** All values that are contained in given list. */
  createdAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  /** All values less than the given value. */
  createdAt_lt?: InputMaybe<Scalars['DateTime']>
  /** All values less than or equal the given value. */
  createdAt_lte?: InputMaybe<Scalars['DateTime']>
  /** All values that are not equal to given value. */
  createdAt_not?: InputMaybe<Scalars['DateTime']>
  /** All values that are not contained in given list. */
  createdAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  createdBy?: InputMaybe<UserWhereInput>
  feature?: InputMaybe<Feature>
  /** All values that are contained in given list. */
  feature_in?: InputMaybe<Array<Feature>>
  /** All values that are not equal to given value. */
  feature_not?: InputMaybe<Feature>
  /** All values that are not contained in given list. */
  feature_not_in?: InputMaybe<Array<Feature>>
  id?: InputMaybe<Scalars['ID']>
  /** All values containing the given string. */
  id_contains?: InputMaybe<Scalars['ID']>
  /** All values ending with the given string. */
  id_ends_with?: InputMaybe<Scalars['ID']>
  /** All values that are contained in given list. */
  id_in?: InputMaybe<Array<Scalars['ID']>>
  /** All values that are not equal to given value. */
  id_not?: InputMaybe<Scalars['ID']>
  /** All values not containing the given string. */
  id_not_contains?: InputMaybe<Scalars['ID']>
  /** All values not ending with the given string */
  id_not_ends_with?: InputMaybe<Scalars['ID']>
  /** All values that are not contained in given list. */
  id_not_in?: InputMaybe<Array<Scalars['ID']>>
  /** All values not starting with the given string. */
  id_not_starts_with?: InputMaybe<Scalars['ID']>
  /** All values starting with the given string. */
  id_starts_with?: InputMaybe<Scalars['ID']>
  memberId?: InputMaybe<Scalars['String']>
  /** All values containing the given string. */
  memberId_contains?: InputMaybe<Scalars['String']>
  /** All values ending with the given string. */
  memberId_ends_with?: InputMaybe<Scalars['String']>
  /** All values that are contained in given list. */
  memberId_in?: InputMaybe<Array<Scalars['String']>>
  /** All values that are not equal to given value. */
  memberId_not?: InputMaybe<Scalars['String']>
  /** All values not containing the given string. */
  memberId_not_contains?: InputMaybe<Scalars['String']>
  /** All values not ending with the given string */
  memberId_not_ends_with?: InputMaybe<Scalars['String']>
  /** All values that are not contained in given list. */
  memberId_not_in?: InputMaybe<Array<Scalars['String']>>
  /** All values not starting with the given string. */
  memberId_not_starts_with?: InputMaybe<Scalars['String']>
  /** All values starting with the given string. */
  memberId_starts_with?: InputMaybe<Scalars['String']>
  publishedAt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than the given value. */
  publishedAt_gt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than or equal the given value. */
  publishedAt_gte?: InputMaybe<Scalars['DateTime']>
  /** All values that are contained in given list. */
  publishedAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  /** All values less than the given value. */
  publishedAt_lt?: InputMaybe<Scalars['DateTime']>
  /** All values less than or equal the given value. */
  publishedAt_lte?: InputMaybe<Scalars['DateTime']>
  /** All values that are not equal to given value. */
  publishedAt_not?: InputMaybe<Scalars['DateTime']>
  /** All values that are not contained in given list. */
  publishedAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  publishedBy?: InputMaybe<UserWhereInput>
  scheduledIn_every?: InputMaybe<ScheduledOperationWhereInput>
  scheduledIn_none?: InputMaybe<ScheduledOperationWhereInput>
  scheduledIn_some?: InputMaybe<ScheduledOperationWhereInput>
  updatedAt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than the given value. */
  updatedAt_gt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than or equal the given value. */
  updatedAt_gte?: InputMaybe<Scalars['DateTime']>
  /** All values that are contained in given list. */
  updatedAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  /** All values less than the given value. */
  updatedAt_lt?: InputMaybe<Scalars['DateTime']>
  /** All values less than or equal the given value. */
  updatedAt_lte?: InputMaybe<Scalars['DateTime']>
  /** All values that are not equal to given value. */
  updatedAt_not?: InputMaybe<Scalars['DateTime']>
  /** All values that are not contained in given list. */
  updatedAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  updatedBy?: InputMaybe<UserWhereInput>
}

export enum UserFeatureOrderByInput {
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC',
  FeatureAsc = 'feature_ASC',
  FeatureDesc = 'feature_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  MemberIdAsc = 'memberId_ASC',
  MemberIdDesc = 'memberId_DESC',
  PublishedAtAsc = 'publishedAt_ASC',
  PublishedAtDesc = 'publishedAt_DESC',
  UpdatedAtAsc = 'updatedAt_ASC',
  UpdatedAtDesc = 'updatedAt_DESC',
}

export type UserFeatureUpdateInput = {
  feature?: InputMaybe<Feature>
  memberId?: InputMaybe<Scalars['String']>
}

export type UserFeatureUpdateManyInlineInput = {
  /** Connect multiple existing UserFeature documents */
  connect?: InputMaybe<Array<UserFeatureConnectInput>>
  /** Create and connect multiple UserFeature documents */
  create?: InputMaybe<Array<UserFeatureCreateInput>>
  /** Delete multiple UserFeature documents */
  delete?: InputMaybe<Array<UserFeatureWhereUniqueInput>>
  /** Disconnect multiple UserFeature documents */
  disconnect?: InputMaybe<Array<UserFeatureWhereUniqueInput>>
  /** Override currently-connected documents with multiple existing UserFeature documents */
  set?: InputMaybe<Array<UserFeatureWhereUniqueInput>>
  /** Update multiple UserFeature documents */
  update?: InputMaybe<Array<UserFeatureUpdateWithNestedWhereUniqueInput>>
  /** Upsert multiple UserFeature documents */
  upsert?: InputMaybe<Array<UserFeatureUpsertWithNestedWhereUniqueInput>>
}

export type UserFeatureUpdateManyInput = {
  feature?: InputMaybe<Feature>
  memberId?: InputMaybe<Scalars['String']>
}

export type UserFeatureUpdateManyWithNestedWhereInput = {
  /** Update many input */
  data: UserFeatureUpdateManyInput
  /** Document search */
  where: UserFeatureWhereInput
}

export type UserFeatureUpdateOneInlineInput = {
  /** Connect existing UserFeature document */
  connect?: InputMaybe<UserFeatureWhereUniqueInput>
  /** Create and connect one UserFeature document */
  create?: InputMaybe<UserFeatureCreateInput>
  /** Delete currently connected UserFeature document */
  delete?: InputMaybe<Scalars['Boolean']>
  /** Disconnect currently connected UserFeature document */
  disconnect?: InputMaybe<Scalars['Boolean']>
  /** Update single UserFeature document */
  update?: InputMaybe<UserFeatureUpdateWithNestedWhereUniqueInput>
  /** Upsert single UserFeature document */
  upsert?: InputMaybe<UserFeatureUpsertWithNestedWhereUniqueInput>
}

export type UserFeatureUpdateWithNestedWhereUniqueInput = {
  /** Document to update */
  data: UserFeatureUpdateInput
  /** Unique document search */
  where: UserFeatureWhereUniqueInput
}

export type UserFeatureUpsertInput = {
  /** Create document if it didn't exist */
  create: UserFeatureCreateInput
  /** Update document if it exists */
  update: UserFeatureUpdateInput
}

export type UserFeatureUpsertWithNestedWhereUniqueInput = {
  /** Upsert data */
  data: UserFeatureUpsertInput
  /** Unique document search */
  where: UserFeatureWhereUniqueInput
}

/** Identifies documents */
export type UserFeatureWhereInput = {
  /** Logical AND on all given filters. */
  AND?: InputMaybe<Array<UserFeatureWhereInput>>
  /** Logical NOT on all given filters combined by AND. */
  NOT?: InputMaybe<Array<UserFeatureWhereInput>>
  /** Logical OR on all given filters. */
  OR?: InputMaybe<Array<UserFeatureWhereInput>>
  /** Contains search across all appropriate fields. */
  _search?: InputMaybe<Scalars['String']>
  createdAt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than the given value. */
  createdAt_gt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than or equal the given value. */
  createdAt_gte?: InputMaybe<Scalars['DateTime']>
  /** All values that are contained in given list. */
  createdAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  /** All values less than the given value. */
  createdAt_lt?: InputMaybe<Scalars['DateTime']>
  /** All values less than or equal the given value. */
  createdAt_lte?: InputMaybe<Scalars['DateTime']>
  /** All values that are not equal to given value. */
  createdAt_not?: InputMaybe<Scalars['DateTime']>
  /** All values that are not contained in given list. */
  createdAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  createdBy?: InputMaybe<UserWhereInput>
  feature?: InputMaybe<Feature>
  /** All values that are contained in given list. */
  feature_in?: InputMaybe<Array<Feature>>
  /** All values that are not equal to given value. */
  feature_not?: InputMaybe<Feature>
  /** All values that are not contained in given list. */
  feature_not_in?: InputMaybe<Array<Feature>>
  id?: InputMaybe<Scalars['ID']>
  /** All values containing the given string. */
  id_contains?: InputMaybe<Scalars['ID']>
  /** All values ending with the given string. */
  id_ends_with?: InputMaybe<Scalars['ID']>
  /** All values that are contained in given list. */
  id_in?: InputMaybe<Array<Scalars['ID']>>
  /** All values that are not equal to given value. */
  id_not?: InputMaybe<Scalars['ID']>
  /** All values not containing the given string. */
  id_not_contains?: InputMaybe<Scalars['ID']>
  /** All values not ending with the given string */
  id_not_ends_with?: InputMaybe<Scalars['ID']>
  /** All values that are not contained in given list. */
  id_not_in?: InputMaybe<Array<Scalars['ID']>>
  /** All values not starting with the given string. */
  id_not_starts_with?: InputMaybe<Scalars['ID']>
  /** All values starting with the given string. */
  id_starts_with?: InputMaybe<Scalars['ID']>
  memberId?: InputMaybe<Scalars['String']>
  /** All values containing the given string. */
  memberId_contains?: InputMaybe<Scalars['String']>
  /** All values ending with the given string. */
  memberId_ends_with?: InputMaybe<Scalars['String']>
  /** All values that are contained in given list. */
  memberId_in?: InputMaybe<Array<Scalars['String']>>
  /** All values that are not equal to given value. */
  memberId_not?: InputMaybe<Scalars['String']>
  /** All values not containing the given string. */
  memberId_not_contains?: InputMaybe<Scalars['String']>
  /** All values not ending with the given string */
  memberId_not_ends_with?: InputMaybe<Scalars['String']>
  /** All values that are not contained in given list. */
  memberId_not_in?: InputMaybe<Array<Scalars['String']>>
  /** All values not starting with the given string. */
  memberId_not_starts_with?: InputMaybe<Scalars['String']>
  /** All values starting with the given string. */
  memberId_starts_with?: InputMaybe<Scalars['String']>
  publishedAt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than the given value. */
  publishedAt_gt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than or equal the given value. */
  publishedAt_gte?: InputMaybe<Scalars['DateTime']>
  /** All values that are contained in given list. */
  publishedAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  /** All values less than the given value. */
  publishedAt_lt?: InputMaybe<Scalars['DateTime']>
  /** All values less than or equal the given value. */
  publishedAt_lte?: InputMaybe<Scalars['DateTime']>
  /** All values that are not equal to given value. */
  publishedAt_not?: InputMaybe<Scalars['DateTime']>
  /** All values that are not contained in given list. */
  publishedAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  publishedBy?: InputMaybe<UserWhereInput>
  scheduledIn_every?: InputMaybe<ScheduledOperationWhereInput>
  scheduledIn_none?: InputMaybe<ScheduledOperationWhereInput>
  scheduledIn_some?: InputMaybe<ScheduledOperationWhereInput>
  updatedAt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than the given value. */
  updatedAt_gt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than or equal the given value. */
  updatedAt_gte?: InputMaybe<Scalars['DateTime']>
  /** All values that are contained in given list. */
  updatedAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  /** All values less than the given value. */
  updatedAt_lt?: InputMaybe<Scalars['DateTime']>
  /** All values less than or equal the given value. */
  updatedAt_lte?: InputMaybe<Scalars['DateTime']>
  /** All values that are not equal to given value. */
  updatedAt_not?: InputMaybe<Scalars['DateTime']>
  /** All values that are not contained in given list. */
  updatedAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  updatedBy?: InputMaybe<UserWhereInput>
}

/** References UserFeature record uniquely */
export type UserFeatureWhereUniqueInput = {
  id?: InputMaybe<Scalars['ID']>
}

export enum UserInterfaceStyle {
  Dark = 'Dark',
  Light = 'Light',
}

/** System User Kind */
export enum UserKind {
  Member = 'MEMBER',
  Pat = 'PAT',
  Public = 'PUBLIC',
  Webhook = 'WEBHOOK',
}

/** Identifies documents */
export type UserManyWhereInput = {
  /** Logical AND on all given filters. */
  AND?: InputMaybe<Array<UserWhereInput>>
  /** Logical NOT on all given filters combined by AND. */
  NOT?: InputMaybe<Array<UserWhereInput>>
  /** Logical OR on all given filters. */
  OR?: InputMaybe<Array<UserWhereInput>>
  /** Contains search across all appropriate fields. */
  _search?: InputMaybe<Scalars['String']>
  createdAt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than the given value. */
  createdAt_gt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than or equal the given value. */
  createdAt_gte?: InputMaybe<Scalars['DateTime']>
  /** All values that are contained in given list. */
  createdAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  /** All values less than the given value. */
  createdAt_lt?: InputMaybe<Scalars['DateTime']>
  /** All values less than or equal the given value. */
  createdAt_lte?: InputMaybe<Scalars['DateTime']>
  /** All values that are not equal to given value. */
  createdAt_not?: InputMaybe<Scalars['DateTime']>
  /** All values that are not contained in given list. */
  createdAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  id?: InputMaybe<Scalars['ID']>
  /** All values containing the given string. */
  id_contains?: InputMaybe<Scalars['ID']>
  /** All values ending with the given string. */
  id_ends_with?: InputMaybe<Scalars['ID']>
  /** All values that are contained in given list. */
  id_in?: InputMaybe<Array<Scalars['ID']>>
  /** All values that are not equal to given value. */
  id_not?: InputMaybe<Scalars['ID']>
  /** All values not containing the given string. */
  id_not_contains?: InputMaybe<Scalars['ID']>
  /** All values not ending with the given string */
  id_not_ends_with?: InputMaybe<Scalars['ID']>
  /** All values that are not contained in given list. */
  id_not_in?: InputMaybe<Array<Scalars['ID']>>
  /** All values not starting with the given string. */
  id_not_starts_with?: InputMaybe<Scalars['ID']>
  /** All values starting with the given string. */
  id_starts_with?: InputMaybe<Scalars['ID']>
  isActive?: InputMaybe<Scalars['Boolean']>
  /** All values that are not equal to given value. */
  isActive_not?: InputMaybe<Scalars['Boolean']>
  kind?: InputMaybe<UserKind>
  /** All values that are contained in given list. */
  kind_in?: InputMaybe<Array<UserKind>>
  /** All values that are not equal to given value. */
  kind_not?: InputMaybe<UserKind>
  /** All values that are not contained in given list. */
  kind_not_in?: InputMaybe<Array<UserKind>>
  name?: InputMaybe<Scalars['String']>
  /** All values containing the given string. */
  name_contains?: InputMaybe<Scalars['String']>
  /** All values ending with the given string. */
  name_ends_with?: InputMaybe<Scalars['String']>
  /** All values that are contained in given list. */
  name_in?: InputMaybe<Array<Scalars['String']>>
  /** All values that are not equal to given value. */
  name_not?: InputMaybe<Scalars['String']>
  /** All values not containing the given string. */
  name_not_contains?: InputMaybe<Scalars['String']>
  /** All values not ending with the given string */
  name_not_ends_with?: InputMaybe<Scalars['String']>
  /** All values that are not contained in given list. */
  name_not_in?: InputMaybe<Array<Scalars['String']>>
  /** All values not starting with the given string. */
  name_not_starts_with?: InputMaybe<Scalars['String']>
  /** All values starting with the given string. */
  name_starts_with?: InputMaybe<Scalars['String']>
  picture?: InputMaybe<Scalars['String']>
  /** All values containing the given string. */
  picture_contains?: InputMaybe<Scalars['String']>
  /** All values ending with the given string. */
  picture_ends_with?: InputMaybe<Scalars['String']>
  /** All values that are contained in given list. */
  picture_in?: InputMaybe<Array<Scalars['String']>>
  /** All values that are not equal to given value. */
  picture_not?: InputMaybe<Scalars['String']>
  /** All values not containing the given string. */
  picture_not_contains?: InputMaybe<Scalars['String']>
  /** All values not ending with the given string */
  picture_not_ends_with?: InputMaybe<Scalars['String']>
  /** All values that are not contained in given list. */
  picture_not_in?: InputMaybe<Array<Scalars['String']>>
  /** All values not starting with the given string. */
  picture_not_starts_with?: InputMaybe<Scalars['String']>
  /** All values starting with the given string. */
  picture_starts_with?: InputMaybe<Scalars['String']>
  publishedAt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than the given value. */
  publishedAt_gt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than or equal the given value. */
  publishedAt_gte?: InputMaybe<Scalars['DateTime']>
  /** All values that are contained in given list. */
  publishedAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  /** All values less than the given value. */
  publishedAt_lt?: InputMaybe<Scalars['DateTime']>
  /** All values less than or equal the given value. */
  publishedAt_lte?: InputMaybe<Scalars['DateTime']>
  /** All values that are not equal to given value. */
  publishedAt_not?: InputMaybe<Scalars['DateTime']>
  /** All values that are not contained in given list. */
  publishedAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  updatedAt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than the given value. */
  updatedAt_gt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than or equal the given value. */
  updatedAt_gte?: InputMaybe<Scalars['DateTime']>
  /** All values that are contained in given list. */
  updatedAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  /** All values less than the given value. */
  updatedAt_lt?: InputMaybe<Scalars['DateTime']>
  /** All values less than or equal the given value. */
  updatedAt_lte?: InputMaybe<Scalars['DateTime']>
  /** All values that are not equal to given value. */
  updatedAt_not?: InputMaybe<Scalars['DateTime']>
  /** All values that are not contained in given list. */
  updatedAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
}

export enum UserOrderByInput {
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  IsActiveAsc = 'isActive_ASC',
  IsActiveDesc = 'isActive_DESC',
  KindAsc = 'kind_ASC',
  KindDesc = 'kind_DESC',
  NameAsc = 'name_ASC',
  NameDesc = 'name_DESC',
  PictureAsc = 'picture_ASC',
  PictureDesc = 'picture_DESC',
  PublishedAtAsc = 'publishedAt_ASC',
  PublishedAtDesc = 'publishedAt_DESC',
  UpdatedAtAsc = 'updatedAt_ASC',
  UpdatedAtDesc = 'updatedAt_DESC',
}

export type UserUpdateManyInlineInput = {
  /** Connect multiple existing User documents */
  connect?: InputMaybe<Array<UserConnectInput>>
  /** Disconnect multiple User documents */
  disconnect?: InputMaybe<Array<UserWhereUniqueInput>>
  /** Override currently-connected documents with multiple existing User documents */
  set?: InputMaybe<Array<UserWhereUniqueInput>>
}

export type UserUpdateOneInlineInput = {
  /** Connect existing User document */
  connect?: InputMaybe<UserWhereUniqueInput>
  /** Disconnect currently connected User document */
  disconnect?: InputMaybe<Scalars['Boolean']>
}

/** Identifies documents */
export type UserWhereInput = {
  /** Logical AND on all given filters. */
  AND?: InputMaybe<Array<UserWhereInput>>
  /** Logical NOT on all given filters combined by AND. */
  NOT?: InputMaybe<Array<UserWhereInput>>
  /** Logical OR on all given filters. */
  OR?: InputMaybe<Array<UserWhereInput>>
  /** Contains search across all appropriate fields. */
  _search?: InputMaybe<Scalars['String']>
  createdAt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than the given value. */
  createdAt_gt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than or equal the given value. */
  createdAt_gte?: InputMaybe<Scalars['DateTime']>
  /** All values that are contained in given list. */
  createdAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  /** All values less than the given value. */
  createdAt_lt?: InputMaybe<Scalars['DateTime']>
  /** All values less than or equal the given value. */
  createdAt_lte?: InputMaybe<Scalars['DateTime']>
  /** All values that are not equal to given value. */
  createdAt_not?: InputMaybe<Scalars['DateTime']>
  /** All values that are not contained in given list. */
  createdAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  id?: InputMaybe<Scalars['ID']>
  /** All values containing the given string. */
  id_contains?: InputMaybe<Scalars['ID']>
  /** All values ending with the given string. */
  id_ends_with?: InputMaybe<Scalars['ID']>
  /** All values that are contained in given list. */
  id_in?: InputMaybe<Array<Scalars['ID']>>
  /** All values that are not equal to given value. */
  id_not?: InputMaybe<Scalars['ID']>
  /** All values not containing the given string. */
  id_not_contains?: InputMaybe<Scalars['ID']>
  /** All values not ending with the given string */
  id_not_ends_with?: InputMaybe<Scalars['ID']>
  /** All values that are not contained in given list. */
  id_not_in?: InputMaybe<Array<Scalars['ID']>>
  /** All values not starting with the given string. */
  id_not_starts_with?: InputMaybe<Scalars['ID']>
  /** All values starting with the given string. */
  id_starts_with?: InputMaybe<Scalars['ID']>
  isActive?: InputMaybe<Scalars['Boolean']>
  /** All values that are not equal to given value. */
  isActive_not?: InputMaybe<Scalars['Boolean']>
  kind?: InputMaybe<UserKind>
  /** All values that are contained in given list. */
  kind_in?: InputMaybe<Array<UserKind>>
  /** All values that are not equal to given value. */
  kind_not?: InputMaybe<UserKind>
  /** All values that are not contained in given list. */
  kind_not_in?: InputMaybe<Array<UserKind>>
  name?: InputMaybe<Scalars['String']>
  /** All values containing the given string. */
  name_contains?: InputMaybe<Scalars['String']>
  /** All values ending with the given string. */
  name_ends_with?: InputMaybe<Scalars['String']>
  /** All values that are contained in given list. */
  name_in?: InputMaybe<Array<Scalars['String']>>
  /** All values that are not equal to given value. */
  name_not?: InputMaybe<Scalars['String']>
  /** All values not containing the given string. */
  name_not_contains?: InputMaybe<Scalars['String']>
  /** All values not ending with the given string */
  name_not_ends_with?: InputMaybe<Scalars['String']>
  /** All values that are not contained in given list. */
  name_not_in?: InputMaybe<Array<Scalars['String']>>
  /** All values not starting with the given string. */
  name_not_starts_with?: InputMaybe<Scalars['String']>
  /** All values starting with the given string. */
  name_starts_with?: InputMaybe<Scalars['String']>
  picture?: InputMaybe<Scalars['String']>
  /** All values containing the given string. */
  picture_contains?: InputMaybe<Scalars['String']>
  /** All values ending with the given string. */
  picture_ends_with?: InputMaybe<Scalars['String']>
  /** All values that are contained in given list. */
  picture_in?: InputMaybe<Array<Scalars['String']>>
  /** All values that are not equal to given value. */
  picture_not?: InputMaybe<Scalars['String']>
  /** All values not containing the given string. */
  picture_not_contains?: InputMaybe<Scalars['String']>
  /** All values not ending with the given string */
  picture_not_ends_with?: InputMaybe<Scalars['String']>
  /** All values that are not contained in given list. */
  picture_not_in?: InputMaybe<Array<Scalars['String']>>
  /** All values not starting with the given string. */
  picture_not_starts_with?: InputMaybe<Scalars['String']>
  /** All values starting with the given string. */
  picture_starts_with?: InputMaybe<Scalars['String']>
  publishedAt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than the given value. */
  publishedAt_gt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than or equal the given value. */
  publishedAt_gte?: InputMaybe<Scalars['DateTime']>
  /** All values that are contained in given list. */
  publishedAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  /** All values less than the given value. */
  publishedAt_lt?: InputMaybe<Scalars['DateTime']>
  /** All values less than or equal the given value. */
  publishedAt_lte?: InputMaybe<Scalars['DateTime']>
  /** All values that are not equal to given value. */
  publishedAt_not?: InputMaybe<Scalars['DateTime']>
  /** All values that are not contained in given list. */
  publishedAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
  updatedAt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than the given value. */
  updatedAt_gt?: InputMaybe<Scalars['DateTime']>
  /** All values greater than or equal the given value. */
  updatedAt_gte?: InputMaybe<Scalars['DateTime']>
  /** All values that are contained in given list. */
  updatedAt_in?: InputMaybe<Array<Scalars['DateTime']>>
  /** All values less than the given value. */
  updatedAt_lt?: InputMaybe<Scalars['DateTime']>
  /** All values less than or equal the given value. */
  updatedAt_lte?: InputMaybe<Scalars['DateTime']>
  /** All values that are not equal to given value. */
  updatedAt_not?: InputMaybe<Scalars['DateTime']>
  /** All values that are not contained in given list. */
  updatedAt_not_in?: InputMaybe<Array<Scalars['DateTime']>>
}

/** References User record uniquely */
export type UserWhereUniqueInput = {
  id?: InputMaybe<Scalars['ID']>
}

export type VerifyOtpLoginAttemptError = {
  __typename?: 'VerifyOtpLoginAttemptError'
  errorCode: Scalars['String']
}

export type VerifyOtpLoginAttemptResult = VerifyOtpLoginAttemptError | VerifyOtpLoginAttemptSuccess

export type VerifyOtpLoginAttemptSuccess = {
  __typename?: 'VerifyOtpLoginAttemptSuccess'
  accessToken: Scalars['String']
}

export type Version = {
  __typename?: 'Version'
  createdAt: Scalars['DateTime']
  id: Scalars['ID']
  revision: Scalars['Int']
  stage: Stage
}

export type VersionWhereInput = {
  id: Scalars['ID']
  revision: Scalars['Int']
  stage: Stage
}

export type VisibleNoDiscount = {
  __typename?: 'VisibleNoDiscount'
  _?: Maybe<Scalars['Boolean']>
}

export type Welcome = {
  __typename?: 'Welcome'
  illustration: Icon
  paragraph: Scalars['String']
  title: Scalars['String']
}

export enum _FilterKind {
  And = 'AND',
  Not = 'NOT',
  Or = 'OR',
  Contains = 'contains',
  ContainsAll = 'contains_all',
  ContainsNone = 'contains_none',
  ContainsSome = 'contains_some',
  EndsWith = 'ends_with',
  Eq = 'eq',
  EqNot = 'eq_not',
  Gt = 'gt',
  Gte = 'gte',
  In = 'in',
  Lt = 'lt',
  Lte = 'lte',
  NotContains = 'not_contains',
  NotEndsWith = 'not_ends_with',
  NotIn = 'not_in',
  NotStartsWith = 'not_starts_with',
  RelationalEvery = 'relational_every',
  RelationalNone = 'relational_none',
  RelationalSingle = 'relational_single',
  RelationalSome = 'relational_some',
  Search = 'search',
  StartsWith = 'starts_with',
}

export enum _MutationInputFieldKind {
  Enum = 'enum',
  Relation = 'relation',
  RichText = 'richText',
  RichTextWithEmbeds = 'richTextWithEmbeds',
  Scalar = 'scalar',
  Union = 'union',
  Virtual = 'virtual',
}

export enum _MutationKind {
  Create = 'create',
  Delete = 'delete',
  DeleteMany = 'deleteMany',
  Publish = 'publish',
  PublishMany = 'publishMany',
  SchedulePublish = 'schedulePublish',
  ScheduleUnpublish = 'scheduleUnpublish',
  Unpublish = 'unpublish',
  UnpublishMany = 'unpublishMany',
  Update = 'update',
  UpdateMany = 'updateMany',
  Upsert = 'upsert',
}

export enum _OrderDirection {
  Asc = 'asc',
  Desc = 'desc',
}

export enum _RelationInputCardinality {
  Many = 'many',
  One = 'one',
}

export enum _RelationInputKind {
  Create = 'create',
  Update = 'update',
}

export enum _RelationKind {
  Regular = 'regular',
  Union = 'union',
}

export enum _SystemDateTimeFieldVariation {
  Base = 'base',
  Combined = 'combined',
  Localization = 'localization',
}

export type AddCampaignCodeMutationVariables = Exact<{
  id: Scalars['ID']
  code: Scalars['String']
}>

export type AddCampaignCodeMutation = {
  __typename?: 'Mutation'
  quoteCart_addCampaign:
    | { __typename?: 'BasicError'; errorMessage: string }
    | {
        __typename?: 'QuoteCart'
        id: string
        campaign?: { __typename?: 'Campaign'; code: string } | null
      }
}

export type CreateQuoteBundleMutationVariables = Exact<{
  id: Scalars['ID']
  input: CreateSwedishBundleInput
}>

export type CreateQuoteBundleMutation = {
  __typename?: 'Mutation'
  quoteCart_createSwedishBundle:
    | { __typename?: 'QuoteBundleError' }
    | {
        __typename?: 'QuoteCart'
        id: string
        bundle?: {
          __typename?: 'QuoteBundle'
          quotes: Array<{ __typename?: 'BundledQuote'; id: string }>
        } | null
      }
}

export type CreateQuoteCartMutationVariables = Exact<{
  market: Market
  locale: Scalars['String']
}>

export type CreateQuoteCartMutation = {
  __typename?: 'Mutation'
  onboardingQuoteCart_create: { __typename?: 'CreateQuoteCartResult'; id: string }
}

export type QuoteCartQuotesQueryVariables = Exact<{
  id: Scalars['ID']
}>

export type QuoteCartQuotesQuery = {
  __typename?: 'Query'
  quoteCart: {
    __typename?: 'QuoteCart'
    bundle?: {
      __typename?: 'QuoteBundle'
      quotes: Array<{ __typename?: 'BundledQuote'; id: string; data: any }>
    } | null
  }
}

export type QuoteCartStatusQueryVariables = Exact<{
  id: Scalars['ID']
}>

export type QuoteCartStatusQuery = {
  __typename?: 'Query'
  quoteCart: {
    __typename?: 'QuoteCart'
    market: Market
    checkout?: {
      __typename?: 'Checkout'
      status: CheckoutStatus
      statusText?: string | null
    } | null
  }
}

export const AddCampaignCodeDocument = gql`
  mutation AddCampaignCode($id: ID!, $code: String!) {
    quoteCart_addCampaign(id: $id, code: $code) {
      ... on QuoteCart {
        id
        campaign {
          code
        }
      }
      ... on BasicError {
        errorMessage: message
      }
    }
  }
`
export const CreateQuoteBundleDocument = gql`
  mutation CreateQuoteBundle($id: ID!, $input: CreateSwedishBundleInput!) {
    quoteCart_createSwedishBundle(id: $id, input: $input) {
      ... on QuoteCart {
        id
        bundle {
          quotes {
            id
          }
        }
      }
    }
  }
`
export const CreateQuoteCartDocument = gql`
  mutation CreateQuoteCart($market: Market!, $locale: String!) {
    onboardingQuoteCart_create(input: { market: $market, locale: $locale }) {
      id
    }
  }
`
export const QuoteCartQuotesDocument = gql`
  query QuoteCartQuotes($id: ID!) {
    quoteCart(id: $id) {
      bundle {
        quotes {
          id
          data
        }
      }
    }
  }
`
export const QuoteCartStatusDocument = gql`
  query QuoteCartStatus($id: ID!) {
    quoteCart(id: $id) {
      market
      checkout {
        status
        statusText
      }
    }
  }
`
export type Requester<C = {}> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R>
export function getSdk<C>(requester: Requester<C>) {
  return {
    AddCampaignCode(
      variables: AddCampaignCodeMutationVariables,
      options?: C,
    ): Promise<AddCampaignCodeMutation> {
      return requester<AddCampaignCodeMutation, AddCampaignCodeMutationVariables>(
        AddCampaignCodeDocument,
        variables,
        options,
      )
    },
    CreateQuoteBundle(
      variables: CreateQuoteBundleMutationVariables,
      options?: C,
    ): Promise<CreateQuoteBundleMutation> {
      return requester<CreateQuoteBundleMutation, CreateQuoteBundleMutationVariables>(
        CreateQuoteBundleDocument,
        variables,
        options,
      )
    },
    CreateQuoteCart(
      variables: CreateQuoteCartMutationVariables,
      options?: C,
    ): Promise<CreateQuoteCartMutation> {
      return requester<CreateQuoteCartMutation, CreateQuoteCartMutationVariables>(
        CreateQuoteCartDocument,
        variables,
        options,
      )
    },
    QuoteCartQuotes(
      variables: QuoteCartQuotesQueryVariables,
      options?: C,
    ): Promise<QuoteCartQuotesQuery> {
      return requester<QuoteCartQuotesQuery, QuoteCartQuotesQueryVariables>(
        QuoteCartQuotesDocument,
        variables,
        options,
      )
    },
    QuoteCartStatus(
      variables: QuoteCartStatusQueryVariables,
      options?: C,
    ): Promise<QuoteCartStatusQuery> {
      return requester<QuoteCartStatusQuery, QuoteCartStatusQueryVariables>(
        QuoteCartStatusDocument,
        variables,
        options,
      )
    },
  }
}
export type Sdk = ReturnType<typeof getSdk>
