import styled from '@emotion/styled'
import Link from 'next/link'
import { theme } from 'ui'
import { PageLink } from '@/lib/PageLink'
import { MiniCart } from '../MiniCart/MiniCart'

const Wrapper = styled.div(() => ({
  backgroundColor: theme.colors.dark,
  color: theme.colors.light,
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  padding: '0.5rem',
}))

export const TopMenu = () => {
  return (
    <Wrapper>
      <div>
        <Link href={PageLink.store()}>Store</Link>
      </div>
      <MiniCart />
    </Wrapper>
  )
}
