import type { ClientSelectAction } from 'embark-core'
import styled from '@emotion/styled'
import { useTranslateTextLabel } from '../hooks/use-translate-text-label'

const Wrapper = styled.div(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '0.5rem',
}))

const SelectBox = styled.button(({ theme }) => ({
  backgroundColor: theme.colors.white,
  border: 0,
  appearance: 'none',
  borderRadius: '0.5rem',
  cursor: 'pointer',
  boxShadow: 'rgb(0 0 0 / 10%) 0px 1px 2px 0px',
  padding: '1rem',
  height: '5rem',
  fontSize: '1rem',
  fontFamily: theme.fonts.body,
}))

export const SelectAction = ({ options }: ClientSelectAction) => {
  const t = useTranslateTextLabel()

  return (
    <Wrapper>
      {options.map((option) => (
        <SelectBox key={option.value} id={option.value} name="value" value={option.value}>
          {t(option.label)}
        </SelectBox>
      ))}
    </Wrapper>
  )
}
