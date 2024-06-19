'use client'
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu'
import { storyblokEditable } from '@storyblok/react'
import { navigationItem } from '@/components/Header/Header.css'
import { NavigationLink } from '@/components/Header/NavigationLink/NavigationLink'
import type { LinkField, SbBaseBlockProps, StoryblokAsset } from '@/services/storyblok/storyblok'
import { getLinkFieldURL } from '@/services/storyblok/Storyblok.helpers'

export type NavItemBlockProps = SbBaseBlockProps<{
  name: string
  link: LinkField
  pillowImage?: StoryblokAsset
  label?: string
}>
export const NavItemBlock = ({ blok }: NavItemBlockProps) => {
  return (
    <NavigationMenuPrimitive.Item
      className={navigationItem}
      value={blok.name}
      {...storyblokEditable(blok)}
    >
      <NavigationLink href={getLinkFieldURL(blok.link, blok.name)}>{blok.name}</NavigationLink>
    </NavigationMenuPrimitive.Item>
  )
}
NavItemBlock.blockName = 'navItem'
