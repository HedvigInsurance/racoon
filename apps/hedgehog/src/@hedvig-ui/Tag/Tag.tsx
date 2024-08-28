import styled from '@emotion/styled'

export const Tag = styled.span<{ alert?: boolean }>`
  display: inline-block;
  background-color: ${({ theme, alert }) =>
    alert ? theme.danger : theme.backgroundTransparent};
  color: ${({ theme, alert }) => alert && theme.background};

  font-size: 0.9rem;
  padding: 0.2rem 0.4rem;
  margin: 0.25rem 0.25rem 0.25rem 0;
  border-radius: 0.25rem;
`
