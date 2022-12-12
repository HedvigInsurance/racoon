import styled from '@emotion/styled'
import * as RadioGroup from '@radix-ui/react-radio-group'

export const Root = RadioGroup.Root

export const Item = styled(RadioGroup.Item)(({ theme }) => ({
  width: '1.375rem',
  height: '1.375rem',

  border: `1px solid ${theme.colors.gray500}`,
  borderRadius: '50%',

  '&[data-state=checked]': {
    borderColor: theme.colors.gray900,
  },

  '&:focus': {
    // @TODO: pending design
    boxShadow: '0 0 0 2px rgba(0, 0, 0, 0.4)',
  },
}))

export const Indicator = styled(RadioGroup.Indicator)(({ theme }) => ({
  display: 'block',
  backgroundColor: theme.colors.gray900,
  borderRadius: '50%',
  width: '100%',
  height: '100%',
}))

export const Label = styled.label(({ theme }) => ({
  fontFamily: theme.fonts.standard,
  fontSize: theme.fontSizes[4],
}))
