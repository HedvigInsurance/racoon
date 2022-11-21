import React, { useState } from 'react'
import { ExpectedBlockType, SbBaseBlockProps } from '@/services/storyblok/storyblok'
import { filterByBlockType } from '@/services/storyblok/Storyblok.helpers'
import * as TierSelector from '../components/CarTierSelector/CarTierSelector'
import { TierSelectorItemBlock, TierSelectorItemBlockProps } from './TierSelectorItemBlock'

type Props = SbBaseBlockProps<{
  title?: string
  items: ExpectedBlockType<TierSelectorItemBlockProps>
}>

export const TierSelectorBlock = ({ blok }: Props) => {
  console.log({ blok })

  const tierSelectorItems = filterByBlockType(blok.items, TierSelectorItemBlock.blockName)

  const [selectedId, setSelectedId] = useState('')
  const selectedItem = tierSelectorItems.find((item) => item._uid === selectedId)

  return (
    <TierSelector.Root type="single">
      <TierSelector.Item value="tier-1">
        <TierSelector.HeaderWithTrigger>
          {selectedId ? (
            <>
              <div>{selectedItem?.title}</div>
              <TierSelector.SecondaryTextStyle>
                {selectedItem?.price}
              </TierSelector.SecondaryTextStyle>
            </>
          ) : (
            blok.title
          )}
        </TierSelector.HeaderWithTrigger>
        <TierSelector.Content>
          {tierSelectorItems.map((nestedBlock) => {
            nestedBlock.handleClick = () => setSelectedId(nestedBlock._uid)
            nestedBlock._uid === selectedId
              ? (nestedBlock.isSelected = true)
              : (nestedBlock.isSelected = false)
            return (
              <TierSelectorItemBlock key={nestedBlock._uid} blok={nestedBlock} {...nestedBlock} />
            )
          })}
        </TierSelector.Content>
      </TierSelector.Item>
    </TierSelector.Root>
  )
}

TierSelectorBlock.blockName = 'tierSelector'
