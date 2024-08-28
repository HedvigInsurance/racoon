import { HTMLAttributes } from 'react'

type Props = HTMLAttributes<HTMLOrSVGElement>

export const USIcon = (props: Props) => (
  <svg
    width="24"
    height="16"
    viewBox="0 4 24 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect y="4" width="24" height="16" rx="2" fill="#FAFAFA" />
    <mask
      id="mask0_14038_2228"
      maskUnits="userSpaceOnUse"
      x="0"
      y="4"
      width="24"
      height="16"
    >
      <rect y="4" width="24" height="16" rx="2" fill="#FF513A" />
    </mask>
    <g mask="url(#mask0_14038_2228)">
      <path d="M0 4H24V5.06667H0V4Z" fill="#FF513A" />
      <path d="M0 6.13334H24V7.2H0V6.13334Z" fill="#FF513A" />
      <path d="M0 8.26667H24V9.33333H0V8.26667Z" fill="#FF513A" />
      <path d="M0 10.4H24V11.4667H0V10.4Z" fill="#FF513A" />
      <path d="M0 12.5333H24V13.6H0V12.5333Z" fill="#FF513A" />
      <path d="M0 14.6667H24V15.7333H0V14.6667Z" fill="#FF513A" />
      <path d="M0 16.8H24V17.8667H0V16.8Z" fill="#FF513A" />
      <path d="M0 18.9333H24V20H0V18.9333Z" fill="#FF513A" />
    </g>
    <path d="M0 6C0 4.89543 0.895431 4 2 4H11.5V11.5H0V6Z" fill="#59BFFA" />
    <rect
      x="0.25"
      y="4.25"
      width="23.5"
      height="15.5"
      rx="1.75"
      stroke="#121212"
      strokeOpacity="0.07"
      strokeWidth="0.5"
    />
    <circle cx="2" cy="10" r="0.5" fill="#FAFAFA" />
    <circle cx="4" cy="10" r="0.5" fill="#FAFAFA" />
    <circle cx="6" cy="10" r="0.5" fill="#FAFAFA" />
    <circle cx="8" cy="10" r="0.5" fill="#FAFAFA" />
    <circle cx="10" cy="10" r="0.5" fill="#FAFAFA" />
    <circle cx="2" cy="8" r="0.5" fill="#FAFAFA" />
    <circle cx="6" cy="6" r="0.5" fill="#FAFAFA" />
    <circle cx="4" cy="6" r="0.5" fill="#FAFAFA" />
    <circle cx="2" cy="6" r="0.5" fill="#FAFAFA" />
    <circle cx="4" cy="8" r="0.5" fill="#FAFAFA" />
    <circle cx="8" cy="6" r="0.5" fill="#FAFAFA" />
    <circle cx="6" cy="8" r="0.5" fill="#FAFAFA" />
    <circle cx="8" cy="8" r="0.5" fill="#FAFAFA" />
    <circle cx="10" cy="8" r="0.5" fill="#FAFAFA" />
    <circle cx="10" cy="6" r="0.5" fill="#FAFAFA" />
  </svg>
)
