import { Market } from '@/lib/types'
import { Form } from './DebuggerPage.types'
import { DENMARK_HOLDER } from './forms/denmarkHolder'
import { DENMARK_HOME } from './forms/denmarkHome'
import { NORWAY_HOLDER } from './forms/norwayHolder'
import { NORWAY_HOME } from './forms/norwayHome'
import { SWEDEN_APARTMENT } from './forms/swedenApartment'
import { SWEDEN_CAR } from './forms/swedenCar'
import { SWEDEN_HOLDER } from './forms/swedenHolder'
import { SWEDEN_HOUSE } from './forms/swedenHouse'

export enum PageInput {
  Market = 'market',
  Bundle = 'bundle',
}

export const MARKETS = Object.entries(Market).map(([name, value]) => ({ name, value }))

export const FORMS_PER_MARKET: Record<Market, Record<string, Form>> = {
  [Market.Sweden]: {
    Apartment: {
      staticData: [{ 'data.type': 'SWEDISH_APARTMENT' }],
      inputGroups: [SWEDEN_HOLDER, SWEDEN_APARTMENT],
    },
    'Apartment + Accident': {
      staticData: [
        { 'data.type': 'SWEDISH_APARTMENT' },
        { 'data.type': 'SWEDISH_ACCIDENT', 'data.isStudent': false },
      ],
      inputGroups: [SWEDEN_HOLDER, SWEDEN_APARTMENT],
    },
    House: {
      staticData: [
        { 'data.type': 'SWEDISH_HOUSE', 'data.extraBuildings': [], 'data.isSubleted': false },
      ],
      inputGroups: [SWEDEN_HOLDER, SWEDEN_HOUSE],
    },
    'House + Accident': {
      staticData: [
        { 'data.type': 'SWEDISH_HOUSE', 'data.extraBuildings': [], 'data.isSubleted': false },
        { 'data.type': 'SWEDISH_ACCIDENT', 'data.isStudent': false },
      ],
      inputGroups: [SWEDEN_HOLDER, SWEDEN_HOUSE],
    },
    Car: {
      staticData: [
        { 'data.type': 'SWEDISH_CAR', 'data.subType': 'TRAFFIC' },
        { 'data.type': 'SWEDISH_CAR', 'data.subType': 'HALF' },
        { 'data.type': 'SWEDISH_CAR', 'data.subType': 'FULL' },
      ],
      inputGroups: [SWEDEN_HOLDER, SWEDEN_CAR],
    },
  },
  [Market.Norway]: {
    Home: {
      staticData: [{ 'data.type': 'NORWEGIAN_HOME_CONTENT', 'data.isYouth': false }],
      inputGroups: [NORWAY_HOLDER, NORWAY_HOME],
    },
    'Home + Travel': {
      staticData: [
        { 'data.type': 'NORWEGIAN_HOME_CONTENT', 'data.isYouth': false },
        { 'data.type': 'NORWEGIAN_TRAVEL', 'data.isYouth': false },
      ],
      inputGroups: [NORWAY_HOLDER, NORWAY_HOME],
    },
    'Home + Accident': {
      staticData: [
        { 'data.type': 'NORWEGIAN_HOME_CONTENT', 'data.isYouth': false },
        { 'data.type': 'NORWEGIAN_ACCIDENT', 'data.isYouth': false },
      ],
      inputGroups: [NORWAY_HOLDER, NORWAY_HOME],
    },
    'Home + Accident + Travel': {
      staticData: [
        { 'data.type': 'NORWEGIAN_HOME_CONTENT', 'data.isYouth': false },
        { 'data.type': 'NORWEGIAN_ACCIDENT', 'data.isYouth': false },
        { 'data.type': 'NORWEGIAN_TRAVEL', 'data.isYouth': false },
      ],
      inputGroups: [NORWAY_HOLDER, NORWAY_HOME],
    },
  },
  [Market.Denmark]: {
    Home: {
      staticData: [{ 'data.type': 'DANISH_HOME_CONTENT', 'data.isStudent': false }],
      inputGroups: [DENMARK_HOLDER, DENMARK_HOME],
    },
    'Home + Accident': {
      staticData: [
        { 'data.type': 'DANISH_HOME_CONTENT', 'data.isStudent': false },
        { 'data.type': 'DANISH_ACCIDENT', 'data.isStudent': false },
      ],
      inputGroups: [DENMARK_HOLDER, DENMARK_HOME],
    },
    'Home + Accident + Travel': {
      staticData: [
        { 'data.type': 'DANISH_HOME_CONTENT', 'data.isStudent': false },
        { 'data.type': 'DANISH_ACCIDENT', 'data.isStudent': false },
        { 'data.type': 'DANISH_TRAVEL', 'data.isStudent': false },
      ],
      inputGroups: [DENMARK_HOLDER, DENMARK_HOME],
    },
  },
}
