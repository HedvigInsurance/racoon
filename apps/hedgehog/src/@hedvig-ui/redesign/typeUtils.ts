// Polymorphic components utils
type AsProp<C extends React.ElementType> = {
  as?: C
}

type PropsToOmit<C extends React.ElementType, P> = keyof (AsProp<C> & P)

export type PolymorphicRef<C extends React.ElementType> =
  React.ComponentPropsWithRef<C>['ref']

export type PolymorphicComponentsProp<
  C extends React.ElementType,
  Props = Record<string, never>,
> = React.PropsWithChildren<Props & AsProp<C>> &
  Omit<React.ComponentPropsWithoutRef<C>, PropsToOmit<C, Props>>

export type PolymorphicComponentPropsWithRef<
  C extends React.ElementType,
  Props = Record<string, never>,
> = PolymorphicComponentsProp<C, Props> & { ref?: PolymorphicRef<C> }
