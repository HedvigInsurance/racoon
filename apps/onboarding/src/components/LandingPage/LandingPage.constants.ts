import { Market, MarketLabel } from '@/lib/types'
import { Insurances } from './LandingPage.types'

// TODO make usage of a proper API
// This is being hardcoded at the moment but in the future that kind of information
// will be retrieved from an proper API
export const INSURANCES_BY_MARKET: Record<Market, Insurances> = {
  [Market.Sweden]: [],
  [Market.Denmark]: [],
  [Market.Norway]: [
    {
      id: 'no-home-contents',
      name: 'MAIN_COVERAGE_TITLE_HOME',
      description: 'MAIN_COVERAGE_DESC_HOME',
      img: '/racoon-assets/home.jpg',
      blurDataURL: 'TUKUN5WFozx^j]t7ROt6a}?wn~Rj',
      fieldName: 'isHomeContents',
    },
    ...(process.env.FEATURE_HOUSE_INSURANCE?.includes(MarketLabel.NO)
      ? [
          {
            id: 'no-house',
            name: 'MAIN_COVERAGE_TITLE_HOUSE',
            description: 'MAIN_COVERAGE_DESC_HOUSE',
            img: '/racoon-assets/house.jpg',
            blurDataURL: 'TeHLbm9axG~qj]ae%g%1NH?voIWq',
            fieldName: 'isHouse',
          },
        ]
      : []),
    {
      id: 'no-travel',
      name: 'ADDITIONAL_COVERAGE_TITLE_TRAVEL',
      description: 'ADDITIONAL_COVERAGE_DESC_TRAVEL',
      img: '/racoon-assets/travel.jpg',
      blurDataURL: 'L8BMoT~VaxIoWC-:WBRkRjs:Rjt7',
      isAdditionalCoverage: true,
      fieldName: 'isTravel',
    },
    ...(process.env.FEATURE_ACCIDENT_NO === 'true'
      ? [
          {
            id: 'no-accident',
            name: 'MAIN_COVERAGE_TITLE_ACCIDENT',
            description: 'MAIN_COVERAGE_DESC_ACCIDENT',
            img: '/racoon-assets/accident.jpg',
            blurDataURL: 'LnJ*Cw?HNFoz_NtRRjof%gRkRjof',
            isAdditionalCoverage: true,
            fieldName: 'isAccident',
          },
        ]
      : []),
  ],
}
