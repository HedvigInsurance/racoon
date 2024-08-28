import clsx from 'clsx'
import { ComponentPropsWithRef, ReactNode, forwardRef } from 'react'
import {
  raisedLabel,
  rootBase,
  rootDisabled,
  sideContent,
  trigger,
  value,
  content,
  input,
  label,
  rootOpen,
  triggerWithValue,
} from './InputWrapper.css'
import { PolymorphicComponentPropsWithRef, PolymorphicRef } from '../typeUtils'
import { Flex } from '../Flex/Flex'

interface RootProps extends ComponentPropsWithRef<'div'> {
  isOpen?: boolean
  disabled?: boolean
}
const Root = forwardRef(
  (
    { className, disabled, isOpen, children, ...props }: RootProps,
    ref: RootProps['ref'],
  ) => {
    return (
      <div
        className={clsx(className, rootBase, {
          [rootDisabled]: disabled,
          [rootOpen]: isOpen,
        })}
        {...props}
        ref={ref}
      >
        {children}
      </div>
    )
  },
)

interface TriggerBaseProps {
  withValue?: boolean
}

export type TriggerProps<C extends React.ElementType> =
  PolymorphicComponentPropsWithRef<C, TriggerBaseProps>

type PolymorphicTrigger = <C extends React.ElementType = 'div'>(
  props: TriggerProps<C>,
) => ReactNode | null

const Trigger: PolymorphicTrigger = forwardRef(function Trigger<
  C extends React.ElementType = 'div',
>(
  { as, withValue, className, children, ...props }: TriggerProps<C>,
  ref: PolymorphicRef<C>,
) {
  const Component = as ?? 'div'

  return (
    <Component
      className={clsx(className, trigger, {
        [triggerWithValue]: withValue,
      })}
      {...props}
      ref={ref}
    >
      {children}
    </Component>
  )
})

interface LabelBaseProps {
  raised?: boolean
}

export type LabelProps<C extends React.ElementType> =
  PolymorphicComponentPropsWithRef<C, LabelBaseProps>

type PolymorphicLabel = <C extends React.ElementType = 'span'>(
  props: LabelProps<C>,
) => ReactNode | null

const Label: PolymorphicLabel = forwardRef(function Label<
  C extends React.ElementType = 'span',
>(
  { as, className, raised, children, ...props }: LabelProps<C>,
  ref: PolymorphicRef<C>,
) {
  const Component = as ?? 'span'

  return (
    <Component
      className={clsx(className, label, {
        [raisedLabel]: raised,
      })}
      {...props}
      ref={ref}
    >
      {children}
    </Component>
  )
})

type ContentProps = ComponentPropsWithRef<typeof Flex>
const Content = forwardRef(
  (
    { className, align = 'center', children, ...props }: ContentProps,
    ref: ContentProps['ref'],
  ) => {
    return (
      <Flex
        align={align}
        className={clsx(className, content)}
        {...props}
        ref={ref}
      >
        {children}
      </Flex>
    )
  },
)

type ValueProps = ComponentPropsWithRef<'span'>
const Value = forwardRef(
  ({ className, children, ...props }: ValueProps, ref: ValueProps['ref']) => {
    return (
      <span className={clsx(className, value)} {...props} ref={ref}>
        {children}
      </span>
    )
  },
)

type InputProps = ComponentPropsWithRef<'input'>
const Input = forwardRef(
  ({ className, children, ...props }: InputProps, ref: InputProps['ref']) => {
    return (
      <input className={clsx(className, input)} {...props} ref={ref}>
        {children}
      </input>
    )
  },
)

type SideContentProps = ComponentPropsWithRef<'span'>
const SideContent = forwardRef(
  ({ children, ...props }: SideContentProps, ref: SideContentProps['ref']) => {
    return (
      <span className={sideContent} {...props} ref={ref}>
        {children}
      </span>
    )
  },
)

export const InputWrapper = {
  Root,
  Trigger,
  Label,
  Content,
  Value,
  Input,
  SideContent,
}
