import { getLocale } from '@/lib/l10n'
import { LocaleLabel } from '@/lib/l10n/locales'
import { Market, MarketLabel } from '@/lib/types'
import { Features, Feature } from '@/services/features'
import { TypeOfContract } from '@/services/graphql/generated'
import { graphqlSdk } from '@/services/graphql/sdk'

export type Insurance = {
  id: string
  name: string
  description: string
  img: {
    src: string
    alt?: string
    blurDataURL?: string
    objectPosition?: string
  }
  perils: Array<string>
  typeOfContract: TypeOfContract
  fieldName: string
  isPreselected?: boolean
  slug?: string
}

const INSURANCES_BY_MARKET: Record<Market, Array<Omit<Insurance, 'perils'>>> = {
  [Market.Sweden]: [
    {
      id: 'se-home',
      name: 'MAIN_COVERAGE_TITLE_HOME',
      description: 'MAIN_COVERAGE_DESC_HOME',
      img: {
        src: '/racoon-assets/home_se.jpg',
        blurDataURL: 'LfLD[NayRkM{?waee.t6emt8ogof',
      },
      isPreselected: false,
      typeOfContract: TypeOfContract.SeApartmentRent,
      fieldName: 'isHome',
      slug: 'home-insurance',
    },
    {
      id: 'se-car',
      name: 'MAIN_COVERAGE_TITLE_CAR',
      description: 'MAIN_COVERAGE_DESC_CAR',
      img: {
        src: '/racoon-assets/car_se.jpg',
        blurDataURL: 'LQF~gZngMxIU~ARiWUM{s;Ipazj@',
      },
      isPreselected: false,
      typeOfContract: TypeOfContract.SeCarFull,
      fieldName: 'isCar',
      slug: 'car',
    },
  ],
  [Market.Denmark]: [
    {
      id: 'dk-home-contents',
      name: 'MAIN_COVERAGE_TITLE_HOME',
      description: 'MAIN_COVERAGE_DESC_HOME',
      img: {
        src: '/racoon-assets/home.jpg',
        blurDataURL: 'TUKUN5WFozx^j]t7ROt6a}?wn~Rj',
      },
      fieldName: 'isHomeContents',
      typeOfContract: TypeOfContract.DkHomeContentOwn,
      isPreselected: !Features.getFeature(Feature.HOUSE_INSURANCE, MarketLabel.DK),
    },
    ...(Features.getFeature(Feature.HOUSE_INSURANCE, MarketLabel.DK)
      ? [
          {
            id: 'dk-house',
            name: 'MAIN_COVERAGE_TITLE_HOUSE',
            description: 'MAIN_COVERAGE_DESC_HOUSE',
            img: {
              src: '/racoon-assets/house.jpg',
              blurDataURL: 'TeHLbm9axG~qj]ae%g%1NH?voIWq',
              objectPosition: 'top left',
            },
            typeOfContract: TypeOfContract.DkHouse,
            fieldName: 'isHouse',
          },
        ]
      : []),
    {
      id: 'dk-travel',
      name: 'ADDITIONAL_COVERAGE_TITLE_TRAVEL',
      description: 'ADDITIONAL_COVERAGE_DESC_TRAVEL',
      img: {
        src: '/racoon-assets/travel.jpg',
        blurDataURL: 'L8BMoT~VaxIoWC-:WBRkRjs:Rjt7',
      },
      typeOfContract: TypeOfContract.DkTravel,
      fieldName: 'isTravel',
    },
    ...(Features.getFeature(Feature.ACCIDENT_INSURANCE, MarketLabel.DK)
      ? [
          {
            id: 'dk-accident',
            name: 'MAIN_COVERAGE_TITLE_ACCIDENT',
            description: 'MAIN_COVERAGE_DESC_ACCIDENT',
            img: {
              src: '/racoon-assets/accident.jpg',
              blurDataURL: 'LnJ*Cw?HNFoz_NtRRjof%gRkRjof',
            },
            typeOfContract: TypeOfContract.DkAccident,
            fieldName: 'isAccident',
          },
        ]
      : []),
  ],
  [Market.Norway]: [
    {
      id: 'no-home-contents',
      name: 'MAIN_COVERAGE_TITLE_HOME',
      description: 'MAIN_COVERAGE_DESC_HOME',
      img: {
        src: '/racoon-assets/home.jpg',
        blurDataURL: 'TUKUN5WFozx^j]t7ROt6a}?wn~Rj',
      },
      typeOfContract: TypeOfContract.NoHomeContentOwn,
      fieldName: 'isHomeContents',
      isPreselected: !Features.getFeature(Feature.HOUSE_INSURANCE, MarketLabel.NO),
    },
    ...(Features.getFeature(Feature.HOUSE_INSURANCE, MarketLabel.NO)
      ? [
          {
            id: 'no-house',
            name: 'MAIN_COVERAGE_TITLE_HOUSE',
            description: 'MAIN_COVERAGE_DESC_HOUSE',
            img: {
              src: '/racoon-assets/house.jpg',
              blurDataURL: 'TeHLbm9axG~qj]ae%g%1NH?voIWq',
              objectPosition: 'top left',
            },
            typeOfContract: TypeOfContract.NoHouse,
            fieldName: 'isHouse',
          },
        ]
      : []),
    {
      id: 'no-travel',
      name: 'ADDITIONAL_COVERAGE_TITLE_TRAVEL',
      description: 'ADDITIONAL_COVERAGE_DESC_TRAVEL',
      img: {
        src: '/racoon-assets/travel.jpg',
        blurDataURL: 'L8BMoT~VaxIoWC-:WBRkRjs:Rjt7',
      },
      typeOfContract: TypeOfContract.NoTravel,
      fieldName: 'isTravel',
    },
    ...(Features.getFeature(Feature.ACCIDENT_INSURANCE, MarketLabel.NO)
      ? [
          {
            id: 'no-accident',
            name: 'MAIN_COVERAGE_TITLE_ACCIDENT',
            description: 'MAIN_COVERAGE_DESC_ACCIDENT',
            img: {
              src: '/racoon-assets/accident.jpg',
              blurDataURL: 'LnJ*Cw?HNFoz_NtRRjof%gRkRjof',
            },
            typeOfContract: TypeOfContract.NoAccident,
            fieldName: 'isAccident',
          },
        ]
      : []),
  ],
}

export const Insurances = {
  async getInsurancesByLocaleLabel(localeLabel: LocaleLabel) {
    const locale = getLocale(localeLabel)
    const insurancesWithouthPerils = INSURANCES_BY_MARKET[locale.market]

    const contractPerilsQueriesResult = await Promise.all(
      insurancesWithouthPerils.map((insurance) =>
        graphqlSdk.ContractPerils({
          contractType: insurance.typeOfContract,
          locale: locale.isoLocale,
        }),
      ),
    )
    const normalisedContractPerils = contractPerilsQueriesResult.map((perilsData) =>
      perilsData.contractPerils.map(({ title }) => title),
    )
    const insurances = insurancesWithouthPerils.map<Insurance>((insuranceWithoutPerils, index) => {
      const perils = normalisedContractPerils[index]

      return { ...insuranceWithoutPerils, perils }
    })

    return insurances
  },
}
