import styled from '@emotion/styled'
import { theme } from '../theme'
import { gray, green, red, yellow } from './colors'

export default {
  title: 'Theme / Colors',
}

type Props = {
  colors: Record<string, string>
  name: string
}

const Palette = ({ colors, name }: Props) => (
  <>
    <ColorName>{name}</ColorName>
    <ColorGrid>
      {Object.entries(colors).map((color) => (
        <div key={color[0]}>
          <ColorSwatch hue={color[1]} />
          <HueName>{`${name}-${color[0]}`}</HueName>
          <HueValue>{color[1]}</HueValue>
        </div>
      ))}
    </ColorGrid>
  </>
)

export const Colors = () => (
  <>
    <Palette name="Gray" colors={gray} />
    <Palette name="Green" colors={green} />
    <Palette name="Yellow" colors={yellow} />
    <Palette name="Red" colors={red} />
  </>
)

const ColorGrid = styled.div({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '2rem 1rem',
  marginBottom: '3rem',
})

const ColorName = styled.h2({
  marginBottom: '1rem',
  fontSize: '2rem',
})

const ColorSwatch = styled.div<{ hue: string }>(({ hue }) => ({
  width: 216,
  height: 150,
  backgroundColor: hue,
  overflow: 'hidden',
  border: '1px solid hsla(0, 0%, 0%, 0.1)',
  borderRadius: theme.radius.md,
}))

const HueName = styled.p({
  marginTop: '0.5rem',
  marginBottom: '0.25rem',
  fontSize: '1.125rem',
})

const HueValue = styled.p(({ theme }) => ({
  color: theme.colors.textSecondary,
  textTransform: 'uppercase',
}))
