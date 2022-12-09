import styled from '@emotion/styled'

export const CircledHSuperscript = () => {
  return <Superscript>Ⓗ</Superscript>
}

const Superscript = styled.sup({
  verticalAlign: 'super',
  fontSize: 'x-small',
})
