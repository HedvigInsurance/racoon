import { AccordionBlock } from '@/blocks/AccordionBlock'
import { AccordionItemBlock } from '@/blocks/AccordionItemBlock'
import { AverageRatingBannerBlock } from '@/blocks/AverageRatingBannerBlock'
import { BannerBlock } from '@/blocks/BannerBlock'
import { ButtonBlock } from '@/blocks/ButtonBlock'
import { CardLinkBlock } from '@/blocks/CardLinkBlock'
import { CardLinkListBlock } from '@/blocks/CardLinkListBlock'
import { CheckListBlock } from '@/blocks/CheckListBlock'
import { ComparisonTableBlock } from '@/blocks/ComparisonTableBlock'
import { ConfirmationPageBlock } from '@/blocks/ConfirmationPageBlock'
import { ConnectPaymentBlock } from '@/blocks/ConnectPaymentBlock'
import { ContentBlock } from '@/blocks/ContentBlock'
import { CookieListBlock } from '@/blocks/CookieListBlock'
import { DownloadableContentItemBlock } from '@/blocks/DownloadableContentItemBlock'
import { GridBlock } from '@/blocks/GridBlock'
import { HeadingBlock } from '@/blocks/HeadingBlock'
import { HeadingLabelBlock } from '@/blocks/HeadingLabelBlock'
import { HeroBlock } from '@/blocks/HeroBlock'
import { ImageBlock } from '@/blocks/ImageBlock'
import { ImageTextBlock } from '@/blocks/ImageTextBlock'
import { InlineSpaceBlock } from '@/blocks/InlineSpaceBlock'
import { InsurableLimitsBlock } from '@/blocks/InsurableLimitsBlock'
import { InsurelyBlock } from '@/blocks/InsurelyBlock'
import { MediaListBlock } from '@/blocks/MediaListBlock'
import { ModalBlock } from '@/blocks/ModalBlock'
import { PageBlock } from '@/blocks/PageBlock'
import { PerilsBlock } from '@/blocks/PerilsBlock'
import { PerilsTableBlock } from '@/blocks/PerilsTableBlock'
import { ProductDocumentsBlock } from '@/blocks/ProductDocumentsBlock'
import { ProductGridBlock } from '@/blocks/ProductGridBlock'
import { ProductGridItemBlock } from '@/blocks/ProductGridItemBlock/ProductGridItemBlock'
import { ProductPageBlock } from '@/blocks/ProductPageBlock'
import { ProductPageBlockV2 } from '@/blocks/ProductPageBlockV2/ProductPageBlockV2'
import { ProductPillowBlock } from '@/blocks/ProductPillowsBlock/ProductPillowBlock'
import { ProductPillowsBlock } from '@/blocks/ProductPillowsBlock/ProductPillowsBlock'
import { ProductReviewsBlock } from '@/blocks/ProductReviewsBlock'
import { ProductSlideshowBlock } from '@/blocks/ProductSlideshowBlock'
import { ProductVariantSelectorBlock } from '@/blocks/ProductVariantSelectorBlock'
import { QuickPurchaseBlock } from '@/blocks/QuickPurchaseBlock'
import { ReusableBlockReference } from '@/blocks/ReusableBlockReference'
import { RichTextBlock } from '@/blocks/RichTextBlock/RichTextBlock'
import { SelectInsuranceGridBlock } from '@/blocks/SelectInsuranceGridBlock'
import { SpacerBlock } from '@/blocks/SpacerBlock'
import { StoryCarouselBlock } from '@/blocks/StoryCarouselBlock'
import { TabsBlock } from '@/blocks/TabsBlock'
import { TextBlock } from '@/blocks/TextBlock'
import { TextContentBlock } from '@/blocks/TextContentBlock'
import { TickerBlock } from '@/blocks/TickerBlock'
import { TimelineBlock } from '@/blocks/TimelineBlock'
import { TimelineItemBlock } from '@/blocks/TimelineItemBlock'
import { TopPickCardBlock } from '@/blocks/TopPickCardBlock'
import { USPBlock, USPBlockItem } from '@/blocks/USPBlock'
import { VideoBlock } from '@/blocks/VideoBlock'
import { WidgetFlowBlock } from '@/blocks/WidgetFlowBlock'
import { WidgetFlowStartButtonBlock } from '@/blocks/WidgetFlowStartButtonBlock'

const blockAliases = { reusableBlock: PageBlock }

export const commonStoryblokComponents = {
  accordion: AccordionBlock,
  accordionItem: AccordionItemBlock,
  averageRatingBanner: AverageRatingBannerBlock,
  banner: BannerBlock,
  button: ButtonBlock,
  cardLink: CardLinkBlock,
  cardLinkList: CardLinkListBlock,
  checkList: CheckListBlock,
  comparisonTable: ComparisonTableBlock,
  confirmation: ConfirmationPageBlock,
  connectPayment: ConnectPaymentBlock,
  content: ContentBlock,
  cookieList: CookieListBlock,
  downloadableContentItem: DownloadableContentItemBlock,
  grid: GridBlock,
  heading: HeadingBlock,
  headingLabel: HeadingLabelBlock,
  hero: HeroBlock,
  image: ImageBlock,
  imageText: ImageTextBlock,
  inlineSpace: InlineSpaceBlock,
  insurely: InsurelyBlock,
  insurableLimits: InsurableLimitsBlock,
  mediaList: MediaListBlock,
  modal: ModalBlock,
  page: PageBlock,
  perils: PerilsBlock,
  perilsTable: PerilsTableBlock,
  product: ProductPageBlock,
  productPage: ProductPageBlockV2,
  productGridItemBlock: ProductGridItemBlock,
  productDocuments: ProductDocumentsBlock,
  productGrid: ProductGridBlock,
  productPillow: ProductPillowBlock,
  productPillows: ProductPillowsBlock,
  productReviews: ProductReviewsBlock,
  productSlideshow: ProductSlideshowBlock,
  productVariantSelector: ProductVariantSelectorBlock,
  quickPurchase: QuickPurchaseBlock,
  reusableBlockReference: ReusableBlockReference,
  richText: RichTextBlock,
  selectInsuranceGrid: SelectInsuranceGridBlock,
  spacer: SpacerBlock,
  tabs: TabsBlock,
  timeline: TimelineBlock,
  timelineItem: TimelineItemBlock,
  text: TextBlock,
  textContent: TextContentBlock,
  ticker: TickerBlock,
  topPickCard: TopPickCardBlock,
  usp: USPBlock,
  uspItem: USPBlockItem,
  videoBlock: VideoBlock,
  widgetFlow: WidgetFlowBlock,
  widgetFlowStartButton: WidgetFlowStartButtonBlock,
  storyCarousel: StoryCarouselBlock,
  ...blockAliases,
}
