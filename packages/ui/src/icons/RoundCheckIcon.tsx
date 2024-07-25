import type { IconRootProps } from 'ui/src/icons/Root'
import { IconRoot } from 'ui/src/icons/Root'

export type RoundCheckIconProps = IconRootProps

export const RoundCheckIcon = ({ size = '1.5rem', ...props }: IconRootProps) => {
  return (
    <IconRoot
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 33 32"
      fill="none"
      size={size}
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.5 32C25.3366 32 32.5 24.8366 32.5 16C32.5 7.16344 25.3366 0 16.5 0C7.66344 0 0.5 7.16344 0.5 16C0.5 24.8366 7.66344 32 16.5 32ZM23.6223 13.1839C24.1104 12.6958 24.1105 11.9043 23.6223 11.4162C23.1341 10.928 22.3427 10.928 21.8545 11.4162L14.3101 18.9606L11.084 15.7345C10.5958 15.2463 9.80438 15.2463 9.31623 15.7345C8.82807 16.2226 8.82807 17.0141 9.31623 17.5022L12.7191 20.9051C13.5978 21.7838 15.0224 21.7838 15.9011 20.9051L23.6223 13.1839Z"
      />
    </IconRoot>
  )
}
