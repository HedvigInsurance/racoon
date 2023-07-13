import { ButtonNextLink } from '@/components/ButtonNextLink'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'

type Props = {
  href: string
  children: string
}

export const ProductPageLink = (props: Props) => {
  return (
    <ButtonNextLink href={props.href} size="medium" variant="secondary-alt">
      <SpaceFlex space={0.5} align="center">
        {props.children}
      </SpaceFlex>
    </ButtonNextLink>
  )
}
