import { Market } from '@/lib/types'
import { Insurances } from './new-member.types'

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
      isPreselected: true,
      embarkStoreKey: 'isHomeContents',
    },
    {
      id: 'no-travel',
      name: 'ADDITIONAL_COVERAGE_TITLE_TRAVEL',
      description: 'ADDITIONAL_COVERAGE_DESC_TRAVEL',
      img: '/racoon-assets/travel.jpg',
      isAdditionalCoverage: true,
      embarkStoreKey: 'isTravel',
    },
  ].concat(
    process.env.FEATURE_ACCIDENT_NO === 'true'
      ? [
          {
            id: 'no-accident',
            name: 'MAIN_COVERAGE_TITLE_ACCIDENT',
            description: 'MAIN_COVERAGE_DESC_ACCIDENT',
            img: '/racoon-assets/accident.jpg',
            isAdditionalCoverage: true,
            embarkStoreKey: 'isAccident',
          },
        ]
      : [],
  ),
}
