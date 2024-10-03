// Naming rules:
// - snake_case for Analytics / ecommerce events (backward compatibility)
// - camelCase for internal anayltics events
export enum TrackingEvent {
  AddToCart = 'add_to_cart',
  Adtraction = 'adtraction',
  BeginCheckout = 'begin_checkout',
  ClickTermsAndConditions = 'clickTermsAndConditions',
  DeleteFromCart = 'delete_from_cart',
  DeviceInfo = 'deviceInfo',
  ExpandPeril = 'expandPeril',
  // Website-driven experiments, as configured in experiment.json
  ExperimentImpression = 'experiment_impression',
  OpenPriceCalculator = 'open_price_calculator',
  OpenProductReviews = 'openProductReviews',
  PageView = 'virtual_page_view',
  Purchase = 'purchase',
  SelectItem = 'select_item',
  ViewCart = 'view_cart',
  ViewItem = 'view_item',
  ViewPromotion = 'view_promotion',
  InsurelyPrompted = 'insurely_prompted',
  InsurelyAccepted = 'insurely_accepted',
  InsurelyCorrectlyFetched = 'insurely_correctly_fetched',
  // Backend-driven experiments as defined in shopSession.experiments
  ShopSessionExperiments = 'shop_session_experiments',
}
