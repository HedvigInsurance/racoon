import { GridLayout } from '@/components/GridLayout/GridLayout'

export const CookieListBlock = () => {
  return (
    <GridLayout.Root>
      <GridLayout.Content width={{ base: '1', md: '2/3', xxl: '1/2' }} align={'center'}>
        <div id="ot-sdk-cookie-policy"></div>
      </GridLayout.Content>
    </GridLayout.Root>
  )
}

CookieListBlock.blockName = 'cookieList'
