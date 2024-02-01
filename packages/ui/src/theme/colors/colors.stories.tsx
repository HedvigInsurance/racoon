import styled from '@emotion/styled'
import { theme } from '../theme'
import {
  amber,
  blue,
  gray,
  grayTranslucent,
  grayTranslucentDark,
  green,
  highlight,
  pink,
  purple,
  red,
  signal,
  teal,
  yellow,
} from './colors'

export default {
  title: 'Theme / Colors',
}

type Props = {
  colors: Record<string, string>
  name: string
  prefix?: string
  suffix?: string
}

const Palette = ({ colors, name, prefix, suffix }: Props) => (
  <>
    <ColorName>{name}</ColorName>
    <ColorGrid>
      {Object.entries(colors).map((color) => (
        <div key={color[0]}>
          <ColorSwatch hue={color[1]} />
          <HueName>{`${prefix ?? name}-${color[0]} ${suffix ?? ''}`}</HueName>
          <HueValue>{color[1]}</HueValue>
        </div>
      ))}
    </ColorGrid>
  </>
)

export const Colors = () => (
  <>
    <Palette name="Gray" prefix="G" colors={gray} />
    <Palette name="Gray Translucent Light Mode" prefix="G" suffix="T L" colors={grayTranslucent} />
    <TranslucentWrapper>
      <Palette
        name="Gray Translucent Dark Mode"
        prefix="G"
        suffix="T D"
        colors={grayTranslucentDark}
      />
    </TranslucentWrapper>
    <Palette name="Green" colors={green} />
    <Palette name="Yellow" colors={yellow} />
    <Palette name="Amber" colors={amber} />
    <Palette name="Red" colors={red} />
    <Palette name="Pink" colors={pink} />
    <Palette name="Purple" colors={purple} />
    <Palette name="Blue" colors={blue} />
    <Palette name="Teal" colors={teal} />

    <Palette name="Highlight Blue" colors={highlight.blue} />
    <Palette name="Highlight Green" colors={highlight.purple} />
    <Palette name="Highlight Yellow" colors={highlight.yellow} />

    <Palette name="Signal Green" colors={signal.green} />
    <Palette name="Signal Amber" colors={signal.amber} />
    <Palette name="Signal Red" colors={signal.red} />
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

const HueValue = styled.p({
  color: theme.colors.textSecondary,
  textTransform: 'uppercase',
})

const TranslucentWrapper = styled.div({
  color: gray[25],
  marginBottom: '3rem',
  marginInline: '-1rem',
  padding: '1rem',
  backgroundColor: gray[1000],
})
