import { type ComponentProps } from 'react'
import { Heading } from 'ui'

type TitleProps = ComponentProps<typeof Heading>

export const SectionTitle = ({ children, ...props }: TitleProps) => (
  <Heading as="h2" variant="standard.24" {...props}>
    {children}
  </Heading>
)

export const SectionSubtitle = ({ children, ...props }: TitleProps) => (
  <Heading as="h3" balance={true} color="textSecondary" variant="standard.24" {...props}>
    {children}
  </Heading>
)
