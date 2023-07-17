import styled from '@emotion/styled'
import { storyblokEditable } from '@storyblok/react'
import { motion, AnimatePresence } from 'framer-motion'
import { mq, theme } from 'ui'
import { CartItemSkeleton } from '@/components/CartItem/CartItemSkeleton'
import { GridLayout } from '@/components/GridLayout/GridLayout'
import { MENU_BAR_HEIGHT_DESKTOP, MENU_BAR_HEIGHT_MOBILE } from '@/components/Header/HeaderStyles'
import { type GridColumnsField, type SbBaseBlockProps } from '@/services/storyblok/storyblok'
import { MultiTierOffer } from './MultiTierOffer'
import { SingleTierOffer } from './SingleTierOffer'
import { useRetargetingOffers } from './useRetargetingOffers'

const RETARGETING_BLOCK_NAME = 'retargeting'

type Props = SbBaseBlockProps<{
  layout?: GridColumnsField
}>

export const RetargetingBlock = (props: Props) => {
  const offers = useRetargetingOffers()

  return (
    <GridLayout.Root {...storyblokEditable(props.blok)}>
      <GridLayoutContent
        width={props.blok.layout?.widths ?? '1'}
        align={props.blok.layout?.alignment ?? 'center'}
      >
        <List>
          {offers === null ? (
            Array.from({ length: 3 }).map((_, index) => <CartItemSkeleton key={index} />)
          ) : (
            <AnimatePresence mode="popLayout">
              {offers.map((item) => (
                <motion.li
                  key={item.key}
                  layout={true}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                >
                  {item.type === 'single' && <SingleTierOffer {...item} />}
                  {item.type === 'multiple' && <MultiTierOffer {...item} />}
                </motion.li>
              ))}
            </AnimatePresence>
          )}
        </List>
      </GridLayoutContent>
    </GridLayout.Root>
  )
}

RetargetingBlock.blockName = RETARGETING_BLOCK_NAME

const GridLayoutContent = styled(GridLayout.Content)({
  paddingBlock: theme.space.lg,
  minHeight: `calc(100vh - ${MENU_BAR_HEIGHT_MOBILE})`,

  [mq.lg]: {
    minHeight: `calc(100vh - ${MENU_BAR_HEIGHT_DESKTOP})`,
  },
})

const List = styled.ul({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.space.md,
})
