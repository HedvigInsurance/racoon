import styled from '@emotion/styled'

export const CasualList = styled.ul`
  display: flex;
  flex-direction: column;
  list-style: none;
  padding: 0;
  margin: 0;
`

export const CasualListItem = styled.li`
  padding: 1rem 0;
  border-top: 1px solid ${({ theme }) => theme.border};

  :last-of-type {
    border-bottom: 1px solid ${({ theme }) => theme.border};
  }
`
