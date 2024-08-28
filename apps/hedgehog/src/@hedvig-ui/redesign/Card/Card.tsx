import { ComponentProps } from 'react'
import { Div } from '@hedvig-ui/redesign'
import { colors } from '@hedvig-ui/redesign/palette'
import styled from '@emotion/styled'
import { css } from '@emotion/react'
import { theme } from '../theme'

type StyleProps = {
  variant: 'primary' | 'secondary'
}

type Props = Partial<StyleProps> & ComponentProps<typeof Div>

export const Card = (props: Props) => {
  const { variant = 'primary', ...rest } = props
  return <StyledCard variant={variant} {...rest} />
}

const VARIANT_COLOR = {
  primary: colors.offWhite,
  secondary: colors.opaque1,
}

const StyledCard = styled(Div)<StyleProps>(
  ({ variant }) => css`
    position: relative;
    border: 0.5px solid ${colors.borderTranslucent1};
    border-radius: 12px;
    padding: ${theme.space.lg};

    background-color: ${VARIANT_COLOR[variant]};
    color: ${colors.textPrimary};
  `,
)
