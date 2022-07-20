import { mockCmsHandlers } from './cms/cms'
import { mockPriceIntentHandlers } from './PriceIntentMock/PriceIntentMock'

export const handlers = [...mockCmsHandlers, ...mockPriceIntentHandlers]
