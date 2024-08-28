import {
  DenmarkIcon,
  FranceIcon,
  NorwayIcon,
  SwedenIcon,
  UKIcon,
  USIcon,
} from '@hedvig-ui/icons'
import { TaskWarmth } from 'types/generated/graphql'

export enum Market {
  Sweden = 'SWEDEN',
  Norway = 'NORWAY',
  Denmark = 'DENMARK',
}

export enum CountryCode {
  SE = 'SE',
  NO = 'NO',
  DK = 'DK',
}

export const MarketFlags = {
  NORWAY: NorwayIcon({}),
  DENMARK: DenmarkIcon({}),
  SWEDEN: SwedenIcon({}),
  FRANCE: FranceIcon({}),
  UK: UKIcon({}),
  US: USIcon({}),
} as const

export const WarmthEmoji: Record<TaskWarmth, string> = {
  [TaskWarmth.Hot]: '🔥',
  [TaskWarmth.Warm]: '🌞',
  [TaskWarmth.Cold]: '🥶',
  [TaskWarmth.Unknown]: '🌚',
}

export enum Locales {
  SV = 'sv',
  NB = 'nb',
  DA = 'da',
  EN = 'en',
}

export enum PickedLocale {
  SvSe = 'sv_SE',
  EnSe = 'en_SE',
  NbNo = 'nb_NO',
  EnNo = 'en_NO',
  DaDk = 'da_DK',
  EnDk = 'en_DK',
}

export const PickedLocaleFlag = {
  [PickedLocale.EnNo]: MarketFlags.UK,
  [PickedLocale.EnSe]: MarketFlags.UK,
  [PickedLocale.EnDk]: MarketFlags.UK,
  [PickedLocale.DaDk]: MarketFlags.DENMARK,
  [PickedLocale.SvSe]: MarketFlags.SWEDEN,
  [PickedLocale.NbNo]: MarketFlags.NORWAY,
} as const

export const LocalesFlag = {
  [Locales.EN]: MarketFlags.UK,
  [Locales.DA]: MarketFlags.DENMARK,
  [Locales.SV]: MarketFlags.SWEDEN,
  [Locales.NB]: MarketFlags.NORWAY,
} as const

export const PickedLocaleMarket: Record<PickedLocale, Market> = {
  [PickedLocale.EnNo]: Market.Norway,
  [PickedLocale.NbNo]: Market.Norway,
  [PickedLocale.EnDk]: Market.Denmark,
  [PickedLocale.DaDk]: Market.Denmark,
  [PickedLocale.EnSe]: Market.Sweden,
  [PickedLocale.SvSe]: Market.Sweden,
}

export const MarketLanguage: Record<Market, string> = {
  [Market.Sweden]: 'se',
  [Market.Norway]: 'no',
  [Market.Denmark]: 'dk',
}

export enum InsuranceType {
  SwedishApartment = 'SWEDISH_APARTMENT',
  SwedishHouse = 'SWEDISH_HOUSE',
  SwedishAccident = 'SWEDISH_ACCIDENT',
  SwedishCar = 'SWEDISH_CAR',
  SwedishQasaRental = 'SWEDISH_QASA_RENTAL',

  SwedishDog = 'SWEDISH_DOG',
  SwedishCat = 'SWEDISH_CAT',
  SwedishObjectlegacy = 'SWEDISH_OBJECT_LEGACY',
  NorwegianHomeContent = 'NORWEGIAN_HOME_CONTENT',
  NorwegianTravel = 'NORWEGIAN_TRAVEL',
  NorwegianAccident = 'NORWEGIAN_ACCIDENT',
  NorwegianHouse = 'NORWEGIAN_HOUSE',
  DanishHomeContent = 'DANISH_HOME_CONTENT',
  DanishTravel = 'DANISH_TRAVEL',
  DanishAccident = 'DANISH_ACCIDENT',
  DanishHouse = 'DANISH_HOUSE',
}

export const ContractIcon: Record<InsuranceType, string> = {
  [InsuranceType.SwedishApartment]: '🏢',
  [InsuranceType.SwedishHouse]: '🏡',
  [InsuranceType.SwedishObjectlegacy]: '📞',
  [InsuranceType.SwedishAccident]: '⛷️',
  [InsuranceType.SwedishCar]: '🚗',
  [InsuranceType.SwedishCat]: '🐈',
  [InsuranceType.SwedishDog]: '🐩',
  [InsuranceType.SwedishQasaRental]: '💸',
  [InsuranceType.NorwegianAccident]: '⛷️',
  [InsuranceType.NorwegianHouse]: '🏡',
  [InsuranceType.NorwegianTravel]: '✈️',
  [InsuranceType.NorwegianHomeContent]: '🏢',
  [InsuranceType.DanishAccident]: '⛷️',
  [InsuranceType.DanishHouse]: '🏡',
  [InsuranceType.DanishTravel]: '✈️',
  [InsuranceType.DanishHomeContent]: '🏢',
}

export enum Currency {
  SEK = 'SEK',
  NOK = 'NOK',
  DKK = 'DKK',
}

export const CurrencyFlags = {
  [Currency.SEK]: MarketFlags.SWEDEN,
  [Currency.DKK]: MarketFlags.DENMARK,
  [Currency.NOK]: MarketFlags.NORWAY,
} as const

export const InsuranceTypeCurrency: Record<InsuranceType, Currency> = {
  [InsuranceType.SwedishApartment]: Currency.SEK,
  [InsuranceType.SwedishHouse]: Currency.SEK,
  [InsuranceType.SwedishAccident]: Currency.SEK,
  [InsuranceType.SwedishCar]: Currency.SEK,
  [InsuranceType.SwedishQasaRental]: Currency.SEK,
  [InsuranceType.SwedishDog]: Currency.SEK,
  [InsuranceType.SwedishCat]: Currency.SEK,
  [InsuranceType.SwedishObjectlegacy]: Currency.SEK,
  [InsuranceType.NorwegianHomeContent]: Currency.NOK,
  [InsuranceType.NorwegianTravel]: Currency.NOK,
  [InsuranceType.NorwegianAccident]: Currency.NOK,
  [InsuranceType.NorwegianHouse]: Currency.NOK,
  [InsuranceType.DanishHomeContent]: Currency.DKK,
  [InsuranceType.DanishTravel]: Currency.DKK,
  [InsuranceType.DanishAccident]: Currency.DKK,
  [InsuranceType.DanishHouse]: Currency.DKK,
}

export const MarketCurrency: Record<Market, Currency> = {
  [Market.Sweden]: Currency.SEK,
  [Market.Norway]: Currency.NOK,
  [Market.Denmark]: Currency.DKK,
}

export enum QuoteProductType {
  Apartment = 'APARTMENT',
  House = 'HOUSE',
  Object = 'OBJECT',
  HomeContent = 'HOME_CONTENT',
  Travel = 'TRAVEL',
  Accident = 'ACCIDENT',
  Car = 'CAR',
  Pet = 'PET',
}

export const QuoteProductTypeContractMap: Record<
  QuoteProductType,
  InsuranceType[]
> = {
  [QuoteProductType.HomeContent]: [
    InsuranceType.NorwegianHomeContent,
    InsuranceType.DanishHomeContent,
  ],
  [QuoteProductType.Apartment]: [
    InsuranceType.SwedishApartment,
    InsuranceType.SwedishQasaRental,
  ],
  [QuoteProductType.Accident]: [
    InsuranceType.DanishAccident,
    InsuranceType.SwedishAccident,
    InsuranceType.NorwegianAccident,
  ],
  [QuoteProductType.House]: [
    InsuranceType.SwedishHouse,
    InsuranceType.NorwegianHouse,
    InsuranceType.DanishHouse,
  ],
  [QuoteProductType.Object]: [InsuranceType.SwedishObjectlegacy],
  [QuoteProductType.Travel]: [
    InsuranceType.NorwegianTravel,
    InsuranceType.DanishTravel,
  ],
  [QuoteProductType.Car]: [InsuranceType.SwedishCar],
  [QuoteProductType.Pet]: [InsuranceType.SwedishDog, InsuranceType.SwedishCat],
}

export const ContractMarketTypes: Record<Market, InsuranceType[]> = {
  SWEDEN: [
    InsuranceType.SwedishHouse,
    InsuranceType.SwedishApartment,
    InsuranceType.SwedishAccident,
    InsuranceType.SwedishCar,
    InsuranceType.SwedishQasaRental,
    InsuranceType.SwedishDog,
    InsuranceType.SwedishCat,
    InsuranceType.SwedishObjectlegacy,
  ],
  NORWAY: [
    InsuranceType.NorwegianHomeContent,
    InsuranceType.NorwegianTravel,
    InsuranceType.NorwegianAccident,
    InsuranceType.NorwegianHouse,
  ],
  DENMARK: [
    InsuranceType.DanishHomeContent,
    InsuranceType.DanishTravel,
    InsuranceType.DanishAccident,
    InsuranceType.DanishHouse,
  ],
}

export enum ContractStatus {
  Active = 'ACTIVE',
  ActiveInFuture = 'ACTIVE_IN_FUTURE',
  ActiveInFutureAndTerminatedInFuture = 'ACTIVE_IN_FUTURE_AND_TERMINATED_IN_FUTURE',
  Pending = 'PENDING',
  TerminatedToday = 'TERMINATED_TODAY',
  TerminatedInFuture = 'TERMINATED_IN_FUTURE',
  Terminated = 'TERMINATED',
  Deleted = 'DELETED',
}

export enum CarSubTypes {
  Full = 'FULL',
  Half = 'HALF',
  Traffic = 'TRAFFIC',
}

export enum TypeOfContract {
  SeHouse = 'SE_HOUSE',
  SeApartmentBrf = 'SE_APARTMENT_BRF',
  SeApartmentRent = 'SE_APARTMENT_RENT',
  SeApartmentStudentBrf = 'SE_APARTMENT_STUDENT_BRF',
  SeApartmentStudentRent = 'SE_APARTMENT_STUDENT_RENT',
  SeAccident = 'SE_ACCIDENT',
  SeAccidentStudent = 'SE_ACCIDENT_STUDENT',
  SeCarFull = 'SE_CAR_FULL',
  SeCarHalf = 'SE_CAR_HALF',
  SeCarTraffic = 'SE_CAR_TRAFFIC',
  SeQasaShortTermRental = 'SE_QASA_SHORT_TERM_RENTAL',
  SeQasaLongTermRental = 'SE_QASA_LONG_TERM_RENTAL',
  SeDogBasic = 'SE_DOG_BASIC',
  SeDogStandard = 'SE_DOG_STANDARD',
  SeDogPremium = 'SE_DOG_PREMIUM',
  SeCatBasic = 'SE_CAT_BASIC',
  SeCatStandard = 'SE_CAT_STANDARD',
  SeCatPremium = 'SE_CAT_PREMIUM',
  SeObjectLegacy = 'SE_OBJECT_LEGACY',
  NoHomeContentOwn = 'NO_HOME_CONTENT_OWN',
  NoHomeContentRent = 'NO_HOME_CONTENT_RENT',
  NoHomeContentYouthOwn = 'NO_HOME_CONTENT_YOUTH_OWN',
  NoHomeContentYouthRent = 'NO_HOME_CONTENT_YOUTH_RENT',
  NoTravel = 'NO_TRAVEL',
  NoTravelYouth = 'NO_TRAVEL_YOUTH',
  NoAccident = 'NO_ACCIDENT',
  NoHouse = 'NO_HOUSE',
  DkHomeContentOwn = 'DK_HOME_CONTENT_OWN',
  DkHomeContentRent = 'DK_HOME_CONTENT_RENT',
  DkHomeContentStudentOwn = 'DK_HOME_CONTENT_STUDENT_OWN',
  DkHomeContentStudentRent = 'DK_HOME_CONTENT_STUDENT_RENT',
  DkAccident = 'DK_ACCIDENT',
  DkAccidentStudent = 'DK_ACCIDENT_STUDENT',
  DkTravel = 'DK_TRAVEL',
  DkTravelStudent = 'DK_TRAVEL_STUDENT',
  DkHouse = 'DK_HOUSE',
}

export enum LiabilityLevel {
  Zero = 'ZERO',
  OneThird = 'ONE_THIRD',
  Half = 'HALF',
  TwoThirds = 'TWO_THIRDS',
  Full = 'FULL',
}

export const LiabilityLevelText: Record<LiabilityLevel, string> = {
  [LiabilityLevel.Full]: '100 %',
  [LiabilityLevel.Half]: '50 %',
  [LiabilityLevel.OneThird]: '1/3',
  [LiabilityLevel.TwoThirds]: '2/3',
  [LiabilityLevel.Zero]: '0%',
}

export const LiabilityLevelValue: Record<LiabilityLevel, number> = {
  [LiabilityLevel.Full]: 1,
  [LiabilityLevel.Half]: 0.5,
  [LiabilityLevel.OneThird]: 1 / 3,
  [LiabilityLevel.TwoThirds]: 2 / 3,
  [LiabilityLevel.Zero]: 0,
}

// FIXME: This should not have to exist
export const TypeOfContractType: Record<TypeOfContract, InsuranceType> = {
  [TypeOfContract.SeHouse]: InsuranceType.SwedishHouse,
  [TypeOfContract.SeApartmentBrf]: InsuranceType.SwedishApartment,
  [TypeOfContract.SeApartmentRent]: InsuranceType.SwedishApartment,
  [TypeOfContract.SeApartmentStudentBrf]: InsuranceType.SwedishApartment,
  [TypeOfContract.SeApartmentStudentRent]: InsuranceType.SwedishApartment,
  [TypeOfContract.SeAccident]: InsuranceType.SwedishAccident,
  [TypeOfContract.SeAccidentStudent]: InsuranceType.SwedishAccident,
  [TypeOfContract.SeCarFull]: InsuranceType.SwedishCar,
  [TypeOfContract.SeCarHalf]: InsuranceType.SwedishCar,
  [TypeOfContract.SeCarTraffic]: InsuranceType.SwedishCar,
  [TypeOfContract.SeQasaLongTermRental]: InsuranceType.SwedishQasaRental,
  [TypeOfContract.SeQasaShortTermRental]: InsuranceType.SwedishQasaRental,
  [TypeOfContract.SeDogBasic]: InsuranceType.SwedishDog,
  [TypeOfContract.SeDogStandard]: InsuranceType.SwedishDog,
  [TypeOfContract.SeDogPremium]: InsuranceType.SwedishDog,
  [TypeOfContract.SeCatBasic]: InsuranceType.SwedishCat,
  [TypeOfContract.SeCatStandard]: InsuranceType.SwedishCat,
  [TypeOfContract.SeCatPremium]: InsuranceType.SwedishCat,
  [TypeOfContract.SeObjectLegacy]: InsuranceType.SwedishObjectlegacy,
  [TypeOfContract.NoHomeContentOwn]: InsuranceType.NorwegianHomeContent,
  [TypeOfContract.NoHomeContentRent]: InsuranceType.NorwegianHomeContent,
  [TypeOfContract.NoHomeContentYouthOwn]: InsuranceType.NorwegianHomeContent,
  [TypeOfContract.NoHomeContentYouthRent]: InsuranceType.NorwegianHomeContent,
  [TypeOfContract.NoTravel]: InsuranceType.NorwegianTravel,
  [TypeOfContract.NoTravelYouth]: InsuranceType.NorwegianTravel,
  [TypeOfContract.NoAccident]: InsuranceType.NorwegianAccident,
  [TypeOfContract.NoHouse]: InsuranceType.NorwegianHouse,
  [TypeOfContract.DkHomeContentOwn]: InsuranceType.DanishHomeContent,
  [TypeOfContract.DkHomeContentRent]: InsuranceType.DanishHomeContent,
  [TypeOfContract.DkHomeContentStudentOwn]: InsuranceType.DanishHomeContent,
  [TypeOfContract.DkHomeContentStudentRent]: InsuranceType.DanishHomeContent,
  [TypeOfContract.DkAccident]: InsuranceType.DanishAccident,
  [TypeOfContract.DkAccidentStudent]: InsuranceType.DanishAccident,
  [TypeOfContract.DkTravel]: InsuranceType.DanishTravel,
  [TypeOfContract.DkTravelStudent]: InsuranceType.DanishTravel,
  [TypeOfContract.DkHouse]: InsuranceType.DanishHouse,
}

// FIXME: Add ability to search for claims via InsuranceType instead to avoid this
export const TypeOfContractByInsuranceType = Object.entries(
  TypeOfContractType,
).reduce<Record<InsuranceType, TypeOfContract[]>>(
  (agg, [key, insuranceType]) => {
    const typeOfContract = key as TypeOfContract
    agg[insuranceType] = agg[insuranceType] || []
    agg[insuranceType].push(typeOfContract)

    return agg
  },
  {} as Record<InsuranceType, TypeOfContract[]>,
)

export enum ApartmentSubTypes {
  SwedishOwn = 'BRF',
  Rent = 'RENT',
  DanishNorwegianOwn = 'OWN',
}

export const SubTypeMarketTypes: Record<Market, ApartmentSubTypes[]> = {
  SWEDEN: [ApartmentSubTypes.SwedishOwn, ApartmentSubTypes.Rent],
  NORWAY: [ApartmentSubTypes.DanishNorwegianOwn, ApartmentSubTypes.Rent],
  DENMARK: [ApartmentSubTypes.DanishNorwegianOwn, ApartmentSubTypes.Rent],
}

export enum ExtraBuildingType {
  Garage = 'GARAGE',
  Carport = 'CARPORT',
  Shed = 'SHED',
  Storehouse = 'STOREHOUSE',
  Friggebod = 'FRIGGEBOD',
  Attefall = 'ATTEFALL',
  Outhouse = 'OUTHOUSE',
  Guesthouse = 'GUESTHOUSE',
  Gazebo = 'GAZEBO',
  Greenhouse = 'GREENHOUSE',
  Sauna = 'SAUNA',
  Barn = 'BARN',
  Boathouse = 'BOATHOUSE',
  Other = 'OTHER',
}

export enum ClaimState {
  Open = 'OPEN',
  Reopened = 'REOPENED',
  Closed = 'CLOSED',
}

export enum ClaimSource {
  App = 'APP',
  Email = 'EMAIL',
  Intercom = 'INTERCOM',
  Phone = 'PHONE',
  Chat = 'CHAT',
  'SOS International' = 'SOS_INTERNATIONAL',
}

export enum PaymentMethod {
  AUTOGIRO = 'AUTOGIRO',
  BANKACCOUNT = 'BANKACCOUNT',
  BANKGIRO = 'BANKGIRO',
  PLUSGIRO = 'PLUSGIRO',
  IBAN = 'IBAN',

  UNKNOWN = 'UNKNOWN',
}

export enum PaymentRecipientType {
  INDIVIDUAL = 'INDIVIDUAL',
  COMPANY = 'COMPANY',
  UNKNOWN = 'UNKNOWN',
}

export type PaymentSender = {
  orgNumber: string // Organisation number
  account: string // Account number (konto nr.)
  type: PaymentMethod
}

export enum CostType {
  INDEMNITY_COST = 'INDEMNITY_COST',
  EXPENSE = 'EXPENSE',
}

export enum ClaimLocation {
  AtHome = 'AT_HOME',
  InHomeMunicipality = 'IN_HOME_MUNICIPALITY',
  OutsideHomeMunicipality = 'OUTSIDE_HOME_MUNICIPALITY',
  InHomeCountry = 'IN_HOME_COUNTRY',
  Abroad = 'ABROAD',
}

export const MarketClaimLocations: Record<Market, ClaimLocation[]> = {
  [Market.Sweden]: [
    ClaimLocation.AtHome,
    ClaimLocation.InHomeCountry,
    ClaimLocation.Abroad,
  ],
  [Market.Norway]: [
    ClaimLocation.AtHome,
    ClaimLocation.InHomeMunicipality,
    ClaimLocation.OutsideHomeMunicipality,
    ClaimLocation.Abroad,
  ],
  [Market.Denmark]: [
    ClaimLocation.AtHome,
    ClaimLocation.InHomeCountry,
    ClaimLocation.Abroad,
  ],
}

export enum PaymentOrderState {
  Requested = 'REQUESTED',
  Approved = 'APPROVED',
  Settled = 'SETTLED',
  Dismissed = 'DISMISSED',
}

export enum Carrier {
  EIR = 'EIR',
  Hedvig = 'HEDVIG',
  HDI = 'HDI',
}

export enum PaymentOrderOrigin {
  Automation = 'AUTOMATION',
  Admin = 'ADMIN',
}

export const PaymentAccounts: Record<Carrier, PaymentSender> = {
  [Carrier.EIR]: {
    orgNumber: '5590930334',
    account: '18779462',
    type: PaymentMethod.PLUSGIRO,
  },
  [Carrier.Hedvig]: {
    orgNumber: '559093-0334',
    account: '187 79 48-8',
    type: PaymentMethod.PLUSGIRO,
  },
  [Carrier.HDI]: {
    orgNumber: '5590930334',
    account: '8754582',
    type: PaymentMethod.PLUSGIRO,
  },
}

export const TypeOfContractFixedDeductibleFirstVetReduction = {
  [TypeOfContract.SeCatBasic]: 1000,
  [TypeOfContract.SeCatStandard]: 1000,
  [TypeOfContract.SeCatPremium]: 1000,
  [TypeOfContract.SeDogBasic]: 1000,
  [TypeOfContract.SeDogStandard]: 1000,
  [TypeOfContract.SeDogPremium]: 1000,
} as const

export const TypeOfContractYearlyInsuranceAmount = {
  [TypeOfContract.SeCatBasic]: 30000,
  [TypeOfContract.SeCatStandard]: 60000,
  [TypeOfContract.SeCatPremium]: 160000,
  [TypeOfContract.SeDogBasic]: 30000,
  [TypeOfContract.SeDogStandard]: 60000,
  [TypeOfContract.SeDogPremium]: 160000,
} as const

export enum TagValue {
  CoInsured = 'CO_INSURED',
  Trustee = 'TRUSTEE',
  ContractUpdate = 'CONTRACT_UPDATE',
  EmployeeIex = 'EMPLOYEE_IEX',
  Employee = 'EMPLOYEE',
  UnderInvestigation = 'UNDER_INVESTIGATION',
  Deceased = 'DECEASED',
  HighServiceNeed = 'HIGH_SERVICE_NEED',
  Secrecy = 'SECRECY',
  Cancelled = 'CANCELLED',
  AdvancedNotice = 'ADVANCE_NOTICE',
  Pet = 'PET',
  Issue = 'ISSUE',
  WaitingPeriod = 'WAITING_PERIOD',
  PaymentDetails = 'PAYMENT_DETAILS',

  Other = 'OTHER',
}

export const TagColor: Record<TagValue, string> = {
  [TagValue.CoInsured]: '#00A08B',
  [TagValue.Trustee]: '#00bb00',
  [TagValue.Employee]: '#444',
  [TagValue.ContractUpdate]: '#00bbbb',
  [TagValue.EmployeeIex]: '#0000bb',
  [TagValue.UnderInvestigation]: '#6666ff',
  [TagValue.Deceased]: '#222',
  [TagValue.HighServiceNeed]: '#ff7777',
  [TagValue.Secrecy]: '#333',
  [TagValue.Cancelled]: '#e1ad01',
  [TagValue.AdvancedNotice]: '#CB87E5',
  [TagValue.Pet]: '#44D793',
  [TagValue.Issue]: '#39558',
  [TagValue.WaitingPeriod]: '#3EBDD1',
  [TagValue.PaymentDetails]: '#B0D675',

  [TagValue.Other]: '#bbbb00',
} as const

export enum CostCategory {
  'Not specified' = 'UNKNOWN',
  'Contents' = 'CONTENTS',
  'Additional Costs' = 'ADDITIONAL_COSTS',
  'Reparation or Restoration' = 'REPARATION_OR_RESTORATION',
  'Examination' = 'EXAMINATION',
  'Deconstruction' = 'DECONSTRUCTION',
  'Treatment Cost' = 'TREATMENT_COST',
  'Invalidity' = 'INVALIDITY',
  'Scarring' = 'SCARRING',
  'Valuation' = 'VALUATION',
  'Repatriation' = 'REPATRIATION',
  'Evacuation' = 'EVACUATION',
}
