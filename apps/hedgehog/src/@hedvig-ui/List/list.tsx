import styled from '@emotion/styled'

export const List = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`

export const ListItem = styled.li`
  display: flex;
  justify-content: space-between;
  list-style-type: none;
  margin: 0;
  padding: 1em 0;
  border-bottom: 1px solid ${({ theme }) => theme.backgroundTransparent};

  :first-of-type {
    margin-top: 0;
  }

  :last-child {
    border: none;
    margin-bottom: 0;
  }
`
