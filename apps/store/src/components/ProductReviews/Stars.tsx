import clsx from 'clsx'
import { StarIcon } from 'ui/src/icons/StarIcon'
import { theme } from 'ui'
import { wrapper } from './Stars.css'

type Props = {
  score: number
  size?: string
  className?: string
}

export const Stars = ({ score, size, className }: Props) => {
  return (
    <div className={clsx(wrapper, className)}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Star key={index} filled={index < Math.trunc(score)} size={size} />
      ))}
    </div>
  )
}

const Star = ({ filled, size = '1.5rem' }: { filled: boolean; size?: string }) => {
  return (
    <StarIcon
      color={filled ? theme.colors.textTranslucentPrimary : theme.colors.textTranslucentTertiary}
      size={size}
    />
  )
}
