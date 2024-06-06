import { style } from '@vanilla-extract/css'
import { addFunctionSerializer } from '@vanilla-extract/css/functionSerializer'
import { minWidth, type Level } from 'ui/src/theme'
import { breakpoints } from 'ui/src/theme/media-query'
import type { ResponsiveVariantsConfig, VariantStyles, Styles } from './repsonsiveVariants.types'
import { createResponsiveVariantsRuntimeFn } from './responsiveVariantsRuntime'

export function responsiveVariants<PossibleVariants extends string>(
  options: ResponsiveVariantsConfig<PossibleVariants>,
) {
  const { base, variants } = options

  let defaultClassName: string | null = null
  if (base) {
    defaultClassName = style(base)
  }

  const responsiveVariantsClassNames = generateBreakpointLevelVariantClassesMap(variants)

  const config = {
    defaultClassName,
    responsiveVariantsClassNames,
  }

  return addFunctionSerializer(createResponsiveVariantsRuntimeFn(config), {
    importPath: 'ui/src/utils/responsiveVariants/responsiveVariantsRuntime',
    importName: 'createResponsiveVariantsRuntimeFn',
    args: [config],
  })
}

function generateBreakpointLevelVariantClassesMap<PossibleVariants extends string>(
  variants: VariantStyles<PossibleVariants>,
) {
  const breakpointLevels: Array<'_' | Level> = ['_', ...(Object.keys(breakpoints) as Array<Level>)]
  const breakpointLevelVariantClassesMap = breakpointLevels.reduce(
    (acc, breakpointLevel) => {
      return {
        ...acc,
        [breakpointLevel]: generateBreakpointLevelVariantClass(breakpointLevel, variants),
      }
    },
    {} as Record<'_' | Level, Record<keyof VariantStyles<PossibleVariants>, string>>,
  )

  return breakpointLevelVariantClassesMap
}

function generateBreakpointLevelVariantClass<PossibleVariants extends string>(
  breakpointLevel: '_' | Level,
  variants: VariantStyles<PossibleVariants>,
) {
  return Object.entries<Styles>(variants).reduce(
    (acc, [variant, styles]) => {
      if (breakpointLevel === '_') {
        return {
          ...acc,
          [variant]: style(styles),
        }
      }

      const mediaQuery = minWidth[breakpointLevel]
      return {
        ...acc,
        [variant]: style({
          '@media': {
            [mediaQuery]: styles,
          },
        }),
      }
    },
    {} as Record<keyof ResponsiveVariantsConfig<PossibleVariants>['variants'], string>,
  )
}
