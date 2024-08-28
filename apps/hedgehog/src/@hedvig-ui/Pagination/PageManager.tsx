import styled from '@emotion/styled'
import { css } from '@emotion/react'
import { ChevronLeft, ChevronRight } from 'react-bootstrap-icons'

const Container = styled.div`
  position: fixed;
  bottom: 0.5rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: ${({ theme }) => theme.accentBackground};
  padding: 0.5rem 0.75rem;
  border-radius: 1000px;
`

const Page = styled.div<{ selected: 'yes' | 'no' }>`
  cursor: default;
  display: grid;
  place-items: center;
  height: 2.5rem;
  aspect-ratio: 1/1;
  border-radius: 50%;
  user-select: none;

  ${({ selected, theme }) =>
    selected === 'yes' &&
    css`
      color: ${theme.accent};
      font-weight: bold;
      background-color: ${theme.accentBackgroundHighlight};
    `};
`

const SelectablePage = styled(Page)`
  background-color: ${({ theme }) => theme.accentBackgroundHighlight};
  cursor: pointer;
`

export const PageManager = ({
  pages,
  currentPage,
  onClick,
}: {
  pages: number[]
  currentPage: number
  onClick: (page: number) => void
}) => {
  if (pages.length < 2) return null

  return (
    <Container>
      <span style={{ marginRight: '1rem' }}>
        Page {currentPage + 1} of {pages.length}
      </span>
      {currentPage === 0 ? (
        <>
          <Page selected="no" />
          <Page selected="no" />
        </>
      ) : (
        <>
          <SelectablePage
            selected="no"
            onClick={() => {
              onClick(0)
            }}
          >
            1
          </SelectablePage>
          <SelectablePage
            selected="no"
            onClick={() => {
              onClick(currentPage - 1)
            }}
          >
            <ChevronLeft />
          </SelectablePage>
        </>
      )}

      <Page selected="yes">{currentPage + 1}</Page>

      {currentPage === pages.length - 1 ? (
        <>
          <Page selected="no" />
          <Page selected="no" />
        </>
      ) : (
        <>
          <SelectablePage
            selected="no"
            onClick={() => {
              onClick(currentPage + 1)
            }}
          >
            <ChevronRight />
          </SelectablePage>

          <SelectablePage
            selected="no"
            onClick={() => {
              onClick(pages.length - 1)
            }}
          >
            {pages.length}
          </SelectablePage>
        </>
      )}
    </Container>
  )
}
