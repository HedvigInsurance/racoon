import { mockPriceIntentHandlers } from './PriceIntentMock/PriceIntentMock'
import { mockShopSessionHandlers } from './ShopSessionMock/ShopSessionMock'

export const handlers = [...mockShopSessionHandlers, ...mockPriceIntentHandlers]
