import { Market, MarketLabel } from '@/lib/types'
import { Features, Feature } from '@/services/features'
import { Insurances } from './LandingPage.types'

export const INSURANCES_BY_MARKET: Record<Market, Insurances> = {
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
            fieldName: 'isAccident',
          },
        ]
      : []),
  ],
}
