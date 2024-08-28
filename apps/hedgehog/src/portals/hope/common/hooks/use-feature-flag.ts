import { useInsecurePersistentState } from '@hedvig-ui'
import { useEffect } from 'react'
import { differenceInDays } from 'date-fns'

interface UseFeatureFlag {
  active: boolean
  activate: () => void
  disable: () => void
}

interface FeatureFlagEntry {
  active: boolean
  accessedAt: Date
}

type FeatureFlagRegistry = Record<string, FeatureFlagEntry>

export const useFeatureFlag = (flag: string): UseFeatureFlag => {
  const [flags, setFlags] = useInsecurePersistentState<FeatureFlagRegistry>(
    `feature-flags`,
    {},
  )

  useEffect(() => {
    const now = new Date()

    Object.keys(flags).map((f) => {
      if (differenceInDays(now, new Date(flags[f].accessedAt)) > 7) {
        const tempFlags = { ...flags }

        delete tempFlags[f]

        setFlags(tempFlags)
      }
    })

    setFlags((prevFlags) => ({
      ...prevFlags,
      [flag]: { ...prevFlags[flag], accessedAt: now },
    }))
  }, [flag, flags, setFlags])

  const handleChange = (value: boolean) => {
    const newFlag = {
      active: value,
      accessedAt: new Date(),
    }

    setFlags((prevFlags) => ({ ...prevFlags, [flag]: newFlag }))
  }

  return {
    active: flags[flag]?.active ?? false,
    activate: () => handleChange(true),
    disable: () => handleChange(false),
  }
}
