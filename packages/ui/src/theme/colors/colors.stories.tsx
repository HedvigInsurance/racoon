import { Heading } from '../../components/Heading/Heading'
import { Text } from '../../components/Text/Text'
import { sprinkles } from '../sprinkles.css'
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
import {
  colorBg,
  colorGrid,
  colorInfo,
  colorSwatch,
  translucentWrapper,
} from './colors.stories.css'

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
    <Heading className={sprinkles({ mb: 'md' })}>{name}</Heading>
    <div className={colorGrid}>
      {Object.entries(colors).map((color) => (
        <div className={colorSwatch} key={color[0]}>
          <div className={colorBg} style={{ backgroundColor: color[1] }} />
          <div className={colorInfo}>
            <Text size="sm">{`${prefix ?? name}-${color[0]} ${suffix ?? ''}`}</Text>
            <Text size="sm" color="textSecondary">
              {color[1]}
            </Text>
          </div>
        </div>
      ))}
    </div>
  </>
)

export const Colors = () => (
  <>
    <Palette name="Grayscale Opaque" prefix="G" colors={gray} />
    <Palette name="Gray Translucent Light Mode" prefix="G" colors={grayTranslucent} />
    <div className={translucentWrapper}>
      <Palette name="Gray Translucent Dark Mode" prefix="G" colors={grayTranslucentDark} />
    </div>
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
