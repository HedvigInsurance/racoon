import { type ComplexStyleRule, type StyleRule } from '@vanilla-extract/css'
import type { Level } from 'ui/src/theme'

export type Styles = Omit<StyleRule, '@media'>

export type VariantStyles<PossibleVariants extends string> = Record<PossibleVariants, Styles>

export type ResponsiveVariantsConfig<PossibleVariants extends string> = {
  base?: ComplexStyleRule
  variants: VariantStyles<PossibleVariants>
}

export type RuntimeResponsiveVariantsFnConfig<PossibleVariants extends string> = {
  defaultClassName: string | null
  responsiveVariantsClassNames: Record<
    '_' | Level,
    Record<keyof VariantStyles<PossibleVariants>, string>
  >
}

export type RuntimeResponsiveVariantsFnOptions<PossibleVariants extends string> =
  | PossibleVariants
  | Partial<Record<'_' | Level, PossibleVariants>>

export type RuntimeResponsiveVariantsFn<PossibleVariants extends string> = (
  options: RuntimeResponsiveVariantsFnOptions<PossibleVariants>,
) => string
