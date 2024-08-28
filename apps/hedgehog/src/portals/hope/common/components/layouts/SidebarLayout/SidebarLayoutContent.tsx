import styled from '@emotion/styled'
import { ComponentProps } from 'react'
import { Toaster } from 'react-hot-toast'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;

  overflow-y: scroll;

  ::-webkit-scrollbar-track {
    background-color: transparent;
  }
`

export function SidebarLayoutContent({ children }: ComponentProps<'div'>) {
  return (
    <Container>
      {children}
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            padding: '20px 25px',
          },
        }}
      />
    </Container>
  )
}
