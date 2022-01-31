import classNames from 'classnames'

type DotProps = {
  className?: string
}

const Dot = ({ className }: DotProps) => (
  <div className={classNames('w-2 h-2 rounded-full bg-current animate-loader', className)} />
)

export const LoadingDots = () => {
  return (
    <div className="flex justify-center align-center space-x-2 text-gray-900">
      <Dot />
      <Dot className="animation-delay-200" />
      <Dot className="animation-delay-400" />
    </div>
  )
}
