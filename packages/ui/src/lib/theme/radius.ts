type RadiusAlias = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export const radius: Partial<Record<number | RadiusAlias, string>> = {
  0: '8px',
  1: '12px',
  2: '16px',
  3: '20px',
  4: '28px',
}

// Aliases
radius.xs = radius[0]
radius.sm = radius[1]
radius.md = radius[2]
radius.lg = radius[3]
radius.xl = radius[4]
