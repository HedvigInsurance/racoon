import styled from '@emotion/styled'
import Image from 'next/image'

const PLACEHOLDER = 'https://a.storyblok.com/f/165473/512x512/7996914970/se-apartment-rental.png'

type PillowProps = {
  size?: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge'
}

export const Pillow = (props: PillowProps) => (
  <StyledImage alt="" src={PLACEHOLDER} {...props} width={80} height={80} />
)

const StyledImage = styled(Image)<PillowProps>(({ size = 'medium' }) => ({
  ...getSize(size),
}))

const getSize = (size: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge') => {
  switch (size) {
    case 'xsmall':
      return { width: '2.25rem', height: '2.25rem' }
    case 'small':
      return { width: '3rem', height: '3rem' }
    case 'medium':
      return { width: '3.5rem', height: '3.5rem' }
    case 'large':
      return { width: '5rem', height: '5rem' }
    case 'xlarge':
      return { width: '13.75rem', height: '13.75rem' }
  }
}
