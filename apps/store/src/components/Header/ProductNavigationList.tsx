import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu'
import {
  NavigationMenuPrimitiveContent,
  NavigationMenuPrimitiveItem,
  NavigationSecondaryList,
} from './HeaderStyles'

type ProductNavigationListProps = {
  items: {
    name: string
    link: LinkField
  }[]
}

export const ProductNavigationList = ({ items }: ProductNavigationListProps) => {
  return (
    <NavigationMenuPrimitiveContent>
      <NavigationMenuPrimitive.Sub defaultValue={blok.name}>
        <NavigationSecondaryList>
          {filteredNavItems.map((nestedBlock) => (
            <NavigationMenuPrimitiveItem
              key={nestedBlock._uid}
              value={nestedBlock.name}
              {...storyblokEditable(nestedBlock)}
            >
              <SecondaryNavigationLink href={getLinkFieldURL(nestedBlock.link, nestedBlock.name)}>
                {nestedBlock.name}
              </SecondaryNavigationLink>
            </NavigationMenuPrimitiveItem>
          ))}
        </NavigationSecondaryList>
      </NavigationMenuPrimitive.Sub>
    </NavigationMenuPrimitiveContent>
  )
}
