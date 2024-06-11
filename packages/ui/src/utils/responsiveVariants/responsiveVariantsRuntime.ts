import type { Level } from 'ui/src/theme'
import type {
  RuntimeResponsiveVariantsFn,
  RuntimeResponsiveVariantsFnConfig,
} from './repsonsiveVariants.types'

export function createResponsiveVariantsRuntimeFn<PossibleVariants extends string>(
  config: RuntimeResponsiveVariantsFnConfig<PossibleVariants>,
) {
  const runtimeFn: RuntimeResponsiveVariantsFn<PossibleVariants> = (options) => {
    if (typeof options !== 'object') {
      const variantClassName = config.responsiveVariantsClassNames._[options]
      return [config.defaultClassName, variantClassName].filter(Boolean).join(' ')
    }

    const breakpointVariantTuple = Object.entries(options).map(([level, variant]) => {
      return config.responsiveVariantsClassNames[level as Level][variant]
    })
    return [config.defaultClassName, ...breakpointVariantTuple].filter(Boolean).join(' ')
  }

  return runtimeFn
}
