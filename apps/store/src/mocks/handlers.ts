import { mockCartHandlers } from './CartMock/CartMock'
import { mockCmsHandlers } from './cms/cms'
import { mockPriceIntentHandlers } from './PriceIntentMock/PriceIntentMock'
import { mockShopSessionHandlers } from './ShopSessionMock/ShopSessionMock'

export const handlers = [
  ...mockCmsHandlers,
  ...mockShopSessionHandlers,
  ...mockPriceIntentHandlers,
  ...mockCartHandlers,
]
